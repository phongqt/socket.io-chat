var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [],
  sequence = 1,
  sockets = [];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

function getUserLoggin(data) {
  let otherClients = [];
  otherClients = clients.filter(function (item) {
    if (item === data) {
      return false;
    }
    return true;
  }).map(function (item) {
    return item;
  })

  return otherClients;
}

function handleListUserLogin() {
  otherClients = [];
  clients.forEach(function (item) {
    otherClients = getUserLoggin(item);
    let indx = clients.indexOf(item);
    sockets[indx].emit('userlist', otherClients);
  }, this);
}

io.on('connection', function (socket) {
  //new user
  socket.on('new user', function (data, callback) {
    if (clients.indexOf(data) === -1) {
      let indx = clients.push(data) - 1;
      sockets[indx] = socket;
      socket.nickname = data;
    }

    handleListUserLogin();
    // io.emit('userlist', otherClients);
    callback(true);
  })

  // socket.emit('chat message', 'welcom to my app! ahihi');
  socket.on('chat message', function (msg) {
    // socket.broadcast.emit('hi');
    io.emit('chat message', {
      from: socket.nickname,
      message: msg
    });

  });

  socket.on('disconnect', function () {
    var index = sockets.indexOf(socket);
    if (index != -1) {
      delete sockets[index];
      delete clients[index];
      handleListUserLogin();
      io.sockets.emit('user disconnect', index);
    }
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});