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

const defaultBudgetValue = 500;

export default function BudgetsSection({
	router,
	userModel,
	activeAccounts,
	...props
}) {
	const [chartData, setChartData] = useState(null);

	const getChartData = useCallback(
		async (mb) => {
			const currentDate = new Date();
			const daysInMonth = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() + 1,
				0
			).getDate();

			const res = await fetch("/api/get_prediction", {
				method: "POST",
				body: JSON.stringify({
					userId: userModel.id,
					monthlyBudget: mb,
					currentDateString: currentDate.toISOString(),
					daysInMonth: daysInMonth,
				}),
			});

			if (!res.ok) {
				console.error("Error fetching prediction data");
				router.push("/error");
			}

			const data = await res.json();

			setChartData({
				labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
				datasets: [
					{
						label: "Monthly Budget",
						data: Array.from({ length: daysInMonth }, () => mb),
						borderColor: "#FF6666",
						backgroundColor: "#FF6666",
						pointRadius: 0,
					},
					{
						label: "Expenditure",
						data: data.expenditure,
						borderColor: "#fb923c",
						backgroundColor: "#fb923c",
						pointRadius: 0,
					},
					{
						label: "Predicted",
						data: data.predicted,
						borderColor: "#fb923c",
						backgroundColor: "#fb923c",
						borderDash: [3, 3],
						// pointRadius: 0,
					},
				],
			});
		},
		[router, userModel.id]
	);

	useEffect(() => {
		getChartData(defaultBudgetValue);
	}, [getChartData]);

	return chartData ? (
		<div id="">
			<div id="" className="w-[120vh] flex items-center h-[45vh]">
				<div className="w-1/4">
					<input
						type="number"
						id="monthly_budget_input"
						className="bg-gray-50 text-gray-500 rounded pl-[13px] text-center outline-none p-1 peer focus:ring-[#fb923c] focus:ring-2 focus:ring-opacity-50 focus:text-gray-700"
						defaultValue={defaultBudgetValue}
						onBlur={(e) => {
							getChartData(e.target.value);
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
		</div>
	) : (
		<LoadingIndicator />
	);
}
