import React from 'react';

const ChatMessage = ({ message, isUser }) => {
  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } mb-3 sm:mb-4 px-2 sm:px-4`}
    >
      <div
        className={`max-w-[85%] sm:max-w-3xl px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-md transition-all duration-300 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        {/* AI Avatar and Name */}
        {!isUser && (
          <div className="flex items-center mb-2">
            <img
              src="https://res.cloudinary.com/proxmaircloud/image/upload/v1760866850/images/aczluepn3nt18oahwweh.png"
              alt="AI"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full mr-2"
            />
            <span className="font-semibold text-xs sm:text-sm text-indigo-600">
              SamraAI
            </span>
          </div>
        )}

        {/* Message Text */}
        <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words">
          {message}
        </div>

        {/* User Name */}
        {isUser && (
          <div className="flex items-center justify-end mt-2">
            <span className="text-[10px] sm:text-xs text-indigo-200">Samra</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
