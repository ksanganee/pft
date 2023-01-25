import BalancesWidget from "./BalancesWidget";
import BudgetCalculator from "./BudgetCalculator";
import BudgetGraph from "./BudgetGraph";

export default function BudgetsSection(props) {
	return (
		<>
			{/* <BalancesWidget userModel={props.userModel} activeAccounts={props.activeAccounts} /> */}
			<BudgetGraph
				userModel={props.userModel}
				activeAccounts={props.activeAccounts}
			/>
			{/* <BudgetsCalculator userModel={props.userModel} activeAccounts={props.activeAccounts} /> */}
		</>
	);
}
