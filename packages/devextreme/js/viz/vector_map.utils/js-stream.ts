/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */

type RequestCallback = (error: string | null, response: ArrayBuffer | null) => void;

function wrapBuffer(arrayBuffer: ArrayBuffer): DataView {
  return new DataView(arrayBuffer);
}

function ui8(stream: DataView, position: number): number {
  return stream.getUint8(position);
}

function ui16LE(stream: DataView, position: number): number {
  return stream.getUint16(position, true);
}

function ui32LE(stream: DataView, position: number): number {
  return stream.getUint32(position, true);
}

function ui32BE(stream: DataView, position: number): number {
  return stream.getUint32(position, false);
}

function f64LE(stream: DataView, position: number): number {
  return stream.getFloat64(position, true);
}

function sendRequest(url: string, callback: RequestCallback): void {
  var request = new XMLHttpRequest();
  request.addEventListener('load', function() {
    callback(this.response ? null : this.statusText, this.response);
  });
  request.open('GET', url);
  request.responseType = 'arraybuffer';
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  request.send(null);
}
