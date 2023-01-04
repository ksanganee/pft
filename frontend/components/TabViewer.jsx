import { useState } from "react";
import AccountsDropdown from "./AccountsDropdown";
import TransactionsList from "./TransactionsList";
import CategoriesChart from "./CategoriesChart";
import LoadingIndicator from "./LoadingIndicator";

export default function TabViewer(props) {
	const [currentTab, setCurrentTab] = useState(4);
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
			component: <div>Tab 3</div>,
		},
		{
			name: "Investments",
			component: <div>Tab 4</div>,
		},
	];

	return (
		<>
			<div className="flex text-gray-500 justify-center">
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
			<div className="mt-8 flex justify-center h-[70vh] bg-white rounded max-w-[70vw]">
				{tabs[currentTab - 1].component}
			</div>
		</>
	);
}

{
	/* <>
	{tab === 1 && (
		<TransactionsList
			userModel={props.userModel}
			activeAccounts={activeAccounts}
		/>
	)}
	{tab === 2 && (
		<CategoriesChart
			userModel={props.userModel}
			activeAccounts={activeAccounts}
		/>
	)}
	{tab === 3 && <div>Tab 3</div>}
	{tab === 4 && <div>Tab 4</div>} */
}
{
	/* </> */
}
