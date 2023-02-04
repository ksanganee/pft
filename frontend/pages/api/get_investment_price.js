export default async function GetInvestmentPriceHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const stock_res = await fetch(
			`https://financialmodelingprep.com/api/v3/quote-short/${body.ticker}?apikey=${process.env.FMP_API_KEY}`
		);

		const stock_data = await stock_res.json();

		res.status(200).json({ price: stock_data[0].price });
	} catch (_) {
		res.status(500).json({
			error_message: "An error occurred in get_investment_price",
		});
	}
}
