export default async function GetInvestmentPriceHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		let price = 0;

		const stock_res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${body.ticker}&apikey=${process.env.AV_API_KEY}`);

		const stock_data = await stock_res.json();

		if (stock_data["Global Quote"] && stock_data["Global Quote"]["05. price"]) {
			price = stock_data["Global Quote"]["05. price"];
		}

		res.status(200).json({ price });
	} catch (_) {
		res.status(500).json({
			error_message: "An error occurred in get_investment_price",
		});
	}
}
