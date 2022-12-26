import Link from "next/link";

export default function VisitLink(props) {
	return (
		<Link
			className="rounded bg-[#fb923c] p-2 right-1 text-white"
			href={props.destination}
		>
			{props.text}
		</Link>
	);
}
