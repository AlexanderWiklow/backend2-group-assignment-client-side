import React, { useState } from "react";

const PostCreate = () => {
  const [content, setContent] = useState("");

  const apiUrl = "http://localhost:5050";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          content
        })
      });

      if (response.status === 201) {
        alert("Post created");
        setContent("");
      } else {
        console.error("Error creating post, status:", response.status);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="post-create">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <textarea
            aria-label="Create a new post"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            required
            className=" resize-none"
          ></textarea>

          <button type="submit" className="ml-auto bg-blue-400 text-white m-2 px-3 py-1 rounded-3xl">
            Tweet
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
