import LoadingIndicator from "./LoadingIndicator";
import TrashIcon from "../svgs/TrashIcon";
import { useState, useCallback, useEffect } from "react";

export default function InvestmentTableRow(props) {
	const [loading, setLoading] = useState(true);

	const getInvestmentData = useCallback(async () => {
		const response = await fetch("/api/get_investment_price", {
			method: "POST",
			body: JSON.stringify({
				ticker: props.investment.ticker,
			}),
		});
		const data = await response.json();
		if (data.price == 0) {
			props.investment.currentPrice = 0;
			props.investment.profit = 0;
			setLoading(false);
			return;
		}
		props.investment.currentPrice = data.price;
		props.investment.profit =
			(data.price * props.investment.quantity - props.investment.cost) /
			(props.investment.cost / 100);
		setLoading(false);
	}, [props.investment]);

	useEffect(() => {
		setLoading(true);
		getInvestmentData();
	}, [getInvestmentData]);

	return (
		<div
			className={`${
				props.investment.profit
					? props.investment.profit >= 0
						? "bg-green-50 hover:bg-green-100"
						: "bg-red-50 hover:bg-red-100"
					: "bg-gray-50 hover:bg-gray-100"
			} flex curved-table-last-row`}
		>
			<div className="w-[130px] ml-5 py-4">{props.investment.name}</div>
			<div className="w-[130px] py-4">{props.investment.ticker}</div>
			<div className="w-[130px] py-4">{props.investment.quantity}</div>
			<div className="w-[130px] py-4">${props.investment.cost}</div>
			<div className="w-[130px] py-4">
				{loading ? (
					<div className="flex justify-center items-center">
						<LoadingIndicator small={true} />
					</div>
				) : (
					`$${(
						Math.round(props.investment.currentPrice * 100) / 100
					).toFixed(2)}`
				)}
			</div>
			<div className="w-[130px] py-4">
				{loading ? (
					<div className="flex justify-center items-center">
						<LoadingIndicator small={true} />
					</div>
				) : props.investment.profit >= 10 ? (
					`${props.investment.profit.toFixed(1)}%`
				) : (
					`${props.investment.profit.toPrecision(2)}%`
				)}
			</div>
			<div className="flex justify-center items-center w-[50px] text-gray-500">
				<TrashIcon
					className="cursor-pointer pb-[2px]"
					onClick={async () => {
						fetch("/api/remove_investment", {
							method: "POST",
							body: JSON.stringify({
								investmentId: props.investment.id,
							}),
						});
						props.setInvestments(
							props.investments.filter(
								(element) => element != props.investment
							)
						);
					}}
				/>
			</div>
		</div>
	);
}
