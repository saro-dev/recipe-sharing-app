import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';

const EditPostPage = () => {
  const { postId } = useParams(); // Get postId from URL params
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    steps: '',
    notesAndTips: '',
    cookingTime: '',
    category: ''
  });

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`https://recipe-backend-1e02.onrender.com/api/post/${postId}`);
        setPost(response.data);
        setFormData({
          title: response.data.title,
          ingredients: response.data.ingredients,
          steps: response.data.steps,
          notesAndTips: response.data.notesAndTips,
          cookingTime: response.data.cookingTime,
          category: response.data.category
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
    return <div className='flex justify-center items-center bg-blue-500 text-snow p-1 '>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10 mb-10 w-full px-4">
      <h2 className="text-2xl font-bold mb-5">Edit Post</h2>
      <div>
        <img
          src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
          alt={post.title}
          className="max-w-full object-cover mb-2 rounded "
          style={{ maxWidth: "400px", width:"350px",height:"250px",objectFit:"cover" }}
        />
        <h4 className='bg-red-200 p-1 text-red-500 my-2 flex items-center rounded-xl' style={{width:"300px"}}>
          <FaInfoCircle
            className="text-red-500 cursor-pointer mx-1"
            size={15}
          /> you're not allowed to change image</h4>
      </div>
      <form onSubmit={handleSubmit} className="w-full " style={{marginBottom:"100px"}}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
          <input style={{width:"380px"}} type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients:</label>
          <textarea style={{width:"380px"}} id="ingredients" name="ingredients" value={formData.ingredients} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full h-20"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="steps" className="block text-sm font-medium text-gray-700">Steps:</label>
          <textarea style={{width:"380px"}} id="steps" name="steps" value={formData.steps} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full h-20"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="notesAndTips" className="block text-sm font-medium text-gray-700">Notes and Tips:</label>
          <textarea style={{width:"380px"}} id="notesAndTips" name="notesAndTips" value={formData.notesAndTips} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full h-20"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">Cooking Time (minutes):</label>
          <input style={{width:"380px"}} type="number" id="cookingTime" name="cookingTime" value={formData.cookingTime} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
          <input style={{width:"380px"}} type="text" id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPostPage;
