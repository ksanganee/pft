import Centred from "../layouts/Centred";
import VStack from "../layouts/VStack";
import { useState } from "react";

export default function TransactionsList(props) {
	const [transactions, setTransactions] = useState([]);

	const getTransactions = async () => {
		await fetch("/api/get_transactions", {
			method: "POST",
			body: JSON.stringify({
				userId: props.userModel.id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setTransactions(data.transactions);
			});
	};

	return (
		<>
			<button
				className="rounded bg-[#fb923c] p-2 right-1 text-white mb-1"
				onClick={getTransactions}
			>
				Get Transactions
			</button>
			{/* <Centred>
				<VStack>
					{transactions.map((transaction, i) => (
						<div key={i}>
							{transaction.amount} to {transaction.merchant_name}
						</div>
					))}
				</VStack>
			</Centred> */}
		</>
	);
}
