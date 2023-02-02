import LoadingIndicator from "./LoadingIndicator";
import TrashIcon from "../svgs/TrashIcon";
import { useState, useCallback, useEffect } from "react";

export default function InvestmentTableRow({
	router,
	investment,
	investments,
	setInvestments,
	...props
}) {
	const [loading, setLoading] = useState(true);

	const getInvestmentData = useCallback(async () => {
		const res = await fetch("/api/get_investment_price", {
			method: "POST",
			body: JSON.stringify({
				ticker: investment.ticker,
			}),
		});

		if (!res.ok) {
			router.push("/error");
			return;
		}

		const data = await res.json();

		if (data.price == 0) {
			investment.currentPrice = 0;
			investment.profit = 0;
		} else {
			investment.currentPrice = data.price;
			investment.profit =
				(data.price * investment.quantity - investment.cost) /
				(investment.cost / 100);
		}

		setLoading(false);
	}, [investment, router]);

	useEffect(() => {
		setLoading(true);
		getInvestmentData();
	}, [getInvestmentData]);

	return (
		<div
			className={`${
				investment.profit
					? investment.profit >= 0
						? "bg-green-50 hover:bg-green-100"
						: "bg-red-50 hover:bg-red-100"
					: "bg-gray-50 hover:bg-gray-100"
			} flex curved-table-last-row`}
		>
			<div className="w-[130px] ml-5 py-4">{investment.name}</div>
			<div className="w-[130px] py-4">{investment.ticker}</div>
			<div className="w-[130px] py-4">{investment.quantity}</div>
			<div className="w-[130px] py-4">${investment.cost}</div>
			<div className="w-[130px] py-4">
				{loading ? (
					<div className="flex justify-center items-center">
						<LoadingIndicator small={true} />
					</div>
				) : (
					`$${(
						Math.round(investment.currentPrice * 100) / 100
					).toFixed(2)}`
				)}
			</div>
			<div className="w-[130px] py-4">
				{loading ? (
					<div className="flex justify-center items-center">
						<LoadingIndicator small={true} />
					</div>
				) : investment.profit >= 10 ? (
					`${investment.profit.toFixed(1)}%`
				) : investment.profit ? (
					`${investment.profit.toPrecision(2)}%`
				) : (
					"0%"
				)}
			</div>
			<div className="flex justify-center items-center w-[50px] text-gray-500">
				<TrashIcon
					className="cursor-pointer pb-[2px]"
					onClick={async () => {
						const res = await fetch("/api/remove_investment", {
							method: "POST",
							body: JSON.stringify({
								investmentId: investment.id,
							}),
						});

						if (!res.ok) {
							router.push("/error");
						} else {
							setInvestments((previousInvestments) => {
								return previousInvestments.filter(
									(element) => element != investment
								);
							});
						}
					}}
				/>
			</div>
		</div>
	);
}
