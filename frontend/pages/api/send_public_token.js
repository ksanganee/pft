import GetClients from "../../utils/clients";

const { plaidClient } = GetClients();

export default async function SendPublicTokenHandler(req, res) {
	try {
		const body = JSON.parse(req.body);

		const exchange_res = await plaidClient.itemPublicTokenExchange({
			public_token: body.publicToken,
		});

		await pbClient.records.create("tokens", {
			user: body.userId,
			token: exchange_res.data.access_token,
		});

		res.status(200).json({});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			error_message: "An error occurred in send_public_token",
		});
	}
}
