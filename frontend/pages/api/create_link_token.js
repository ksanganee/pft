import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';


export default async function CreateLinkTokenHandler(req, res) {
	const body = JSON.parse(req.body);

	const configuration = new Configuration({
		basePath: PlaidEnvironments.sandbox,
		baseOptions: {
			headers: {
				'PLAID-CLIENT-ID': process.env.CLIENT_ID,
				'PLAID-SECRET': process.env.SANDBOX_SECRET,
			},
		},
	});
	
	const client = new PlaidApi(configuration);

	const plaid_response = await client.linkTokenCreate({
		client_name: "PFT Testing",
		language: "en",
		country_codes: ["GB", "US"],
		user: {
			client_user_id: body.userId,

		},
		products: ["assets", "auth", "transactions"],
	})

	res.status(200).json(plaid_response.data);
}
