import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

const getTransactions = async (
	pbClient,
	userId,
	plaidClient,
	start_date,
	end_date
) => {
	const outgoings = [];

	const records_res = await pbClient.records.getFullList("tokens", 200, {
		filter: `user = '${userId}'`,
	});

	for (const entry of records_res) {
		const transactions_res = await plaidClient.transactionsGet({
			access_token: entry.token,
			start_date,
			end_date,
		});
		transactions_res.data.transactions.forEach((transaction) => {
			if (transaction.amount > 0) {
				outgoings.push({
					amount: transaction.amount,
					date: transaction.date,
				});
			}
		});
	}

	outgoings.sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	});

	return outgoings;
};

const arrayISE = (transactions, array_size) => {
	const data = Array.from({ length: array_size }, () => 0);
	for (const transaction of transactions) {
		const date = new Date(transaction.date);
		data[date.getDate() - 1] += transaction.amount;
	}
	return data;
};

export default async function GetPastSplitTransactionsHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const currentDate = new Date(body.currentDateString);

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

		let expenditure = await getTransactions(
			pbClient,
			body.userId,
			plaidClient,
			new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
				.toISOString()
				.slice(0, 10),
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
				.toISOString()
				.slice(0, 10)
		).then((transactions) => arrayISE(transactions, currentDate.getDate()));

		const lastMonthsExpenditure = await getTransactions(
			pbClient,
			body.userId,
			plaidClient,
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
				.toISOString()
				.slice(0, 10),
			new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
				.toISOString()
				.slice(0, 10)
		).then((transactions) =>
			arrayISE(
				transactions,
				new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					0
				).getDate()
			)
		);

		const lastLastMonthsExpenditure = await getTransactions(
			pbClient,
			body.userId,
			plaidClient,
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1)
				.toISOString()
				.slice(0, 10),
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0)
				.toISOString()
				.slice(0, 10)
		).then((transactions) =>
			arrayISE(
				transactions,
				new Date(
					currentDate.getFullYear(),
					currentDate.getMonth() - 1,
					0
				).getDate()
			)
		);

		const predicted = [];
		for (let i = 0; i < expenditure.length-1; i++) {
			predicted.push(null);
		}

		predicted.push(expenditure.reduce((a, b) => a + b, 0));

		for (let i = predicted.length; i < body.daysInMonth; i++) {
			predicted.push(predicted[i - 1] + Math.random() * 100);
		}

		const cumulativeSum = (
			(sum) => (value) =>
				(sum += value)
		)(0);

		expenditure = expenditure.map(cumulativeSum);

		res.status(200).json({
			expenditure,
			predicted,
			lastMonthsExpenditure,
			lastLastMonthsExpenditure,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: `${e}`,
			// error_message: "An error occurred in get_prediction",
		});
	}
}
