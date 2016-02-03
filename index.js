//Configuration
var streamingServer = require('./streamingServer');
start(streamingServer, 8080);

function start(server, port) {
  server.listen(port, function () {
      console.log('listening on *:' + port);
  });
}
