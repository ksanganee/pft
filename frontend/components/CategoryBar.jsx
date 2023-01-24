import Image from "next/image";

export default function CategoryBar(props) {

	if (!props.transaction || !props.account) return null;

	const uglyDate = new Date(props.transaction.date);
	const niceDate = `${uglyDate.getDate()}/${uglyDate.getMonth() + 1}`;

	const name = props.transaction.merchant_name || props.transaction.name;

	return (
		<div className="overflow-auto text-gray-600">
			<div
				className={`bg-gray-100 hover:bg-gray-200 rounded-md p-2 flex justify-between items-center`}
			>
				<div className="flex items-center">
					<div className="w-[55px] text-center pr-2">{niceDate}</div>
					<div className="mr-3">{name}</div>
					<div className="text-gray-400">
						{props.transaction.category}
					</div>
				</div>
				<div className="flex items-center">
					{props.transaction.amount < 0 ? `+` : `-`}£
					{Math.abs(props.transaction.amount)}
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
