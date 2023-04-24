import { useEffect } from "react";

import { useRouter } from "next/router";

export default function MyProfile() {
	const router = useRouter();

	useEffect(() => {
		getRedirection();
	}, []);

	async function getRedirection() {
		const res = await fetch("http://localhost:5050/profile", {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});

		if (res.status === 401) return router.push("/");

		const data = await res.json();
		data.redirect ??= "/";
		return router.push(data.redirect);
	}

	return (
		<main className="flex items-center justify-center h-screen">
			<img src="loader.png" alt="loading icon" className="w-20 h-20 animate-spin" />
		</main>
	);
}
