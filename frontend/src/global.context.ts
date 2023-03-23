import { createContext } from "react";
import { Socket } from "socket.io-client";

interface SocketType {
	socket: Socket | null;
	setSocket: (k: Socket) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const SocketContext = createContext<SocketType>({ socket: null, setSocket: () => {} });
