import Image from "next/image";

export default function TransactionBar({ transaction, account, ...props }) {
	if (!transaction || !account) return null;
	return (
		<div className="group overflow-auto text-gray-600">
			<div
				className={`${
					transaction.amount > 0
						? "bg-red-50 hover:bg-red-100"
						: "bg-green-50 hover:bg-green-100"
				} rounded-md p-2 flex justify-between items-center`}
			>
				{transaction.merchant_name ? (
					<div className="pl-2">{transaction.merchant_name} </div>
				) : (
					<div className="pl-2">{transaction.name}</div>
				)}
				<div className="flex">
					<div className="flex-col text-xs text-right">
						<div>
							{transaction.amount < 0 ? `+` : `-`}£
							{Math.abs(transaction.amount)}
						</div>
						<div className="text-gray-400">
							{transaction.category}
						</div>
					</div>
					<Image
						src={`/${account.institution.toLowerCase()}.png`}
						width={30}
						height={20}
						alt={account.institution}
						className="ml-2 shadow-sm rounded"
					/>
				</div>
			</div>
		</div>
	);
}
