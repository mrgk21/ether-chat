import { io, Socket } from "socket.io-client";

export class SocketService {
	socket: Socket;
	emit: typeof this.socket.emit;
	on: typeof this.socket.on;

	constructor(namespace: string, token: string) {
		this.socket = io(`http://localhost:5000/${namespace}`, {
			extraHeaders: {
				Authentication: `Bearer ${token}`,
			},
		});
		this.emit = this.socket.emit;
		this.on = this.socket.on;
	}
}
