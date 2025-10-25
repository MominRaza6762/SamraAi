import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-3xl px-6 py-4 rounded-2xl shadow-md bg-white border border-gray-200">
        <div className="flex items-center mb-2">
          <img
            src="https://res.cloudinary.com/proxmaircloud/image/upload/v1760866850/images/aczluepn3nt18oahwweh.png"
            alt="AI"
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="font-semibold text-sm text-indigo-600">SamraAI</span>
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;