const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");//loging library
const mongoose = require("mongoose");
const router = require("./router");
const cors = require("cors");

mongoose.connect("mongodb://localhost:auth/auth");
const app = express();
app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json({
    type: "*/*"
}));
router(app);

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on:", port);