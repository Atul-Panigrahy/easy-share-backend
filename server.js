const express = require("express");
const app = express();
const routes = require("./routes/router.js");

const connectDB = require("./config/db");
connectDB();

app.use("/api/files", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
