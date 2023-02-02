import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

var groupBy = function (xs, key) {
	return xs.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};

export default async function GetTransactionsHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const pbClient = new PocketBase("http://127.0.0.1:8090");

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

		let transactions = [];

		const records_res = await pbClient.records.getFullList("tokens", 200, {
			filter: `user = '${body.userId}'`,
		});

		for (const entry of records_res) {
			const transaction_list_res = await plaidClient.transactionsGet({
				access_token: entry.token,
				start_date: new Date(
					new Date().setDate(new Date().getDate() - 365)
				)
					.toISOString()
					.split("T")[0],
				end_date: new Date().toISOString().split("T")[0],
			});
			transaction_list_res.data.transactions.forEach((transaction) => {
				if (body.activeAccounts.includes(transaction.account_id)) {
					transactions.push({
						account_id: transaction.account_id,
						amount: transaction.amount,
						category: transaction.category
							? transaction.category[0]
							: "N/A",
						date: transaction.date,
						iso_currency_code: transaction.iso_currency_code,
						merchant_name: transaction.merchant_name,
						name: transaction.name,
					});
				}
			});
		}

		transactions = groupBy(transactions, "date");
		res.status(200).json({ transactions });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error_message: "An error occurred in get_date_grouped_transactions",
		});
	}
}
