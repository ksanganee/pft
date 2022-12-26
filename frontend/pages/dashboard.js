import PocketBase from "pocketbase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Centered from "../layouts/Centred";
import VStack from "../layouts/VStack";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
	let router = useRouter();

	const pb = new PocketBase("http://127.0.0.1:8090");

	const [userModel, setUserModel] = useState(null);
	const [token, setToken] = useState(null);

	const createLinkToken = async (userId) => {
		await fetch("/api/create_link_token", {
			method: "POST",
			body: JSON.stringify({
				userId,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setToken(data.link_token);
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
		}
	}, [pb.authStore.model, router]);

	const startProcess = async () => {
		createLinkToken(pb.authStore.model.id);
	};

	return (
		<Centered>
			<VStack>
				{userModel && <p>Signed in as {userModel.email}</p>}

				<button
					className="rounded bg-[#fb923c] p-2 right-1 text-white mb-2 mt-1.5"
					onClick={startProcess}
				>
					Start Process
				</button>

				{token && <p className="mb-2">{token}</p>}

				<LogoutButton />
			</VStack>
		</Centered>
	);
}
