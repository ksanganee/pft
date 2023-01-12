import Image from "next/image";
import { useState } from "react";

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

	// const [hovered, setHovered] = useState(false);

	const uglyDate = new Date(props.transaction.date);
	const date = props.shortDate
		? `${uglyDate.getDate()}/${uglyDate.getMonth() + 1}`
		: `${uglyDate.getDate()}/${
				uglyDate.getMonth() + 1
		  }/${uglyDate.getFullYear()}`;

	return (
		props.transaction &&
		props.account && (
			<div className="group overflow-auto">
				<div
					className={`${
						props.colour
							? props.transaction.amount > 0
								? "bg-red-50 hover:bg-red-100"
								: "bg-green-50 hover:bg-green-100"
							: "bg-gray-100 hover:bg-gray-200"
					} rounded-md p-2 flex justify-between items-center`}
				>
					<div className="flex">
						£{Math.abs(props.transaction.amount)}
					</div>
					{props.transaction.merchant_name ? (
						<div className="">
							{props.transaction.merchant_name}
						</div>
					) : (
						<div className="">{props.transaction.name}</div>
					)}
					<div className="flex">
						{date}
						<Image
							src={`/${props.account.institution.toLowerCase()}.png`}
							width={20}
							height={20}
							alt={props.account.institution}
							className="ml-2 shadow-sm rounded"
						/>
					</div>
					{/* <div
						id="transaction_info"
						className="absolute p-2 min-w-max rounded bg-gray-100 scale-0 group-hover:scale-100 ml-[33%] text-left"
					>
						<strong>Account:</strong>
						<br />
						{`	Name: ${props.account.name}`}
						<br />
						{`	Institution: ${props.account.institution}`}
						<br />
						<br />
						<strong>Transaction:</strong>
						<br />
						{props.transaction.amount <= 0
							? `	Amount: £${Math.abs(props.transaction.amount)}`
							: `	Amount: -£${props.transaction.amount}`}
						<br />
						{`	Category: ${props.transaction.category}`}
						<br />
						{`	Date: ${props.transaction.date}`}
						<br />
						{`	Merchant name: ${props.transaction.merchant_name}`}
						<br />
						{`	Name: ${props.transaction.name}`}
					</div> */}
				</div>
			</div>
		)
	);
}
