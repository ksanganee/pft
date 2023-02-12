import GetClients from "../../utils/clients";

const { pocketbaseClient, plaidClient } = GetClients();

export default async function GetAccountsHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const accounts = [];

		const records_res = await pocketbaseClient.records.getFullList(
			"tokens",
			200,
			{
				filter: `user = '${body.userId}'`,
			}
		);

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
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in get_accounts",
		});
	}
}
