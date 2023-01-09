import Image from "next/image";

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

	const uglyDate = new Date(props.transaction.date);
	const date = `${uglyDate.getDate()}/${
		uglyDate.getMonth() + 1
	}/${uglyDate.getFullYear()}`;

	return (
		props.transaction &&
		props.account && (
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
					<div className="">{props.transaction.merchant_name}</div>
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
			</div>
		)
	);
}
