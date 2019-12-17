/* eslint-env node */
/* eslint-disable no-console */

process.on('uncaughtException', function(e) {
    console.log('!!! Uncaught exception !!!');
    console.log(e.message);
    console.log(e.stack);
});

var fs = require('fs'),
    path = require('path'),
    utils = require('../../artifacts/js/vectormap-utils/dx.vectormaputils.node.js'),
    PORTS = require('../../ports.json');

var dataDirectory = path.join(path.dirname(process.argv[1]), '../content/VectorMapData');

var actions = {
    'parse-buffer': function(arg, callback) {
        var count = 2,
            obj = {};
        fs.readFile(path.join(dataDirectory, arg + '.shp'), function(e, buffer) {
            obj['shp'] = buffer;
            done();
        });
        fs.readFile(path.join(dataDirectory, arg + '.dbf'), function(e, buffer) {
            obj['dbf'] = buffer;
            done();
        });
        function done() {
            var func,
                data,
                errors;
            if(--count === 0) {
                func = utils.parse(obj, function(data_, errors_) {
                    data = data_;
                    errors = errors_;
                });
                callback({
                    func: func === data,
                    data: data,
                    errors: errors
                });
            }
        }
    },

    'read-and-parse': function(arg, callback) {
        var func;
        func = utils.parse(path.join(dataDirectory, arg), function(data, errors) {
            callback({
                func: func === undefined,
                data: data,
                errors: errors
            });
        });
    }
};

function getRequestInfo(url) {
    var parts = url.split('/');
    return {
        action: parts[1],
        arg: parts[2]
    };
}

require('http').createServer(function(request, response) {
    var info = getRequestInfo(request.url),
        action = actions[info.action];
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    if(action) {
        action(info.arg, callback);
    }
    function callback(data) {
        response.end(JSON.stringify(data));
    }
}).listen(PORTS['vectormap-utils-tester'], '127.0.0.1');
