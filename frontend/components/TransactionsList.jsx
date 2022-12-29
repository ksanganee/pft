import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useState, useEffect } from "react";

export default function TransactionsList() {

	let router = useRouter();
	const pb = new PocketBase("http://127.0.0.1:8090");
	const [userModel, setUserModel] = useState(null);
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
	

	const [transactions, setTransactions] = useState([]);

	const getTransactions = async () => {
		await fetch("/api/get_transactions", {
			method: "POST",
			body: JSON.stringify({
				userId: userModel.id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setTransactions(data.transactions);
				console.log(data.transactions)
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
