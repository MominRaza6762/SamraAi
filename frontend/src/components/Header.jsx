import React from 'react';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 sm:px-6 shadow-lg relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Sidebar Toggle (Mobile Only) */}
          <button
            onClick={onToggleSidebar}
            className="sm:hidden text-2xl focus:outline-none relative z-50 bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all"
          >
            ☰
          </button>

          <img
            src="https://res.cloudinary.com/proxmaircloud/image/upload/v1760866850/images/mguwrgtmosbmec3kxi7g.png"
            alt="logo"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <h1 className="text-lg sm:text-2xl font-bold">SamraAI</h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              Your Personal Research Assistant
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium">Welcome, Samra Ilyas</p>
          <p className="text-xs text-indigo-200">MPhil Student</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
