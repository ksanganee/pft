import { useState } from "react";

export default function AddInvestmentBar(props) {
	const [currentTicker, setCurrentTicker] = useState("None");
	const [currentPrice, setCurrentPrice] = useState("-");

	const investmentOptions = [
		["None", { name: "-", ticker: "-" }],
		["AAPL", { name: "Apple", ticker: "AAPL" }],
		["AMZN", { name: "Amazon", ticker: "AMZN" }],
		["MSFT", { name: "Microsoft", ticker: "MSFT" }],
		["GOOG", { name: "Google", ticker: "GOOG" }],
	];

	const investmentMappings = new Map(investmentOptions);

	const getPrice = async (ticker) => {
		if (ticker == "None") return "-";
		const response = await fetch("/api/get_investment_price", {
			method: "POST",
			body: JSON.stringify({
				ticker: ticker,
			}),
		});
		const data = await response.json();
		return data.price;
	};

	return (
		<div>
			<button
				onClick={async () => {
					const quantityInput =
						document.getElementById("quantityInput");
					const costInput = document.getElementById("costInput");
					if (
						currentTicker != "None" &&
						quantityInput.value > "0" &&
						costInput.value > "0"
					) {
						const newInvestment = {
							name: investmentMappings.get(currentTicker).name,
							ticker: investmentMappings.get(currentTicker)
								.ticker,
							quantity: quantityInput.value,
							cost: costInput.value,
						};
						const response = await fetch("/api/add_investment", {
							method: "POST",
							body: JSON.stringify({
								userId: props.userModel.id,
								investment: newInvestment,
							}),
						});
						const data = await response.json();
						newInvestment.id = data.id;
						props.addInvestment(newInvestment);
					} else {
						if (currentTicker == "None") {
							document
								.getElementById("tickerInput")
								.classList.add("border-red-500");
						}
						if (quantityInput.value <= "0") {
							quantityInput.classList.add("border-red-500");
						}
						if (costInput.value <= "0") {
							costInput.classList.add("border-red-500");
						}
					}
				}}
				className="rounded bg-[#fb923c] p-2 text-white hover:bg-[#fb923c]/80 text-sm mb-5"
			>
				+ Add Investment
			</button>
			<div className="text-sm bg-gray-100 text-gray-900 flex curved-table-header">
				<div className="w-[130px] ml-5 py-4">Name</div>
				<div className="w-[130px] py-4">
					<div className="block text-sm font-medium text-gray-900 dark:text-white">
						Ticker
					</div>
				</div>
				<div className="w-[130px] py-4">Quantity</div>
				<div className="w-[130px] py-4">Cost ($)</div>
				<div className="w-[130px] py-4">Price</div>
				<div className="w-[130px] py-4">Profit</div>
			</div>
			<div className="text-sm text-gray-500 flex bg-gray-50 curved-bottom">
				<div className="w-[130px] ml-5 py-4">
					{investmentMappings.get(currentTicker).name}
				</div>
				<div className="w-[130px] py-4">
					<select
						id="tickerInput"
						className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-[80px] text-center"
						onChange={(e) => {
							document
								.getElementById("tickerInput")
								.classList.remove("border-red-500");
							setCurrentTicker(e.target.value);
							getPrice(e.target.value).then((price) => {
								if (price == 0) {
									setCurrentPrice("-");
								} else {
									setCurrentPrice(`$${(Math.round(price * 100) / 100).toFixed(2)}`);
								}
							});
						}}
					>
						{investmentOptions.map((option) => {
							return (
								<option key={option} value={option[0]}>
									{option[0]}
								</option>
							);
						})}
					</select>
				</div>
				<div className="w-[130px] py-4">
					<input
						type="number"
						id="quantityInput"
						className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-[80px] pl-[13px] text-center"
						onChange={() => {
							document
								.getElementById("quantityInput")
								.classList.remove("border-red-500");
						}}
					/>
				</div>
				<div className="w-[130px] py-4">
					<input
						type="number"
						id="costInput"
						className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-[80px] pl-[13px] text-center"
						onChange={() => {
							document
								.getElementById("costInput")
								.classList.remove("border-red-500");
						}}
					/>
				</div>
				<div className="w-[130px] py-4">{currentPrice}</div>
				<div className="w-[130px] py-4">-</div>
			</div>
		</div>
	);
}
