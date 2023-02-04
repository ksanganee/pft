import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useCallback, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import CategoryBar from "./CategoryBar";
import LoadingIndicator from "./LoadingIndicator";

function makeColor(colorNum, colors) {
	if (colors < 1) colors = 1;
	return (colorNum * (360 / colors)) % 360;
}

function groupTransactionsByCategory(array) {
	return array.reduce((result, currentValue) => {
		if (!result[currentValue.category]) {
			result[currentValue.category] = 0;
		}
		result[currentValue.category] += currentValue.amount;
		return result;
	}, {});
}

export default function CategoriesChart({
	router,
	userModel,
	activeAccounts,
	...props
}) {
	const [outgoings, setOutgoings] = useState([]);
	const [chartData, setChartData] = useState(null);

	ChartJS.register(ArcElement, Tooltip, Legend);

	const getTransactions = useCallback(async () => {
		const res = await fetch("/api/get_past_split_transactions", {
			method: "POST",
			body: JSON.stringify({
				userId: userModel.id,
				activeAccounts: activeAccounts.map(
					(account) => account.account_id
				),
				startDate: new Date(
					new Date().setDate(new Date().getDate() - 30)
				)
					.toISOString()
					.slice(0, 10),
			}),
		});

		if (!res.ok) {
			router.push("/error");
			return;
		}

		const data = await res.json();

		setOutgoings(data.outgoings);

		const groups = groupTransactionsByCategory(data.outgoings);

		setChartData({
			labels: Object.keys(groups),
			datasets: [
				{
					label: " Total spent (£)",
					data: Object.values(groups),
					backgroundColor: Object.values(groups).map((_, i) => {
						return `hsl(${makeColor(
							i,
							Object.keys(groups).length
						)}, 100%, 70%)`;
					}),
					borderWidth: 5,
					borderRadius: 15,
					hoverBorderWidth: 5,
					borderJoinStyle: "round",
				},
			],
		});
	}, [activeAccounts, router, userModel.id]);

	useEffect(() => {
		setChartData(null);
		getTransactions();
	}, [getTransactions]);

	const accountsMap = new Map(
		activeAccounts.map((account) => [account.account_id, account])
	);

	return chartData ? (
		<div className="flex-col w-[120vh] space-y-6">
			<div className="text-base">
				Previous 30 days expenditure by category
			</div>
			<div className="flex w-[120vh] justify-center space-x-3">
				<div className="w-[60vh]">
					<Pie
						data={chartData}
						options={{
							plugins: {
								legend: {
									position: "bottom",
								},
							},
						}}
					/>
				</div>
				<div className="flex-col space-y-2 text-sm overflow-auto max-h-[60vh] w-[60vh]">
					{outgoings.map((transaction, i) => (
						<CategoryBar
							key={i}
							transaction={transaction}
							account={accountsMap.get(transaction.account_id)}
						/>
					))}
				</div>
			</div>
		</div>
	) : (
		<LoadingIndicator />
	);
}
