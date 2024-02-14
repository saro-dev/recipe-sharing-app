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

  return (
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
              className="border p-4 rounded-lg shadow-md cursor-pointer"
            >
              <div className="flex justify-between">
                <Link to={`/post-details/${post._id}`}>
                  <h3 className="text-xl text-blue-800 font-bold ">
                    {post.title}
                  </h3>
                </Link>
                <FaEdit
                  size={20}
                  className="text-blue-500 cursor-pointer mr-2"
                  onClick={() => handleEditPost(post._id)}
                />
                <FaTrash
                  size={20}
                  className="text-red-500 cursor-pointer"
                  onClick={() => openDeleteModal(post._id)}
                />
              </div>
              <p>{post.tags}</p>
              <p>{post.likes.length} Likes</p>
              <p>{post.comments.length} Comments</p>
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
  );
};

export default MyPostsPage;
