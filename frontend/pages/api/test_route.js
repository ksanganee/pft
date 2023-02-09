export default async function TestRouteHandler(req, res) {
	const previous_thirty_days = [76.5, 0, 53, 27, 63, 10, 0, 5];

	await fetch("http://127.0.0.1:5000/api/predict", {
		method: "POST",
		body: JSON.stringify({
			previous_thirty_days: previous_thirty_days,
		}),
	}).then((response) => {
		console.log(response);
	});

	res.status(200).json({});
}
