import express from "express";
import _ from "lodash";
import { createServer } from "node:http";
import { Server } from "socket.io";
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
const peers: Array<SocketId> = [];

io.of("user").on("connection", (socket) => {
	peers.push(socket.id);
	console.log("connected: ", socket.id);

	socket.broadcast.emit("sample", socket.listenerCount);

	socket.on("join-peer", (arg, cb) => {
		const selfId = socket.id;
		const availablePeers = [...peers];

		let existingPeers: any = peers.map((peerId) =>
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

		// check if peers are available
		const peerId = availablePeers[_.random(availablePeers.length)];

		console.log({ peers, availablePeers, selfId, peerId });

		const room: Room = { id: uuiv4(), peers: [selfId, peerId] };
		rooms.push(room);
		socket.join(peerId);
		cb({ ack: true, payload: { message: `joined with ${peerId}`, data: { peerId } } });
	});

	socket.on("message", (arg, cb) => {
		console.log(arg);
		cb({ ack: true, payload: { message: "server: hello from server" } });
	});

	socket.on("sampleData", (data: any) => console.log(data));
});

io.listen(5000);
