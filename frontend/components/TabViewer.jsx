import { useState } from "react";
import TransactionsList from "./TransactionsList";

export default function TabViewer() {
	const [tab, setTab] = useState(1);

	return (
		<>
			<div className="flex flex-wrap text-gray-500">
				<div className="mr-2">
					<div
						onClick={() => setTab(1)}
						className={`${
							tab == 1
								? "text-[#fb923c] border-[#fb923c]"
								: "border-transparent hover:border-gray-300"
						} transition duration-200 ease-in-out inline-flex p-4 rounded-t-lg border-b-2 cursor-pointer `}
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
						} transition duration-200 ease-in-out inline-flex p-4 rounded-t-lg border-b-2 cursor-pointer `}
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
					<div
						onClick={() => setTab(4)}
						className={`${
							tab == 4
								? "text-[#fb923c] border-[#fb923c]"
								: "border-transparent hover:border-gray-300"
						} transition duration-200 ease-in-out inline-flex p-4 rounded-t-lg border-b-2 cursor-pointer `}
					>
						Accounts
					</div>
				</div>
			</div>
			<div id="" className="h-96 mt-6">
				{tab === 1 && <TransactionsList />}
				{tab === 2 && <div>Tab 2</div>}
				{tab === 3 && <div>Tab 3</div>}
				{tab === 4 && <div>Tab 4</div>}
			</div>
		</>

		// <>
		// 	<div className="flex justify-evenly mb-1">
		// 		<div onClick={() => setTab(1)}>Tab 1</div>
		// 		<div onClick={() => setTab(2)}>Tab 2</div>
		// 		<div onClick={() => setTab(3)}>Tab 3</div>
		// 	</div>
		// 	<hr className="w-80"/>
		// 	<div className="mt-1">
		// 		{tab === 1 && <div>Tab 1</div>}
		// 		{tab === 2 && <div>Tab 2</div>}
		// 		{tab === 3 && <div>Tab 3</div>}
		// 	</div>
		// </>
	);
}
