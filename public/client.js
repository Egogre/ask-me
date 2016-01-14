var socket = io();

var connectionCount = document.getElementById('connection-count');
var statusMessage = document.getElementById('status-message');
var voteTally = document.getElementById('vote-tally');
var userVote = document.getElementById('user-vote');
var buttons = document.querySelectorAll('#choices button');

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Total Connected Users: ' + count;
});

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
});

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    socket.send('voteCast', this.innerText);
  });
}

socket.on('voteCount', function (tally, message) {
  userVote.innerText = 'You voted for ' + message;
  voteTally.innerText = 'Vote Count: A: ' +
                        (tally.A || '0') +
                        ' B: ' +
                        (tally.B || '0') +
                        ' C: ' +
                        (tally.C || '0') +
                        ' D: ' +
                        (tally.D || '0');
});
