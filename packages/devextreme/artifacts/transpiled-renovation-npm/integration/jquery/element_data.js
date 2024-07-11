"use strict";

var _jquery = _interopRequireDefault(require("jquery"));
var _element_data = require("../../core/element_data");
var _use_jquery = _interopRequireDefault(require("./use_jquery"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

const useJQuery = (0, _use_jquery.default)();
if (useJQuery) {
  (0, _element_data.setDataStrategy)(_jquery.default);
}