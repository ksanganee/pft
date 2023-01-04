import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function GetPastMonthTransactionsHandler(req, res) {
	const body = JSON.parse(req.body);

	const pbClient = new PocketBase("http://127.0.0.1:8090");

	let incomings = [];
	let outgoings = [];

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
					.transactionsGet({
						access_token: entry.token,
						start_date: new Date(
							new Date().setDate(new Date().getDate() - 30)
						)
							.toISOString()
							.split("T")[0],
						end_date: new Date().toISOString().split("T")[0],
					})
					.then(async (response) => {
						response.data.transactions.forEach((transaction) => {
							if (
								body.activeAccounts.includes(
									transaction.account_id
								)
							) {
								if (transaction.amount < 0) {
									incomings.push({
										account_id: transaction.account_id,
										amount: transaction.amount,
										category: transaction.category[0],
										date: transaction.date,
										iso_currency_code:
											transaction.iso_currency_code,
										merchant_name:
											transaction.merchant_name,
										name: transaction.name,
									});
								} else {
									outgoings.push({
										account_id: transaction.account_id,
										amount: transaction.amount,
										category: transaction.category[0],
										date: transaction.date,
										iso_currency_code:
											transaction.iso_currency_code,
										merchant_name:
											transaction.merchant_name,
										name: transaction.name,
									});
								}
							}
						});
					});
			}
			incomings.sort((a, b) => {
				return new Date(b.date) - new Date(a.date);
			});
			outgoings.sort((a, b) => {
				return new Date(b.date) - new Date(a.date);
			});
			res.status(200).json({ incomings, outgoings });
		});
}
