import { useState, useEffect } from "react";
import PlaidLinkButtons from "./PlaidLinkButtons";
import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default function AccountsDropdown(props) {
	const [accounts, setAccounts] = useState([]);
	const [dropped, setDropped] = useState(false);

	const getAccounts = async () => {
		await fetch("/api/get_accounts", {
			method: "POST",
			body: JSON.stringify({
				userId: props.userModel.id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setAccounts(data.accounts);
				props.setActiveAccounts(data.accounts);
			});
	};

	useEffect(() => {
		getAccounts();
	}, []);

	useEffect(() => {
		const checkboxes = document.querySelectorAll("input[type=checkbox]");
		checkboxes.forEach((checkbox) => {
			checkbox.checked = true;
		});
	}, [accounts]);

	return (
		<>
			<button
				id="dropdownBgHoverButton"
				className="rounded bg-[#fb923c] p-2 text-white hover:bg-[#fb923c]/80 mt-2"
				type="button"
				onClick={() => setDropped(!dropped)}
			>
				<div className="flex flex-row justify-between">
					Accounts
					<svg
						className={`w-4 h-4 mt-[5px] ml-1 ${
							dropped ? "" : "-rotate-90"
						} duration-75`}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
					</svg>
				</div>
			</button>

			<div
				className={`${
					dropped ? "" : "hidden"
				} z-10 bg-white rounded shadow absolute mt-2`}
			>
				<ul
					className="p-3 space-y-1 text-sm text-gray-700"
					aria-labelledby="dropdownBgHoverButton"
				>
					{accounts.map((account, i) => {
						return (
							<li key={i}>
								<div className="flex p-2 rounded hover:bg-gray-100">
									<label className="inline-flex relative items-center w-full cursor-pointer">
										<input
											type="checkbox"
											className="peer sr-only"
											onChange={(e) => {
												if (e.target.checked) {
													props.setActiveAccounts([
														...props.activeAccounts,
														account,
													]);
												} else {
													props.setActiveAccounts(
														props.activeAccounts.filter(
															(activeAccount) =>
																activeAccount.account_id !=
																account.account_id
														)
													);
												}
											}}
										/>
										<div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#fb923c]"></div>
										<span className="ml-3">
											{account.name} in{" "}
											{account.institution}
										</span>
									</label>
									<div className="ml-2">
										<Image
											src={`/${account.institution.toLowerCase()}.png`}
											width={20}
											height={20}
											alt={account.institution}
										/>
									</div>
								</div>
							</li>
						);
					})}
					<PlaidLinkButtons
						userModel={props.userModel}
						refresh={getAccounts}
					/>
					<LogoutButton />
				</ul>
			</div>
		</>
	);
}
