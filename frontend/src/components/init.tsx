import { useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import { configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { SocketContext } from "../global.context";

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
	const [socket, setSocket] = useState<Socket | null>(null);
	const socketObj = useMemo(() => ({ socket, setSocket }), [socket]);

	return (
		<SocketContext.Provider value={socketObj}>
			<WagmiConfig client={client}>
				<div className="flex flex-col h-screen">{children}</div>
			</WagmiConfig>
		</SocketContext.Provider>
	);
};

export default Init;
