import GetClients from "../../utils/clients";

const { pocketbaseClient } = GetClients();

export default async function RemoveInvestmentHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		await pocketbaseClient.records.delete("investments", body.investmentId);

		res.status(200).json({});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in remove_investment",
		});
	}
}
