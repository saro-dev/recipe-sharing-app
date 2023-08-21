import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlusCircle, FiTrash } from 'react-icons/fi';
import Alert from './Alert';

const RecipePostComponent = ({ userId }) => {
  const [recipeData, setRecipeData] = useState({
    title: '',
    ingredients: [''],
    steps: [''],
    tags: '',
    image: null,
    category: '',
    timestamp: new Date().toISOString(),
  });
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [category, setCategory] = useState(''); // State for selected category
  const categories = ['Breakfast', 'Lunch', 'Dinner'];

  const handleInputChange = event => {
    const { name, value } = event.target;
    setRecipeData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = event => {
    const selectedImage = event.target.files[0];
    setRecipeData(prevData => ({ ...prevData, image: selectedImage }));
  };

  const handleAddIngredient = () => {
    setRecipeData(prevData => ({ ...prevData, ingredients: [...prevData.ingredients, ''] }));
  };

  const handleRemoveIngredient = index => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients.splice(index, 1);
    setRecipeData(prevData => ({ ...prevData, ingredients: newIngredients }));
  };
  const handleRemoveStep = index => {
    const newSteps = [...recipeData.steps];
    newSteps.splice(index, 1);
    setRecipeData(prevData => ({ ...prevData, steps: newSteps }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index] = value;
    setRecipeData(prevData => ({ ...prevData, ingredients: newIngredients }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...recipeData.steps];
    newSteps[index] = value;
    setRecipeData(prevData => ({ ...prevData, steps: newSteps }));
  };
  const handleAddStep = () => {
    setRecipeData(prevData => ({ ...prevData, steps: [...prevData.steps, ''] }));
  };
  const handleSubmit = async event => {
    event.preventDefault();
    
    const currentTime = new Date().toISOString(); // Get the current time as an ISO string
    
    const formData = new FormData();
    formData.append('title', recipeData.title);
    formData.append('ingredients', recipeData.ingredients.join('\n'));
    formData.append('steps', recipeData.steps.join('\n'));
    formData.append('tags', recipeData.tags);
    formData.append('userId', userId);
    formData.append('image', recipeData.image);
    formData.append('category', recipeData.category);
    formData.append('timestamp', currentTime); // Append the timestamp to the form data
    
    try {
      const response = await axios.post('https://recipe-backend-wntf.onrender.com/api/postRecipe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Recipe posted:', response.data);
      setAlert({ type: 'success', message: 'Recipe posted successfully!' });
      setTimeout(() => setAlert(null), 2000);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error posting recipe:', error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="p-4 w-full sm:w-96">
        {alert && <Alert type={alert.type} message={alert.message} />}
        <h2 className="text-xl font-semibold mb-4">Post a Recipe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
          <div className="relative">
  <input
    type="file"
    name="image"
    required
    onChange={handleImageUpload}
    className="sr-only" // Hide the default input appearance
    id="image-upload" // Add an ID for the label to associate with
  />
  <label
    htmlFor="image-upload" // Use the ID of the input
    className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 flex items-center justify-center"
  >
    <span className="mr-2">Upload Image</span>
    <i className="fas fa-upload mr-2"></i>
  </label>
</div>

          {recipeData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <input
                type="text"
                placeholder={`Ingredient ${index + 1}`}
                value={ingredient}
                onChange={e => handleIngredientChange(index, e.target.value)}
                className="flex-1 border rounded p-2"
              />
              {index > 0 && (
                <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="text-red-500 hover:text-red-600 focus:outline-none"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="w-full bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 flex items-center justify-center"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Add Ingredient
          </button>
          {recipeData.steps.map((step, index) => (
  <div key={index} className="flex space-x-2 items-center">
    <input
      type="text"
      placeholder={`Step ${index + 1}`}
      value={step}
      onChange={e => handleStepChange(index, e.target.value)}
      className="flex-1 border rounded p-2"
    />
    {index > 0 && (
    <button
      type="button"
      onClick={() => handleRemoveStep(index)}
      className="text-red-500 hover:text-red-600 focus:outline-none"
    >
      <i className="fas fa-trash-alt"></i>
    </button>
    )}
  </div>
))}
<button
  type="button"
  onClick={handleAddStep}
  className="w-full bg-blue-500 text-white py-1 px-2 rounded mt-2 hover:bg-blue-600"
>
  <i className="fas fa-plus-circle mr-2"></i> Add Step
</button>
<div className="relative">
  <select
    name="category"
    value={category}
    onChange={handleInputChange}
    className="w-full border rounded p-2 appearance-none"
  >
    <option value="">Select Category</option>
    {categories.map(cat => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 font-bold rounded hover:bg-blue-600"
          >
            Post Recipe 
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default RecipePostComponent;
