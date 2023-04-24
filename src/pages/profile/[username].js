import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import AppLayout from "@/components/AppLayout";
import Nav from "@/components/Nav";
import Post from "@/components/post";
import FollowButton from "@/components/followButton";
import PostCreate from "@/components/PostCreate";

export default function Profile() {
	return <AppLayout Nav={Nav} Main={Main} Sidebar={() => <></>} />;
}

function Main() {
	const router = useRouter();

	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const [profileError, setProfileError] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetchProfile();
	}, []);

	async function fetchProfile() {
		try {
			const res = await fetch(`http://localhost:5050${location.pathname}`, {
				credentials: "include"
			});
			switch (res.status) {
				case 404:
					throw { err: "The specified profile does not exist." };
				default:
					break;
			}

			const data = await res.json();
			data.posts.sort((a, b) => {
				const comparison = new Date(b.createdAt) - new Date(a.createdAt);
				return comparison;
			});
			setData(data);
		} catch (error) {
			console.error(error);
			error.err ??= "Something went wrong.";
			setProfileError(error.err);
		}
		setLoading(false);
	}

	return (
		<>
			<h1 className="m-2 text-2xl">{isLoading ? "..." : data?.username}</h1>
			<div className="flex justify-end m-2" style={{ display: data?.clientIsProfileOwner || profileError ? "none" : "flex" }}>
				<FollowButton clientIsFollowing={data?.clientIsFollowing || false} profileId={data?.id} />
			</div>
			<div className="border-b-2" />
			{profileError ? (
				<>
					<h2 className="my-8 text-xl text-center">{profileError}</h2>
					<button className="text-center text-blue-400" onClick={() => router.back()}>
						Go back
					</button>
				</>
			) : null}
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
