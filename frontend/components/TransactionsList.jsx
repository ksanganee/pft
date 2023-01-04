import { useEffect, useState } from "react";
import TransactionBar from "./TransactionBar";
import LoadingIndicator from "./LoadingIndicator";

export default function TransactionsList(props) {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
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
					setLoading(false);
				});
		};
		setLoading(true);
		getTransactions();
	}, [props.activeAccounts, props.userModel.id]);

	const accountsMap = new Map(
		props.activeAccounts.map((account) => [account.account_id, account])
	);

	return loading ? (
		<LoadingIndicator />
	) : (
		<div className="flex-col space-y-2 text-sm w-[80%] overflow-auto">
			{transactions.map((transaction, i) => (
				<TransactionBar
					key={i}
					transaction={transaction}
					account={accountsMap.get(transaction.account_id)}
				/>
			))}
		</div>
	);
}