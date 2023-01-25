import { useCallback, useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";

export default function BalancesWidget(props) {
	const [balances, setBalances] = useState([]);
	const [loading, setLoading] = useState(true);

	const getTransactions = useCallback(async () => {
		setBalances([]);
		await fetch("/api/get_balances", {
			method: "POST",
			body: JSON.stringify({
				userId: props.userModel.id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				for (let i = 0; i < data.balances.length; i++) {
					for (let j = 0; j < props.activeAccounts.length; j++) {
						if (
							data.balances[i].account_id ==
							props.activeAccounts[j].account_id
						) {
							setBalances((newBalances) => [
								...newBalances,
								{
									balance: data.balances[i].balance,
									name: props.activeAccounts[j].name,
									institution:
										props.activeAccounts[j].institution,
								},
							]);
							break;
						}
					}
				}
				setLoading(false);
			});
	}, [props.activeAccounts, props.userModel.id]);

	useEffect(() => {
		setLoading(true);
		getTransactions();
	}, [getTransactions]);

	return loading ? (
		<div className="h-[200px] w-[200px] flex justify-center items-center">
			<LoadingIndicator small={true} />
		</div>
	) : (
		<div className="flex-col space-y-2 text-sm overflow-auto mb-20">
			{balances.map((balance, i) => {
				return (
					<div key={i}>
						{balance.name} in {balance.institution}: £
						{balance.balance}
					</div>
				);
			})}
		</div>
	);
}
