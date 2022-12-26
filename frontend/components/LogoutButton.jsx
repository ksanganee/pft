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
		<button
			className="rounded bg-[#fb923c] pt-1 pb-1 pl-2 pr-2 right-1 text-white"
			onClick={handleSignout}
		>
			Logout
		</button>
	);
}
