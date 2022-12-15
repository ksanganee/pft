import PocketBase from "pocketbase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SignoutButton from "../components/SignoutButton";

export default function Dashboard() {
	let router = useRouter();

	const client = new PocketBase("http://127.0.0.1:8090");

	const [userModel, setUserModel] = useState(null);

	useEffect(() => {
		if (client.authStore.model == null) {
			router.push({
				pathname: "/login",
				query: { name: "You must login first" },
			});
		} else {
			setUserModel(client.authStore.model);
		}
	}, []);

	return (
		<div className="flex items-center justify-center h-screen">
			{userModel && <p>Signed in as {userModel.email}</p>}
			<SignoutButton />
		</div>
	);
}
