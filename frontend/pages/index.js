import { useRouter } from "next/router";

export default function Index() {
	let router = useRouter();

	return (
		<div className="flex items-center justify-center h-screen">
			<button
				className="rounded-lg bg-[#fb923c] p-1.5 right-1 text-white"
				onClick={() => router.push("/signup")}
			>
				Sign up
			</button>
		</div>
	);
}
