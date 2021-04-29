let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
var mysql = require("mysql");

var conn = mysql.createConnection({
  host: "localhost",
  database: "chat_progra",
  user: "root",
});

conn.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("Conexión exitosa!");
  }
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/chat.html");
});

io.on("connection", function (socket) {
  console.log("un usuario se ha conectado");

  let username;

  socket.on("createUser", function (data) {
    username = data;
    conn.query(
      'INSERT INTO usuarios(nombre_usuario, fecha) VALUES ("' +
        username +
        '", CURDATE())'
    );
  });

  socket.on("mjsNuevo", function (data) {
    socket.broadcast.emit("mensaje", {
      usuario: username,
      mensaje: data,
    });
    socket.emit("mensaje", {
      usuario: username,
      mensaje: data,
    });
  });
});

http.listen(3000, function () {
  console.log("server on port 3000");
});
