/**
 * services/agora.service.js
 *
 * Generates Agora RTC tokens for audio-only meetings.
 * Residents click "Join" on the meeting page → frontend uses this token
 * to connect to the Agora channel for an audio call.
 *
 * Install: npm install agora-access-token
 */

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const { v4: uuidv4 } = require("uuid");

const APP_ID          = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// Token expires in 2 hours (in seconds)
const TOKEN_EXPIRY = 7200;

/**
 * Generate a unique channel name for a meeting
 */
const generateChannelName = (societyId, meetingId) => {
  return `society_${societyId}_meeting_${meetingId}`.replace(/[^a-zA-Z0-9_]/g, "_");
};

/**
 * Generate an Agora RTC token for a user to join a channel
 * @param {string} channelName  - Agora channel name
 * @param {string} uid          - User's numeric UID (use 0 for dynamic assignment)
 * @param {string} role         - "publisher" (can speak) or "subscriber" (listen only)
 */
const generateToken = (channelName, uid = 0, role = "publisher") => {
  if (!APP_ID || !APP_CERTIFICATE) {
    // Dev mode: return mock token
    console.warn("AGORA_APP_ID or AGORA_APP_CERTIFICATE not set — returning mock token");
    return { token: `MOCK_TOKEN_${uuidv4()}`, channelName, uid, expiresIn: TOKEN_EXPIRY };
  }

  const agoraRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const expireTime = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY;
  const privilegeExpireTime = expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID, APP_CERTIFICATE, channelName, uid, agoraRole, expireTime, privilegeExpireTime
  );

  return { token, channelName, uid, expiresIn: TOKEN_EXPIRY, appId: APP_ID };
};

module.exports = { generateChannelName, generateToken };
