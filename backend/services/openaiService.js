import fs from "fs";
import openai from "../config/openai.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"; // ✅ Replaces pdf-parse

// 🧩 Helper function to extract text from PDF using pdfjs-dist
const extractTextFromPDF = async (fileBuffer) => {
  // Temporarily silence PDF.js console warnings
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
    const pdf = await loadingTask.promise;

    let textContent = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      const pageText = text.items.map((item) => item.str).join(" ");
      textContent += pageText + "\n\n";
    }

    return textContent.trim();
  } finally {
    // Restore warnings after extraction
    console.warn = originalWarn;
  }
};

// 🧹 Helper function to clean responses
const cleanResponse = (text) => {
  if (!text) return '';

  return text
    .replace(/^### (.*$)/gim, '\n\n🔹 $1\n')
    .replace(/^## (.*$)/gim, '\n\n🔸 $1\n')
    .replace(/^# (.*$)/gim, '\n\n⭐ $1\n')
    .replace(/\*\*(.*?)\*\*/gim, '$1'.toUpperCase())
    .replace(/\*(.*?)\*/gim, '$1')
    .replace(/^\s*[-*]\s+(.*$)/gim, '• $1')
    .replace(/^\d+\.\s+(.*$)/gim, '→ $1')
    .replace(/^\>\s+(.*$)/gim, '“$1”')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

// 💬 Chat Response
export const generateChatResponse = async (message, conversationHistory = []) => {
  try {
    const systemMessage = {
      role: "system",
      content: `You are SamraAI, a personal study and research assistant created exclusively for Samra Ilyas, an MPhil student.
Always address the user as "Samra". Be polite, academic, conversational, and helpful.
Provide detailed, well-researched answers, but ensure the reply is clean and formatted in plain text (no Markdown, no symbols like # or *). 
When appropriate, suggest further reading or research directions.`
    };

    const messages = [systemMessage, ...conversationHistory, { role: "user", content: message }];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    });

    const rawText = response.choices[0].message.content;
    return cleanResponse(rawText);
  } catch (error) {
    console.error('OpenAI Chat Error:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};

// 🖼️ Image Analysis
export const analyzeImage = async (imageUrl, prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are SamraAI, an AI assistant helping Samra Ilyas with image analysis. Respond in plain text without Markdown formatting."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt || "Please analyze this image in detail." },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1500
    });

    return cleanResponse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Image Analysis Error:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
};

// 🎧 Audio Transcription
export const transcribeAudio = async (audioBuffer) => {
  try {
    const file = new File([audioBuffer], "audio.mp3", { type: "audio/mpeg" });

    const response = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en"
    });

    return cleanResponse(response.text);
  } catch (error) {
    console.error('OpenAI Transcription Error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};

// 📄 Document (PDF) Analysis
export const analyzeDocument = async (fileBuffer, prompt) => {
  try {
    const documentText = await extractTextFromPDF(fileBuffer);

    const systemMessage = {
      role: "system",
      content: "You are SamraAI, helping Samra Ilyas analyze documents. Provide clear, academic explanations in plain text only — no Markdown or symbols."
    };

    const userMessage = {
      role: "user",
      content: `${prompt}\n\nDocument content:\n${documentText}`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemMessage, userMessage],
      temperature: 0.7,
      max_tokens: 2500
    });

    return cleanResponse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI Document Analysis Error:", error);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
};

// 🖼️ Image Generation
export const generateImage = async (prompt) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    return response.data[0].url;
  } catch (error) {
    console.error('OpenAI Image Generation Error:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
};
