import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 5000;

const httpServer = createServer(app);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Api is working",
  });
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const roomParticipants = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", ({ currentUserName, roomId }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = currentUserName;

    if (!roomParticipants[roomId]) {
      roomParticipants[roomId] = [];
    }

    roomParticipants[roomId].push({
      socketId: socket.id,
      username: currentUserName,
    });
    socket.to(roomId).emit("new-user-join", {
      currentUserName,
      roomId,
    });
    io.to(roomId).emit("participants-updated", roomParticipants[roomId]);
  });

  socket.on("leave-room", ({ roomId, currentUserName }) => {
    socket.leave(roomId);

    if (roomParticipants[roomId]) {
      roomParticipants[roomId] = roomParticipants[roomId].filter(
        (p) => p.socketId !== socket.id
      );

      socket.to(roomId).emit("user-left", { username: currentUserName });

      io.to(roomId).emit("participants-updated", roomParticipants[roomId]);

      if (roomParticipants[roomId].length === 0) {
        delete roomParticipants[roomId];
      }
    }
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", { code });
  });

  socket.on("typing", ({ roomId, username }) => {
    socket.to(roomId).emit("user-typing", { username });
  });

  socket.on("stop-typing", ({ roomId }) => {
    socket.to(roomId).emit("user-stop-typing");
  });

  socket.on("output-changed", ({ roomId, output }) => {
    socket.to(roomId).emit("output-updated", { output });
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    const username = socket.username;

    if (roomId && roomParticipants[roomId]) {
      roomParticipants[roomId] = roomParticipants[roomId].filter(
        (p) => p.socketId !== socket.id
      );

      socket.to(roomId).emit("user-left", {
        username,
      });

      io.to(roomId).emit("participants-updated", roomParticipants[roomId]);

      if (roomParticipants[roomId].length === 0) {
        delete roomParticipants[roomId];
      }
    }

    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend is working on port ${PORT}`);
});
