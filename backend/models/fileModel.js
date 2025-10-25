import {mongoose} from "../config/database.js";

const fileSchema = new mongoose.Schema({
  session_id: { type: String, required: true, index: true },
  file_name: { type: String, required: true },
  file_type: { type: String },
  file_url: { type: String },
  cloudinary_id: { type: String },
  created_at: { type: Date, default: Date.now }
});

const FileUpload = mongoose.model("FileUpload", fileSchema);

// ✅ Save file upload
export const saveFileUpload = async (sessionId, fileName, fileType, fileUrl, cloudinaryId) => {
  const doc = await FileUpload.create({
    session_id: sessionId,
    file_name: fileName,
    file_type: fileType,
    file_url: fileUrl,
    cloudinary_id: cloudinaryId
  });
  return doc._id;
};

// ✅ Get all uploaded files (for all sessions)
export const getAllFileUploads = async () => {
  return FileUpload.find({})
    .sort({ created_at: -1 }) // ORDER BY created_at DESC
    .lean()
    .exec();
};

// ✅ Get uploaded files by session ID
export const getFileUploadsBySession = async (sessionId) => {
  return FileUpload.find({ session_id: sessionId })
    .sort({ created_at: -1 })
    .lean()
    .exec();
};
