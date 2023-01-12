export default function VStack(props) {
	return (
		<div className="flex-col text-center space-y-2">
			{Array.isArray(props.children) ? (
				props.children.map((child, i) => {
					return <div key={i}>{child}</div>;
				})
			) : (
				<div>{props.children}</div>
			)}
		</div>
	);
}
