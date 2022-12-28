import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import PlaidLinkButtons from "../components/PlaidLinkButtons";
import TransactionsList from "../components/TransactionsList";
import Centered from "../layouts/Centred";
import VStack from "../layouts/VStack";

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
				<PlaidLinkButtons userModel={userModel} />
				<TransactionsList userModel={userModel} />
				<LogoutButton />
			</VStack>
		</Centered>
	);
}
