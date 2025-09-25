/* eslint-disable react/prop-types */
import Comment from "./Comment";
import NewComment from "./NewComment";
import { useEffect, useState } from "react";


function Comments({ currentUser, listingId }, ) {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);

//  
useEffect(() => {
    // Fetch initial comments data from the API
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments/${listingId}`);
        const data = await res.json();
        if (data.success) {
          setBackendComments(data.comments || []);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);
  const createComment = async (text) => {
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, user: currentUser , listingId: listingId   }),
      });
      const data = await res.json();
      if (data.success) {
        return data.comment;
      } else {
        throw new Error('Failed to create comment');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

//   const addComment = (text) => {
//     createComment(text).then((comment) => {
//       setBackendComments([...backendComments, comment]);
//     });
//   };
const addComment = (text) => {
    createComment(text).then((comment) => {
      setBackendComments([...backendComments, comment]);
    }).catch(error => console.error('Error adding comment:', error));
  };

//  

const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/${commentId}/deletecomment`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment.id !== commentId
        );
        setBackendComments(updatedBackendComments);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
//   const updateComment = (text, commentId) => {
//     const updatedBackendComments = backendComments.map((backendComment) => {
//       if (backendComment.id === commentId) {
//         return {...backendComment, content: text}
//       }
//       return backendComment 
//     })
//     setBackendComments(updatedBackendComments)
//     setActiveComment(null)
//   }
const updateComment = async (text, commentId) => {
    try {
      const res = await fetch(`/api/comment/${commentId}/updatecomment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedBackendComments = backendComments.map((backendComment) => {
          if (backendComment.id === commentId) {
            return { ...backendComment, content: text };
          }
          return backendComment;
        });
        setBackendComments(updatedBackendComments);
        setActiveComment(null);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <main className="comment-section mx-auto max-w-3xl p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg h-[40vh] overflow-y-auto  ">
    {backendComments.map((comment) => (
      <Comment
        key={comment.id}
        currentUser={currentUser}
        replies={comment.replies || []}
        activeComment={activeComment}
        setActiveComment={setActiveComment}
        deleteComment={deleteComment}
        addComment={addComment}
        updateComment={updateComment}
        {...comment}
      />
    ))}
    <NewComment currentUser={currentUser} handleSubmit={addComment} initialText="" buttonText="Send" />
  </main>
  );
}

export default Comments;