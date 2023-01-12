export default function Centred(props) {
	return (
		<div className="flex justify-center items-center h-screen">
			{props.children}
		</div>
	);
}
