//Set name of the file to tail.
var fname = '/tmp/prbs/last.log';

//Includes
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var tailStream = require('file-tail');
var split = require('split');

module.exports = http;

//Register the tail endpoint
app.get('/', function(req,res) {
  var htmlFile = __dirname + '/index.html'
  console.log('Serving file ' + htmlFile)
  res.sendFile(htmlFile)
});

//Register the Websocket handler
io.on('connection', function(socket) {
  console.error('CONNECTION')

  //Stream must be created inside the io.on scope
  //var readStream = ts.createReadStream(fname)
  var readStream = tailStream.startTailing(fname);

  //Squirt a chunk of data to the client
  readStream.on('line', function(line) {
  //var line = split(data.toString());
  console.error(line);
  socket.emit('line', line);
  });

  // Some streaming libraries throw the 'end' event.
  readStream.on('end', function() {
    socket.emit('end');
  });
});
