import * as _ from "lodash";
import { useContext, useEffect, useReducer, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ChatBox from "../components/chatBox";
import Request from "../components/toasts/request";
import { ChatResponse } from "../components/toasts/types";
import { SocketContext } from "../global.context";
import { SocketResponse } from "../types";

interface Chat {
	id: number;
	peerId: string;
}

enum ActionTypes {
	REQUEST = "REQUEST",
	NEW_CHAT = "NEW_CHAT",
}

interface Action {
	type: ActionTypes;
	payload: any;
}

const initState: { chats1: Chat[] } = { chats1: [] };

const reducer = (state: typeof initState, action: Action): typeof initState => {
	switch (action.type) {
		case "NEW_CHAT": {
			const tempChats = [...state.chats1];
			let max = _.max(tempChats.map((item) => item.id));
			if (!max) max = 1;
			tempChats.push({ id: max + 1, peerId: action.payload.peerId });
			return { ...state, chats1: tempChats };
		}
	}
	return state;
};

const Home = () => {
	const { socket } = useContext(SocketContext);
	const [chats, setChats] = useState<Array<Chat>>([]);
	const [{ chats1 }, dispatch] = useReducer(reducer, initState);

	useEffect(() => {
		if (!socket) return;
		socket.on("connect", () => {
			console.log("socket connected!");
			dispatch({ type: ActionTypes.NEW_CHAT, payload: { peerId: socket?.id as string } });
		});
		socket?.on("chat-request", (response: { from: string }) => {
			toast(
				<Request
					peerId={response.from}
					handleAccept={() => handleNewChat(ChatResponse.ACCEPT, response.from)}
					handleDeny={() => handleNewChat(ChatResponse.DENY)}
				/>,
			);
		});
	}, [socket]);

	const handleNewChat = (res: ChatResponse, peerId = "") => {
		toast.dismiss();
		if (res === ChatResponse.DENY) return;

		socket?.emit("chat-accept", { from: peerId }, (response: { ack: boolean; payload: { from: string } }) => {
			if (!response.ack) return;
			dispatch({ type: ActionTypes.NEW_CHAT, payload: { peerId } });
		});
	};

	const requestChat = () => {
		socket?.emit("search-peer", null, (response: SocketResponse) => {
			if (!response.ack) {
				toast.error(response.error?.message as string);
				return;
			}
			toast(response.payload?.message as string);
		});
	};

	const deleteChats = (id: number) => {
		const tempChats = _.filter(chats, (item) => item.id !== id);
		setChats(tempChats);
	};

	return (
		<div>
			{chats1.length > 0 && (
				<div className="grid grid-cols-2 h-[93vh] auto-rows-fr">
					{chats1.map((chat, index) => (
						<ChatBox
							id={chat.id}
							peerId={chat.peerId}
							index={index}
							size={chats1.length}
							key={chat.id}
							addChat={requestChat}
							removeChat={deleteChats}
						/>
					))}
				</div>
			)}
			{/* {chats.length === 0 && (
				<div className="flex flex-col items-center h-[93vh] justify-center">
					<h1 className="text-2xl font-semibold">Some things are just bound to happen</h1>
					<Image className="rounded-md" alt="oh no!" src="/beluga.png" height={600} width={600} />
					<button
						type="button"
						className="dark:border-black border-2 p-2 m-2 rounded-md"
						onClick={() => setChats([{ id: 1, peerId: "" }])}
					>
						Click here to go away!
					</button>
				</div>
			)} */}
			<Toaster position="top-center" reverseOrder={false} />
		</div>
	);
};

export default Home;
