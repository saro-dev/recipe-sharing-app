// CustomToast.js
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomToast = () => {
  const notify = () => toast.success('Added to favorites!', {
    position: 'top-right',
    autoClose: 2000, // Close after 2 seconds
  });

  return (
    <div>
      <button onClick={notify} style={{ display: 'none' }}></button>
      <ToastContainer />
    </div>
  );
};

export default CustomToast;
