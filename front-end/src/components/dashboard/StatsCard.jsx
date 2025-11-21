import React from 'react';

const StatsCard = ({ title, value, icon, color, subtitle, onClick, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-300 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color} hover:shadow-md transition-shadow w-full text-left`}
      disabled={!onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </button>
  );
};

export default StatsCard;