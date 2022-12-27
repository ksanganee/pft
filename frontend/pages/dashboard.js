import PocketBase from "pocketbase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Centered from "../layouts/Centred";
import VStack from "../layouts/VStack";
import LogoutButton from "../components/LogoutButton";
import PlaidLinkButtons from "../components/PlaidLinkButtons";

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
		<Centered>
			<VStack>
				{userModel && <p>Signed in as {userModel.email}</p>}
				<PlaidLinkButtons userModel={userModel}/>
				<LogoutButton />
			</VStack>
		</Centered>
	);
}
