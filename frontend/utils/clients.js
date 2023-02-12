import { PlaidApi, PlaidEnvironments } from "plaid";
import PocketBase from "pocketbase";

export default function GetClients() {
	const pocketbaseClient = new PocketBase(
		process.env.NEXT_PUBLIC_POCKETBASE_URL
	);

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

	return { pocketbaseClient, plaidClient };
}
