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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import BalancesWidget from "./BalancesWidget";
import BudgetCalculator from "./BudgetCalculator";
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

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "bottom",
		},
	},
	scales: {
		y: {
			beginAtZero: true,
		},
	},
};

export default function BudgetsSection({
	router,
	userModel,
	activeAccounts,
	...props
}) {
	const [chartData, setChartData] = useState(null);
	const [cumulativeData, setCumulativeData] = useState(null);
	const [monthlyBudget, setMonthlyBudget] = useState(200);

	// const currentDate = useMemo(() => new Date("2023-01-27"), []);
	const currentDate = useMemo(() => new Date(), []);
	const daysInMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0
	).getDate();

	const updateChart = useCallback(
		(expenditureData, maxMonthlyBudget) => {
			setChartData({
				labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
				datasets: [
					{
						label: "Monthly Budget",
						data: Array.from(
							{ length: daysInMonth },
							() => maxMonthlyBudget
						),
						borderColor: "#FF6666",
						backgroundColor: "#FF6666",
						pointRadius: 0,
					},
					{
						label: "Expenditure",
						data: Array.from({ length: daysInMonth }, (_, i) =>
							i < currentDate.getDate()
								? expenditureData[i]
								: null
						),
						borderColor: "#fb923c",
						backgroundColor: "#fb923c",
						pointRadius: 0,
					},
					{
						label: "Predicted",
						data: Array.from({ length: daysInMonth }, (_, i) =>
							i < currentDate.getDate() - 1
								? null
								: expenditureData[i]
						),
						borderColor: "#fb923c",
						backgroundColor: "#fb923c",
						borderDash: [3, 3],
						pointRadius: 0,
					},
				],
			});
		},
		[currentDate, daysInMonth]
	);

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

		const cumulativeData = [0];
		for (var i = 1; i <= currentDate.getDate(); i++) {
			cumulativeData.push(
				cumulativeData[i - 1] +
					data.outgoings
						.filter((transaction) => {
							const transactionDate = new Date(transaction.date);
							return (
								transactionDate.getDate() === i &&
								transactionDate.getMonth() ===
									currentDate.getMonth()
							);
						})
						.reduce(
							(acc, transaction) =>
								Math.round((acc + transaction.amount) * 100) /
								100,
							0
						)
			);
		}

		cumulativeData.shift();
		const increment =
			cumulativeData[cumulativeData.length - 1] / currentDate.getDate();
		for (var i = currentDate.getDate() + 1; i <= daysInMonth; i++) {
			cumulativeData.push(
				Math.round((cumulativeData[i - 2] + increment) * 100) / 100
			);
		}

		setCumulativeData(cumulativeData);
		updateChart(cumulativeData, monthlyBudget);
		console.log(cumulativeData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentDate, daysInMonth, activeAccounts, userModel.id, updateChart]);

	useEffect(() => {
		setChartData(null);
		getTransactions();
	}, [getTransactions]);

	return chartData ? (
		<div id="">
			<div id="" className="w-[120vh] flex items-center h-[45vh]">
				<div className="w-1/4">
					<input
						type="number"
						id="monthly_budget_input"
						className="bg-gray-50 text-gray-500 rounded pl-[13px] text-center outline-none p-1 peer focus:ring-[#fb923c] focus:ring-2 focus:ring-opacity-50 focus:text-gray-700"
						value={monthlyBudget}
						onChange={(e) => {
							if (e.target.value < 0) {
								document.getElementById(
									"monthly_budget_input"
								).value = 0;
							} else {
								setMonthlyBudget(e.target.value);
								updateChart(cumulativeData, e.target.value);
							}
						}}
					/>
					<label
						htmlFor="monthly_budget_input"
						className="absolute text-sm text-gray-500 -translate-y-6 -translate-x-[150px] peer-focus:text-gray-700"
					>
						Monthly budget
					</label>
				</div>
				<div className="w-3/4">
					<Line options={options} data={chartData} />
				</div>
			</div>
			<div className="flex justify-center items-center space-x-10 h-[25vh]">
				<BalancesWidget
					userModel={userModel}
					activeAccounts={activeAccounts}
				/>
				<BudgetCalculator
					router={router}
					userModel={userModel}
					activeAccounts={activeAccounts}
				/>
			</div>
		</div>
	) : (
		<LoadingIndicator />
	);
}
