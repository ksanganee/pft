export const fetcher = async (url, body) => {
	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const { error_message } = await res.json();
		throw new Error(error_message);
	}

	return res.json();
};