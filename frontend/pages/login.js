import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import Centred from "../layouts/Centred";

export default function LoginPageHandler() {
	let router = useRouter();

	useEffect(() => {
		const pb = new PocketBase("http://127.0.0.1:8090");
		if (pb.authStore.model != null) {
			router.push("/dashboard");
		}
	}, []);

	return (
		<Centred>
			<LoginForm />
		</Centred>
	);
}
