import { useEffect, useState } from "react";

import { useRouter } from "next/router";

export default function FollowButton({ clientIsFollowing, profileId }) {
	const router = useRouter();

	//
	// Follow
	//
	const [isFollowing, setIsFollowing] = useState(false);
	useEffect(() => setIsFollowing(clientIsFollowing), [clientIsFollowing]);
	const [isFollowPending, setIsFollowPending] = useState(false);

	function handleFollow() {
		follow();
	}
	async function follow() {
		setIsFollowPending(true);
		try {
			const res = await fetch("http://localhost:5050/follow", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ targetUserID: profileId || "" }),
				credentials: "include"
			});
			if (res.status === 401) return router.replace();
			if (res.status === 404) return router.reload();
		} catch (error) {
			return;
		}
		setIsFollowing(!isFollowing);
		setIsFollowPending(false);
	}

	return (
		<button onClick={handleFollow} type="button" className="px-4 py-2 text-white bg-blue-400 rounded-full" disabled={isFollowPending}>
			{isFollowing ? "Unfollow" : "Follow"}
		</button>
	);
}
