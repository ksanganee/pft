import VisitLink from "../components/VisitLink";
import SingleCentered from "../layouts/Centred";
import VStack from "../layouts/VStack";

export default function index() {
	return (
		<SingleCentered>
			<VStack>
				<VisitLink destination="/login" text="Login"/>
			</VStack>
		</SingleCentered>
	);
}
