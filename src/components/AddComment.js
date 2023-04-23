import React, { useState } from "react";

const AddComment = ({ postId, onCommentAdded }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment) return;

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5050/post/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          comment: comment
        })
      });
      console.log({ response });
      if (response.status === 201) {
        const { newComment } = await response.json();

        onCommentAdded({ sender: newComment.sender, comment: newComment.comment });
        setComment("");
      }
    } catch (error) {}
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          disabled={loading}
          className="border border-gray-300 rounded-md p-2 m-2"
        />
        <button type="submit" className="ml-auto bg-blue-400 text-white m-2 px-3 py-1 rounded-3xl">
          send
        </button>
      </div>
    </form>
  );
};

export default AddComment;
