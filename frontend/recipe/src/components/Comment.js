import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import defaultimg from "./defaultimg.jpg";



const Comment = ({ comment, onAddReply, onDeleteReply, loggedInUser, postId, setPost }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleAddReply = () => {
    if (replyText.trim() !== '') {
      onAddReply(comment._id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`https://recipe-backend-1e02.onrender.com/api/comment/${postId}/${commentId}`, {
        data: { userId: loggedInUser._id },
      });
      console.log('User ID:', loggedInUser._id);

      // Update the post by filtering out the deleted comment
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.filter((c) => c._id !== commentId),
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await axios.delete(`https://recipe-backend-1e02.onrender.com/api/comment/${postId}/${comment._id}/${replyId}`, {
        data: { userId: loggedInUser._id },
      });
      
      // Update the comment by filtering out the deleted reply
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.map((c) => {
          if (c._id === comment._id) {
            return {
              ...c,
              replies: c.replies.filter((r) => r._id !== replyId),
            };
          }
          return c;
        }),
      }));
      console.log("Reply deleted successfully")
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  return (
    <div
      className={`p-4 border mb-4 rounded ${
        loggedInUser && comment.user === loggedInUser._id
          ? 'bg-blue-100'
          : 'bg-gray-100'
      }`}
      style={{ overflowX: 'auto', maxHeight: '200px', width:'350px' }}
    >
      <div className="comment-text mb-3 flex" style={{ wordWrap: 'break-word',flexDirection:"column" }}>
      <div className='flex items-center my-2'>
      <img
            src={`https://recipe-backend-1e02.onrender.com/api/getProfileImage/${comment.user}`}
            alt=""
            className="max-w-full max-h-full object-cover mr-2"
            style={{ height: "30px", width: "30px", borderRadius: "50%" }}
            onError={(e) => {
              e.target.src = defaultimg; // Replace with the URL of your default image
            }}
          /><strong className='mb-2'>{comment.name}</strong> 
      </div>
         {comment.text}
      </div>
      <button
        onClick={() => setShowReplyInput(!showReplyInput)}
        className="reply-button-small text-blue-900 font-bold"
      >
        Reply
      </button>
      {loggedInUser && comment.user === loggedInUser._id && (
        <button onClick={() => handleDelete(comment._id)} className="delete-button text-white ml-8 bg-red-700 rounded-lg p-1">
          Delete <i className='fa fa-trash'></i>
        </button>
      )}
      {showReplyInput && (
        <div className="reply-input">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply to this comment"
            className="border rounded-xl p-2 flex-grow m-3"
            style={{ wordWrap: 'break-word' }}
          />
          <button onClick={handleAddReply} className="reply-button stroke-slate-300 bg-slate-700 focus:stroke-blue-200 focus:bg-blue-600 border border-slate-600 hover:border-slate-300 rounded-lg p-2 duration-300">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
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
      )}
      {comment.replies && comment.replies.length > 0 && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="toggle-replies-button ml-5 text-blue-700"
        >
          {showReplies ? 'Hide Replies' : 'Show Replies'}
        </button>
      )}
      {showReplies && comment.replies.length > 0 && (
        <div className="replies" style={{ marginLeft: '20px', overflow: 'scroll', display: 'flex', flexDirection: 'column' }}>
          {comment.replies.map((reply) => (
            <div key={reply._id} className="reply rounded">
              <div className="reply-text rounded" style={{ wordWrap: 'break-word' }}>
                <strong>{reply.name}:</strong> {reply.text}
              </div>
              {loggedInUser && loggedInUser._id === reply.user && (
                <button
                  onClick={() => handleDeleteReply(reply._id)}
                  className="delete-button text-red-700 mt-2"
                  style={{color:"snow",backgroundColor:"red", paddingLeft:"2px", paddingRight:"2px", borderRadius:"5px", textDecoration:"none"}}
                >
                   Delete <i className='fa fa-trash'></i>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
