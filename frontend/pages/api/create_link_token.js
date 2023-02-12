import GetClients from "../../utils/clients";

const { plaidClient } = GetClients();

export default async function CreateLinkTokenHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const plaid_response = await plaidClient.linkTokenCreate({
			client_name: "PFT Testing",
			language: "en",
			country_codes: ["GB", "US"],
			user: {
				client_user_id: body.userId,
			},
			products: ["auth", "transactions"],
		});

		res.status(200).json(plaid_response.data);
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in create_link_token",
		});
	}
}
