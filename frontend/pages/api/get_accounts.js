import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default async function GetAccountsHandler(req, res) {
	const body = JSON.parse(req.body);

	const pbClient = new PocketBase("http://127.0.0.1:8090");

	let accounts = [];

	const plaidClient = new PlaidApi({
		basePath: PlaidEnvironments.sandbox,
		baseOptions: {
			headers: {
				"PLAID-CLIENT-ID": process.env.CLIENT_ID,
				"PLAID-SECRET": process.env.SANDBOX_SECRET,
			},
		},
	});

	await pbClient.records
		.getFullList("tokens", 200, {
			filter: `user = '${body.userId}'`,
		})
		.then(async (records) => {
			for (const entry of records) {
				await plaidClient
					.accountsGet({
						access_token: entry.token,
					})
					.then(async (accounts_response) => {
						await plaidClient
							.institutionsGetById({
								institution_id:
									accounts_response.data.item.institution_id,
								country_codes: ["GB", "US"],
							})
							.then((institution_response) => {
								accounts_response.data.accounts.forEach(
									(account) => {
										accounts.push({
											account_id: account.account_id,
											name: account.name,
											institution:
												institution_response.data.institution.name.split()[0],
										});
									}
								);
							});
					});
			}
			res.status(200).json({ accounts });
		});
}
