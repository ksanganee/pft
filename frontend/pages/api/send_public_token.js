import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function SendPublicTokenHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const plaidClient = new PlaidApi({
			basePath:
				process.env.ENVIRONMENT === "development"
					? PlaidEnvironments.development
					: PlaidEnvironments.sandbox,
			baseOptions: {
				headers: {
					"PLAID-CLIENT-ID": process.env.CLIENT_ID,
					"PLAID-SECRET":
						process.env.ENVIRONMENT === "development"
							? process.env.DEVELOPMENT_SECRET
							: process.env.SANDBOX_SECRET,
				},
			},
		});

		const exchange_res = await plaidClient.itemPublicTokenExchange({
			public_token: body.publicToken,
		});

		const pbClient = new PocketBase("http://127.0.0.1:8090");

		await pbClient.records.create("tokens", {
			user: body.userId,
			token: exchange_res.data.access_token,
		});

		res.status(200);
	} catch (_) {
		res.status(500).json({
			error_message: "An error occurred in send_public_token",
		});
	}
}
