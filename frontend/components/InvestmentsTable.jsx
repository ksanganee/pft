import { useCallback, useEffect, useState } from "react";
import AddInvestmentBar from "./AddInvestmentBar";
import InvestmentTableRow from "./InvestmentTableRow";
import LoadingIndicator from "./LoadingIndicator";

export default function InvestmentsTable({ router, userModel, ...props }) {
	const [investments, setInvestments] = useState([]);
	const [loading, setLoading] = useState(true);

	const getInvestments = useCallback(async () => {
		const res = await fetch("/api/get_investments", {
			method: "POST",
			body: JSON.stringify({
				userId: userModel.id,
			}),
		});

		if (!res.ok) {
			router.push("/error");
		} else {
			const data = await res.json();
			setInvestments(data.investments, setLoading(false));
		}
	}, [router, userModel.id]);

	useEffect(() => {
		setLoading(true);
		getInvestments();
	}, [getInvestments]);

	return loading ? (
		<LoadingIndicator />
	) : (
		<div>
			<div className="text-sm overflow-auto max-h-[356px] mb-5 curved-table-header">
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
								router={router}
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
				router={router}
				userModel={userModel}
				addInvestment={(newInvestment) =>
					setInvestments((prevInvestments) => [
						...prevInvestments,
						newInvestment,
					])
				}
			/>
		</div>
	);
}
