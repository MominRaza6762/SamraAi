import { getAllChatHistory } from '../models/chatModel.js';
import { getAllFileUploads } from '../models/fileModel.js';
import { getAllSessions } from '../models/sessionModel.js';

export const login = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Admin authenticated successfully'
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await getAllChatHistory();

    res.json({
      success: true,
      chats: chats
    });
  } catch (error) {
    console.error('Get All Chats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chats',
      error: error.message
    });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    const files = await getAllFileUploads();

    res.json({
      success: true,
      files: files
    });
  } catch (error) {
    console.error('Get All Files Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve files',
      error: error.message
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const chats = await getAllChatHistory();
    const files = await getAllFileUploads();
    const sessions = await getAllSessions();

    res.json({
      success: true,
      stats: {
        totalChats: chats.length,
        totalFiles: files.length,
        totalSessions: sessions.length
      }
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard stats',
      error: error.message
    });
  }
};