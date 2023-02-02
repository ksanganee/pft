import { useCallback, useEffect, useState } from "react";
import TransactionBar from "./TransactionBar";
import LoadingIndicator from "./LoadingIndicator";
import useSWR from "swr";

const fetcher = async (url, body) => {
	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify(body),
	});
	return res.json();
};

export default function TransactionsList(props) {
	const { data, error, isLoading } = useSWR(
		"/api/get_date_grouped_transactions",
		(url) =>
			fetcher(url, {
				userId: props.userModel.id,
				activeAccounts: props.activeAccounts.map(
					(account) => account.account_id
				),
			})
	);

	const accountsMap = new Map(
		props.activeAccounts.map((account) => [account.account_id, account])
	);

	if (error) return props.router.push("/error");

	if (isLoading) return <LoadingIndicator />;

	return (
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
			{Object.keys(data.transactions)
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
								{data.transactions[date].map(
									(transaction, j) => {
										return (
											<TransactionBar
												key={j}
												transaction={transaction}
												account={accountsMap.get(
													transaction.account_id
												)}
											/>
										);
									}
								)}
							</div>
						</div>
					);
				})}
		</div>
	);
}
