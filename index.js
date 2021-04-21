let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/chat.html");
});

io.on("connection", function (socket) {
  console.log("un usuario se ha conectado");

  let username;

  socket.on("createUser", function (data) {
    username = data;
  });

  socket.on("mjsNuevo", function (data) {
    socket.emit("mensaje", {
      usuario: username,
      mensaje: data,
    });
  });
});

http.listen(3000, function () {
  console.log("server on port 3000");
});
