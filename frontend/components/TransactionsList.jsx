import { useCallback, useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import TransactionBar from "./TransactionBar";

export default function TransactionsList({
	router,
	userModel,
	activeAccounts,
	...props
}) {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	const getTransactions = useCallback(async () => {
		const res = await fetch("/api/get_date_grouped_transactions", {
			method: "POST",
			body: JSON.stringify({
				userId: userModel.id,
				activeAccounts: activeAccounts.map(
					(account) => account.account_id
				),
			}),
		});

		if (!res.ok) {
			router.push("/error");
		}

		const data = await res.json();
		setTransactions(data.transactions, setLoading(false));
	}, [activeAccounts, router, userModel.id]);

	useEffect(() => {
		setLoading(true);
		getTransactions();
	}, [getTransactions]);

	const accountsMap = new Map(
		activeAccounts.map((account) => [account.account_id, account])
	);

	return loading ? (
		<LoadingIndicator />
	) : (
		<div
			id="transactionsContainer"
			className="flex-col space-y-4 text-sm w-[80%] bottom-blur overflow-auto no-scrollbar"
			onScroll={(e) => {
				if (
					e.target.scrollTop + e.target.clientHeight >=
					e.target.scrollHeight
				) {
					document
						.getElementById("transactionsContainer")
						.classList.remove("bottom-blur");
				} else {
					document
						.getElementById("transactionsContainer")
						.classList.add("bottom-blur");
				}
			}}
		>
			{Object.keys(transactions)
				.sort()
				.reverse()
				.map((date, i) => {
					const uglyDate = new Date(date);
					const niceDate = `${uglyDate.getDate()}/${
						uglyDate.getMonth() + 1
					}/${uglyDate.getFullYear()}`;
					return (
						<div key={i}>
							<div className="text-gray-800 text-left p-1">
								{niceDate}
							</div>
							<div className="flex-col space-y-1">
								{transactions[date].map((transaction, j) => {
									return (
										<TransactionBar
											key={j}
											transaction={transaction}
											account={accountsMap.get(
												transaction.account_id
											)}
										/>
									);
								})}
							</div>
						</div>
					);
				})}
		</div>
	);
}
