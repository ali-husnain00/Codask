import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http";
import message from "./models/message.js";
import router from "./routes/routes.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

dotenv.config();
connectDB();
app.use(
  cors({
    origin: "https://codask.netlify.app/",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(router)

const activeUsers = {};

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ id, user }) => {
    socket.join(id);
    socket.projectId = id;
    socket.userId = user._id;

    if (!activeUsers[id]) {
      activeUsers[id] = [];
    }

    const isAlreadyActive = activeUsers[id].some((u) => u.id == user._id);

    if (!isAlreadyActive) {
      if (!isAlreadyActive) {
        activeUsers[id].push({ id: user._id, username: user.username });
      }
    }

    io.to(id).emit("activeUserUpdate", activeUsers[id]);

    socket.to(id).emit("userJoined", user);
  });

socket.on("typing", ({projectId, user}) => {
  socket.to(projectId).emit("userTyping", user);
});


  socket.on("codeChange", (data) => {
    const { projectId, fileId, content, senderId } = data;
    socket.to(projectId).emit("codeUpdate", data);
  });

  socket.on("sentMessage", async (data) => {
    const { projectId, sender, content } = data;

    if (!projectId || !sender || !content) {
      console.error("Missing required fields in socket message");
      return;
    }

    try {
      const savedMessage = await message.create({
        projectId,
        sender,
        content,
      });

      const fullMessage = await savedMessage.populate("sender", "username");

      io.to(projectId).emit("receiveMessage", fullMessage);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  });

  socket.on("disconnect", () => {
    const { projectId, userId } = socket;
    if (projectId && activeUsers[projectId]) {
      activeUsers[projectId] = activeUsers[projectId].filter(
        (u) => u.id !== userId
      );
      io.to(projectId).emit("activeUserUpdate", activeUsers[projectId]);
    }
  });
});

app.get("/", (req, res) => {
  res.send("App is working");
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
