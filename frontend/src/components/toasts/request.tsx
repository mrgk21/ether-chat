interface RequestProps {
	peerId: string;
	handleAccept: (_event: React.MouseEvent<HTMLButtonElement>) => void;
	handleDeny: (_event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Request = ({ peerId, handleAccept, handleDeny }: RequestProps) => {
	return (
		<div>
			<h1 className="font-semibold text-xl">{peerId} wants to chat..</h1>
			<div className="flex space-x-2">
				<button type="button" onClick={handleAccept}>
					Accept
				</button>
				<button type="button" onClick={handleDeny}>
					Deny
				</button>
			</div>
		</div>
	);
};

export default Request;
