import PocketBase from "pocketbase";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Centered from "../layouts/Centred";
import VStack from "../layouts/VStack";
import LogoutButton from "../components/LogoutButton";
import {
	usePlaidLink,
	PlaidLinkOnEvent,
	PlaidLinkOnExit,
	PlaidLinkOptions,
} from "react-plaid-link";

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
	}, []);

	const startProcess = async () => {
		createLinkToken(pb.authStore.model.id);
	};

	const onSuccess = useCallback(async (publicToken, metadata) => {
		await fetch("/api/send_public_token", {
			method: "POST",
			body: JSON.stringify({
				publicToken,
				userId: pb.authStore.model.id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});
		console.log(publicToken, metadata);
	}, []);

	const onExit = useCallback((error, metadata) => {
		router.push("/error");
	}, []);

	const { open, ready } = usePlaidLink({
		token,
		onSuccess,
		onExit,
	});

	return (
		<Centered>
			<VStack>
				{userModel && <p>Signed in as {userModel.email}</p>}

				<button
					className="rounded bg-[#fb923c] p-2 right-1 text-white mb-1 mt-1"
					onClick={startProcess}
				>
					Start Process
				</button>

				{token && (
					<>
						<p className="mb-2">{token}</p>
						{ready && (
							<button
								className="rounded bg-[#fb923c] p-2 right-1 text-white mb-1 mt-1"
								onClick={() => {
									open();
								}}
							>
								Open Link
							</button>
						)}
					</>
				)}
				<LogoutButton />
			</VStack>
		</Centered>
	);
}
