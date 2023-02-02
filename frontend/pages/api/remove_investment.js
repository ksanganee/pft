import PocketBase from "pocketbase";

export default async function RemoveInvestmentHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const pbClient = new PocketBase("http://127.0.0.1:8090");

		await pbClient.records.delete("investments", body.investmentId);

		res.status(200).json();
	} catch (_) {
		res.status(500).json({
			error_message: "An error occurred in remove_investment",
		});
	}
}
