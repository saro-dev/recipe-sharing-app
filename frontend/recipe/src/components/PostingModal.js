import React from 'react';

const PostingModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
      <div className="bg-white p-6 rounded-lg custom-shadow z-999">
        <p className="text-xl font-semibold mb-4">Posting...</p>
        <p>Please wait while your recipe is being posted.</p>
      </div>
    </div>
  );
};

export default PostingModal;
