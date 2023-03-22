import GetClients from "../../utils/clients";
import GroupBy from "../../utils/group";

const { pocketbaseClient, plaidClient } = GetClients();

export default async function GetTrainingDataHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const records_res = await pocketbaseClient.records.getFullList(
			"tokens",
			200,
			{
				filter: `user = '${body.userId}'`,
			}
		);

		const amounts = [];

		for (let i = 0; i < 25; i++) {
			const transactions = [];

			for (const entry of records_res) {
				const transaction_list_res = await plaidClient.transactionsGet({
					access_token: entry.token,
					start_date: new Date(
						new Date().setDate(new Date().getDate() - 750 + i * 30)
					)
						.toISOString()
						.slice(0, 10),
					end_date: new Date(
						new Date().setDate(new Date().getDate() - 720 + i * 30)
					)
						.toISOString()
						.slice(0, 10),
					options: {
						count: 500,
					},
				});
				transaction_list_res.data.transactions.forEach(
					(transaction) => {
						transactions.push({
							amount: transaction.amount,
							date: transaction.date,
						});
					}
				);
			}

			const groups = GroupBy(transactions, "date");

			for (let j = 0; j < 30; j++) {
				let amount = 0;
				const date = new Date(
					new Date().setDate(new Date().getDate() - 750 + i * 30 + j)
				)
					.toISOString()
					.slice(0, 10);

				if (groups[date]) {
					groups[date].forEach((transaction) => {
						amount += transaction.amount;
					});
				}
				amounts.push(Math.round(amount * 100) / 100);
			}

			amounts.pop();

			console.log(i);
		}

		res.status(200).json({ amounts });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in get_training_data",
		});
	}
}
