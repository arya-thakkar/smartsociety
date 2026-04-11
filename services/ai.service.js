/**
 * services/ai.service.js
 *
 * AI routing:
 *   Claude (Anthropic)  → Meeting transcript summarization ONLY
 *   Gemini (Google)     → Complaints, task prioritization, all other AI
 *
 *  BOT_URL still supported for fully custom overrides.
 */

const axios = require("axios");

const BOT_URL = process.env.BOT_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const CLAUDE_URL = "https://api.anthropic.com/v1/messages";

// ─────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────
const callGemini = async (prompt) => {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set in .env");
  const response = await axios.post(
    GEMINI_URL,
    { contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 1024 } },
    { timeout: 20000 }
  );
  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");
  return text.trim();
};

const callClaude = async (prompt) => {
  if (!CLAUDE_API_KEY) throw new Error("CLAUDE_API_KEY is not set in .env");
  const response = await axios.post(
    CLAUDE_URL,
    { model: "claude-3-5-haiku-20241022", max_tokens: 2048, messages: [{ role: "user", content: prompt }] },
    {
      headers: { "x-api-key": CLAUDE_API_KEY, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
      timeout: 30000,
    }
  );
  const text = response.data?.content?.[0]?.text;
  if (!text) throw new Error("Empty response from Claude");
  return text.trim();
};

const callBot = async (endpoint, payload) => {
  const response = await axios.post(`${BOT_URL}${endpoint}`, payload, { timeout: 15000 });
  return response.data;
};

// ═════════════════════════════════════════════════════════════════
//  1. COMPLAINT GENERATION  [Gemini]
// ═════════════════════════════════════════════════════════════════
const generateComplaint = async (text) => {
  if (BOT_URL) return callBot("/ai/complaint/generate", { text });
  try {
    const prompt = `You are an AI assistant for a residential society management system.
A resident described an issue. Generate a structured complaint from it.

Resident's text: "${text}"

Respond in valid JSON only (no markdown):
{"title":"short 5-8 word title","description":"polished 2-3 sentence description","priority":"Low|Medium|High"}

Priority: High=emergency/fire/flood/gas/sewage, Low=cosmetic/suggestion, Medium=everything else`;
    const raw = await callGemini(prompt);
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch (err) {
    console.error("Gemini complaint generation failed:", err.message);
    const lower = text.toLowerCase();
    let priority = "Medium";
    if (/urgent|emergency|fire|flood|leak|dangerous/i.test(lower)) priority = "High";
    if (/minor|small|suggest|feedback/i.test(lower)) priority = "Low";
    const title = text.trim().split(/\s+/).slice(0, 8).join(" ").replace(/[^a-zA-Z0-9 ]/g, "");
    return { title: title.charAt(0).toUpperCase() + title.slice(1), description: `Complaint regarding: "${text}". Please investigate.`, priority };
  }
};

// ═════════════════════════════════════════════════════════════════
//  2. TASK PRIORITIZATION  [Gemini]
// ═════════════════════════════════════════════════════════════════
const prioritizeTask = async ({ title, description }) => {
  if (BOT_URL) {
    const result = await callBot("/ai/task/prioritize", { title, description });
    return result.priority;
  }
  try {
    const prompt = `Analyze this society management task and respond with ONLY one word: HIGH, MEDIUM, or LOW.
Title: "${title}"
Description: "${description || "N/A"}"
HIGH=urgent/safety/emergency/deadline, LOW=cosmetic/optional, MEDIUM=everything else`;
    const result = await callGemini(prompt);
    const p = result.toUpperCase().trim();
    return ["HIGH", "MEDIUM", "LOW"].includes(p) ? p : "MEDIUM";
  } catch (err) {
    console.error("Gemini task prioritization failed:", err.message);
    const combined = `${title} ${description || ""}`.toLowerCase();
    if (/urgent|critical|asap|emergency|immediate|deadline/i.test(combined)) return "HIGH";
    if (/important|soon|needed|required/i.test(combined)) return "MEDIUM";
    return "LOW";
  }
};

// ═════════════════════════════════════════════════════════════════
//  3. MEETING SUMMARIZATION PIPELINE  [Claude]
// ═════════════════════════════════════════════════════════════════
const transcribeAudio = async (transcriptText) => {
  if (BOT_URL) {
    const result = await callBot("/ai/meeting/transcribe", { audioUrl: transcriptText });
    return result.transcript;
  }
  // Pass-through: transcript text arrives directly from frontend (WebRTC captions or uploaded text)
  return transcriptText;
};

const splitTranscript = (text) => {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += 500) chunks.push(words.slice(i, i + 500).join(" "));
  return chunks.length > 0 ? chunks : [text];
};

const summarizeChunks = async (chunks) => {
  if (BOT_URL) {
    const result = await callBot("/ai/meeting/summarize-chunks", { chunks });
    return result.summaries;
  }
  const summaries = [];
  for (let i = 0; i < chunks.length; i++) {
    try {
      const summary = await callClaude(
        `You are a professional meeting secretary for a residential society.
Summarize this meeting transcript section in 3-5 bullet points (decisions, issues raised, action items).
Format each point starting with •

Transcript section ${i + 1}:
"${chunks[i]}"`
      );
      summaries.push(summary);
    } catch (err) {
      console.error(`Claude chunk summarization failed chunk ${i + 1}:`, err.message);
      summaries.push(`[Part ${i + 1}]: ${chunks[i].split(/\s+/).slice(0, 15).join(" ")}...`);
    }
  }
  return summaries;
};

const combineSummaries = async (summaries) => {
  if (BOT_URL) {
    const result = await callBot("/ai/meeting/combine", { summaries });
    return result.finalSummary;
  }
  try {
    return await callClaude(
      `You are a professional meeting secretary. Combine these section summaries into one final meeting summary.

Section summaries:
${summaries.join("\n\n")}

Format with: 1) Brief overview paragraph, 2) Key Discussion Points (bullets), 3) Decisions Made (bullets), 4) Action Items (bullets).
Use professional language suitable for official meeting minutes.`
    );
  } catch (err) {
    console.error("Claude combine summaries failed:", err.message);
    return `📋 MEETING SUMMARY\n\n${summaries.join("\n\n")}\n\n[End of Summary]`;
  }
};

const processMeeting = async (transcriptText) => {
  const transcript = await transcribeAudio(transcriptText);
  const chunks = splitTranscript(transcript);
  const chunkSummaries = await summarizeChunks(chunks);
  const summary = await combineSummaries(chunkSummaries);
  return { transcript, chunks: chunkSummaries, summary };
};

module.exports = { generateComplaint, prioritizeTask, transcribeAudio, splitTranscript, summarizeChunks, combineSummaries, processMeeting };
