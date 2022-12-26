import PocketBase from "pocketbase";

export default function testingHandler(req, res) {
	const pb = new PocketBase("http://127.0.0.1:8090");
	console.log(pb);
}