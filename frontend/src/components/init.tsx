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
	return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default Init;
