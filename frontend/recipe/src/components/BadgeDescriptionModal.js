// BadgeDescriptionModal.js
import React from 'react';
import Modal from './Modal';
import ironIcon from '../iron.png';
import bronzeIcon from '../bronze.png';
import silverIcon from '../silver.png';
import goldIcon from '../gold.png';

const BadgeDescriptionModal = ({ isOpen, onClose, recipeCount }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Badge Descriptions</h2>
        <p className='flex justify-space'>
          
              <img src={ironIcon} alt="Iron Icon" className="inline-block w-6 h-auto mr-2" />
              <span className='text-black font-bold'>Iron Badge</span>: Novice Poster (0-25 posts).
            
        </p>
        <p className='flex justify-space'>
          
              <img src={bronzeIcon} alt="Bronze Icon" className="inline-block w-6 h-auto mr-2" />
              <span className='text-red-900 font-bold'>Bronze Badge</span>: Active Poster (26-50 posts).
            
        </p>
        <p className='flex justify-space'>
          
              <img src={silverIcon} alt="Silver Icon" className="inline-block w-6 h-auto mr-2" />
              <span className='text-blue-300 font-bold'>Silver Badge</span>: Expert Poster (51-75 posts).
            
        </p>
        <p className='flex justify-space'>
          
              <img src={goldIcon} alt="Gold Icon" className="inline-block w-6 h-auto mr-2" />
              <span className='text-yellow-600 font-bold'>Gold Badge</span>: Master Poster (76-100 posts).
            
        </p>
      </div>
    </Modal>
  );
};

export default BadgeDescriptionModal;
