import PocketBase from "pocketbase";

export default async function RemoveInvestmentHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const pbClient = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

		await pbClient.records.delete("investments", body.investmentId);

		res.status(200).json({});
	} catch (_) {
		res.status(500).json({
			error_message: "An error occurred in remove_investment",
		});
	}
}
