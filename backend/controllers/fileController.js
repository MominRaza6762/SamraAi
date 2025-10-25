import { uploadFile } from '../services/cloudinaryService.js';
import { processFile } from '../services/fileProcessingService.js';
import { saveFileUpload } from '../models/fileModel.js';
import { saveChatMessage } from '../models/chatModel.js';

export const uploadAndAnalyze = async (req, res) => {
  try {
    const { prompt, sessionId } = req.body;
    const file = req.file;

    if (!file || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'File and session ID are required'
      });
    }

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a prompt or instruction for the file analysis'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadFile(file.buffer, file.originalname, file.mimetype);

    // Save file metadata to database
    await saveFileUpload(
      sessionId,
      file.originalname,
      file.mimetype,
      uploadResult.secure_url,
      uploadResult.public_id
    );

    // Process file based on type
    const analysisResult = await processFile(
      uploadResult.secure_url,
      file.mimetype,
      file.buffer,
      prompt
    );

    // Format response
    let botResponse = '';
    if (analysisResult.type === 'image_analysis') {
      botResponse = `Dear Samra, I've analyzed the image you uploaded. Here's what I found:\n\n${analysisResult.content}`;
    } else if (analysisResult.type === 'audio_transcription') {
      botResponse = `Dear Samra, I've transcribed and analyzed your audio file.\n\nTranscription:\n${analysisResult.transcription}\n\nAnalysis:\n${analysisResult.analysis}`;
    } else if (analysisResult.type === 'document_analysis') {
      botResponse = `Dear Samra, I've analyzed your document. ${analysisResult.content}`;
    }

    // Save chat interaction
    await saveChatMessage(
      sessionId,
      `[File Upload: ${file.originalname}] ${prompt}`,
      botResponse
    );

    res.json({
      success: true,
      message: botResponse,
      fileUrl: uploadResult.secure_url,
      fileName: file.originalname
    });
  } catch (error) {
    console.error('File Upload Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process file',
      error: error.message
    });
  }
};