import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import TabViewer from "../components/TabViewer";

export default function Dashboard() {
	const router = useRouter();

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	return (
		userModel && (
			<div className="flex justify-center items-center h-screen">
				<div className="flex-col text-center">
					<TabViewer userModel={userModel} />
				</div>
			</div>
		)
	);
}
