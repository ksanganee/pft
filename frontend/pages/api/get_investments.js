import PocketBase from "pocketbase";

export default async function GetInvestmentsHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const pbClient = new PocketBase("http://127.0.0.1:8090");

		let investments = [];

		const record_res = await pbClient.records.getFullList(
			"investments",
			200,
			{
				filter: `user = '${body.userId}'`,
			}
		);

		for (const entry of record_res) {
			investments.push({
				id: entry.id,
				name: entry.name,
				ticker: entry.ticker,
				quantity: entry.quantity,
				cost: entry.cost,
			});
		}

		res.status(200).json({ investments });
	} catch (_) {
		res.status(500).json({
			error_message: "An error occurred in get_investments",
		});
	}
}
