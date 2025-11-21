import React from 'react';

const ErrorAlert = ({ message, onRetry, onClose }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-700 text-sm mt-1">{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
      
      {onRetry && (
        <div className="mt-3 flex space-x-2">
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorAlert;