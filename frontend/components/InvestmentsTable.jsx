import { useCallback, useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import AddInvestmentBar from "./AddInvestmentBar";
import InvestmentTableRow from "./InvestmentTableRow";

export default function InvestmentsTable(props) {
	const [investments, setInvestments] = useState([]);
	const [loading, setLoading] = useState(true);

	const addInvestment = useCallback((investment) => {
		setInvestments((prevInvestments) => {
			return [...prevInvestments, investment];
		});
	}, []);

	const getInvestments = useCallback(async () => {
		const response = await fetch("/api/get_investments", {
			method: "POST",
			body: JSON.stringify({
				userId: props.userModel.id,
			}),
		});
		const data = await response.json();
		setInvestments(data.investments);
		setLoading(false);
	}, [props.userModel.id]);

	useEffect(() => {
		setLoading(true);
		getInvestments();
	}, [getInvestments]);

	return loading ? (
		<LoadingIndicator />
	) : (
		<div>
			<div className="text-sm overflow-auto max-h-96 mb-5 curved-table-header">
				<div className="text-gray-700 bg-gray-200 flex">
					<div scope="col" className="w-[130px] ml-5 py-3">
						Name
					</div>
					<div scope="col" className="w-[130px] py-3">
						Ticker
					</div>
					<div scope="col" className="w-[130px] py-3">
						Quantity
					</div>
					<div scope="col" className="w-[130px] py-3">
						Cost
					</div>
					<div scope="col" className="w-[130px] py-3">
						Price
					</div>
					<div scope="col" className="w-[130px] py-3">
						Profit
					</div>
					<div scope="col" className="w-[50px] py-3"></div>
				</div>
				<div>
					{investments.map((investment, i) => {
						return (
							<InvestmentTableRow
								key={i}
								investment={investment}
								investments={investments}
								setInvestments={setInvestments}
							/>
						);
					})}
				</div>
			</div>
			<AddInvestmentBar
				addInvestment={addInvestment}
				userModel={props.userModel}
			/>
		</div>
	);
}
