import express from "express";
import _ from "lodash";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { v4 as uuiv4 } from "uuid";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: ["http://localhost:3000"],
	},
});

type SocketId = string;

interface Room {
	id: string;
	peers: Array<SocketId>;
}

const rooms: Array<Room> = [];
const users: Map<string, Socket> = new Map();

io.of("user").on("connection", (socket) => {
	users.set(socket.id, socket);
	console.log("connected: ", socket.id);

	socket.on("disconnect", () => {
		users.delete(socket.id);
		_.remove(rooms, (item) => item.peers.includes(socket.id));
	});

	socket.broadcast.emit("sample", socket.listenerCount);

	// initiate room search
	socket.on("search-peer", async (arg, cb) => {
		try {
			const selfId = socket.id;
			const availablePeers = [...(await io.of("user").fetchSockets()).map((item) => item.id)];
			console.log({ availablePeers });
			// const x = await io.of("user").fetchSockets();
			// console.log(x.);

			let existingPeers: any = availablePeers.map((peerId) =>
				rooms.map((room) => {
					const equal = _.isEqual(_.sortBy([selfId, peerId]), _.sortBy(room.peers));
					if (equal) return peerId;
					return null;
				}),
			);
			existingPeers = _.compact(_.flattenDeep(existingPeers));
			_.remove(availablePeers, (item) => item === selfId);
			_.remove(availablePeers, (item) => (existingPeers as Array<string>).includes(item));

			if (availablePeers.length === 0) {
				cb({ ack: false, error: { message: "There is no one to talk to" } });
				return;
			}
			console.log({ availablePeers, rooms });
			const peerId = availablePeers[_.random(availablePeers.length - 1)];

			users.get(peerId)?.emit("chat-request", { from: selfId });

			cb({ ack: true, payload: { message: `Requested ${peerId}` } });
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("chat-accept", (arg) => {
		const room: Room = { id: uuiv4(), peers: [socket.id, arg.from] };
		rooms.push(room);
		socket.join(room.id);
	});

	// remove
	socket.on("message", (arg, cb) => {
		cb({ ack: true, payload: { message: "server: hello from server" } });
	});

	socket.on("sampleData", (data: any) => console.log(data));
});

io.listen(5000);
