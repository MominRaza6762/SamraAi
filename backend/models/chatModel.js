import {mongoose} from "../config/database.js";

const chatSchema = new mongoose.Schema({
  session_id: { type: String, required: true, index: true },
  user_message: { type: String, required: true },
  bot_response: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const Chat = mongoose.model("ChatHistory", chatSchema);

// ✅ Save a new chat message
export const saveChatMessage = async (sessionId, userMessage, botResponse) => {
  const doc = await Chat.create({
    session_id: sessionId,
    user_message: userMessage,
    bot_response: botResponse
  });
  return doc._id;
};

// ✅ Get chat history by session ID
export const getChatHistory = async (sessionId, limit = 100) => {
  return Chat.find({ session_id: sessionId })
             .sort({ created_at: -1 })
             .limit(limit)
             .lean()
             .exec();
};

// ✅ Get all chat history (for all sessions)
export const getAllChatHistory = async () => {
  return Chat.find({})
             .sort({ created_at: -1 }) // ORDER BY created_at DESC
             .lean()
             .exec();
};
