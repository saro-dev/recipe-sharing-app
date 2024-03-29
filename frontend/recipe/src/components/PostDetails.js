import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaHeart,
  FaWhatsapp,
  FaSnapchat,
  FaTelegram,
} from "react-icons/fa";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import ReactDOM from "react-dom";
import Comment from "./Comment";
import defaultimg from "./defaultimg.jpg";
import nonveg from "../non-veg.png";
import veg from "../veg.webp";

const PostDetails = ({ loggedInUser }) => {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [alert, setAlert] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);

  const postURL = window.location.href;
  const customMessage = "Hey, check out this amazing dish on Recipeeze!";

  // Function to fetch comments for a specific post
  const fetchPostComments = async () => {
    try {
      const commentsResponse = await axios.get(
        `https://recipe-backend-1e02.onrender.com/api/comments/${postId}`
      );

      setComments(commentsResponse.data);
      console.log(commentsResponse);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(
          `https://recipe-backend-1e02.onrender.com/api/posts/${postId}`
        );
        const postData = response.data;
        setPost(postData);

        // Check if the logged-in user has this post in favorites
        if (loggedInUser) {
          const response2 = await axios.get(
            `https://recipe-backend-1e02.onrender.com/api/isFavorite/${loggedInUser._id}/${postId}`
          );
          setIsFavorite(response2.data.isFavorite);
        }

        // Set the number of likes after setting the post state
        setLikes(postData.likes.length);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
    fetchPostComments(); // Call the function to fetch comments
  }, [postId, loggedInUser]);

  const handleToggleLike = useCallback(async () => {
    try {
      // Send a request to toggle the like status of the post
      const response = await axios.post(
        `https://recipe-backend-1e02.onrender.com/api/like/${postId}`,
        {
          userId: loggedInUser._id,
        }
      );
      const updatedPost = response.data;

      // Update the number of likes based on the response
      setLikes(updatedPost.likes.length);
      const notificationMessage = `${loggedInUser.name} likes your post`;
        const notification = {
          type: 'like',
          postId: updatedPost._id,
          message: notificationMessage,
          isRead: false,
          createdAt: new Date(),
          UserId: loggedInUser._id,
        };

        // Send notification to the post owner, excluding self
        if (updatedPost.userId !== loggedInUser._id) {
          const notificationResponse = await axios.post(
            `https://recipe-backend-1e02.onrender.com/api/addNotification/${updatedPost.userId}`,
            {
              notification,
            }
          );

          console.log(`Notification sent to post owner ${updatedPost.userId}:`, notificationResponse.data);
          
        }

      // ... (other logic for updating isFavorite, local storage, and notifications)
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }, [postId, loggedInUser]);
  
  const handleAddToFavorites = async () => {
    try {
      if (!loggedInUser) {
        // Redirect to login page or show a message
        return;
      }

      if (isFavorite) {
        await axios.delete(
          `https://recipe-backend-1e02.onrender.com/api/removeFavorite/${loggedInUser._id}/${postId}`
        );
        setAlert({
          type: "success",
          message: "Removed from favorites successfully",
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      } else {
        await axios.post(
          `https://recipe-backend-1e02.onrender.com/api/addFavorite/${loggedInUser._id}/${postId}`
        );
        setAlert({
          type: "success",
          message: "Added to favorites successfully",
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }

      setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await axios.post(
        `https://recipe-backend-1e02.onrender.com/api/comment/${postId}`,
        {
          userId: loggedInUser._id,
          text: commentText,
        }
      );
      const newComment = response.data;

      // Update the post with the new comment
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, newComment],
      }));

      // Clear the comment text
      setCommentText("");
      const notificationMessage = `${loggedInUser.name} commented on your post`;
        const notification = {
          type: 'comment',
          postId: post._id,
          message: notificationMessage,
          isRead: false,
          createdAt: new Date(),
          UserId: loggedInUser._id,
        };

        // Send notification to the post owner, excluding self
        if (post.userId !== loggedInUser._id) {
          const notificationResponse = await axios.post(
            `https://recipe-backend-1e02.onrender.com/api/addNotification/${post.userId._id}`,
            {
              notification,
            }
          );

          console.log(`Notification sent to post owner ${post.userId._id}:`, notificationResponse.data);
        }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (parentCommentId, text) => {
    try {
      const response = await axios.post(
        `https://recipe-backend-1e02.onrender.com/api/comment/${postId}/addReply/${parentCommentId}`,
        {
          userId: loggedInUser._id,
          name: loggedInUser.name,
          text,
        }
      );

      const newReply = response.data;

      // Update the state to reflect the newly added reply
      setPost((prevPost) => {
        const updatedComments = addReplyToComments(
          prevPost.comments,
          parentCommentId,
          newReply
        );
        return { ...prevPost, comments: updatedComments };
      });
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const addReplyToComments = (comments, parentCommentId, newReply) => {
    return comments.map((comment) => {
      if (comment._id === parentCommentId) {
        // Add the new reply to the replies array of the parent comment
        if (!comment.replies) {
          comment.replies = [newReply];
        } else {
          comment.replies.push(newReply);
        }
      } else if (comment.replies) {
        // Recursively search for the parent comment in replies
        addReplyToComments(comment.replies, parentCommentId, newReply);
      }
      return comment;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-20 w-20 mt-5 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4 page-container">
        <p>Failed to load post details.</p>
      </div>
    );
  }

  

  const ingredientList = post.ingredients
    .split("\n")
    .map((ingredient, index) => (
      <p key={index} className="mt-2">
        <span className="font-semibold">{index + 1}. </span>
        {ingredient}
      </p>
    ));
  const stepList = post.steps.split("\n").map((step, index) => (
    <p key={index} className="mt-2">
      <span className="font-semibold">{index + 1}. </span>
      {step}
    </p>
  ));

  const uptitle = post.title.toUpperCase();
  const handleProfileClick = () => {
    if (loggedInUser && loggedInUser._id === post.userId._id) {
      // If the post owner is the logged-in user, navigate to their profile
      navigate("/profile");
    } else {
      // If the post owner is not the logged-in user, navigate to the post owner's profile
      navigate(`/user/${post.userId._id}`);
    }
  };
  const handleConvertToImage = (uptitle) => {
    // Convert the ingredient list to a plain text string
    const ingredientText = ingredientList
      .map((ingredient, index) => {
        const ingredientElement = document.createElement("div");
        ReactDOM.render(ingredient, ingredientElement);
        return ` ${ingredientElement.textContent}`;
      })
      .join("\n");

    // Create a temporary element to measure the text size
    const tempElement = document.createElement("div");
    tempElement.style.font = "bold 24px Arial"; // Font size and type
    tempElement.textContent = "RECIPEEZE";

    // Get the width and height required for the text
    const textWidth = tempElement.offsetWidth + 5;
    const textHeight = tempElement.offsetHeight + 20;

    // Calculate the canvas dimensions based on text size and content
    const canvasWidth = Math.max(400, textWidth);
    const canvasHeight =
      textHeight + 40 + ingredientText.split("\n").length * 30; // Increased vertical padding

    // Create a canvas element with dynamic dimensions
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions based on content
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set background color to purple
    context.fillStyle = "purple";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Define styles for text
    context.fillStyle = "white"; // Text color
    context.font = "bold 24px Arial"; // Font size and type

    // Add the heading text "RECIPEEZE" centered horizontally
    const headingX = (canvas.width - textWidth) / 4;
    const headingY = 30;
    context.fillText("RECIPEEZE", headingX, headingY);

    // Define initial position for drawing ingredient text
    let x = 20; // X-coordinate
    let y = textHeight + 60; // Increased vertical padding and alignment

    // Draw the ingredient text on the canvas
    ingredientText.split("\n").forEach((line) => {
      context.fillText(line, x, y);
      y += 30; // Move down for the next line
    });

    // Convert the canvas to a data URL (image)
    const dataUrl = canvas.toDataURL("image/png");

    // Create a download link for the image with the recipe title as the filename
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${uptitle}.png`; // Set the image filename to the recipe title
    a.click();
  };

  function checkForNonVeg(ingredients) {
    const nonVegKeywords = [
      "egg",
      "chicken",
      "meat",
      "mutton",
      "beef",
      "pork",
      "fish",
      "seafood",
      "lamb",
      "venison",
      "duck",
      "turkey",
      "veal",
      "salmon",
      "shrimp",
      "crab",
      "lobster",
      "clam",
      "oyster",
      "scallop",
      "squid",
      "octopus",
      "prawn",
      "ham",
      "bacon",
      "sausage",
      "steak",
      "ribs",
      "liver",
      "tripe",
      "gizzard",
      "offal",
    ];
    const lowerIngredients = ingredients.toLowerCase();

    return nonVegKeywords.some((keyword) => lowerIngredients.includes(keyword));
  }

  return (
    <div className="p-4 page-container mb-20 max-w-4xl mx-auto">
      {!loggedInUser && (
        <div className="z-999 bg-red-100 p-4 rounded text-red-600 mb-4">
          You are not logged in! <br></br> Please{" "}
          <Link
            className="bg-red-600 text-white px-2 py-1 rounded font-bold mx-1"
            to="/login"
          >
            Log In
          </Link>{" "}
          or{" "}
          <Link
            className="bg-red-600 text-white px-2 py-1 rounded font-bold mx-1"
            to="/signup"
          >
            Sign Up
          </Link>{" "}
          to view more recipes.
        </div>
      )}
      {alert && (
        <div
          className={`p-2 mb-4 z-999 text-white bg-${
            alert.type === "success" ? "green" : "red"
          }-500`}
        >
          {alert.message}
        </div>
      )}
      <div className=" mb-4 w-100 flex">
        <button
          onClick={() => navigate(-1)}
          className="text-black-600 flex items-center"
        >
          <FaArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <button
          onClick={handleAddToFavorites}
          className={`ml-auto ${
            isFavorite
              ? "text-yellow-500"
              : "text-gray-500 hover:text-yellow-500"
          }`}
        >
          <FaStar size={25} />
        </button>
      </div>
      <hr></hr>

      <h2 className="text-l font-semibold mb-4 mt-2 flex">
        Post By{" "}
        <button
          className="ml-2 text-blue-900 flex"
          onClick={handleProfileClick}
        >
          <img
            src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${post.userId._id}`}
            alt=""
            className="max-w-full max-h-full object-cover mr-2"
            style={{ height: "50px", width: "50px", borderRadius: "50%" }}
            onError={(e) => {
              e.target.src = defaultimg; // Replace with the URL of your default image
            }}
          />
          <h2 className="text-2xl mt-2">{post.userId.name}</h2>
        </button>
      </h2>
      <hr></hr>
      <div className="flex mb-4 mt-2">
        <h2 className="text-xl font-semibold  mr-6">{uptitle}</h2>
        {checkForNonVeg(post.ingredients) ? (
          <img
            src={nonveg} // Replace with the path to your non-veg icon
            alt="Non-Veg"
            className="h-6 w-6 mr-3"
          />
        ) : (
          <img
            src={veg} // Replace with the path to your veg icon
            alt="Veg"
            className="h-6 w-6 mr-3"
          />
        )}
      </div>
      <div>
        <img
          src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
          alt={post.title}
          className="max-w-full object-cover mb-2 rounded"
          style={{ maxWidth: "300px" }}
        />
      </div>
      <div className="flex items-center">
        <button
          className={`like-button2 h-10 ${
            isFavorite ? "text-white" : "text-red-600 hover:text-white"
          }`}
          onClick={handleToggleLike}
        >
          <FaHeart size={25} />
          {likes} Likes
        </button>
        <div className="mt-2 bg-white w-40 rounded ml-3">
          <div className="ml-5">
            <h3 className="font-semibold ">Making Time:</h3>
            <i className="fa fa-clock mr-2 text-green-600"></i>
            {post.cookingTime} Minutes
          </div>
        </div>
      </div>
      <hr className="m-1"></hr>
      <div className="mt-2">
        <h3 className="font-semibold">Ingredients:</h3>
        {ingredientList}
      </div>
      <button
        className="bg-blue-700 text-white p-2 rounded-lg mt-3"
        onClick={() => handleConvertToImage(uptitle)}
      >
        Convert to Shopping List
      </button>
      <hr className="mt-2"></hr>
      <div className="mt-2">
        <h3 className="font-semibold">Steps:</h3>
        {stepList}
      </div>
      <hr></hr>
      <div className="mt-2 bg-blue-200 rounded p-3">
        <h3 className="font-semibold mb-1">Notes and Tips:</h3>
        {post.notesAndTips}
      </div>

      <p className="mt-2">
        <span className="text-blue-600">#Tags:</span>{" "}
        {post.tags.split(",").map((tag, index) => (
          <span key={index}>{tag.trim()} </span>
        ))}
      </p>
      <hr className="m-2"></hr>
      <div className="bg-white p-2 rounded flex">
        <h1 className="mb-2">
          Share <i className="fa fa-share"></i>
        </h1>
        <WhatsappShareButton
          url={postURL}
          title={`${customMessage}\n${post.title}`}
        >
          <FaWhatsapp
            size={30}
            className="ml-2 cursor-pointer text-green-500 hover:text-green-600"
          />
        </WhatsappShareButton>
        <FacebookShareButton
          url={postURL}
          quote={`${customMessage}\n${post.title}`}
        >
          <FacebookIcon
            size={30}
            className="ml-4 cursor-pointer text-blue-600 hover:text-blue-700"
          />
        </FacebookShareButton>

        <a
          href={`https://www.snapchat.com/share?url=${encodeURIComponent(
            postURL
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaSnapchat
            size={30}
            className="ml-4 cursor-pointer text-yellow-600 hover:text-yellow-700"
          />
        </a>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(postURL)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegram
            size={30}
            className="ml-4 cursor-pointer text-blue-600 hover:text-blue-700"
          />
        </a>
      </div>
      <div className="mt-4 mb-4">
        <h3 className="font-semibold">Comments:</h3>
        <div className="bg-slate-800 border border-slate-700 flex flex-col rounded-xl p-2 text-sm my-2">
          <h1 className="text-center text-slate-600 text-xl font-bold col-span-6">
            Post a comment
          </h1>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Your thoughts..."
            className="bg-slate-700 text-slate-300 h-28 placeholder:text-slate-300 placeholder:opacity-50 border border-slate-600  resize-none outline-none rounded-lg p-2 duration-300 focus:border-slate-300"
            style={{ width: "100%" }}
          ></textarea>

          <div className="flex justify-end mt-2" style={{ width: "100%" }}>
            <button
              onClick={() => handleAddComment(post._id)}
              disabled={!commentText.trim()}
              className=" stroke-slate-300 bg-slate-700 focus:stroke-blue-200 focus:bg-blue-600 border border-slate-600 hover:border-slate-300 rounded-lg p-2 duration-300 flex justify-center items-center "
              style={{ width: "100px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M10.11 13.6501L13.69 10.0601"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <hr />
        <h3
          className="my-2 text-white bg-blue-600 p-1 rounded-lg"
          style={{ width: "250px" }}
        >
          {post.comments.length} comments on this post
        </h3>
        {post.comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onAddReply={handleAddReply}
            loggedInUser={loggedInUser} // Pass loggedInUser
            postId={post._id} // Pass postId
            setPost={setPost} // Pass setPost
          />
        ))}
      </div>
    </div>
  );
};

export default PostDetails;
