"use strict";

exports._TESTS_resetDataKey = _TESTS_resetDataKey;
exports.generateDataKey = generateDataKey;
let nextDataKey = 1;
function generateDataKey() {
  return 'vectormap-data-' + nextDataKey++;
}

///#DEBUG
function _TESTS_resetDataKey() {
  nextDataKey = 1;
}
///#ENDDEBUG