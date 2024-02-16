import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "./ConfirmDeleteModal"; // Import the ConfirmDeleteModal component
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyPostsPage = ({ userId }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // New state for modal visibility
  const [postToDelete, setPostToDelete] = useState(null); // New state for post to delete
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(
          `https://recipe-backend-1e02.onrender.com/api/myposts/${userId}`
        );
        setMyPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching my posts:", error);
      }
    };

    fetchMyPosts();
  }, [userId]);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`https://recipe-backend-1e02.onrender.com/api/post/${postId}`);
      const updatedPosts = myPosts.filter((post) => post._id !== postId);
      setMyPosts(updatedPosts);
      toast.success("Post deleted successfully!", {
        position: "top-right",
        autoClose: 1000, // Close after 2 seconds
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };
  const openDeleteModal = (postId) => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous route
  };

  return (
    <>
    <div className="back-nav my-3 ml-3" onClick={handleGoBack} >
        &#x2190; Back
      </div>
    <div className="p-4">
      
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">My Posts</h2>
        <Link
          to="/post"
          className="flex items-center text-blue-500 hover:underline"
        >
          <FaPlus size={20} className="mr-1" /> Create Post
        </Link>
      </div>
      <hr className="mb-3"/>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      ) : myPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="space-y-4">
          {myPosts.map((post) => (
            <div
              key={post._id}
              className="border p-4 rounded-lg shadow-md"
              style={{maxWidth:"350px"}}
            >
              <div className="flex justify-between mb-2" >
                <Link to={`/post-details/${post._id}`}>
                <img
          src={`https://recipe-backend-1e02.onrender.com/api/getRecipeImage/${post._id}`}
          alt={post.title}
          className="max-w-full object-cover mb-2 rounded "
          style={{ maxWidth: "400px", width:"250px",height:"150px",objectFit:"cover" }}
        />
                  <h3 className="text-xl text-blue-800 font-bold ">
                    {post.title}
                  </h3>
                </Link>
                <div className="flex items-center  justify-between flex-col bg-blue-300 rounded-xl w-8" style={{height:"90px"}}>
                <FaEdit
                  size={20}
                  className="text-blue-900 cursor-pointer my-2"
                  onClick={() => handleEditPost(post._id)}
                />
                <FaTrash
                  size={20} 
                  className="text-red-500 cursor-pointer my-2"
                  onClick={() => openDeleteModal(post._id)}
                />
                </div>
              </div>
              <p> <i className="fa fa-heart text-red-700 mr-1"></i> {post.likes.length} Likes</p>
              <p><i className="fa fa-comment text-blue-700 mr-1"></i>{post.comments.length} Comments</p>
            </div>
          ))}
        </div>
      )}
      {/* Render the ConfirmDeleteModal when needed */}
      {deleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => {
            handleDeletePost(postToDelete);
            closeDeleteModal();
          }}
        />
      )}
    </div>
    </>
  );
};

export default MyPostsPage;
