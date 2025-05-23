import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';

export default function CommentsSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const currentUserId = localStorage.getItem("user_id");
  const currentUserName = localStorage.getItem("name");

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      console.log("Fetching comments for task ID:", taskId);
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/comments/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const rawData = res.data.data;
        const dataArray = Array.isArray(rawData) ? rawData : [rawData];
        setComments(dataArray);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

//    Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
  
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/comments`,
        {
          task_id: taskId,
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      const added = res.data.data;
      setComments((prev) => [...prev, added]);
      console.log('Comment added:', added);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };
  
    // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/comments/${commentId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };
  

  return (
    <div className="flex flex-col h-full">
      {/* Comments Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2  ">
        {loading ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 bg-button text-white flex items-center justify-center rounded-full text-sm font-bold">
                {comment.user?.name?.[0]?.toUpperCase() || currentUserName?.[0]?.toUpperCase()} 
              </div>

              {/* Comment Content */}
              <div className="flex-1 bg-box px-4 py-2 rounded-xl shadow-sm">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{comment.user?.name || `${localStorage.getItem("name")}`}</span>
                  <span>{new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString(
                    [], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}</span>
                </div>
                <p className="mt-1 text-sm text-baseText">{comment.content}</p>
              </div>

              {/* Delete Icon (placeholder) */}
              {comment.user_id == currentUserId && (
              <button
                className="text-gray-400 hover:text-red-500 mt-1"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <FiTrash2 size={16} />
              </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Comment Input */}
      <div className="mt-4 border-t pt-3 text-baseText">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Add a comment..."
        />
        <button
          onClick={handleAddComment}
          className="mt-2 bg-button text-white px-4 py-1.5 rounded-lg text-sm hover:bg-buttonHover"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}
