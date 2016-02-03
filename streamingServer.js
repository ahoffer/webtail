//Includes
var http = require('http')
var stream = require('stream')
var LineStream = require('byline').LineStream;
var stripBomStream = require('strip-bom-stream');
var tailStream = require('jimbly-tail-stream');

module.exports = http.createServer(function (req, res) {

    //Sluurp the file path and name from the requested URL
    var fname = req.url;
    console.error("GET " + fname);

    //Tell the browser to expect an HTML document
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    var fileStream = tailStream.createReadStream(fname);
    fileStream.on('error', function(err) {console.error(err);
      res.end('<h1>Cannot read ' + fname + '</h1>');
    })

    //FYI. Some read sreams leave in the byte order marks (BOMs).
    //Use a filter to strip them out.
    fileStream.pipe(stripBomStream()).pipe(res);

    //Clean up
    res.on('end', function () {
        fileStream.close();
    });
});
