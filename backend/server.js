const connect = require("./connectDB");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;
// use cors to allow cross origin resource sharing
app.use(cors());
//use express.json to parse incoming requests with JSON payloads
app.use(express.json());

//use app.listen to start the server on a specified port and connect to the server
app.listen(3000, () => {
  connect.connectToServer();
  console.log(`Server is running on port ${PORT}`);
});
 