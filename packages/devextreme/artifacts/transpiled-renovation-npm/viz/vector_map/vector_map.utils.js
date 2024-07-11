"use strict";

exports.generateDataKey = generateDataKey;
let nextDataKey = 1;
function generateDataKey() {
  return 'vectormap-data-' + nextDataKey++;
}