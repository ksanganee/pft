import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function SendPublicTokenHandler(req, res) {
	const body = JSON.parse(req.body);

	const client = new PlaidApi({
		basePath: PlaidEnvironments.sandbox,
		baseOptions: {
			headers: {
				"PLAID-CLIENT-ID": process.env.CLIENT_ID,
				"PLAID-SECRET": process.env.SANDBOX_SECRET,
			},
		},
	});

	await client
		.itemPublicTokenExchange({
			public_token: body.publicToken,
		})
		.then(async (response) => {
			console.log(response.data)
			const pb = new PocketBase("http://127.0.0.1:8090");
			await pb.records
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
