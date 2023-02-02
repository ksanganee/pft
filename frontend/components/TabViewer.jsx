import { useState } from "react";
import AccountsDropdown from "./AccountsDropdown";
import TransactionsList from "./TransactionsList";
import CategoriesChart from "./CategoriesChart";
import InvestmentsTable from "./InvestmentsTable";
import BudgetsSection from "./BudgetsSection";

export default function TabViewer(props) {
	console.log(1);

	const [currentTab, setCurrentTab] = useState(1);
	const [activeAccounts, setActiveAccounts] = useState([]);

	const tabs = [
		{
			name: "Transactions",
			component: (
				<TransactionsList
					userModel={props.userModel}
					activeAccounts={activeAccounts}
				/>
			),
		},
		{
			name: "Categories",
			component: (
				<CategoriesChart
					userModel={props.userModel}
					activeAccounts={activeAccounts}
				/>
			),
		},
		{
			name: "Budgets",
			component: (
				<BudgetsSection
					userModel={props.userModel}
					activeAccounts={activeAccounts}
				/>
			),
		},
		{
			name: "Investments",
			component: <InvestmentsTable userModel={props.userModel} />,
		},
	];

	return (
		<>
			<div className="flex text-gray-700 justify-center">
				{tabs.map((tab, i) => {
					return (
						<div
							key={i + 1}
							onClick={() => setCurrentTab(i + 1)}
							className={`${
								currentTab == i + 1
									? "text-[#fb923c] border-[#fb923c]"
									: "border-transparent hover:border-gray-300"
							} inline-flex p-4 rounded-t-lg border-b-2 cursor-pointer mr-2`}
						>
							{tab.name}
						</div>
					);
				})}
				<AccountsDropdown
					userModel={props.userModel}
					activeAccounts={activeAccounts}
					setActiveAccounts={setActiveAccounts}
				/>
			</div>
			<div className="mt-8 flex justify-center h-[70vh] bg-white rounded max-w-[80vw]">
				{activeAccounts.length > 0 && tabs[currentTab - 1].component}
			</div>
		</>
	);
}
