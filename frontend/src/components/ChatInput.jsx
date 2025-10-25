import React, { useState } from 'react';
import FileUpload from './FileUpload';

const ChatInput = ({ onSendMessage, onSendFile, loading }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && message.trim()) {
      onSendFile(selectedFile, message.trim());
      setSelectedFile(null);
      setMessage('');
      setShowFileUpload(false);
    } else if (message.trim() && !selectedFile) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setShowFileUpload(true);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setShowFileUpload(false);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3 sm:p-4 w-full">
      <div className="container mx-auto max-w-4xl">
        {showFileUpload && (
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onRemoveFile={handleRemoveFile}
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-end gap-2 sm:gap-3"
        >
          <div className="flex-1 relative w-full">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedFile
                  ? "Enter your prompt for file analysis..."
                  : "Ask SamraAI anything..."
              }
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm sm:text-base"
              rows="2"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600 transition-colors"
              disabled={loading}
            >
              📎
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || (!message.trim() && !selectedFile)}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-colors ${
              loading || (!message.trim() && !selectedFile)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? '⏳' : selectedFile ? '🔍 Analyze' : '📤 Send'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-3">
          SamraAI is powered by OpenAI GPT-4o
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
