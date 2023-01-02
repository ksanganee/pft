import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function GetTransactionsHandler(req, res) {
	const body = JSON.parse(req.body);

	const pbClient = new PocketBase("http://127.0.0.1:8090");

	let transactions = [];

	const plaidClient = new PlaidApi({
		basePath: PlaidEnvironments.sandbox,
		baseOptions: {
			headers: {
				"PLAID-CLIENT-ID": process.env.CLIENT_ID,
				"PLAID-SECRET": process.env.SANDBOX_SECRET,
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
					.transactionsSync({
						access_token: entry.token,
						cursor: null,
					})
					.then(async (response) => {
						response.data.added.forEach((transaction) => {
							if (body.activeAccounts.includes(transaction.account_id)) {
								transactions.push({
									account_id: transaction.account_id,
									amount: transaction.amount,
									category: transaction.category[0],
									date: transaction.date,
									iso_currency_code:
										transaction.iso_currency_code,
									merchant_name: transaction.merchant_name,
									name: transaction.name,
								});
							}
						});
					});
			}
			// Sort transactions by date
			transactions.sort((a, b) => {
				return new Date(b.date) - new Date(a.date);
			});
			res.status(200).json({ transactions });
		});
}
