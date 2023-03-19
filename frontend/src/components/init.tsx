import { configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

interface InitProps {
	children: React.ReactNode;
}

const { provider, webSocketProvider } = configureChains([mainnet], [publicProvider()]);
const client = createClient({
	autoConnect: true,
	provider,
	webSocketProvider,
});

const Init = ({ children }: InitProps) => {
	return (
		<WagmiConfig client={client}>
			<div className="flex flex-col h-screen">{children}</div>
		</WagmiConfig>
	);
};

export default Init;
