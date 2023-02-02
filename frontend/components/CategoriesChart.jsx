import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import CategoryBar from "./CategoryBar";
import LoadingIndicator from "./LoadingIndicator";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

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

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
	plugins: {
		legend: {
			position: "bottom",
		},
	},
};

export default function CategoriesChart(props) {
	const { data, error, isLoading } = useSWR(
		"/api/get_past_split_transactions",
		(url) =>
			fetcher(url, {
				userId: props.userModel.id,
				activeAccounts: props.activeAccounts.map(
					(account) => account.account_id
				),
				startDate: new Date(
					new Date().setDate(new Date().getDate() - 30)
				)
					.toISOString()
					.slice(0, 10),
			})
	);

	if (error) {
		props.router.push("/error");
		return null;
	}

	if (isLoading) return <LoadingIndicator />;

	const groups = groupTransactionsByCategory(data.outgoings);

	const chartData = {
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
	};

	const accountsMap = new Map(
		props.activeAccounts.map((account) => [account.account_id, account])
	);

	return (
		<div className="flex-col w-[120vh] space-y-6">
			<div className="text-base">
				Previous 30 days expenditure by category
			</div>
			<div className="flex w-[120vh] justify-center space-x-3">
				<div className="w-[60vh]">
					<Pie data={chartData} options={options} />
				</div>
				<div className="flex-col space-y-2 text-sm overflow-auto max-h-[60vh] w-[60vh]">
					{data.outgoings.map((transaction, i) => (
						<CategoryBar
							key={i}
							transaction={transaction}
							account={accountsMap.get(transaction.account_id)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
