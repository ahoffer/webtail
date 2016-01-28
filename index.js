//Configuration
var port = 8080;
var fname = '/tmp/prbs/last.log';

//Includes
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

// The fs library does not keep reading the file once the
// file descriptor is created; as soon as createReadStream
// is called, subsequent write to the file do not become
// part of the read stream.
//var fs = require("fs");

// The tailing-stream library would not continue streaming
// when... I forget, but I remember I didn't like the behavior
//var ts = require("tailing-stream")

// The always-tail2 two is the most robust libarary, but it never
// sends a close or end event because it expects the log file will
// start writing over itself when it gets full. That means I cannot
// catch an event to tell a user the build process is complete.
var Tail = require('always-tail2')

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
    socket.emit('line', line);
  });

  //Some streaming libraries throw the 'end' event.
  //TODO: Enhance always-tail2 to throw close or end event.
  readStream.on('end', function() {
    socket.emit('end');
  });

});

//Start Web server
http.listen(port, function(){
  console.log('listening on *:' + port);
});
