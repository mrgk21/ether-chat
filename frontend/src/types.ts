export interface SocketResponse {
	ack: boolean;
	payload?: { message: string; [k: string]: any };
	error?: { message: string; [k: string]: any };
}
