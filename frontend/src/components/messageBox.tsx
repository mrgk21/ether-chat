interface MessageBoxProps {
	text: string;
	sender: "self" | "other";
}

const MessageBox = ({ text, sender }: MessageBoxProps) => {
	if (sender == "self")
		return (
			<div className="dark:bg-slate-400 dark:border-gray-500 border-[1px] p-1 pl-2 pr-4 m-1 rounded-md w-fit">
				{`You: ${text}`}
			</div>
		);
	if (sender == "other")
		return (
			<div className="dark:bg-slate-400 dark:border-gray-500 border-[1px] p-1 m-1 rounded-md w-fit ml-auto">{`Stranger: ${text}`}</div>
		);
	else return null;
};

export default MessageBox;
