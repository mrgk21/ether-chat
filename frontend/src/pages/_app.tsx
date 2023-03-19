import type { AppProps } from "next/app";
import Init from "../components/init";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import "../global.css";

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<Init>
			<Navbar />
			<div className="flex">
				<Sidebar groups={null} chats={null} />
				<Component {...pageProps} />
			</div>
		</Init>
	);
};

export default App;
