import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useEffect } from "react";

export default function LogoutPageHandler() {
	const router = useRouter();

	useEffect(() => {
		const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
		pb.authStore.clear();
		router.push({
			pathname: "/login",
			query: { name: "You have signed out" },
		});
	}, [router]);

	return null;
}
