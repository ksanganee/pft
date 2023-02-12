import PocketBase from "pocketbase";

export default function LogoutButton({ router, ...props }) {
	const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

	const handleSignout = async (e) => {
		e.preventDefault();
		pb.authStore.clear();
		router.push({
			pathname: "/login",
			query: { name: "You have signed out" },
		});
	};

	return (
		<li>
			<div
				className="flex p-2 rounded hover:bg-gray-100 h-[36px] items-center"
				onClick={handleSignout}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 26"
					className="w-[36px] h-[20px] mr-1 ml-1 pr-[1px]"
					fill="#FB923C"
					strokeLinecap="round"
				>
					<path d="M15,24H0V2h15v8h-2V4H2v18h11v-6h2V24z M18.4,18.7L17,17.3l3.3-3.3H5v-2h15.3L17,8.7l1.4-1.4L24,13L18.4,18.7z" />
				</svg>
				<p className="ml-[5px] mr-8">Logout</p>
			</div>
		</li>
	);
}
