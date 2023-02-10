import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

var groupBy = function (xs, key) {
	return xs.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};

export default async function GetDateGroupedTransactionsHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const pbClient = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

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

		const today = new Date();

		for (const entry of records_res) {
			const transaction_list_res = await plaidClient.transactionsGet({
				access_token: entry.token,
				start_date: new Date(
					today.getFullYear() - 1,
					today.getMonth(),
					today.getDate()
				)
					.toISOString()
					.slice(0, 10),
				end_date: today.toISOString().slice(0, 10),
				options: {
					count: 500,
				},
			});
			transaction_list_res.data.transactions.forEach((transaction) => {
				if (body.activeAccounts.includes(transaction.account_id)) {
					transactions.push({
						account_id: transaction.account_id,
						amount: transaction.amount,
						category: transaction.category
							? transaction.name ==
							  "Exchanged to ETH Round up Ethereum"
								? "Round-up"
								: transaction.category[0]
							: "N/A",
						date: transaction.date,
						iso_currency_code: transaction.iso_currency_code,
						merchant_name: transaction.merchant_name,
						name:
							transaction.name ==
							"Exchanged to ETH Round up Ethereum"
								? "ETH Spare Change"
								: transaction.name,
					});
				}
			});
		}

		transactions = groupBy(transactions, "date");
		res.status(200).json({ transactions });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in get_date_grouped_transactions",
		});
	}
}
