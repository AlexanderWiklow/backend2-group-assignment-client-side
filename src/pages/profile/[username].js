import React, { useState, useEffect } from "react";

import AppLayout from "@/components/AppLayout";
import Nav from "@/components/Nav";
import Post from "@/components/post";
import FollowButton from "@/components/followButton";
import PostCreate from "@/components/PostCreate";

export default function Profile() {
	return <AppLayout Nav={Nav} Main={Main} Sidebar={() => <></>} />;
}

function Main() {
	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		fetchProfile();
	}, []);

	async function fetchProfile() {
		const res = await fetch(`http://localhost:5050${location.pathname}`, {
			credentials: "include"
		});
		const data = await res.json();
		data.posts.sort((a, b) => {
			const comparison = new Date(b.createdAt) - new Date(a.createdAt);
			return comparison;
		});
		setData(data);
		setLoading(false);
	}

	return (
		<>
			<h1 className="m-2 text-3xl">{isLoading ? "..." : data?.username}</h1>
			<div className="flex justify-end m-2" style={{ display: data?.clientIsProfileOwner ? "none" : "flex" }}>
				<FollowButton clientIsFollowing={data?.clientIsFollowing || false} profileId={data?.id} />
			</div>
			<div className="border-b-2" />
			<div style={{ display: data?.clientIsProfileOwner ? "block" : "none" }}>
				<div className="p-2">
					<PostCreate />
				</div>
				<div className="border-b-[1px]" />
			</div>
			<div className="flex flex-col flex-grow h-0 overflow-auto">{data?.posts ? data.posts.map((post, i) => <Post author={data.username} post={post} key={i} />) : null}</div>
		</>
	);
}
