import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/AppLayout";
import Nav from "@/components/Nav";
import Post from "@/components/post";
import PostCreate from "@/components/PostCreate";

export default function Feed() {
	return <AppLayout Nav={Nav} Main={Main} Sidebar={() => <></>} title={"Feed"} />;
}

function Main() {
	const router = useRouter();

	const [postsSortedByDate, setPostsSortedByDate] = useState(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		fetchFeed();
	}, []);

	async function fetchFeed() {
		const res = await fetch(`http://localhost:5050/feed`, {
			credentials: "include"
		});
		if (res.status === 401) return router.push("/");

		const usersWithPosts = await res.json();
		const posts = usersWithPosts
			.map((user) => {
				const usernameBakedIntoPosts = user.posts.map((post) => {
					post.author = user.username;
					return post;
				});
				return usernameBakedIntoPosts;
			})
			.flat()
			.sort((a, b) => {
				const comparison = new Date(b.createdAt) - new Date(a.createdAt);
				return comparison;
			});
		setPostsSortedByDate(posts);
		setLoading(false);
	}

	return (
		<>
			<div className="p-2">
				<PostCreate />
			</div>
			<div className="border-b-[1px]" />
			<div className="flex flex-col flex-grow h-0 overflow-auto">
				{!postsSortedByDate && isLoading ? <p className="mx-auto my-4 text-4xl w-min animate-spin">🌞</p> : null}
				{postsSortedByDate ? postsSortedByDate.map((post, i) => <Post author={post.author} post={post} key={i} />) : null}
				{!isLoading && !postsSortedByDate?.length ? (
					<div className="text-center">
						<p>No posts yet</p>
						<p>It could be that you do not follow anyone.</p>
						<p>Or the people you follow are just very boring and do not post anything!</p>
						<a className="text-blue-400" href="/home">
							Go to Homepage
						</a>
					</div>
				) : null}
			</div>
		</>
	);
}
