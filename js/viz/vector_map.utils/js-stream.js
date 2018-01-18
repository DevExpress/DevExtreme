// jshint strict:implied, -W098, -W117
/* eslint-disable no-undef*/

var domAdapter = require("../../core/dom_adapter");

function wrapBuffer(arrayBuffer) {
    return new DataView(arrayBuffer);
}

function ui8(stream, position) {
    return stream.getUint8(position);
}

function ui16LE(stream, position) {
    return stream.getUint16(position, true);
}

function ui32LE(stream, position) {
    return stream.getUint32(position, true);
}

function ui32BE(stream, position) {
    return stream.getUint32(position, false);
}

function f64LE(stream, position) {
    return stream.getFloat64(position, true);
}

function sendRequest(url, callback) {
    var request = new XMLHttpRequest();
    domAdapter.listen(request, "load", function() {
        callback(this.response ? null : this.statusText, this.response);
    });
    request.open('GET', url);
    request.responseType = 'arraybuffer';
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.send(null);
}
