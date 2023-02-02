import Link from "next/link";

export default function VisitLink({ destination, text }) {
	return (
		<Link
			className="rounded bg-[#fb923c] p-2 right-1 text-white hover:bg-[#fb923c]/80 transition duration-100 ease-in-out focus:ring-4 focus:ring-[#fb923c] focus:ring-opacity-50"
			href={props.destination}
		>
			{props.text}
		</Link>
	);
}
