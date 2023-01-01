const express = require("express");
const app = express();
const routes = require("./routes/router.js");
const path = require("path");
const cors = require("cors");
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

app.use(express.static("public"));
app.use(express.json());

const connectDB = require("./config/db");
connectDB();

// Template Engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

let corsOptions = {
  origin: ["http://127.0.0.1:5500", "https://easy-share-atul.netlify.app"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//Router
app.use("/", routes);

io.on("connection", (socket) => {
  console.log("A new user joined");
  // console.log(socket);
  socket.on("sender-join", (data) => {
    // console.log(data);
    socket.join(data.uid);
  });
  socket.on("receiver-join", (data) => {
    socket.join(data.uid);
    socket.in(data.sender_uid).emit("init", data.uid);
  });
  socket.on("file-meta", (data) => {
    socket.in(data.uid).emit("fs-meta", data.metadata);
  });

  socket.on("fs-start", (data) => {
    socket.in(data.uid).emit("fs-share", {});
  });

  socket.on("file-raw", (data) => {
    socket.in(data.uid).emit("fs-share", data.buffer);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
