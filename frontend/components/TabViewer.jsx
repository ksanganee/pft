import { useEffect, useState } from "react";
import TransactionsList from "./TransactionsList";
import AccountsDropdown from "./AccountsDropdown";

export default function TabViewer(props) {
	const [tab, setTab] = useState(1);
	const [activeAccounts, setActiveAccounts] = useState([]);

	return (
		<>
			<div className="flex text-gray-500 justify-center">
				<div className="mr-2">
					<div
						onClick={() => setTab(1)}
						className={`${
							tab == 1
								? "text-[#fb923c] border-[#fb923c]"
								: "border-transparent hover:border-gray-300"
						} inline-flex p-4 rounded-t-lg border-b-2 cursor-pointer`}
					>
						Transactions
					</div>
				</div>
				<div className="mr-2">
					<div
						onClick={() => setTab(2)}
						className={`${
							tab == 2
								? "text-[#fb923c] border-[#fb923c]"
								: "border-transparent hover:border-gray-300"
						} inline-flex p-4 rounded-t-lg border-b-2 cursor-pointer `}
					>
						Budgets
					</div>
				</div>
				<div className="mr-2">
					<div
						onClick={() => setTab(3)}
						className={`${
							tab == 3
								? "text-[#fb923c] border-[#fb923c]"
								: "border-transparent hover:border-gray-300"
						} transition duration-200 ease-in-out inline-flex p-4 rounded-t-lg border-b-2 cursor-pointer `}
					>
						Investments
					</div>
				</div>
				<div className="mr-2">
					<AccountsDropdown
						userModel={props.userModel}
						activeAccounts={activeAccounts}
						setActiveAccounts={setActiveAccounts}
					/>
				</div>
			</div>
			<div className="mt-6 mb-3 flex justify-center h-[70vh] overflow-auto bg-white rounded shadow-ring max-w-[70vw]">
				{tab === 1 && (
					<TransactionsList
						userModel={props.userModel}
						activeAccounts={activeAccounts}
					/>
				)}
				{tab === 2 && <div>Tab 2</div>}
				{tab === 3 && <div>Tab 3</div>}
			</div>
			{/* </div> */}
		</>
	);
}
