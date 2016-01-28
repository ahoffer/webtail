
var port = 8080;
var fname = '/tmp/prbs/last.log';


var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
//var fs = require("fs");
//var ts = require("tailing-stream")
var Tail = require('always-tail2')

app.get('/', function(req, res) {
  res.sendFile(fname)
});


app.get('/tail', function(req,res) {
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket) {
  console.error('CONNECTION')

  function makeLogLine(msg) {
    return socket.id + '-' + msg
  }

  //Stream must be created inside the io.on scope
  //var readStream = ts.createReadStream(fname)
  var readStream = new Tail(fname, '\n')

  // Log events to the console to figure out how this stuff works.
  // It's pedagogical!
  var events =  ['close', 'end', 'error', 'readable']
  events.forEach(function(event) {
    readStream.on(event, function() {
        console.error(makeLogLine(event.toUpperCase()))
      })
  });

  //Squirt a chunk of data to the client
  readStream.on('line', function(line) {
    //console.error(line);
    socket.emit('line', line);
  });

readStream.on('end', function() {
      socket.emit('end');
})

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
