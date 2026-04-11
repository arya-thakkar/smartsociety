/**
 * services/transcription.service.js
 *
 * Handles audio transcription via AssemblyAI (free tier).
 *
 * Free tier: 100 hours/month — no credit card needed
 * Sign up:   https://www.assemblyai.com/
 *
 * Flow:
 *   1. uploadAudioBuffer()  → uploads raw audio buffer → returns upload_url
 *   2. requestTranscript()  → submits transcription job → returns transcript_id
 *   3. pollTranscript()     → polls until complete      → returns transcript text
 *   4. transcribeBuffer()   → runs all 3 steps          → returns final text
 */

const axios = require("axios");

const ASSEMBLYAI_KEY = process.env.ASSEMBLYAI_API_KEY;
const BASE_URL = "https://api.assemblyai.com/v2";

const headers = () => ({
  authorization: ASSEMBLYAI_KEY,
  "content-type": "application/json",
});

// ─────────────────────────────────────────────────────────────────
//  Step 1 — Upload raw audio buffer to AssemblyAI CDN
//  Returns: upload_url (temporary URL AssemblyAI uses internally)
// ─────────────────────────────────────────────────────────────────
const uploadAudioBuffer = async (buffer) => {
  if (!ASSEMBLYAI_KEY) throw new Error("ASSEMBLYAI_API_KEY is not set in .env");

  const response = await axios.post(`${BASE_URL}/upload`, buffer, {
    headers: {
      authorization: ASSEMBLYAI_KEY,
      "content-type": "application/octet-stream",
      "transfer-encoding": "chunked",
    },
    maxBodyLength: Infinity,
    timeout: 120000, // 2 min upload timeout
  });

  if (!response.data?.upload_url) {
    throw new Error("AssemblyAI upload failed — no upload_url returned");
  }

  return response.data.upload_url;
};

// ─────────────────────────────────────────────────────────────────
//  Step 2 — Submit transcription job
//  Returns: transcript_id
// ─────────────────────────────────────────────────────────────────
const requestTranscript = async (uploadUrl) => {
  const response = await axios.post(
    `${BASE_URL}/transcript`,
    {
      audio_url: uploadUrl,
      language_detection: true,   // auto-detect language (handles Hindi, English, etc.)
      punctuate: true,            // add punctuation
      format_text: true,          // clean formatting
      speaker_labels: true,       // distinguish different speakers (Speaker A, B, etc.)
    },
    { headers: headers(), timeout: 30000 }
  );

  if (!response.data?.id) {
    throw new Error("AssemblyAI transcription request failed — no id returned");
  }

  return response.data.id;
};

// ─────────────────────────────────────────────────────────────────
//  Step 3 — Poll until transcription is complete
//  AssemblyAI takes 20-60 seconds for a typical meeting recording
// ─────────────────────────────────────────────────────────────────
const pollTranscript = async (transcriptId) => {
  const maxAttempts = 60;   // poll up to 60 times
  const intervalMs  = 5000; // every 5 seconds = max 5 minutes wait

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await axios.get(
      `${BASE_URL}/transcript/${transcriptId}`,
      { headers: headers(), timeout: 15000 }
    );

    const { status, text, error, utterances } = response.data;

    if (status === "completed") {
      // If speaker_labels is enabled, build a labelled transcript
      if (utterances && utterances.length > 0) {
        const labelled = utterances
          .map((u) => `Speaker ${u.speaker}: ${u.text}`)
          .join("\n");
        return labelled;
      }
      return text;
    }

    if (status === "error") {
      throw new Error(`AssemblyAI transcription error: ${error}`);
    }

    // status is "queued" or "processing" — wait and retry
    console.log(`[AssemblyAI] Attempt ${attempt}/${maxAttempts} — status: ${status}`);
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("AssemblyAI transcription timed out after 5 minutes");
};

// ─────────────────────────────────────────────────────────────────
//  Full pipeline — upload buffer → request → poll → return text
// ─────────────────────────────────────────────────────────────────
const transcribeBuffer = async (audioBuffer) => {
  console.log("[AssemblyAI] Uploading audio...");
  const uploadUrl = await uploadAudioBuffer(audioBuffer);

  console.log("[AssemblyAI] Requesting transcription...");
  const transcriptId = await requestTranscript(uploadUrl);

  console.log(`[AssemblyAI] Polling transcript id: ${transcriptId}`);
  const transcript = await pollTranscript(transcriptId);

  console.log("[AssemblyAI] Transcription complete ✅");
  return transcript;
};

module.exports = { transcribeBuffer, uploadAudioBuffer, requestTranscript, pollTranscript };
