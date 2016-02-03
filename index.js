//Configuration
var streamingServer = require('./streamingServer')
var webSocketServer = require('./webSocketServer')
start(streamingServer, 9090, "streaming server")
start(webSocketServer, 8080, "web socket server")

//Helper method
function start(server, port, msg) {
  server.listen(port, function () {
      msg === undefined ? '' : msg
      console.log('listening on *:' + port + ' ' + msg);
  });
}
