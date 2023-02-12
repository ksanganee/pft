import GetClients from "../../utils/GetClients";

const { pocketbaseClient } = GetClients();

export default async function AddInvestmentHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const record = await pocketbaseClient.records.create("investments", {
			user: body.userId,
			name: body.investment.name,
			ticker: body.investment.ticker,
			quantity: body.investment.quantity,
			cost: body.investment.cost,
		});

		res.status(200).json({ id: record.id });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in add_investment",
		});
	}
}
