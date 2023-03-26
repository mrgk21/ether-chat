import { useContext, useState } from "react";
import { SocketContext } from "../global.context";
import MessageBox from "./messageBox";

interface ChatBoxProps {
	id: number;
	index: number;
	size: number;
	peerId: string;
	addChat: () => void;
	removeChat: (index: number) => void;
}

const ChatBox = ({ id, index, size, peerId, addChat, removeChat }: ChatBoxProps) => {
	const { socket } = useContext(SocketContext);

	const [msg, setMsg] = useState("");
	const [chats, setChats] = useState<Array<string>>([]);

	const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (msg.length === 0) return;
		if (e.key == "Enter") {
			const tempChats = [...chats];
			tempChats.push(msg);
			setChats(tempChats);

			socket?.emit("message", msg, (response: { ack: boolean; payload: object }) => {
				console.log(response, socket);

				if (!response || !response.ack) {
					const tempChats = [...chats];
					tempChats.pop();
					setChats(tempChats);
				}
			});
			setMsg("");
		}
	};

	return (
		<div
			className={`dark:bg-slate-200 dark:border-gray-300 rounded-md ${
				size % 2 == 0 ? "" : index + 1 === size ? "col-span-2" : ""
			} p-2 m-2 border-[1px] flex flex-col`}
		>
			<div className="flex flex-col flex-grow h-full">
				<p className="pl-2 font-mono text-sm">Connected to: {peerId}</p>
				<div className="flex-grow p-2 m-1 dark:bg-slate-300 dark:border-gray-400 border-[1px] rounded-md overflow-scroll ">
					{chats.length > 0 ? chats.map((item) => <MessageBox text={item} />) : null}
				</div>
				<div className="flex flex-col-reverse max-h-fit">
					<div className="flex">
						<button
							type="button"
							className="rounded-md p-1 m-1 border-2 border-black hover:bg-slate-400"
							onClick={addChat}
						>
							New*
						</button>
						<button
							type="button"
							className="rounded-md p-1 m-1 border-2 border-black hover:bg-red-400"
							onClick={() => removeChat(id)}
						>
							Delete*
						</button>
						<input
							type="text"
							onKeyDownCapture={(e) => handleKey(e)}
							className="flex-grow rounded-md p-1 m-1"
							placeholder="send some text"
							value={msg}
							onChange={(e) => setMsg(e.target.value)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;
