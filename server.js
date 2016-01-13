const _ = require('lodash');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                 .listen(port, function () {
                    console.log('Listening on port ' + port + '.');
                  });
const io = socketIo(server);

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var votes = {};

// function countVotes(votes) {
//   var voteCount = {
//       A: 0,
//       B: 0,
//       C: 0,
//       D: 0
//   };
//
//   for (var vote in votes) {
//     voteCount[votes[vote]]++;
//   }
//
//   return voteCount;
// }

function countVotes(votes) {
  var pairs = _.toPairs(votes);
  var values = pairs.map( function(obj) { return obj[1]; } );
  var voteCount = _.countBy(values, _.identity);
  //_.chain might work even better
  return voteCount;
}

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected to Ask The Audience.');
  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;

      socket.emit('voteCount', countVotes(votes), message);
      console.log('countVotes:', countVotes(votes));
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    console.log(countVotes());
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

module.exports = server;
