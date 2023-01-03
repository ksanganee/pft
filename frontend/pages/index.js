import VisitLink from "../components/VisitLink";
import Centered from "../layouts/Centred";
import VStack from "../layouts/VStack";

export default function IndexHandler() {
	return (
		<Centered>
			<VStack>
				<VisitLink destination="/login" text="Login" />
			</VStack>
		</Centered>
	);
}
