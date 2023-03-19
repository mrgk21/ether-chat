import * as _ from "lodash";
import Image from "next/image";
import { useState } from "react";
import ChatBox from "../components/chatBox";

const Home = () => {
	const [chats, setChats] = useState<Array<number>>([1]);

	const handleMoreChats = () => {
		const tempChats = [...chats];
		const max = _.max(chats);
		if (!max) return;
		tempChats.push(max + 1);
		console.log(tempChats);

		setChats(tempChats);
	};

	const deleteChats = (id: number) => {
		const tempChats = _.filter(chats, (item) => item !== id);
		setChats(tempChats);
	};

	return (
		<div>
			{chats.length > 0 && (
				<div className="grid grid-cols-2 h-[93vh] auto-rows-fr">
					{chats.map((id, index) => (
						<ChatBox
							id={id}
							index={index}
							size={chats.length}
							key={id}
							addChat={handleMoreChats}
							removeChat={deleteChats}
						/>
					))}
				</div>
			)}
			{chats.length === 0 && (
				<div className="flex flex-col items-center h-[93vh] justify-center">
					<h1 className="text-2xl font-semibold">Some things are just bound to happen</h1>
					<Image className="rounded-md" alt="oh no!" src="/beluga.png" height={600} width={600} />
					<button
						type="button"
						className="dark:border-black border-2 p-2 m-2 rounded-md"
						onClick={() => setChats([1])}
					>
						Click here to go away!
					</button>
				</div>
			)}
		</div>
	);
};

export default Home;
