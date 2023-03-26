import * as _ from "lodash";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ChatBox from "../components/chatBox";
import { ChatResponse } from "../components/toasts/types";
import { SocketContext } from "../global.context";
import { SocketResponse } from "../types";

interface Chat {
	id: number;
	peerId: string;
}

const Home = () => {
	const { socket } = useContext(SocketContext);
	const [chats, setChats] = useState<Array<Chat>>([]);

	console.log(chats);

	useEffect(() => {
		if (!socket) return;
		socket.on("connect", () => {
			console.log("socket connected!");

			setChats([{ id: 1, peerId: socket?.id as string }]);
		});
	}, [socket]);

	const handleNewChat = (res: ChatResponse, peerId = "") => {
		console.log(chats);

		// toast.dismiss();
		// if (res === ChatResponse.DENY) return;
		// const tempChats = [...chats];
		// const max = _.max(tempChats.map((item) => item.id));
		// console.log(max, tempChats);

		// socket?.emit("chat-accept", { from: peerId });

		// if (!max) return;

		// tempChats.push({ id: max + 1, peerId });
		// setChats(tempChats);
	};

	const requestChat = () => {
		socket?.emit("search-peer", null, (response: SocketResponse) => {
			if (!response.ack) {
				toast.error(response.error?.message as string);
				return;
			}
			toast(response.payload?.message as string);
		});

		// state not available here, due to a global call, possibly solve it with web workers
		// socket?.timeout(2000).on("chat-request", (response: { from: string }) => {
		// 	console.log(response); // show a pop up
		// 	toast(
		// 		<Request
		// 			peerId={response.from}
		// 			handleAccept={() => handleNewChat(ChatResponse.ACCEPT, response.from)}
		// 			handleDeny={() => handleNewChat(ChatResponse.DENY)}
		// 		/>,
		// 	);
		// });
	};

	const deleteChats = (id: number) => {
		const tempChats = _.filter(chats, (item) => item.id !== id);
		setChats(tempChats);
	};

	return (
		<div>
			{chats.length > 0 && (
				<div className="grid grid-cols-2 h-[93vh] auto-rows-fr">
					{chats.map((chat, index) => (
						<ChatBox
							id={chat.id}
							peerId={chat.peerId}
							index={index}
							size={chats.length}
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
