import React, { useState, useEffect } from "react";

import Post from "@/components/post";

export default function Profile() {
	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		fetch(`http://localhost:5050${location.pathname}`, {
			credentials: "include"
		})
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			});
	}, []);

	return (
		<>
			<div className="flex flex-col items-center h-screen">
				<main className="flex-grow w-full max-w-lg">
					<h1 className="my-8 text-4xl text-center">{isLoading ? "..." : data?.username}</h1>
					<div className="border-b-2" />
					{data?.posts ? data.posts.map((post, i) => <Post author={data.username} post={post} key={i} />) : null}
				</main>
			</div>
		</>
	);
}
