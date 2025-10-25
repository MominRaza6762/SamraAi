import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import LoadingIndicator from '../components/LoadingIndicator';
import { sendChatMessage, getChatHistory, uploadFile } from '../utils/api';
import { generateSessionId } from '../utils/helpers';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(generateSessionId());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory(currentSessionId);
  }, [currentSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async (sessionId) => {
    try {
      const data = await getChatHistory(sessionId);
      const history = data.history || [];
      const formattedMessages = history.flatMap(msg => [
        { text: msg.user_message, isUser: true },
        { text: msg.bot_response, isUser: false }
      ]);
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (message) => {
    const userMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendChatMessage(message, currentSessionId);
      const botMessage = { text: response.message, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        text: 'Sorry Samra, I encountered an error. Please try again.',
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFile = async (file, prompt) => {
    const userMessage = { text: `[File: ${file.name}] ${prompt}`, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await uploadFile(file, prompt, currentSessionId);
      const botMessage = { text: response.message, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to upload file:', error);
      const errorMessage = {
        text: 'Sorry Samra, I encountered an error processing your file. Please try again.',
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = (sessionId) => {
    setCurrentSessionId(sessionId);
    setSidebarOpen(false); // Close sidebar automatically on mobile
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Header fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header onToggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content (with top padding to avoid overlap) */}
      <div className="flex flex-1 overflow-hidden relative pt-[72px]">
        {/* Sidebar (Overlays header on mobile) */}
        <div
          className={`fixed top-0 left-0 h-full w-64 transform bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:relative lg:translate-x-0 lg:w-64`}
        >
          <Sidebar
            currentSessionId={currentSessionId}
            onSessionSelect={handleSessionSelect}
            onClose={() => setSidebarOpen(false)} // 👈 ye line add karo
          />
        </div>

        {/* Backdrop (Mobile Only) */}
        {sidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          ></div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="container mx-auto max-w-3xl">
              {messages.length === 0 ? (
                <div className="text-center py-20">
                  <img
                    src="https://res.cloudinary.com/proxmaircloud/image/upload/v1760866851/images/hq5lykkcytufap7cchf9.png"
                    alt="background"
                    className="w-28 h-28 mx-auto rounded-full mb-6 shadow-md"
                  />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Welcome, Samra! 👋
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    I'm SamraAI, your personal research assistant. How can I
                    help you today?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
                    {[
                      {
                        icon: "📚",
                        title: "Research Help",
                        desc: "Literature review, paper analysis",
                      },
                      {
                        icon: "📄",
                        title: "Document Analysis",
                        desc: "PDF, DOCX, and more",
                      },
                      {
                        icon: "🔍",
                        title: "Web Research",
                        desc: "Latest information and trends",
                      },
                      {
                        icon: "🎯",
                        title: "Study Assistance",
                        desc: "Concepts, summaries, Q&A",
                      },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="text-2xl mb-2">{card.icon}</div>
                        <p className="text-sm font-semibold text-gray-800">
                          {card.title}
                        </p>
                        <p className="text-xs text-gray-500">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      message={msg.text}
                      isUser={msg.isUser}
                    />
                  ))}
                  {loading && <LoadingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
