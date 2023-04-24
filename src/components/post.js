import { useEffect, useState, useRef, createContext, useContext } from "react";

import { useRouter } from "next/router";

import Comment from "@/components/comment";
import AddComment from "@/components/AddComment";

const EditingContext = createContext(null);

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
	const [currentContent, setCurrentContent] = useState(post?.content || "");
	const [editingMode, setEditingMode] = useState(false);
	const [editedContent, setEditedContent] = useState(currentContent);
	const [isEditPending, setIsEditPending] = useState(false);

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

	const [comments, setComments] = useState(post?.comments || []);

	const updateCommentsList = (newComment) => {
		console.log("new comment", newComment);
		setComments([...comments, newComment]);
	};

	return (
		<div className="px-2 border-b-2">
			<div className="grid grid-cols-2">
				<div className="flex items-center">
					<a href={`/profile/${author}` === router.asPath ? null : `/profile/${author}`} className="text-blue-500 underline">
						{author || ""}
					</a>
					<span className="ml-2 text-xs opacity-70">{new Date(post?.createdAt).toUTCString()}</span>
				</div>
				<div className="justify-end gap-2" style={{ display: post?.clientIsAuthor ? "flex" : "none" }}>
					<button onClick={() => setEditingMode(true)} style={{ display: editingMode ? "none" : "unset" }} className="grayscale" disabled={isEditPending}>
						✏
					</button>
					<button onClick={handleDeletePost} className="grayscale" disabled={isDeletePending}>
						🗑
					</button>
				</div>
			</div>
			<div>
				<EditingContext.Provider value={{ editingMode, setEditingMode, editedContent, setEditedContent, isEditPending, setIsEditPending, currentContent, setCurrentContent, postId: post._id }}>
					<p style={{ display: editingMode ? "none" : "unset" }}>{currentContent}</p>
					<PostEditor />
				</EditingContext.Provider>
			</div>
			<div>
				<button onClick={handleToggleLike} disabled={isLikePending}>
					<span style={{ filter: hasLiked ? "grayscale(0%)" : "grayscale(100%)" }}>👍</span> {likes} {likes === 1 ? "like" : "likes"}
				</button>
				<details>
					<summary>comments</summary>
					<div className="w-full">
						<AddComment postId={post?._id} onCommentAdded={updateCommentsList} />
						{comments?.map((commentObj, i) => <Comment key={i} sender={commentObj.sender} comment={commentObj.comment} />) || null}
					</div>
				</details>
			</div>
		</div>
	);
}

function PostEditor() {
	const router = useRouter();

	const { editingMode, setEditingMode, isEditPending, setIsEditPending, editedContent, setEditedContent, currentContent, setCurrentContent, postId } = useContext(EditingContext);
	const editorInput = useRef();
	const [editError, setEditError] = useState("");

	function handleEditPost(e) {
		e.preventDefault();
		editPost();
	}
	async function editPost() {
		setIsEditPending(true);
		try {
			if (editedContent === currentContent) throw { err: "The posts content was the same." };
			const res = await fetch(`http://localhost:5050/post/${postId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ content: editedContent }),
				credentials: "include"
			});
			switch (res.status) {
				case 400:
					throw { err: "The post must contain at least 1 character!" };
				case 401:
					return router.push("/");
				case 404:
					throw { err: "Post not found." };
				default:
					break;
			}
		} catch (error) {
			console.error("Error updating post: ", error);
			error.err ??= "Something went wrong, please try again later...";
			setEditError(error.err);
			setIsEditPending(false);
			return;
		}
		setEditError("");
		setCurrentContent(editedContent);
		setEditingMode(false);
		setIsEditPending(false);
	}

	function handleEditCancel() {
		setEditError("");
		setEditedContent(currentContent);
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

	return (
		<>
			<form onSubmit={handleEditPost} style={{ display: editingMode ? "unset" : "none" }} className="relative flex flex-col">
				<div className="absolute flex items-center justify-center w-full h-full pointer-events-none">{isEditPending ? <span className="text-2xl animate-spin">🌞</span> : null}</div>
				<textarea ref={editorInput} className="w-full" onInput={(e) => setEditedContent(e.target.value)} value={editedContent} disabled={isEditPending} />
				<div className="flex items-center">
					<p className="text-sm">
						{editError ? "⚠" : null} {editError}
					</p>
					<div className="flex justify-end flex-grow gap-2">
						<button type="submit">Save</button>
						<button onClick={(_) => handleEditCancel()} type="button">
							Cancel
						</button>
					</div>
				</div>
			</form>
		</>
	);
}
