import { useEffect, useState, useRef } from "react";

import { useRouter } from "next/router";

export default function Post({ author, post }) {
  const router = useRouter();

  //
  //Liking
  //
  const [likes, setLikes] = useState(post?.likes.length || 0);
  const [hasLiked, setHasLiked] = useState(post?.clientHasLiked || false);
  const [isLikePending, setIsLikePending] = useState(false);

  function handleToggleLike() {
    toggleLike();
  }

  async function toggleLike() {
    setIsLikePending(true);
    const targetPost = post?._id || undefined;
    const targetUser = author || undefined;
    if (!targetPost || !targetUser) return console.error("Invalid toggleLike payload");
    try {
      const res = await fetch("http://localhost:5050/post/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ targetUser, targetPost }),
        credentials: "include"
      });

      if (res.status === 401) throw "Unauthorised";
      if (res.status === 404) throw "Not found";

      setLikes(hasLiked ? likes - 1 : likes + 1);
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error("Toggling like error:", error);
      if (error === "Unauthorised") location.replace("/");
      if (error === "Not found") return;
    }
    setIsLikePending(false);
  }

  //
  //Editing
  //
  const editorInput = useRef();
  const [editingMode, setEditingMode] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.content || "");
  const [isEditPending, setIsEditPending] = useState(false);

  function handleEditPost(e) {
    e.preventDefault();
    editPost();
  }
  async function editPost() {
    setIsEditPending(true);
    const targetPost = post?._id || undefined;
    if (!targetPost) return console.error("Invalid editPost payload");
    try {
      const res = await fetch(`http://localhost:5050/post/${targetPost}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: editedContent }),
        credentials: "include"
      });

      if (res.status === 401) throw "Unauthorised";
      if (res.status === 404) throw "Not found";

      setEditingMode(false);
      post.content = editedContent;
    } catch (error) {
      console.error("Editing post error:", error);
      if (error === "Unauthorised") location.replace("/");
      if (error === "Not found") return;
    }

    setIsEditPending(false);
  }

  function handleEditCancel() {
    setEditedContent(post?.content || "");
    setEditingMode(false);
  }

  //select the posts editor input when editing mode is active
  useEffect(() => {
    if (editingMode) {
      editorInput.current.focus();
      return;
    }
    editorInput.current.blur();
  }, [editingMode]);

  //
  //deleting
  //
  const [isDeletePending, setIsDeletePending] = useState(false);

  function handleDeletePost() {
    deletePost();
  }
  async function deletePost() {
    setIsDeletePending(true);
    //TODO: Fetch to delete the current post
    setIsDeletePending(false);
  }

  //
  //commenting
  //
  //TODO:

  return (
    <div className="px-2 border-b-2">
      <div className="grid grid-cols-2">
        <div className="flex items-center">
          <a
            href={`/profile/${author}` === router.asPath ? null : `/profile/${author}`}
            className="text-blue-500 underline"
          >
            {author || ""}
          </a>
          <span className="ml-2 text-xs opacity-70">{new Date(post?.createdAt).toUTCString()}</span>
        </div>
        <div className="justify-end gap-2" style={{ display: post?.clientIsAuthor ? "flex" : "none" }}>
          <button
            onClick={() => setEditingMode(true)}
            style={{ display: editingMode ? "none" : "unset" }}
            className="grayscale"
          >
            ✏
          </button>
          <button onClick={handleDeletePost} className="grayscale" disabled={isDeletePending}>
            🗑
          </button>
        </div>
      </div>
      <div>
        <p style={{ display: editingMode ? "none" : "unset" }}>{post?.content || ""}</p>
        <form onSubmit={handleEditPost} style={{ display: editingMode ? "unset" : "none" }} className="flex flex-col">
          <textarea
            ref={editorInput}
            className="w-full"
            onInput={(e) => setEditedContent(e.target.value)}
            value={editedContent}
          />
          <div className="flex justify-end gap-2">
            <button type="submit">Save</button>
            <button onClick={(_) => handleEditCancel()} type="button">
              Cancel
            </button>
          </div>
        </form>
      </div>
      <button onClick={handleToggleLike} disabled={isLikePending}>
        <span style={{ filter: hasLiked ? "grayscale(0%)" : "grayscale(100%)" }}>👍</span> {likes}{" "}
        {likes === 1 ? "like" : "likes"}
      </button>
    </div>
  );
}
