import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function SendPublicTokenHandler(req, res) {
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

	await plaidClient
		.itemPublicTokenExchange({
			public_token: body.publicToken,
		})
		.then(async (response) => {
			const pbClient = new PocketBase("http://127.0.0.1:8090");
			await pbClient.records
				.create("tokens", {
					user: body.userId,
					token: response.data.access_token,
				})
				.then(async () => {
					res.status(200).json({ success: true });
				})
				.catch(() => {
					res.status(500).json({ success: false });
				});
		})
		.catch(() => {
			res.status(500).json({ success: false });
		});
}
