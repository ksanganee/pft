import { useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function Dashboard(props) {
	const [token, setToken] = useState("");

	const createLinkToken = async () => {
		await fetch("/api/create_link_token", {
			method: "POST",
			body: JSON.stringify({
				userId: props.userModel.id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setToken(data.link_token);
			});
	};

	const linkSuccessCallback = useCallback(
		async (publicToken, _) => {
			await fetch("/api/send_public_token", {
				method: "POST",
				body: JSON.stringify({
					publicToken,
					userId: props.userModel.id,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
				})
				.catch((err) => console.log(err));
		},
		[props.userModel]
	);

	const linkErrorCallback = useCallback((_) => {
		router.push("/error");
	}, []);

	const { open, ready } = usePlaidLink({
		token: token,
		onSuccess: linkSuccessCallback,
		onExit: linkErrorCallback,
	});

	return (
		<>
			<button
				className="rounded bg-[#fb923c] p-2 right-1 text-white mb-1"
				onClick={createLinkToken}
			>
				Start Process
			</button>

			{token && (
				<>
					<p className="mb-1 mt-1">{token}</p>
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
		</>
	);
}
