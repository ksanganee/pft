import { useCallback, useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";

export default function BudgetCalculator({
	router,
	userModel,
	activeAccounts,
	...props
}) {
	const [income, setIncome] = useState(1000);

	return (
		<div className="flex-col space-y-2 overflow-auto">
			<div className="mt-5">
				<input
					type="number"
					id="floating_standard"
					className="bg-gray-50 text-gray-500 rounded pl-[13px] text-center outline-none p-1 peer focus:ring-[#fb923c] focus:ring-2 focus:ring-opacity-50 focus:text-gray-700"
					value={income}
					onChange={(e) => {
						setIncome(e.target.value);
					}}
				/>
				<label
					htmlFor="floating_standard"
					className="absolute text-sm text-gray-500 -translate-y-6 -translate-x-[195px] peer-focus:text-gray-700"
				>
					Monthly income
				</label>
			</div>
			<div className="flex-col space-y-2 pt-8">
				<div>
					50% allocated to your needs: £{Math.round(income * 0.5)}
				</div>
				<div>
					30% allocated to your wants: £{Math.round(income * 0.3)}
				</div>
				<div>
					20% allocated to your savings: £{Math.round(income * 0.2)}
				</div>
			</div>
		</div>
	);
}
