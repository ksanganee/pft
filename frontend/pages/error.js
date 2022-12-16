import Link from "next/link";

export default function Error() {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex-col text-center space-y-2">
				<p className="text-red-500 bg-red-200 p-2 rounded-lg mb-4 text-center">
					There has been an error
				</p>
				<Link
					className="rounded-lg bg-[#fb923c] p-1.5 right-1 text-white"
					href="/dashboard"
				>
					Dashboard
				</Link>
			</div>
		</div>
	);
}
