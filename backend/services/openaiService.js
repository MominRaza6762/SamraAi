
import openai from '../config/openai.js';

// Helper function to clean Markdown and extra symbols
const cleanResponse = (text) => {
  if (!text) return '';

  return text
    // Headings (#, ##, ###)
    .replace(/^### (.*$)/gim, '\n\n🔹 $1\n')  // Level 3 heading
    .replace(/^## (.*$)/gim, '\n\n🔸 $1\n')   // Level 2 heading
    .replace(/^# (.*$)/gim, '\n\n⭐ $1\n')    // Level 1 heading

    // Bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '$1'.toUpperCase()) // **text** → TEXT
    .replace(/\*(.*?)\*/gim, '$1')                   // *text* → text

    // Lists (- or *)
    .replace(/^\s*[-*]\s+(.*$)/gim, '• $1')          // - item → • item

    // Numbered lists
    .replace(/^\d+\.\s+(.*$)/gim, '→ $1')

    // Blockquotes
    .replace(/^\>\s+(.*$)/gim, '“$1”')

    // Remove backticks and code blocks
    .replace(/```[\s\S]*?```/g, '')                  // remove code blocks
    .replace(/`([^`]+)`/g, '$1')                     // inline code → plain

    // Clean extra newlines & spaces
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const generateChatResponse = async (message, conversationHistory = []) => {
  try {
    const systemMessage = {
      role: "system",
      content: `You are SamraAI, a personal study and research assistant created exclusively for Samra Ilyas, an MPhil student. 
Always address the user as "Samra". Be polite, academic, conversational, and helpful. 
Provide detailed, well-researched answers, but ensure the reply is clean and formatted in plain text (no Markdown, no symbols like # or *). 
When appropriate, suggest further reading or research directions.`
    };

    const messages = [
      systemMessage,
      ...conversationHistory,
      { role: "user", content: message }
    ];

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

export const analyzeDocument = async (documentText, prompt) => {
  try {
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
    console.error('OpenAI Document Analysis Error:', error);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
};

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
