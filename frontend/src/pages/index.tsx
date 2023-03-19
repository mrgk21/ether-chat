import * as _ from "lodash";
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
		<div className="grid grid-cols-2 h-[92vh] auto-rows-fr">
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
	);
};

export default Home;
