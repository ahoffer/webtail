//Set name of the file to tail.
var fname = '/tmp/prbs/last.log';

//Includes
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var escape = require('escape-html');

module.exports = http;

//Root path serves up the whole file in a request.
app.get('/', function(req, res) {
  res.sendFile(fname)
});

//Register the tail endpoint
app.get('/tail', function(req,res) {
  res.sendFile(__dirname + '/index.html')
});

//Register the Websocket handler
io.on('connection', function(socket) {
  console.error('CONNECTION')

  //Stream must be created inside the io.on scope
  //var readStream = ts.createReadStream(fname)
  var readStream = new Tail(fname, '\n')

  //Squirt a chunk of data to the client
  readStream.on('line', function(line) {
    socket.emit('line', escape(line));
  });

  //Some streaming libraries throw the 'end' event.
  readStream.on('end', function() {
    socket.emit('end');
  });
});
