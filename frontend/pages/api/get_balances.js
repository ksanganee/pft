import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function GetBalancesHandler(req, res) {
	const body = JSON.parse(req.body);

	const pbClient = new PocketBase("http://127.0.0.1:8090");

	let balances = [];

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

	await pbClient.records
		.getFullList("tokens", 200, {
			filter: `user = '${body.userId}'`,
		})
		.then(async (records) => {
			for (const entry of records) {
				await plaidClient
					.accountsBalanceGet({
						access_token: entry.token,
					})
					.then(async (balances_response) => {
						balances_response.data.accounts.forEach((account) => {
							balances.push({
								account_id: account.account_id,
								balance:
									account.balances.available ||
									account.balances.current,
								// name: account.name,
								name: account.official_name,
							});
						});
					});
			}
			res.status(200).json({ balances });
		});
}
