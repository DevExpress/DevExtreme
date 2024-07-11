"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.A11yStatusContainerComponent = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CLASSES = {
  container: 'dx-gridbase-a11y-status-container'
};
const A11yStatusContainerComponent = _ref => {
  let {
    statusText
  } = _ref;
  return (0, _renderer.default)('<div>').text(statusText ?? '').addClass(CLASSES.container).attr('role', 'status');
};
exports.A11yStatusContainerComponent = A11yStatusContainerComponent;