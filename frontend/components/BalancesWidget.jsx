import { useCallback, useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";

export default function BalancesWidget({
	router,
	userModel,
	activeAccounts,
	...props
}) {
	const [balances, setBalances] = useState([]);
	const [loading, setLoading] = useState(true);

	const getTransactions = useCallback(async () => {
		setBalances([]);
		const res = await fetch("/api/get_balances", {
			method: "POST",
			body: JSON.stringify({
				userId: userModel.id,
			}),
		});

		if (!res.ok) {
			router.push("/error");
			return;
		}

		const data = await res.json();

		for (let i = 0; i < data.balances.length; i++) {
			for (let j = 0; j < activeAccounts.length; j++) {
				if (
					data.balances[i].account_id == activeAccounts[j].account_id
				) {
					setBalances((newBalances) => [
						...newBalances,
						{
							balance: data.balances[i].balance,
							name: activeAccounts[j].name,
							institution: activeAccounts[j].institution,
						},
					]);
					break;
				}
			}
		}
		setLoading(false);
	}, [activeAccounts, router, userModel.id]);

	useEffect(() => {
		setLoading(true);
		getTransactions();
	}, [getTransactions]);

	return loading ? (
		<div className="h-[200px] w-[200px] flex justify-center items-center">
			<LoadingIndicator small={true} />
		</div>
	) : (
		<div className="flex-col space-y-2 overflow-auto">
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
