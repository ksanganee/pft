import PocketBase from "pocketbase";

export default async function GetInvestmentsHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const pbClient = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

		let investments = [];

		const records_res = await pbClient.records.getFullList(
			"investments",
			200,
			{
				filter: `user = '${body.userId}'`,
			}
		);

		for (const entry of records_res) {
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
