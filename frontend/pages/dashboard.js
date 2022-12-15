import PocketBase from "pocketbase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
	let router = useRouter();

	const client = new PocketBase("http://127.0.0.1:8090");

	const [userModel, setUserModel] = useState(null);
	const [token, setToken] = useState("");

	const getToken = async (model) => {
		await client.records
			.getList("secret", 1, 1, {
				filter: 'user = "' + model.id + '"',
			})
			.then((res) => {
				setToken(res.items[0].token);
			})
			.catch((_) => {
				console.log("Not linked account with plaid");
				router.push("/error");
			});
	};

	useEffect(() => {
		if (client.authStore.model == null) {
			router.push({
				pathname: "/login",
				query: { name: "You must login first" },
			});
		} else {
			setUserModel(client.authStore.model);
			getToken(client.authStore.model);
		}
	}, []);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex-col text-center space-y-2">
				{userModel && <p>Signed in as {userModel.email}</p>}
				<p>Token: {token}</p>
				<LogoutButton />
			</div>
		</div>
	);
}
