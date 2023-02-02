import PocketBase from "pocketbase";

export default async function AddInvestmentHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const pbClient = new PocketBase("http://127.0.0.1:8090");

		const record = await pbClient.records.create("investments", {
			user: body.userId,
			name: body.investment.name,
			ticker: body.investment.ticker,
			quantity: body.investment.quantity,
			cost: body.investment.cost,
		});

		res.status(200).json({ id: record.id });
	} catch (_) {
		res.status(500).json({
			error_message: "An error occurred in add_investment",
		});
	}
}
