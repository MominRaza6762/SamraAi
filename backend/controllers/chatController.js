import { generateChatResponse } from '../services/openaiService.js';
import { saveChatMessage, getChatHistory } from '../models/chatModel.js';
import { createSession, updateSession, getSession } from '../models/sessionModel.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Message and session ID are required'
      });
    }

    // Check if session exists, create if not
    let session = await getSession(sessionId);
    if (!session) {
      await createSession(sessionId, 'New Chat');
    }

    // Get conversation history
    const history = await getChatHistory(sessionId);
    const conversationHistory = history.map(msg => ([
      { role: 'user', content: msg.user_message },
      { role: 'assistant', content: msg.bot_response }
    ])).flat();

    // Generate response
    const botResponse = await generateChatResponse(message, conversationHistory);

    // Save to database
    await saveChatMessage(sessionId, message, botResponse);

    // Update session timestamp
   await updateSession(sessionId, { title: session?.title || 'New Chat' });


    res.json({
      success: true,
      message: botResponse,
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Chat Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const history = await getChatHistory(sessionId);

    res.json({
      success: true,
      history: history
    });
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history',
      error: error.message
    });
  }
};