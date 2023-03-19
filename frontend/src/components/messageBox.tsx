interface MessageBoxProps {
	text: string;
}

const MessageBox = ({ text }: MessageBoxProps) => {
	return <div className="dark:bg-slate-400 dark:border-gray-500 border-[1px] p-1 m-1 rounded-md">{text}</div>;
};

export default MessageBox;
