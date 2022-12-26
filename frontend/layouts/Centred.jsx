export default function Centred(props) {
	return (
		<div className="flex items-center justify-center h-screen">
			{props.children}
		</div>
	);
}
