import VisitLink from "../components/VisitLink";
import Centred from "../layouts/Centred";
import VStack from "../layouts/VStack";

export default function error() {
	return (
		<Centred>
			<VStack>
				<p className="text-red-500 bg-red-200 p-2 rounded mb-4 text-center">
					Something went wrong
				</p>
				<VisitLink destination="/dashboard" text="Dashboard" />
			</VStack>
		</Centred>
	);
}
