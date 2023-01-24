import VisitLink from "../components/VisitLink";

export default function IndexHandler() {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="flex-col text-center space-y-2">
				<VisitLink destination="/login" text="Login" />
			</div>
		</div>
	);
}
