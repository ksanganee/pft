import VisitLink from "../components/VisitLink";
import Centred from "../layouts/Centred";
import VStack from "../layouts/VStack";

export default function IndexHandler() {
	return (
		<Centred>
			<VStack>
				<VisitLink destination="/login" text="Login" />
			</VStack>
		</Centred>
	);
}
