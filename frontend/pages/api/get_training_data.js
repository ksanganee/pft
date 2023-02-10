import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function GetTrainingDataHandler(req, res) {
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
					// if (transaction.amount > 0) {
					outgoings.push({
						amount: transaction.amount,
						date: transaction.date,
					});
					// }
				});
			}

			outgoings.sort((a, b) => {
				return new Date(b.date) - new Date(a.date);
			});

			return outgoings;
		};

		const groupBy = function (xs, key) {
			return xs.reduce(function (rv, x) {
				(rv[x[key]] = rv[x[key]] || []).push(x);
				return rv;
			}, {});
		};

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

		const today = new Date();
		const trainingData = [];
		for (let i = 0; i <= 730; i++) {
			let amount = 0;
			const d = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 730 + i
			)
				.toISOString()
				.slice(0, 10);
			console.log(d);
			await getTransactions(
				pbClient,
				body.userId,
				plaidClient,
				d,
				d
			).then((transactions) => {
				for (const t of transactions) {
					amount += t.amount;
				}
				trainingData.push(Math.round(amount * 100) / 100);
			});
			console.log(trainingData);
			await new Promise((r) => setTimeout(r, 4000));
		}

		res.status(200).json({
			trainingData,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in get_training_data",
		});
	}
}
