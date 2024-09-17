require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./connection");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const compression = require('compression');
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const topicRouter = require("./routes/topic");
const adminRouter = require("./routes/admin");
const commentRouter = require("./routes/comment");
const { Server } = require("socket.io");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const PORT = process.env.PORT || 8000;
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

connectMongoDB(process.env.MONGO_URL).then(() =>
  console.log("MongoDB Connected")
);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// 
app.use("/user", userRouter);
app.use(checkForAuthenticationCookie("token"));
app.use("/blog", blogRouter);
app.use("/topic", topicRouter);
app.use("/admin", adminRouter);
app.use("/comment", commentRouter);

httpServer.listen(PORT, () =>
  console.log(`Server started and listening on port ${PORT}`)
);
