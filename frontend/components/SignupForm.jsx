import Link from "next/link";
import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useState } from "react";

export default function SignupForm() {
	const router = useRouter();

	const pb = new PocketBase("http://127.0.0.1:8090");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSignUp = async (e) => {
		e.preventDefault();
		await pb.users
			.create({
				email: email,
				password: password,
				passwordConfirm: password,
			})
			.then(async (_) => {
				await pb.users
					.authViaEmail(email, password)
					.then((_) => {
						router.push("/dashboard");
					})
					.catch((_) => {
						router.push({
							pathname: "/login",
							query: { name: "Successfully created" },
						});
					});
			})
			.catch((_) => {
				setPassword("");
				setError("Sign up failed");
			});
	};

	return (
		<form
			className="flex flex-col min-w-max formFixedWidth"
			onSubmit={handleSignUp}
		>
			<input
				type="email"
				className="rounded border-gray-300 border-2 p-1.5 mb-2"
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				className="rounded border-gray-300 border-2 p-1.5 mb-2"
				placeholder="Password"
				onChange={(e) => setPassword(e.target.value)}
				value={password}
			/>
			{error && (
				<p className="text-red-500 bg-red-200 p-2 rounded mb-2 text-center">
					{error}
				</p>
			)}
			<button className="rounded bg-[#fb923c] p-1.5 right-1 text-white">
				Sign up
			</button>
			<div className="flex items-center justify-center">
				<Link className="p-2" href="/login">
					Already have an account?
				</Link>
			</div>
		</form>
	);
}
