import React from 'react';

export const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-blue-500" />
      <p className="text-lg font-medium text-gray-700">Loading...</p>
    </div>
  );
}

