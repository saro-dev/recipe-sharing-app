import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPostPage = () => {
  const { postId } = useParams(); // Get postId from URL params
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    content: ''
  });

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/post/${postId}`);
        setPost(response.data);
        setFormData({
          title: response.data.title, // Convert tags array to string
          content: response.data.content
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://recipe-backend-1e02.onrender.com/api/post/${postId}`, formData);
      navigate(`/post-details/${postId}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="tags">Tags:</label>
          <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleChange}></textarea>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPostPage;
