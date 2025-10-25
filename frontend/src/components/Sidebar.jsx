import React, { useEffect, useState } from 'react';
import { getAllSessions, createSession } from '../utils/api';
import { generateSessionId, formatDate, truncateText } from '../utils/helpers';

const Sidebar = ({ currentSessionId, onSessionSelect, onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getAllSessions();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    const newSessionId = generateSessionId();
    try {
      await createSession(newSessionId, 'New Chat');
      onSessionSelect(newSessionId);
      loadSessions();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <div className="w-64 h-full flex flex-col bg-white border-r border-gray-200 shadow-md relative">
      {/* ❌ Close Button (Only for mobile) */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl lg:hidden"
      >
        ✖
      </button>

      {/* Chat List Section */}
      <div className="flex-1 overflow-y-auto p-3 mt-8 lg:mt-0">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Recent Chats
        </h3>

        {loading ? (
          <div className="text-center py-8 text-gray-400 animate-pulse">
            Loading...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No chat history yet
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.session_id)}
                className={`w-full text-left p-3 rounded-lg transition-colors text-sm duration-200 ${
                  currentSessionId === session.session_id
                    ? 'bg-indigo-100 border-l-4 border-indigo-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-medium text-gray-800">
                  {truncateText(session.title || 'New Chat', 22)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(session.updated_at)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New Chat Button (Fixed at bottom) */}
      <div className="p-4 border-t bg-white sticky bottom-0">
        <button
          onClick={handleNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 text-sm shadow-md"
        >
          <span>➕</span>
          <span>New Chat</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
