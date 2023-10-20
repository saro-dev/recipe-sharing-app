import React from 'react';

const Alert = ({ type, message }) => {
  const alertClass = 
    type === 'success' ? 'bg-green-100 text-green-800 border-b-2  border-green-700' :
    type === 'error' ? 'bg-red-100 text-red-800 border-b-2  border-red-900' :
    '';

  return (
    <div className={`p-4 mb-4 rounded-lg z-999 ${alertClass}`}>
      {message}
    </div>
  );
};

export default Alert;
