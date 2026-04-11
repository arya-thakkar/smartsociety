/**
 * services/meeting.service.js
 *
 * Meeting lifecycle:
 *   create    → scheduled
 *   start     → live  (Agora channel open, members join)
 *   end       → ended
 *   upload-audio → audio sent to AssemblyAI → transcript → Claude summary
 */

const Meeting = require("../models/meeting.model");
const aiService = require("./ai.service");
const agoraService = require("./agora.service");
const { transcribeBuffer } = require("./transcription.service");

// ─────────────────────────────────────────────────────────────────
//  Create meeting — admin schedules it from dashboard
// ─────────────────────────────────────────────────────────────────
const createMeeting = async ({ title, agenda, date }, userId, societyId) => {
  const meeting = await Meeting.create({
    title, agenda, date,
    createdBy: userId,
    society: societyId,
    status: "scheduled",
  });

  // Agora channel name tied to this specific meeting
  const channelName = agoraService.generateChannelName(societyId, meeting._id);
  meeting.channelName = channelName;
  await meeting.save();

  return meeting;
};

// ─────────────────────────────────────────────────────────────────
//  Get Agora join token — called when any member clicks "Join"
// ─────────────────────────────────────────────────────────────────
const getJoinToken = async (meetingId, societyId, userId) => {
  const meeting = await Meeting.findOne({ _id: meetingId, society: societyId });
  if (!meeting) throw { status: 404, message: "Meeting not found" };
  if (meeting.status === "ended") throw { status: 400, message: "Meeting has ended" };

  // Derive numeric uid from userId (Agora requires numeric uid)
  const uid = parseInt(userId.toString().slice(-8), 16) % 1000000;
  const { token, appId, expiresIn } = agoraService.generateToken(meeting.channelName, uid, "publisher");

  // Track who joined
  await Meeting.findByIdAndUpdate(meetingId, { $addToSet: { participants: userId } });

  return {
    token,
    channelName: meeting.channelName,
    uid,
    appId,
    expiresIn,
    meetingTitle: meeting.title,
  };
};

// ─────────────────────────────────────────────────────────────────
//  Start meeting
// ─────────────────────────────────────────────────────────────────
const startMeeting = async (meetingId, societyId) => {
  const meeting = await Meeting.findOneAndUpdate(
    { _id: meetingId, society: societyId },
    { status: "live", startedAt: new Date() },
    { new: true }
  );
  if (!meeting) throw { status: 404, message: "Meeting not found" };
  return meeting;
};

// ─────────────────────────────────────────────────────────────────
//  End meeting
// ─────────────────────────────────────────────────────────────────
const endMeeting = async (meetingId, societyId) => {
  const meeting = await Meeting.findOneAndUpdate(
    { _id: meetingId, society: societyId },
    { status: "ended", endedAt: new Date() },
    { new: true }
  );
  if (!meeting) throw { status: 404, message: "Meeting not found" };
  return meeting;
};

