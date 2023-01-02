import { useState, useEffect } from "react";
import TransactionBar from "./TransactionBar";

export default function TransactionsList(props) {
	const [transactions, setTransactions] = useState([]);

	const getTransactions = async () => {
		await fetch("/api/get_transactions", {
			method: "POST",
			body: JSON.stringify({
				userId: props.userModel.id,
				activeAccounts: props.activeAccounts.map(
					(account) => account.account_id
				),
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setTransactions(data.transactions);
			});
	};

	useEffect(() => {
		getTransactions();
	}, [props.activeAccounts]);

	const accountsMap = new Map(
		props.activeAccounts.map((account) => [account.account_id, account])
	);

	return (
		// <VStack>
		<div className="flex-col space-y-2 text-sm">
			{transactions.map((transaction, i) => (
				<TransactionBar
					key={i}
					transaction={transaction}
					account={accountsMap.get(transaction.account_id)}
				/>
			))}
		</div>
		// </VStack>
	);
}
