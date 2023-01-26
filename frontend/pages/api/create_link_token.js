import { PlaidApi, PlaidEnvironments } from "plaid";

export default async function CreateLinkTokenHandler(req, res) {
	const body = JSON.parse(req.body);

	const plaidClient = new PlaidApi({
		basePath: process.env.ENVIRONMENT === "development" ? PlaidEnvironments.development : PlaidEnvironments.sandbox,
		baseOptions: {
			headers: {
				"PLAID-CLIENT-ID": process.env.CLIENT_ID,
				"PLAID-SECRET": process.env.ENVIRONMENT === "development" ? process.env.DEVELOPMENT_SECRET : process.env.SANDBOX_SECRET,
			},
		},
	});

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
}
