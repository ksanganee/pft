import { useState, useCallback, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/router";

export default function PlaidLinkButtons(props) {
	let router = useRouter();

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

	useEffect(() => {
		createLinkToken();
	}, []);

	const linkSuccessCallback = useCallback(async (publicToken, _) => {
		await fetch("/api/send_public_token", {
			method: "POST",
			body: JSON.stringify({
				publicToken,
				userId: props.userModel.id,
			}),
		})
			.then((res) => res.json())
			.then((_) => {
				props.refresh();
			});
	}, []);

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
			{token && (
				<>
					{ready && (
							<li>
								<div
									className="flex p-2 rounded hover:bg-gray-100 h-[36px] items-center h-screen"
									onClick={() => open()}
								>
									<svg
										viewBox="-2 -2 24.00 24.00"
										id="meteor-icon-kit__regular-plus"
										xmlns="http://www.w3.org/2000/svg"
										className="w-[36px] h-[20px] mr-2"
									>
										<path
											d="M9 9V1C9 0.44772 9.4477 0 10 0C10.5523 0 11 0.44772 11 1V9H19C19.5523 9 20 9.4477 20 10C20 10.5523 19.5523 11 19 11H11V19C11 19.5523 10.5523 20 10 20C9.4477 20 9 19.5523 9 19V11H1C0.44772 11 0 10.5523 0 10C0 9.4477 0.44772 9 1 9H9z"
											fill="#FB923C"
										></path>
									</svg>
									<p className="ml-[5px] mr-8">Add Accounts</p>
								</div>
							</li>
					)}
				</>
			)}
		</>
	);
}
