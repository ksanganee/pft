import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import TabViewer from "../components/TabViewer";
import Centered from "../layouts/Centred";
import VStack from "../layouts/VStack";
import LoadingIndicator from "../components/LoadingIndicator";

export default function Dashboard() {
	let router = useRouter();

	const pb = new PocketBase("http://127.0.0.1:8090");

	const [userModel, setUserModel] = useState(null);

	useEffect(() => {
		if (pb.authStore.model == null) {
			router.push({
				pathname: "/login",
				query: { name: "You must login first" },
			});
		} else {
			setUserModel(pb.authStore.model);
		}
	}, []);

	return (
		<>
			{userModel && (
				<Centered>
				{/* <div className="flex justify-center items-center h-screen"> */}
					<VStack>
						<TabViewer userModel={userModel} />
					</VStack>
				{/* </div> */}
				</Centered>
			)}
		</>
	);
}
