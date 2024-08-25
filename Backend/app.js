require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./connection");
const cookieParser = require("cookie-parser");
const compression = require('compression');
const cluster = require('node:cluster');
const os = require('os');
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const topicRouter = require("./routes/topic");
const adminRouter = require("./routes/admin");
const commentRouter = require("./routes/comment");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

} else {
  connectMongoDB(process.env.MONGO_URL).then((e) =>
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

  app.use("/user", userRouter);
  app.use(checkForAuthenticationCookie("token"));
  app.use("/blog", blogRouter);
  app.use("/topic", topicRouter);
  app.use("/admin", adminRouter);
  app.use("/comment", commentRouter);

  app.listen(PORT, () => console.log(`Worker ${process.pid} started and listening on port ${PORT}`));
}
