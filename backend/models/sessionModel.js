import {mongoose} from "../config/database.js";

const sessionSchema = new mongoose.Schema({
  session_id: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: "New Chat" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

sessionSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Session = mongoose.model("Session", sessionSchema);

// ✅ Create new session
export const createSession = async (sessionId, title) => {
  const doc = await Session.create({
    session_id: sessionId,
    title: title || "New Chat"
  });
  return doc._id;
};

// ✅ Update existing session
export const updateSession = async (sessionId, data = {}) => {
  data.updated_at = new Date();
  return Session.findOneAndUpdate(
    { session_id: sessionId },
    { $set: data },
    { new: true, upsert: true }
  )
    .lean()
    .exec();
};

// ✅ Get a single session by ID
export const getSession = async (sessionId) => {
  return Session.findOne({ session_id: sessionId }).lean().exec();
};

// ✅ Get all sessions (newly added)
export const getAllSessions = async () => {
  return Session.find({})
    .sort({ updated_at: -1 }) // same as ORDER BY updated_at DESC
    .lean()
    .exec();
};
