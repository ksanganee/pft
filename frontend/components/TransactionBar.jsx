import Image from "next/image";

export default function TransactionBar(props) {
	return (
		<div className="group overflow-auto text-gray-600">
			<div
				className={`${
					props.transaction.amount > 0
						? "bg-red-50 hover:bg-red-100"
						: "bg-green-50 hover:bg-green-100"
				} rounded-md p-2 flex justify-between items-center`}
			>
				{props.transaction.merchant_name ? (
					<div className="pl-2">
						{props.transaction.merchant_name}{" "}
					</div>
				) : (
					<div className="pl-2">{props.transaction.name}</div>
				)}
				<div className="flex">
					<div className="flex-col text-xs text-right">
						<div>
							{props.transaction.amount < 0 ? `+` : `-`}£
							{Math.abs(props.transaction.amount)}
						</div>
						<div className="text-gray-400">
							{props.transaction.category}
						</div>
					</div>
					<Image
						src={`/${props.account.institution.toLowerCase()}.png`}
						width={30}
						height={20}
						alt={props.account.institution}
						className="ml-2 shadow-sm rounded"
					/>
				</div>
			</div>
		</div>
	);
}
