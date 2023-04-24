export default function AppLayout({ Nav, Main, Sidebar, title }) {
	return (
		<div className="flex justify-center">
			<div className="grid grid-cols-[minmax(auto,_16rem)_32rem_minmax(auto,_20rem)]">
				<header>
					<Nav />
				</header>
				<main className="flex flex-col w-full border-x-[1px] h-screen">
					{title ? (
						<>
							<h1 className="m-2 text-2xl">{title}</h1>
							<div className="border-b-2" />
						</>
					) : null}
					<Main />
				</main>
				<aside>
					<Sidebar />
				</aside>
			</div>
		</div>
	);
}
