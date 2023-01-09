import PocketBase from "pocketbase";

export default async function GetInvestmentsHandler(req, res) {
	const body = JSON.parse(req.body);

	const pbClient = new PocketBase("http://127.0.0.1:8090");

	let investments = [];

	await pbClient.records
		.getFullList("investments", 200, {
			filter: `user = '${body.userId}'`,
		})
		.then((records) => {
			for (const entry of records) {
				investments.push({
					id: entry.id,
					name: entry.name,
					ticker: entry.ticker,
					quantity: entry.quantity,
					cost: entry.cost,
				});
			}
			res.status(200).json({ investments });
		});
}
