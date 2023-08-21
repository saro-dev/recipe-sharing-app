import React from 'react';

const Modal = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md backdrop-brightness-90">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {children}
        <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={onRequestClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
