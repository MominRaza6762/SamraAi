import { analyzeImage, transcribeAudio, analyzeDocument } from './openaiService.js';

export const processFile = async (fileUrl, fileType, fileBuffer, prompt) => {
  try {
    // Image analysis
    if (fileType.startsWith('image/')) {
      const analysis = await analyzeImage(fileUrl, prompt);
      return {
        type: 'image_analysis',
        content: analysis
      };
    }

    // Audio transcription
    if (fileType.startsWith('audio/')) {
      const transcription = await transcribeAudio(fileBuffer);
      const analysis = await analyzeDocument(transcription, prompt || "Please provide a summary and key points from this audio transcription.");
      return {
        type: 'audio_transcription',
        transcription: transcription,
        analysis: analysis
      };
    }

    // Text-based documents (PDF, TXT, CSV, etc.)
    if (fileType === 'application/pdf' || 
        fileType === 'text/plain' || 
        fileType === 'text/csv' ||
        fileType === 'application/json') {
      
      const textContent = fileBuffer.toString('utf-8');
      const analysis = await analyzeDocument(textContent, prompt || "Please analyze this document and provide key insights.");
      
      return {
        type: 'document_analysis',
        content: analysis
      };
    }

    // DOCX and XLSX - simplified handling (in production, use proper parsers)
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      
      return {
        type: 'document_analysis',
        content: `Dear Samra, I've received your ${fileType.includes('word') ? 'Word' : 'Excel'} document. To provide detailed analysis, please use PDF or TXT format, or describe what specific information you need from this file.`
      };
    }

    throw new Error('Unsupported file type for processing');
  } catch (error) {
    console.error('File Processing Error:', error);
    throw error;
  }
};