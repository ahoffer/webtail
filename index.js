var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
//var fs = require("fs");
var ts = require("tailing-stream")
var Tail = require('always-tail')

app.get('/', function(req, res) {
  res.sendFile('/tmp/prbs/last.log')
});

app.get('/tail', function(req,res) {
  res.sendFile(__dirname + '/index.html')
});

// ['close', 'end', 'error', 'readable'].forEach(function(event) {
//   readStream.on(event, function() {console.error(event.toUppoerCase())})
// });

var fname = '/tmp/prbs/last.log';

io.on('connection', function(socket) {
  console.error('CONNECTION')

  //Stream must be created inside the io.on scope
  readStream = ts.createReadStream(fname)
  readStream.on('data', function(chunk) {
    console.error(chunk.toString());
    socket.emit('data', chunk.toString('utf8'));
  });
});

var port = 8080;
http.listen(port, function(){
  console.log('listening on *:' + port);
});