// ─────────────────────────────────────────────────────────────────
//  Upload audio → AssemblyAI transcript → Claude summary
//
//  This is the core new feature.
//  Steps:
//    1. Mark meeting as "transcribing"
//    2. Send audio buffer to AssemblyAI (polls until done, ~30-60s)
//    3. Feed transcript into Claude summarization pipeline
//    4. Save transcript + summary to meeting record
//
//  Everything after step 1 runs non-blocking (fire and forget)
//  so the HTTP response returns immediately with 202 Accepted.
// ─────────────────────────────────────────────────────────────────
const uploadAudioAndTranscribe = async (meetingId, societyId, audioBuffer) => {
  const meeting = await Meeting.findOne({ _id: meetingId, society: societyId });
  if (!meeting) throw { status: 404, message: "Meeting not found" };
  if (meeting.status !== "ended") {
    throw { status: 400, message: "Meeting must be ended before uploading audio. Call PATCH /meetings/:id/end first." };
  }
  if (meeting.aiStatus === "processing" || meeting.aiStatus === "transcribing") {
    throw { status: 400, message: "Transcription already in progress for this meeting." };
  }

  // Mark as transcribing immediately so UI can show a spinner
  await Meeting.findByIdAndUpdate(meetingId, { aiStatus: "transcribing" });

  // ── Non-blocking pipeline ──────────────────────────────────────
  (async () => {
    try {
      // Step 1 — AssemblyAI transcription (20-60 seconds typically)
      console.log(`[Meeting ${meetingId}] Starting AssemblyAI transcription...`);
      const transcript = await transcribeBuffer(audioBuffer);
      console.log(`[Meeting ${meetingId}] Transcript ready (${transcript.length} chars). Running Claude summary...`);

      // Save transcript immediately so it's available even if summary fails
      await Meeting.findByIdAndUpdate(meetingId, {
        transcript,
        aiStatus: "processing",
      });

      // Step 2 — Claude summarization pipeline
      const { chunks, summary } = await aiService.processMeeting(transcript);

      // Step 3 — Save everything
      await Meeting.findByIdAndUpdate(meetingId, {
        chunks,
        summary,
        aiStatus: "done",
      });

      console.log(`[Meeting ${meetingId}] ✅ Transcript + summary saved successfully.`);
    } catch (err) {
      console.error(`[Meeting ${meetingId}] ❌ Pipeline failed:`, err.message);
      await Meeting.findByIdAndUpdate(meetingId, {
        aiStatus: "failed",
        aiError: err.message,
      });
    }
  })();

  // Return immediately — frontend should poll GET /meetings/:id to check aiStatus
  return {
    message: "Audio uploaded. Transcription started — this takes 30-60 seconds. Poll GET /api/meetings/:id and check aiStatus.",
    meetingId,
    aiStatus: "transcribing",
  };
};

// ─────────────────────────────────────────────────────────────────
//  Manual transcript submit (fallback if admin has text already)
// ─────────────────────────────────────────────────────────────────
const submitTranscript = async (meetingId, societyId, transcriptText) => {
  const meeting = await Meeting.findOneAndUpdate(
    { _id: meetingId, society: societyId },
    { transcript: transcriptText, aiStatus: "processing" },
    { new: true }
  );
  if (!meeting) throw { status: 404, message: "Meeting not found" };

  // Claude pipeline non-blocking
  aiService.processMeeting(transcriptText)
    .then(async ({ transcript, chunks, summary }) => {
      await Meeting.findByIdAndUpdate(meetingId, { transcript, chunks, summary, aiStatus: "done" });
    })
    .catch(async (err) => {
      console.error("Meeting Claude pipeline failed:", err.message);
      await Meeting.findByIdAndUpdate(meetingId, { aiStatus: "failed" });
    });

  return { message: "Transcript submitted. Claude summary being generated." };
};

// ─────────────────────────────────────────────────────────────────
//  Standard CRUD
// ─────────────────────────────────────────────────────────────────
const getMeetings = async (societyId) => {
  return Meeting.find({ society: societyId })
    .populate("createdBy", "name")
    .sort({ date: -1 });
};

const getMeetingById = async (id, societyId) => {
  const meeting = await Meeting.findOne({ _id: id, society: societyId })
    .populate("createdBy", "name")
    .populate("participants", "name unit");
  if (!meeting) throw { status: 404, message: "Meeting not found" };
  return meeting;
};

const updateMeeting = async (id, societyId, updates) => {
  const meeting = await Meeting.findOneAndUpdate(
    { _id: id, society: societyId }, updates, { new: true }
  );
  if (!meeting) throw { status: 404, message: "Meeting not found" };
  return meeting;
};

module.exports = {
  createMeeting,
  getJoinToken,
  startMeeting,
  endMeeting,
  uploadAudioAndTranscribe,
  submitTranscript,
  getMeetings,
  getMeetingById,
  updateMeeting,
};
