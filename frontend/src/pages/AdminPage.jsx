import React, { useState, useEffect } from 'react';
import { adminLogin, getAllChats, getAllFiles, getDashboardStats } from '../utils/api';
import { formatDate, getFileIcon } from '../utils/helpers';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [chats, setChats] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated && activeTab === 'stats') {
      loadStats();
    } else if (isAuthenticated && activeTab === 'chats') {
      loadChats();
    } else if (isAuthenticated && activeTab === 'files') {
      loadFiles();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminLogin(username, password);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadChats = async () => {
    try {
      const data = await getAllChats();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const loadFiles = async () => {
    try {
      const data = await getAllFiles();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.user_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.bot_response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🔐 Admin Access</h1>
            <p className="text-gray-600">SamraAI Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SamraAI Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage chats, files, and analytics</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'stats'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 Statistics
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'chats'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            💬 Chat History
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'files'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📁 Files
          </button>
        </div>

        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-2">💬</div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalChats}</h3>
              <p className="text-gray-600">Total Messages</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-2">📁</div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalFiles}</h3>
              <p className="text-gray-600">Files Uploaded</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalSessions}</h3>
              <p className="text-gray-600">Chat Sessions</p>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search chat history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredChats.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No chat history found</p>
              ) : (
                filteredChats.map((chat) => (
                  <div key={chat.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-500">{formatDate(chat.created_at)}</span>
                      <span className="text-xs font-medium text-indigo-600">Session: {chat.session_id.substr(0, 15)}...</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg mb-2">
                      <p className="text-sm text-gray-800"><strong>User:</strong> {chat.user_message}</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-800"><strong>SamraAI:</strong> {chat.bot_response}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {files.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No files uploaded yet</p>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="border-b border-gray-200 pb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{getFileIcon(file.file_type)}</span>
                      <div>
                        <p className="font-medium text-gray-800">{file.file_name}</p>
                        <p className="text-xs text-gray-500">{formatDate(file.created_at)}</p>
                        <p className="text-xs text-gray-500">Session: {file.session_id.substr(0, 15)}...</p>
                      </div>
                    </div>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      View File
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;