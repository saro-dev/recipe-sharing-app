import React, { useState } from 'react';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [updatedName, setUpdatedName] = useState(userData.name);
  const [updatedBio, setUpdatedBio] = useState(userData.bio);

  const handleSave = () => {
    // Call the onSave function to save the updated name and bio
    onSave(updatedName, updatedBio);
    onClose(); // Close the modal
  };

  return (
    // Modal backdrop
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="bg-white p-6 rounded-lg custom-shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-1">Name</label>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value.substring(0, 15))}
            className="border rounded py-1 px-2 w-full focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-1">Bio</label>
          <textarea
            value={updatedBio}
            onChange={(e) => setUpdatedBio(e.target.value.substring(0, 100))}
            rows="4"
            maxLength="100" // Set a maximum character limit (300 characters)
            className="border rounded py-2 px-2 w-full focus:outline-none focus:border-blue-400"
          ></textarea>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
