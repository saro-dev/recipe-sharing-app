import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

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
      await axios.delete(`http://localhost:5000/api/comment/${postId}/${commentId}`, {
        params: { userId: loggedInUser._id },
      });

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
      await axios.delete(`http://localhost:5000/api/comment/${postId}/${comment._id}/${replyId}`, {
        params: { userId: loggedInUser._id },
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
    >
      <div className="comment-text mb-3">
        <strong>{comment.name}:</strong> {comment.text}
      </div>
      {loggedInUser && comment.user === loggedInUser._id && (
        <button onClick={() => handleDelete(comment._id)} className="delete-button text-red-700 mr-5">
          <FaTrash />
        </button>
      )}
      <button
        onClick={() => setShowReplyInput(!showReplyInput)}
        className="reply-button-small text-blue-900 font-bold"
      >
        Reply
      </button>
      {comment.replies && comment.replies.length > 0 && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="toggle-replies-button ml-5 text-blue-700"
        >
          {showReplies ? 'Hide Replies' : 'Show Replies'}
        </button>
      )}
      {showReplies && comment.replies.length > 0 && (
        <div className="replies" style={{ marginLeft: '20px' }}>
          {comment.replies.map((reply) => (
            <div key={reply._id} className="reply rounded">
              <div className="reply-text rounded">
                <strong>{reply.name}:</strong> {reply.text}
              </div>
              {loggedInUser && loggedInUser._id === reply.user && (
                <button
                  onClick={() => handleDeleteReply(reply._id)}
                  className="delete-button text-red-700 mt-2"
                >
                  <FaTrash className='text-red-700'/>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {showReplyInput && (
        <div className="reply-input">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply to this comment"
          />
          <button onClick={handleAddReply} className="reply-button">
            Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
