import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "./Alert";
import PostingModal from "./PostingModal";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RecipePostComponent = ({ userId,email }) => {
  const [recipeData, setRecipeData] = useState({
    title: "",
    ingredients: [""],
    steps: [""],
    tags: "",
    image: null,
    category: "",
    cookingTime: "",
    notesAndTips: "",
    timestamp: new Date().toISOString(),
  });
  const navigate = useNavigate();
  const [category, setCategory] = useState(""); // State for selected category
  const [loading, setLoading] = useState(false);
  const [cookingTime, setCookingTime] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const categories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"];
  const [userData, setUserData] = useState(null);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRecipeData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "category") {
      setCategory(value);
    }
  };

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    setRecipeData((prevData) => ({ ...prevData, image: selectedImage }));
  };

  const handleAddIngredient = () => {
    setRecipeData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, ""],
    }));
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients.splice(index, 1);
    setRecipeData((prevData) => ({ ...prevData, ingredients: newIngredients }));
  };
  const handleRemoveStep = (index) => {
    const newSteps = [...recipeData.steps];
    newSteps.splice(index, 1);
    setRecipeData((prevData) => ({ ...prevData, steps: newSteps }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index] = value;
    setRecipeData((prevData) => ({ ...prevData, ingredients: newIngredients }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...recipeData.steps];
    newSteps[index] = value;
    setRecipeData((prevData) => ({ ...prevData, steps: newSteps }));
  };
  const handleAddStep = () => {
    setRecipeData((prevData) => ({
      ...prevData,
      steps: [...prevData.steps, ""],
    }));
  };

  const handleCookingTimeChange = (event) => {
    const { value } = event.target;
    setCookingTime(value);
  };






  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPosting(true);
    const currentTime = new Date().toISOString(); // Get the current time as an ISO string

    const formData = new FormData();
    formData.append("title", recipeData.title);
    formData.append("ingredients", recipeData.ingredients.join("\n"));
    formData.append("steps", recipeData.steps.join("\n"));
    formData.append("tags", recipeData.tags);
    formData.append("userId", userId);
    formData.append("image", recipeData.image);
    formData.append("category", recipeData.category);
    formData.append("cookingTime", cookingTime);
    formData.append("notesAndTips", recipeData.notesAndTips);
    formData.append("timestamp", currentTime); // Append the timestamp to the form data

    setLoading(true);
    try {
      const response = await axios.post(
        "https://recipe-backend-1e02.onrender.com/api/postRecipe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { _id, authorName, title } = response.data;

    console.log("Recipe posted:", response.data);
    toast.success('Recipe posted successfully!', {
      position: 'top-right',
      autoClose: 1000, // Close after 2 seconds
    });
    setTimeout(() => navigate('/myposts'), 2000);


    } catch (error) {
      console.error("Error posting recipe:", error);
    } finally {
      setIsPosting(false);
      setLoading(false); // Disable loading state
    }
  };

  return (
    <div className="flex justify-center">
      <div className="p-4 w-full sm:w-96">
        {isPosting && <PostingModal />}
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
          <div className="relative z-1">
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
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="flex-1 border rounded p-2"
                required
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
                onChange={(e) => handleStepChange(index, e.target.value)}
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
          <div className="relative z-1">
            <select
              name="category"
              value={category}
              onChange={handleInputChange}
              className="w-full border rounded p-2 appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            name="cookingTime"
            placeholder="Cooking Time (minutes)"
            required
            value={cookingTime}
            onChange={handleCookingTimeChange}
            className="w-full border rounded p-2"
          />
          <div className="scrollable-textarea-container">
            <textarea
              name="notesAndTips"
              placeholder="Notes and Tips while cooking"
              required
              value={recipeData.notesAndTips}
              onChange={handleInputChange}
              className="scrollable-textarea"
              rows="4"
            />
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
            className="w-full bg-green-500 text-white py-2 px-4 font-bold rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipePostComponent;
