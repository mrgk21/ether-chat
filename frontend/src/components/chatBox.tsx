import { useContext, useEffect, useReducer, useState } from "react";
import { SocketContext } from "../global.context";
import MessageBox from "./messageBox";

interface ChatBoxProps {
	peerDetails: {
		peerId: string;
		roomId: string;
	};
	id: number;
	index: number;
	size: number;
	addChat: () => void;
	removeChat: (index: number) => void;
}

interface Messages {
	content: string;
	sender: "self" | "other";
}

enum ActionTypes {
	NEW_MESSAGE = "NEW_MESSAGE",
	DELETE_MESSAGE = "DELETE_MESSAGE",
}

interface Action {
	type: ActionTypes;
	payload: any;
}

const initState: { messages: Messages[] } = { messages: [] };

const reducer = (state: typeof initState, action: Action): typeof initState => {
	switch (action.type) {
		case "NEW_MESSAGE": {
			const tempMsgs = [...state.messages];
			tempMsgs.push({ content: action.payload.msg, sender: action.payload.sender });
			return { ...state, messages: tempMsgs };
		}
		case "DELETE_MESSAGE": {
			const tempMsgs = [...state.messages];
			tempMsgs.pop();
			return { ...state, messages: tempMsgs };
		}
	}
	return state;
};

const ChatBox = ({ id, index, size, peerDetails: { peerId, roomId }, addChat, removeChat }: ChatBoxProps) => {
	const { socket } = useContext(SocketContext);

	const [msg, setMsg] = useState("");
	const [{ messages }, dispatch] = useReducer(reducer, initState);

	useEffect(() => {
		if (!socket) return;
		socket.on("connect", () => {
			return;
		});
		socket?.on("message", (response: { ack: boolean; payload: { content: string } }) => {
			if (!response) return;
			const {
				ack,
				payload: { content },
			} = response;
			if (!ack) return;
			console.log("inside on message");

			if (id === 0) return;
			dispatch({ type: ActionTypes.NEW_MESSAGE, payload: { msg: content, sender: "other" } });
		});
	}, [socket]);

	const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (msg.length === 0) return;
		if (e.key == "Enter") {
			// exception for self chatting
			if (id === 0) {
				dispatch({ type: ActionTypes.NEW_MESSAGE, payload: { msg, sender: "self" } });
				return;
			}

			// optimistic updates
			dispatch({ type: ActionTypes.NEW_MESSAGE, payload: { msg, sender: "self" } });
			socket?.emit("message", { content: msg, roomId }, (response: { ack: boolean; payload: object }) => {
				console.log(roomId);
				if (!response || !response.ack) dispatch({ type: ActionTypes.DELETE_MESSAGE, payload: {} });
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
				<p className="pl-2 font-mono text-sm">Connected to: {roomId}</p>
				<div className="flex-grow p-2 m-1 dark:bg-slate-300 dark:border-gray-400 border-[1px] rounded-md overflow-scroll ">
					{messages.length > 0
						? messages.map((item) => <MessageBox text={item.content} sender={item.sender} />)
						: null}
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
