import GetClients from "../../utils/clients";
import GroupBy from "../../utils/group";

const { pocketbaseClient, plaidClient } = GetClients();

export default async function GetDateGroupedTransactionsHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		let transactions = [];

		const records_res = await pocketbaseClient.records.getFullList(
			"tokens",
			200,
			{
				filter: `user = '${body.userId}'`,
			}
		);

		for (const entry of records_res) {
			const transaction_list_res = await plaidClient.transactionsGet({
				access_token: entry.token,
				start_date: new Date(body.startDate).toISOString().slice(0, 10),
				end_date: new Date(body.endDate).toISOString().slice(0, 10),
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

		transactions = GroupBy(transactions, "date");
		res.status(200).json({ transactions });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in get_date_grouped_transactions",
		});
	}
}
