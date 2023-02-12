import GetClients from "../../utils/clients";

const { pocketbaseClient, plaidClient } = GetClients();

export default async function GetBalancesHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const balances = [];

		const records_res = await pocketbaseClient.records.getFullList(
			"tokens",
			200,
			{
				filter: `user = '${body.userId}'`,
			}
		);

		for (const entry of records_res) {
			const balances_res = await plaidClient.accountsBalanceGet({
				access_token: entry.token,
			});

			balances_res.data.accounts.forEach((account) => {
				balances.push({
					account_id: account.account_id,
					balance:
						account.balances.available || account.balances.current,
					name: account.official_name,
				});
			});
		}

		res.status(200).json({ balances });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in get_balances",
		});
	}
}
