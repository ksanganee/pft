import { useCallback, useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import AddInvestmentBar from "./AddInvestmentBar";
import InvestmentTableRow from "./InvestmentTableRow";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

export default function InvestmentsTable(props) {
	const [investments, setInvestments] = useState([]);

	const { data, error, isLoading } = useSWR("/api/get_investments", (url) =>
		fetcher(url, {
			userId: props.userModel.id,
		})
	);

	const addInvestment = useCallback((investment) => {
		setInvestments((prevInvestments) => {
			return [...prevInvestments, investment];
		});
	}, []);

	useEffect(() => {
		if (data && data.investments) {
			setInvestments(data.investments);
		}
	}, [data]);

	if (error) {
		props.router.push("/error");
		return null;
	}

	if (isLoading) return <LoadingIndicator />;

	return (
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
								router={props.router}
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
				router={props.router}
				addInvestment={addInvestment}
				userModel={props.userModel}
			/>
		</div>
	);
}
