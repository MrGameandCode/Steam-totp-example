var express = require("express");
var SteamTotp = require("steam-totp");
require("dotenv").config();
var app = express();
var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
var io = require("socket.io")(server);
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/totp.html");
});
io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
  socket.on("get code", function (msg) {
    console.log("generating new code...");
    console.log(process.env.SECRET);
    var temp_code = SteamTotp.generateAuthCode(process.env.SECRET);
    io.emit("code generated", temp_code);
    console.log(temp_code);
  });
});
