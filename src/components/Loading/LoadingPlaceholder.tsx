import React from 'react';

const LoadingPlaceholder = () => (
  <div className="flex flex-col items-center space-y-4 p-4">
    <div className="w-full h-48 bg-gray rounded-lg animate-pulse"></div>
    <div className="w-full h-6 bg-gray rounded animate-pulse"></div>
    <div className="w-4/5 h-6 bg-gray rounded animate-pulse"></div>
  </div>
);

export default LoadingPlaceholder;
