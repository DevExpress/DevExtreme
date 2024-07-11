"use strict";

exports.EditorStateProps = void 0;
var _devices = _interopRequireDefault(require("../../../../core/devices"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EditorStateProps = exports.EditorStateProps = {
  hoverStateEnabled: true,
  activeStateEnabled: true,
  get focusStateEnabled() {
    return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
  }
};