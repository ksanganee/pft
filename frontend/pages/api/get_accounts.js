import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function GetAccountsHandler(req, res) {
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

		const accounts = [];

		const records_res = await pbClient.records.getFullList("tokens", 200, {
			filter: `user = '${body.userId}'`,
		});

		for (const entry of records_res) {
			const account_res = await plaidClient.accountsGet({
				access_token: entry.token,
			});

			const institution_res = await plaidClient.institutionsGetById({
				institution_id: account_res.data.item.institution_id,
				country_codes: ["GB", "US"],
			});

			account_res.data.accounts.forEach((account) => {
				accounts.push({
					account_id: account.account_id,
					name: account.name,
					institution:
						institution_res.data.institution.name.split(" ")[0],
				});
			});
		}

		res.status(200).json({ accounts });
	} catch (_) {
		res.status(500).json({
			error_message: "An error occurred in get_accounts",
		});
	}
}
