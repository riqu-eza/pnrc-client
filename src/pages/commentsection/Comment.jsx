/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

// import { nanoid } from "nanoid";
import { useState } from "react";
import NewComment from "./NewComment";
import Reply from "./Reply";

import {  FaEdit,  FaReply, FaTimes } from "react-icons/fa";
import { formatDate } from "../../utility/formatdate";



export default function Comment(props ) {
  // const [score, setScore] = useState(props.score);
  // const [disableUpvote, setDisableUpvote] = useState(false);
  // const [disableDownvote, setDisableDownvote] = useState(false);
  const isCurrentUser =  props.currentUser;
  const [backendReplies, setBackendReplies] = useState(props.replies || []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isReplying, setIsReplying] = useState(false); // Add this state
console.log(isCurrentUser)
  // let starterScore = props.score;

  const isEditing =
    props.activeComment &&
    props.activeComment.id === props.id &&
    props.activeComment.type === "editing";

//  
// const handleScoreChange = async (e) => {
//     let newScore = score;
//     if (e.target.classList.contains("minus-btn")) {
//       newScore -= 1;
//     } else if (e.target.classList.contains("plus-btn")) {
//       newScore += 1;
//     }

//     try {
//       const res = await fetch(`http://localhost:3000/api/comment/${props.id}/vote`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ score: newScore }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setScore(newScore);
//         setDisableDownvote(newScore - starterScore < 1);
//         setDisableUpvote(starterScore - newScore < 1);
//         starterScore = newScore;
//       }
//     } catch (error) {
//       console.error('Error updating score:', error);
//     }
//   };
//   
//   
const addReply = async (text) => {
    try {
      const res = await fetch(`/api/comment/${props.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.success) {
        setBackendReplies([data.reply, ...backendReplies]);
        props.setActiveComment(null);
      }
      // console.log('here', props.createdAt)
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };
//   



const deleteComment = async () => {
  try {
    const res = await fetch(`/api/comment/${props.id}/delete`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      // Handle successful comment deletion, e.g., notify parent component
      props.onDelete(props.id);
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};


  return (
    <div className="comment-container bg-white p-4 rounded-lg shadow-md mb-4">
    <div className="comment mb-4">
      <div className="comment-heading flex items-center mb-2">
        <img
          className="user-avatar w-10 h-10 rounded-full mr-4"
          src={props.user.avatar}
          alt="user avatar"
        />
        <p className="username font-bold text-gray-700">{props.user.username}</p>
        {isCurrentUser && <p className="tag text-sm bg-blue-500 text-white px-2 py-1 rounded ml-2">you</p>}
        <p className="date text-gray-500 text-sm ml-auto">{ formatDate (props.createdAt)}</p>
      </div>
      <div className="editing">
        {!isEditing && <p className="comment-content text-gray-800"> {props.content}</p>}
        {isEditing && (
          <NewComment
            currentUser={props.currentUser}
            placeholder="Edit your comment"
            initialText={props.content}
            isEdit
            buttonText="Update"
          />
        )}
      </div>
      {/* <div className="comment-votes flex items-center mt-4">
        <button
          className="plus-btn text-green-500"
          disabled={disableUpvote}
          onClick={() => handleScoreChange(1)}
        >
          <FaPlus />
        </button>
        <p className="comment-votes_total mx-2">{score}</p>
        <button
          className="minus-btn text-red-500"
          disabled={disableDownvote}
          onClick={() => handleScoreChange(-1)}
        >
          <FaMinus />
        </button>
      </div> */}
      <div className="comment-footer mt-4 flex">
        {isCurrentUser ? (
          <div className="toggled-btns flex space-x-2">
            <button
              className="delete-btn text-red-500 flex items-center"
              onClick={() => setShowDeleteModal(true)}
            >
              <FaTimes className="mr-1" />
              Delete
            </button>
            <button
              className="edit-btn text-blue-500 flex items-center"
              onClick={() => props.setActiveComment({ id: props.id, type: 'editing' })}
            >
              <FaEdit className="mr-1" />
              Edit
            </button>
          </div>
        ) : (
          <button
            className="reply-btn text-blue-500 flex items-center"
            onClick={() => setIsReplying(true)}
          >
            <FaReply className="mr-1" />
            Reply
          </button>
        )}
      </div>
    </div>
    {isReplying && (
      <div className="reply-container ml-10">
        <NewComment
          currentUser={props.currentUser}
          placeholder={`Replying to @${props.user.username}`}
          handleSubmit={(text) => addReply(`@${props.user.username}, ${text}`)}
          buttonText="Reply"
        />
      </div>
    )}
    {backendReplies.length > 0 && (
      <div className="replies-container ml-10 border-l-2 border-gray-200 pl-4">
        {backendReplies.map((reply) => (
          <div className="reply mb-4" key={reply.id}>
            <Reply
              currentUser={props.currentUser}
              activeComment={props.activeComment}
              setActiveComment={props.setActiveComment}
              addReply={addReply}
              deleteReply={props.deleteReply}
              updateReply={props.updateReply}
              {...reply}
            />
          </div>
        ))}
      </div>
    )}
    {showDeleteModal && (
      <div className="delete-modal-container fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="delete-modal bg-white p-6 rounded-lg shadow-lg">
          <h2 className="delete-modal_title text-xl font-bold mb-4">Delete comment</h2>
          <p className="delete-modal_content mb-4">
            Are you sure you want to delete this comment? This will remove the comment and can't be undone.
          </p>
          <div className="delete-modal_btns flex space-x-4">
            <button
              className="delete-modal_btn no bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setShowDeleteModal(false)}
            >
              No, cancel
            </button>
            <button
              className="delete-modal_btn yes bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={deleteComment}
            >
              Yes, delete
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}