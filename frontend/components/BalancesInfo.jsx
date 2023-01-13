import { useCallback, useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";

export default function BalancesInfo(props) {
	const [balances, setBalances] = useState([]);
	const [loading, setLoading] = useState(true);

	const getTransactions = useCallback(async () => {
		await fetch("/api/get_balances", {
			method: "POST",
			body: JSON.stringify({
				userId: props.userModel.id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setBalances(data.balances);
				console.log(data.balances);
				setLoading(false);
			});
	}, [props.userModel.id]);

	useEffect(() => {
		setLoading(true);
		getTransactions();
	}, [getTransactions]);

	return loading ? (
		<LoadingIndicator />
	) : (
		<div className="flex-col space-y-2 text-sm w-[80%] overflow-x-scroll overflow-y-scroll">
			{balances.map((balance, i) => {
				return (
					<div key={i}>
						{balance.name}
						{balance.balance}
					</div>
				);
			})}
		</div>
	);
}
