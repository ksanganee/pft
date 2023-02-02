import Image from "next/image";

export default function CategoryBar({ transaction, account, ...props }) {
	if (!transaction || !account) return null;

	const uglyDate = new Date(transaction.date);
	const niceDate = `${uglyDate.getDate()}/${uglyDate.getMonth() + 1}`;

	const name = transaction.merchant_name || transaction.name;

	return (
		<div className="overflow-auto text-gray-600">
			<div
				className={`bg-gray-100 hover:bg-gray-200 rounded-md p-2 flex justify-between items-center`}
			>
				<div className="flex items-center">
					<div className="w-[55px] text-center pr-2">{niceDate}</div>
					<div className="mr-3">{name}</div>
					<div className="text-gray-400">{transaction.category}</div>
				</div>
				<div className="flex items-center">
					{transaction.amount < 0 ? `+` : `-`}££
					{Math.abs(transaction.amount)}
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
