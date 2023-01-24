import VisitLink from "../components/VisitLink";
import VStack from "../layouts/VStack";

export default function ErrorHandler() {
	return (
		<div className="flex justify-center items-center h-screen">
			<VStack>
				<p className="text-red-500 bg-red-200 p-2 rounded mb-4 text-center">
					Something went wrong
				</p>
				<VisitLink destination="/dashboard" text="Dashboard" />
			</VStack>
		</div>
	);
}
