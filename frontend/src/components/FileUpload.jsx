import React, { useState } from 'react';
import { getFileIcon } from '../utils/helpers';

const FileUpload = ({ onFileSelect, selectedFile, onRemoveFile }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="mb-4">
      {selectedFile ? (
        <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileIcon(selectedFile.type)}</span>
            <div>
              <p className="font-medium text-gray-800">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={onRemoveFile}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            ✕
          </button>
        </div>
      ) : (
        <form
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            onChange={handleChange}
            accept=".pdf,.txt,.csv,.docx,.xlsx,.json,.jpg,.jpeg,.png,.webp,.mp3,.wav,.m4a"
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-2">
              <div className="text-4xl">📎</div>
              <p className="text-sm text-gray-600">
                Drag & drop or <span className="text-indigo-600 font-semibold">browse</span>
              </p>
              <p className="text-xs text-gray-500">
                PDF, TXT, CSV, DOCX, XLSX, JSON, Images, Audio
              </p>
            </div>
          </label>
        </form>
      )}
    </div>
  );
};

export default FileUpload;