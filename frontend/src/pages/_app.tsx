import type { AppProps } from "next/app";
import Init from "../components/init";
import Navbar from "../components/navbar";
import "../global.css";

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<Init>
			<Navbar />
			<Component {...pageProps} />
		</Init>
	);
};

export default App;
