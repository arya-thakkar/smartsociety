/**
 * server.js — Smart Society Management System v2.1
 */

require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const morgan    = require("morgan");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB();

// ── Routes ──────────────────────────────────────────────────────
app.use("/api/auth",          require("./routes/auth.routes"));
app.use("/api/society",       require("./routes/society.routes"));
app.use("/api/members",       require("./routes/member.routes"));
app.use("/api/staff",         require("./routes/staff.routes"));
app.use("/api/visitor",       require("./routes/visitor.routes"));
app.use("/api/logs",          require("./routes/log.routes"));
app.use("/api/amenities",     require("./routes/amenity.routes"));
app.use("/api/bookings",      require("./routes/booking.routes"));
app.use("/api/announcements", require("./routes/announcement.routes"));
app.use("/api/complaints",    require("./routes/complaint.routes"));
app.use("/api/tasks",         require("./routes/task.routes"));
app.use("/api/meetings",      require("./routes/meeting.routes"));
app.use("/api/finance",       require("./routes/finance.routes"));

// ── Health ──────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "ok", message: "Smart Society API v2.1 🏢" }));

// ── Global Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🏢  Smart Society API v2.1 on port ${PORT}`);
  console.log(`🤖  Gemini:      ${process.env.GEMINI_API_KEY        ? "✅" : "❌ not set"}`);
  console.log(`🤖  Claude:      ${process.env.CLAUDE_API_KEY        ? "✅" : "❌ not set"}`);
  console.log(`🎙️   AssemblyAI:  ${process.env.ASSEMBLYAI_API_KEY    ? "✅" : "❌ not set"}`);
  console.log(`☁️   Cloudinary:  ${process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌ not set"}`);
  console.log(`📞  Agora:       ${process.env.AGORA_APP_ID           ? "✅" : "⚠️  mock mode"}\n`);
});
