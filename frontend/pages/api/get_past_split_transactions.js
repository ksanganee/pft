import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function GetPastSplitTransactionsHandler(req, res) {
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

		const incomings = [];
		const outgoings = [];

		const records_res = await pbClient.records.getFullList("tokens", 200, {
			filter: `user = '${body.userId}'`,
		});

		for (const entry of records_res) {
			const transactions_res = await plaidClient.transactionsGet({
				access_token: entry.token,
				start_date: body.startDate,
				// end_date: '2023-01-27',
				end_date: new Date().toISOString().slice(0, 10),
			});
			transactions_res.data.transactions.forEach((transaction) => {
				if (body.activeAccounts.includes(transaction.account_id)) {
					const newTransaction = {
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
					};
					if (transaction.amount < 0) {
						incomings.push(newTransaction);
					} else {
						outgoings.push(newTransaction);
					}
				}
			});
		}

		incomings.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		outgoings.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		res.status(200).json({ incomings, outgoings });
	} catch (_) {
		res.status(500).json({
			error_message: "An error occurred in get_past_split_transactions",
		});
	}
}
