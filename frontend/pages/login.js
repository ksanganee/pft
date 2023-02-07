import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useEffect } from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPageHandler() {
	const router = useRouter();

	useEffect(() => {
		const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
		if (pb.authStore.model != null) {
			router.push("/dashboard");
		}
	}, [router]);

	return (
		<div className="flex justify-center items-center h-screen">
			<LoginForm router={router} />
		</div>
	);
}
