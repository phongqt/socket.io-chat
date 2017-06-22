
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [], sequence = 1;;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  //new user
  socket.on('new user', function (data, callback) {
    if (clients.indexOf(data) !== -1) { 
      callback(false);
    } else {
      socket.nickname = data;
      clients.push(data);
      console.log(clients);
      io.emit('userlist', clients);
      callback(true);
    }
  })

  socket.emit('chat message', 'welcom to my app! ahihi');
  socket.on('chat message', function (msg) {
    // socket.broadcast.emit('hi');
    io.emit('chat message', msg);

  });
  socket.on('disconnect', function () {
    var index = clients.indexOf(socket);
    if (index != -1) {
      clients.splice(index, 1);
      console.info('Client gone (id=' + socket.id + ').');
    }
  });
});

// setInterval(function() {
//     var randomClient;
//     if (clients.length > 0) {
//         randomClient = Math.floor(Math.random() * clients.length);
//         clients[randomClient].emit('chat message', sequence++);
//     }
// }, 1000);

http.listen(3000, function () {
  console.log('listening on *:3000');
});