/* eslint-disable no-unused-vars, no-var, one-var*/

function wrapBuffer(buffer) {
    return buffer;
}

function ui8(stream, position) {
    return stream[position];
}

function ui16LE(stream, position) {
    return stream.readUInt16LE(position);
}

function ui32LE(stream, position) {
    return stream.readUInt32LE(position);
}

function ui32BE(stream, position) {
    return stream.readUInt32BE(position);
}

function f64LE(stream, position) {
    return stream.readDoubleLE(position);
}

var fs = require('fs');
function sendRequest(path, callback) {
    fs.readFile(path, callback);
}
