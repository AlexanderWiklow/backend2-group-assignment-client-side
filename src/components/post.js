import { useState } from "react";

import { useRouter } from "next/router";

export default function Post({ author, post }) {
	const router = useRouter();

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

	return (
		<div className="border-b-2">
			<div className="flex items-center">
				<a href={`/profile/${author}` === router.asPath ? null : `/profile/${author}`} className="text-blue-500 underline">
					{author || ""}
				</a>
				<span className="ml-2 text-xs opacity-70">{new Date(post?.createdAt).toUTCString()}</span>
			</div>
			<p>{post?.content || ""}</p>
			<button onClick={handleToggleLike} disabled={isLikePending}>
				<span style={{ filter: hasLiked ? "grayscale(0%)" : "grayscale(100%)" }}>👍</span> {likes} {likes === 1 ? "like" : "likes"}
			</button>
		</div>
	);
}
