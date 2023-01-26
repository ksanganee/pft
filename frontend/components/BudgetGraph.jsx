import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { useCallback, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import LoadingIndicator from "./LoadingIndicator";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
		title: {
			display: true,
			text: "Chart.js Line Chart",
		},
	},
	scales: {
		y: {
			beginAtZero: true,
		},
	},
};

export default function BudgetGraph(props) {
	const [chartData, setChartData] = useState(null);
	// const [cumulativeData, setCumulativeData] = useState(null);
	// const [monthlyBudget, setMonthlyBudget] = useState(null);

	// const currentDate = new Date();
	// const daysInMonth = new Date(
	// 	currentDate.getFullYear(),
	// 	currentDate.getMonth() + 1,
	// 	0
	// ).getDate();

	// const getTransactions = useCallback(async () => {
	// 	const response = await fetch("/api/get_past_month_transactions", {
	// 		method: "POST",
	// 		body: JSON.stringify({
	// 			userId: props.userModel.id,
	// 			activeAccounts: props.activeAccounts.map(
	// 				(account) => account.account_id
	// 			),
	// 		}),
	// 	});
	// 	const data = await response.json();

	// 	const cumulativeData = [0];
	// 	for (var i = 1; i <= currentDate.getDate(); i++) {
	// 		cumulativeData.push(
	// 			cumulativeData[i - 1] +
	// 				data.outgoings
	// 					.filter((transaction) => {
	// 						const transactionDate = new Date(transaction.date);
	// 						return (
	// 							transactionDate.getDate() === i &&
	// 							transactionDate.getMonth() ===
	// 								currentDate.getMonth()
	// 						);
	// 					})
	// 					.reduce(
	// 						(acc, transaction) => acc + transaction.amount,
	// 						0
	// 					)
	// 		);
	// 	}

	// 	cumulativeData.shift();
	// 	const increment =
	// 		cumulativeData[cumulativeData.length - 1] / currentDate.getDate();
	// 	for (var i = currentDate.getDate() + 1; i <= daysInMonth; i++) {
	// 		cumulativeData.push(
	// 			Math.round((cumulativeData[i - 2] + increment) * 100) / 100
	// 		);
	// 	}

	// 	setCumulativeData(cumulativeData);
	// }, [currentDate, daysInMonth, props.activeAccounts, props.userModel.id]);

	// useEffect(() => {
	// 	setChartData(null);
	// 	getTransactions();
	// }, [getTransactions]);

	// useEffect(() => {
	// 	setChartData({
	// 		labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
	// 		datasets: [
	// 			{
	// 				label: "Expenditure",
	// 				data: cumulativeData,
	// 				borderColor: "#fb923c",
	// 				backgroundColor: "#fb923c",
	// 			},
	// 			{
	// 				label: "Monthly Budget",
	// 				data: monthlyBudget,
	// 				borderColor: "#000000",
	// 				backgroundColor: "#000000",
	// 			},
	// 		],
	// 	});
	// }, [cumulativeData, daysInMonth, monthlyBudget]);

	return chartData ? (
		<div className="w-[120vh] flex">
			<div className="w-1/4">test</div>
			<div className="w-3/4">
				{/* <Line options={options} data={chartData} /> */}
			</div>
		</div>
	) : (
		<LoadingIndicator />
	);
}
