export default function TransactionBar(props) {
	// props.transaction {
	//   account_id,
	//   amount,
	//   category,
	//   date,
	//   iso_currency_code,
	//   merchant_name,
	//   name,
	// }

	// props.account {
	//   account_id,
	//   name,
	//   institution,
	// }

	return (
		props.transaction &&
		props.account && (
			<div
				className={`${
					props.transaction.amount > 0 ? "bg-red-50" : "bg-green-50"
				} rounded-md p-2`}
			>
				£{Math.abs(props.transaction.amount)}{" "}
				{props.transaction.amount > 0 ? "to" : "from"}{" "}
				{props.transaction.merchant_name} in {props.account.name}{" "}
				{props.account.institution} on {props.transaction.date}
			</div>
		)
	);
}
