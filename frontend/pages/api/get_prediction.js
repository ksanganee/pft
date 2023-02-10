import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function GetPredictionHandler(req, res) {
	try {
		const getTransactions = async (
			pbClient,
			userId,
			plaidClient,
			start_date,
			end_date
		) => {
			const outgoings = [];

			const records_res = await pbClient.records.getFullList(
				"tokens",
				200,
				{
					filter: `user = '${userId}'`,
				}
			);

			for (const entry of records_res) {
				const transactions_res = await plaidClient.transactionsGet({
					access_token: entry.token,
					start_date,
					end_date,
					options: {
						count: 500,
					},
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

		var groupBy = function (xs, key) {
			return xs.reduce(function (rv, x) {
				(rv[x[key]] = rv[x[key]] || []).push(x);
				return rv;
			}, {});
		};
		const body = JSON.parse(req.body);

		const currentDate = new Date(body.currentDateString);

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

		const thisMonthSoFar = await getTransactions(
			pbClient,
			body.userId,
			plaidClient,
			new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
				.toISOString()
				.slice(0, 10),
			new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				currentDate.getDate()
			)
				.toISOString()
				.slice(0, 10)
		).then((transactions) => {
			return arrayISE(transactions, currentDate.getDate());
		});

		const expenditure = thisMonthSoFar.map(
			(
				(sum) => (value) =>
					(sum += value)
			)(0)
		);

		const predicted = [];
		for (let i = 0; i < expenditure.length - 1; i++) {
			predicted.push(null);
		}

		predicted.push(expenditure[expenditure.length - 1]);

		for (let i = predicted.length; i < body.daysInMonth; i++) {
			predicted.push(predicted[i - 1] + Math.random() * 100);
		}

		const temp = await getTransactions(
			pbClient,
			body.userId,
			plaidClient,
			"2023-01-08",
			"2023-01-31"
			
		).then((transactions) => {
			console.log(arrayISE(transactions, 31));
		});

		res.status(200).json({
			// temp,
			thisMonthSoFar,
			expenditure,
			predicted,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: `${e}`,
			// error_message: "An error occurred in get_prediction",
		});
	}
}