const express = require("express");
const app = express();
const routes = require("./routes/router.js");
const path = require("path");
const cors = require("cors");

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
