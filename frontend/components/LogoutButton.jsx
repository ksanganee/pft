import PocketBase from "pocketbase";
import { useRouter } from "next/router";

export default function LogoutButton() {
	const pb = new PocketBase("http://127.0.0.1:8090");

	let router = useRouter();

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
				// className="flex p-2 rounded hover:bg-[#fb923c]/80 h-[36px] items-center h-screen bg-[#fb923c] text-white"
				className="flex p-2 rounded hover:bg-gray-100 h-[36px] items-center h-screen"
				onClick={handleSignout}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 26"
					className="w-[36px] h-[20px] mr-1 ml-1 pr-[1px]"
					fill="#FB923C"
					// make the stroke extra rounded
					stroke-linecap="round"
					// fill="#FFFFFF"
				>
					<path d="M15,24H0V2h15v8h-2V4H2v18h11v-6h2V24z M18.4,18.7L17,17.3l3.3-3.3H5v-2h15.3L17,8.7l1.4-1.4L24,13L18.4,18.7z"></path>{" "}
				</svg>
				{/* <svg
					viewBox="-2 -2 24.00 24.00"
					xmlns="http://www.w3.org/2000/svg"
					className="w-[36px] h-[20px] mr-2"
					fill="#FB923C"
				>
					<path
						d="M9 9V1C9 0.44772 9.4477 0 10 0C10.5523 0 11 0.44772 11 1V9H19C19.5523 9 20 9.4477 20 10C20 10.5523 19.5523 11 19 11H11V19C11 19.5523 10.5523 20 10 20C9.4477 20 9 19.5523 9 19V11H1C0.44772 11 0 10.5523 0 10C0 9.4477 0.44772 9 1 9H9z"
					></path>
				</svg> */}
				<p className="ml-[5px] mr-8">Logout</p>
			</div>
		</li>
		// <button
		// 	className="rounded bg-[#fb923c] pt-1 pb-1 pl-2 pr-2 right-1 text-white"
		// 	onClick={handleSignout}
		// >
		// 	Logout
		// </button>
	);
}
