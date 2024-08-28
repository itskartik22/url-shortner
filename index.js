const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const urlRoutes = require("./routes/urlRoutes");
const { redirectToOriginalUrl } = require("./controllers/urlControllers");
const app = express();
dotenv.config({
  path: "./config.env",
});

mongoose
  .connect(
    process.env.MONGODB_URL.replace("<PASSWORD>", process.env.MONGODB_PASSWORD),
    {
      dbName: process.env.MONGODB_DBNAME,
    }
  )
  .then((val) => {
    console.log("Server connected to Database.");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cors());

app.use("/url", urlRoutes);
app.use("/:shortId", redirectToOriginalUrl);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Listening at port 8000.....");
});
