import GetClients from "../../utils/get_clients";
import GroupBy from "../../utils/group";

const { pocketbaseClient, plaidClient } = GetClients();

export default async function GetPredictionHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const records_res = await pocketbaseClient.records.getFullList(
			"tokens",
			200,
			{
				filter: `user = '${body.userId}'`,
			}
		);

		const today = new Date();

		const transactions = [];

		for (const entry of records_res) {
			const transaction_list_res = await plaidClient.transactionsGet({
				access_token: entry.token,
				start_date: new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() - 29
				)
					.toISOString()
					.slice(0, 10),
				end_date: today.toISOString().slice(0, 10),
				options: {
					count: 500,
				},
			});
			transaction_list_res.data.transactions.forEach((transaction) => {
				transactions.push({
					amount: transaction.amount,
					date: transaction.date,
				});
			});
		}

		const groups = GroupBy(transactions, "date");

		const amounts = [];

		let expenditure = [];

		for (let i = 0; i < 30; i++) {
			let amount = 0;
			let pAmount = 0;
			const date = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 29 + i
			)
				.toISOString()
				.slice(0, 10);

			if (groups[date]) {
				groups[date].forEach((transaction) => {
					amount += transaction.amount;
					if (transaction.amount > 0) pAmount += transaction.amount;
				});
			}
			expenditure.push(pAmount);
			amounts.push(Math.round(amount * 100) / 100);
		}

		const forecast_amount =
			new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() -
			today.getDate();

		let predictions = await fetch(process.env.LSTM_URL, {
			method: "POST",
			body: JSON.stringify({
				previous_thirty_days: amounts,
				forecast_amount,
			}),
		}).then((res) => res.json());

		console.log(predictions);

		expenditure = expenditure.slice(-today.getDate(), amounts.length);

		expenditure = expenditure.map(
			(
				(sum) => (value) =>
					(sum += value)
			)(0)
		);

		for (let i = 0; i < today.getDate(); i++) {
			predictions.unshift(0);
		}

		predictions[expenditure.length - 1] =
			expenditure[expenditure.length - 1];

		for (let i = 0; i < predictions.length; i++) {
			if (predictions[i] < 0) predictions[i] = 0;
			predictions[i] = Math.round(predictions[i] * 100) / 100;
		}

		predictions = predictions.map(
			(
				(sum) => (value) =>
					(sum += value)
			)(0)
		);

		for (let i = 0; i < predictions.length; i++) {
			predictions[i] = Math.round(predictions[i] * 100) / 100;
		}

		for (let i = 0; i < today.getDate() - 1; i++) {
			predictions[i] = null;
		}

		console.log(expenditure);

		res.status(200).json({ expenditure, predictions });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in get_prediction",
		});
	}
}
