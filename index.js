//Configuration
var port = 8080;

//Includes
//var app = require('express')()
var http = require('http')
var fs = require('fs')
var stream = require('stream')
var util = require('util');
var process = require('process')
var byline = require('byline');
var LineStream = byline.LineStream;
var stripBomStream = require('strip-bom-stream');
var tail_stream = require('jimbly-tail-stream');


// The fs library does not keep reading the file once the
// file descriptor is created; as soon as createReadStream
// is called, subsequent write to the file do not become
// part of the read stream.
//var fs = require("fs");

// The tailing-stream library would not continue streaming
// when... I forget, but I remember I didn't like the behavior
//var ts = require("tailing-stream")

// The always-tail2 two is the most robust library, but it never
// sends a close or end event because it expects the log file will
// start writing over itself when it gets full. That means I cannot
// catch an event to tell a user the build process is complete.
var Tail = require('always-tail2');


var lister = new stream.Transform(this, {objectMode: true});
lister._transform = function (chunk, encoding, callback) {
    var input = chunk.toString();
    var output = '<li>' + input + '</li>';
    this.push(output);
    callback();
};

var liner = new LineStream();

var server = http.createServer(function (req, res) {

    //Sluurp the file path and name from the requested URL
    var fname = req.url;
    console.error("GET " + fname);

    //Tell the browser to expect an HTML document
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    //Write just enough HTML to display text as list items
    res.write("<style>li {list-style: none;} </style>\n<ul>\n");

    var stream = tail_stream.createReadStream(fname);
    //FYI. Some read sreams leave in the byte order marks (BOMs).
    //Use a filter to strip them out.
    stream.pipe(stripBomStream()).pipe(liner).pipe(lister).pipe(res);

    //Clean up
    res.on('end', function () {
        s.close();
    });

});

//Start Web server
server.listen(port, function () {
    console.log('listening on *:' + port);
});
