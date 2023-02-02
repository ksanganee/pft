import VisitLink from "../components/VisitLink";

export default function ErrorHandler() {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="flex-col text-center space-y-2">
				<p className="text-red-500 bg-red-200 p-2 rounded mb-4 text-center">
					Something went wrong
				</p>
				<VisitLink destination="/dashboard" text="Dashboard" />
			</div>
		</div>
	);
}
