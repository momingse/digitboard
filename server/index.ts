import express from "express";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { uuid } from "uuidv4";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

  app.get("/health", (req, res) => {
    res.send("Healthy!");
  });

  const rooms = new Map<string, Room>();
  const userToRoom = new Map<string, string>();

  const addMove = (roomId: string, socketId: string, move: Move) => {
    const room = rooms.get(roomId);

    if (!room?.users.has(socketId)) {
      room?.usersMoves.set(socketId, []);
    }

    room?.usersMoves.get(socketId)?.push(move);
  };

  const undoMove = (roomId: string, socketId: string) => {
    const room = rooms.get(roomId);

    room?.usersMoves.get(socketId)?.pop();
  };

  const leaveRoom = (roomId: string, socketId: string) => {
    const room = rooms.get(roomId);

    const userMoves = room?.usersMoves.get(socketId);

    room?.drawed.push(...(userMoves ?? []));
    room?.users.delete(socketId);

    userToRoom.delete(socketId);

    console.log(`User left room: ${socketId}`);
  };

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const getRoomId = () => {
      const roomId = userToRoom.get(socket.id);

      return (
        roomId ??
        [...socket.rooms].find((room) => room !== socket.id) ??
        socket.id
      );
    };

    socket.on("create_room", (username) => {
      let roomId: string;

      do {
        roomId = Math.random().toString(36).substring(2, 6);
      } while (rooms.has(roomId));

      socket.join(roomId);

      rooms.set(roomId, {
        users: new Map([[socket.id, username]]),
        usersMoves: new Map([[socket.id, []]]),
        drawed: [],
      });

      socket.emit("created", roomId);
    });

    socket.on("join_room", (roomId, username) => {
      console.log(`Request To join room: ${socket.id} => ${roomId}`);

      const room = rooms.get(roomId);
      if (room) {
        socket.join(roomId);

        userToRoom.set(socket.id, roomId);
        room.users.set(socket.id, username);
        room.usersMoves.set(socket.id, []);

        io.to(socket.id).emit("joined", roomId);
      } else {
        io.to(socket.id).emit("joined", roomId, true);
      }
    });

    socket.on("check_room", (roomId) => {
      if (rooms.has(roomId)) socket.emit("room_exists", true);
      else socket.emit("room_exists", false);
    });

    socket.on("joined_room", () => {
      const roomId = getRoomId();

      console.log(`Joined room: ${socket.id} => ${roomId}`);

      const room = rooms.get(roomId);
      if (!room) return;
      io.to(socket.id).emit(
        "room",
        room.drawed,
        JSON.stringify(Object.fromEntries(room.usersMoves ?? [])),
        JSON.stringify(Object.fromEntries(room.users ?? [])),
      );

      socket.broadcast
        .to(roomId)
        .emit("new_user", socket.id, room.users.get(socket.id) || "Anonymous");
    });

    socket.on("leave_room", () => {
      const roomId = getRoomId();
      leaveRoom(roomId, socket.id);

      io.to(roomId).emit("user_disconnect", socket.id);
    });

    socket.on("draw", (move) => {
      const roomId = getRoomId();

      const timestamp = Date.now();
      const updatedMove: Move = { ...move, timestamp, id: uuid() };
      addMove(roomId, socket.id, updatedMove);

      io.to(socket.id).emit("your_move", updatedMove);

      socket.broadcast.to(roomId).emit("user_draw", updatedMove, socket.id);
    });

    socket.on("undo", () => {
      const roomId = getRoomId();
      undoMove(roomId, socket.id);
      socket.broadcast.to(roomId).emit("user_undo", socket.id);
    });

    socket.on("send_msg", (msg) => {
      io.to(getRoomId()).emit("new_msg", socket.id, msg);
    });

    socket.on("mouse_move", (x, y) => {
      const roomId = getRoomId();
      socket.broadcast.to(roomId).emit("mouse_moved", x, y, socket.id);
    });

    socket.on("disconnect", () => {
      const roomId = getRoomId();
      leaveRoom(roomId, socket.id);

      io.to(roomId).emit("user_disconnect", socket.id);

      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  app.all("*", (req, res) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
