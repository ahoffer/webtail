//Includes
var http = require('http')
var stream = require('stream')
var LineStream = require('byline').LineStream;
var stripBomStream = require('strip-bom-stream');
var tailStream = require('jimbly-tail-stream');

// The fs library does not keep reading the file once the
// file descriptor is created; as soon as createReadStream
// is called, subsequent write to the file do not become
// part of the read stream.
//var fs = require("fs");

// Create transform stream to turn each line in the file into
// HTML markup for a list item
var lister = new stream.Transform(this, {objectMode: true});
lister._transform = function (chunk, encoding, callback) {
    var input = chunk.toString();
    var output = '<li>' + input + '</li>';
    this.push(output);
    callback();
};

var liner = new LineStream();

module.exports = http.createServer(function (req, res) {

    //Sluurp the file path and name from the requested URL
    var fname = req.url;
    console.error("GET " + fname);

    //Tell the browser to expect an HTML document
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    //Write just enough HTML to display text as list items (tested in Chrome)
    res.write("<style>li {list-style: none;} </style>\n<ul>\n");

    var fileStream = tailStream.createReadStream(fname);
    //FYI. Some read sreams leave in the byte order marks (BOMs).
    //Use a filter to strip them out.
    fileStream.pipe(stripBomStream()).pipe(liner).pipe(lister).pipe(res);

    //Clean up
    res.on('end', function () {
        fileStream.close();
    });
});
