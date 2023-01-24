import VisitLink from "../components/VisitLink";
import VStack from "../layouts/VStack";

export default function IndexHandler() {
	return (
		<div className="flex justify-center items-center h-screen">
			<VStack>
				<VisitLink destination="/login" text="Login" />
			</VStack>
		</div>
	);
}
