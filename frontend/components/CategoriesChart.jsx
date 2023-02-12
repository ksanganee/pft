import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pie, getElementAtEvent } from "react-chartjs-2";
import CategoryBar from "./CategoryBar";
import LoadingIndicator from "./LoadingIndicator";
import TrashIcon from "../svgs/TrashIcon";

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
	const chartRef = useRef();
	const [categoryFilter, setCategoryFilter] = useState(null);

	ChartJS.register(ArcElement, Tooltip, Legend);

	const getTransactions = useCallback(async () => {
		const today = new Date();
		const res = await fetch("/api/get_split_transactions", {
			method: "POST",
			body: JSON.stringify({
				userId: userModel.id,
				activeAccounts: activeAccounts.map(
					(account) => account.account_id
				),
				startDate: new Date(new Date().setDate(today.getDate() - 30)),
				endDate: today,
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

		return Object.keys(groups);
	}, [activeAccounts, router, userModel.id]);

	let categories = useRef([]);

	useEffect(() => {
		setChartData(null);
		getTransactions().then((res) => {
			categories.current = res;
		});
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
						ref={chartRef}
						data={chartData}
						options={{
							plugins: {
								legend: {
									position: "bottom",
								},
							},
						}}
						onClick={(e) => {
							const point = getElementAtEvent(
								chartRef.current,
								e
							);
							if (!point.length) return;

							setCategoryFilter(
								categories.current[point[0].index]
							);
							// console.log(categories.current[point[0].index]);
						}}
					/>
				</div>
				<div className="flex-col space-y-2 text-sm max-h-[59vh] w-[60vh]">
					{categoryFilter && (
						<div
							className="text-red-600 bg-red-200 rounded w-[60vh] p-1"
							onClick={() => setCategoryFilter(null)}
						>
							{categoryFilter}
							<TrashIcon className="inline pb-1 pl-1 ml-1" />
						</div>
					)}
					<div
						className={`flex-col space-y-2 text-sm overflow-auto ${
							categoryFilter ? "max-h-[56vh]" : "max-h-[56vh]"
						} w-[60vh]`}
					>
						{outgoings.map((transaction, i) => (
							<CategoryBar
								key={i}
								transaction={transaction}
								account={accountsMap.get(
									transaction.account_id
								)}
								categoryFilter={categoryFilter}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	) : (
		<LoadingIndicator />
	);
}
