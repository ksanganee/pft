import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import TransactionBar from "./TransactionBar";
import LoadingIndicator from "./LoadingIndicator";

function makeColor(colorNum, colors) {
	if (colors < 1) colors = 1;
	return (colorNum * (360 / colors)) % 360;
}

const groupTransactionsByCategory = (array) => {
	return array.reduce((result, currentValue) => {
		if (!result[currentValue.category]) {
			result[currentValue.category] = 0;
		}
		result[currentValue.category] += currentValue.amount;
		return result;
	}, {});
};

export default function CategoriesChart(props) {
	const [incomings, setIncomings] = useState([]);
	const [outgoings, setOutgoings] = useState([]);
	const [chartData, setChartData] = useState(null);

	const getTransactions = async () => {
		await fetch("/api/get_past_month_transactions", {
			method: "POST",
			body: JSON.stringify({
				userId: props.userModel.id,
				activeAccounts: props.activeAccounts.map(
					(account) => account.account_id
				),
			}),
		})
			.then((res) => res.json())
			.then((obj) => {
				setIncomings(obj.incomings);
				setOutgoings(obj.outgoings);
				const groups = groupTransactionsByCategory(obj.outgoings);
				const labels = Object.keys(groups);
				let backgroundColor = [];
				for (let i = 0; i < labels.length; i++) {
					makeColor(i, labels.length);
					backgroundColor.push(
						`hsl(${makeColor(i, labels.length)}, 100%, 70%)`
					);
				}
				setChartData({
					labels,
					datasets: [
						{
							label: " Total spent (£)",
							data: Object.values(groups),
							backgroundColor: backgroundColor,
							borderWidth: 5,
							borderRadius: 15,
							hoverBorderWidth: 5,
							borderJoinStyle: "round",
						},
					],
				});
			});
	};

	useEffect(() => {
		setChartData(null);
		getTransactions();
	}, [props.activeAccounts]);

	const accountsMap = new Map(
		props.activeAccounts.map((account) => [account.account_id, account])
	);

	ChartJS.register(ArcElement, Tooltip, Legend);

	return chartData ? (
		<div className="flex-col w-full space-y-6">
			<div className="">Previous 30 days expenditure by category</div>
			<div className="flex w-full">
				<div className="">
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
				<div className="flex-col space-y-2 text-sm overflow-auto w-full">
					{outgoings.map((transaction, i) => (
						<TransactionBar
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
