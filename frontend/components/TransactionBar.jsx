import { useState } from "react";

export default function TransactionBar(props) {
	// account_id: transaction.account_id,
	// amount: transaction.amount,
	// category: transaction.category[0],
	// date: transaction.date,
	// iso_currency_code: transaction.iso_currency_code,
	// merchant_name: transaction.merchant_name,
	// name: transaction.name,

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
