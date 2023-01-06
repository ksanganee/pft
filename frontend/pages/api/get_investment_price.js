export default async function GetInvestmentsHandler(req, res) {
	const body = JSON.parse(req.body);

	let price = 0;

	for (let i = 1; i <= 13; i++) {
		const response = await fetch(
			`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${body.ticker}&apikey=${process.env.AV_API_KEY}${i}`
		);
		const data = await response.json();
		if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
			price = data["Global Quote"]["05. price"];
			break;
		}
	}

	console.log(price);

	res.status(200).json({ price });
}
