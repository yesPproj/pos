const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes/routes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/", routes);

// MongoDB Atlas connection
const mongoURI =
  "mongodb+srv://admin:admin@cluster0.ka61xaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Could not connect to MongoDB Atlas", err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
