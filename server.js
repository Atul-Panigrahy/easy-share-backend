const express = require("express");
const app = express();
const routes = require("./routes/router.js");
const path = require("path");

const connectDB = require("./config/db");
connectDB();

// Template Engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//Router
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
