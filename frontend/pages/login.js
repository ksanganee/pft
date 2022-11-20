import { useRouter } from 'next/router'
import PocketBase from 'pocketbase';
import { useState, useEffect } from 'react';

export default function Login() {
	let router = useRouter()

	const client = new PocketBase('http://127.0.0.1:8090');

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [query, setQuery] = useState("")

	useEffect(() => {
		setQuery(router.query.name);
	}, [router.query]);

	const handleLogin = async (e) => {
		e.preventDefault()
		await client.users.authViaEmail(
			email,
			password
		).then((_) => {
			router.push("/dashboard")
		}).catch((err) => {
			setQuery("");
			setError("Login failed")
		});
	}

	return (
		<div className="flex items-center justify-center h-screen">
			<form className="flex flex-col min-w-max formFixedWidth"onSubmit={handleLogin}>
				{query && <p className="text-green-500 bg-green-200 p-2 rounded-lg mb-2 text-center">{query}</p>}
				<input
					type="email"
					className="rounded-lg border-gray-300 border-2 p-1.5 mb-2"
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					className="rounded-lg border-gray-300 border-2 p-1.5 mb-2"
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				{error && <p className="text-red-500 bg-red-200 p-2 rounded-lg mb-2 text-center">{error}</p>}
				<button className="rounded-lg bg-[#fb923c] p-1.5 right-1 text-white">
					Login
				</button>
			</form>
		</div>
	);
}