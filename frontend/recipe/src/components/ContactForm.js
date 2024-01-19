// ContactForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './contactform.css';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous route
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Submit the form data to the server
    axios.post('https://recipe-backend-1e02.onrender.com/api/contact', formData)
      .then((response) => {
        setResponseMessage({
          text: 'Your message has been sent successfully. Recipeeze will contact you shortly.',
          color: 'green', // Set color to green for success
        });
        setTimeout(() => {
        navigate('/');
      }, 3000);                                                                                                                                                                   
      })
      .catch((error) => {
        setResponseMessage({
          text: 'An error occurred while sending your message. Please try again later.',
          color: 'red', // Set color to red for error
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="contact-form">
    <div className="back-nav" onClick={handleGoBack}>
        &#x2190; Back
      </div>
      <h2 className="contact-title">Get in Touch</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />

        <label className="form-label">Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />

        <label className="form-label">Message:</label>
        <textarea name="message" value={formData.message} onChange={handleChange} className="form-textarea" required />

        <button type="submit" className="form-button" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {responseMessage && <p style={{ color: responseMessage.color }} className={submitting ? 'submitting' : 'response'}>{responseMessage.text}</p>}
    </div>
  );
};

export default ContactForm;
