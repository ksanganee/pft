import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useEffect } from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPageHandler() {
	let router = useRouter();

	useEffect(() => {
		const pb = new PocketBase("http://127.0.0.1:8090");
		if (pb.authStore.model != null) {
			router.push("/dashboard");
		}
	}, [router]);

	return (
		<div className="flex justify-center items-center h-screen">
			<LoginForm />
		</div>
	);
}
