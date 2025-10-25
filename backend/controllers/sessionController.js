import { getAllSessions, createSession } from '../models/sessionModel.js';

export const getSessions = async (req, res) => {
  try {
    const sessions = await getAllSessions();

    res.json({
      success: true,
      sessions: sessions
    });
  } catch (error) {
    console.error('Get Sessions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sessions',
      error: error.message
    });
  }
};

export const newSession = async (req, res) => {
  try {
    const { sessionId, title } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    await createSession(sessionId, title || 'New Chat');

    res.json({
      success: true,
      sessionId: sessionId,
      message: 'Session created successfully'
    });
  } catch (error) {
    console.error('Create Session Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
      error: error.message
    });
  }
};