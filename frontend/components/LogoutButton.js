import PocketBase from "pocketbase";
import { useRouter } from "next/router";

export default function LogoutButton() {
	const client = new PocketBase("http://127.0.0.1:8090");

	let router = useRouter();

	const handleSignout = async (e) => {
		e.preventDefault();
		await client.authStore.clear();
		router.push({
			pathname: "/login",
			query: { name: "You have signed out" },
		});
	};

	return (
		<div>
			<button
				className="rounded-lg bg-[#fb923c] p-1.5 right-1 text-white"
				onClick={handleSignout}
			>
				Sign out
			</button>
		</div>
	);
}
