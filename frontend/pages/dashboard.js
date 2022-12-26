import PocketBase from "pocketbase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import Centered from "../layouts/Centred";
import VStack from "../layouts/VStack";

export default function dashboard() {
	let router = useRouter();

	const pb = new PocketBase("http://127.0.0.1:8090");

	const [userModel, setUserModel] = useState(null);
	const [token, setToken] = useState("");

	const handleLink = async (e) => {
		e.preventDefault();
		await pb.records.create("secret", {
			user: userModel.id,
			token: "test",
		});
		setToken("test");
	};

	const getToken = async (model) => {
		await pb.records
			.getList("secret", 1, 1, {
				filter: `user = "${model.id}"`,
			})
			.then((res) => {
				setToken(res.items[0].token);
			})
			.catch((_) => {
				console.log("Not linked account with plaid");
				// router.push("/error");
			});
	};

	useEffect(() => {
		if (pb.authStore.model == null) {
			router.push({
				pathname: "/login",
				query: { name: "You must login first" },
			});
		} else {
			setUserModel(pb.authStore.model);
			getToken(pb.authStore.model);
		}
	}, []);

	return (
		<Centered>
			<VStack>
				{userModel && <p>Signed in as {userModel.email}</p>}
				{token ? (
					<p>Token: {token}</p>
				) : (
					<button
						className="rounded bg-[#fb923c] p-1.5 right-1 text-white"
						onClick={handleLink}
					>
						Link account with Plaid
					</button>
				)}
				<LogoutButton />
			</VStack>
		</Centered>
	);
}
