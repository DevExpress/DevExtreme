"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TOAST_CLASS = 'dx-toast';
function hideAllToasts(container) {
  const toasts = (0, _renderer.default)(`.${TOAST_CLASS}`).toArray();
  if (!arguments.length) {
    // @ts-expect-error
    toasts.forEach(toast => {
      (0, _renderer.default)(toast).dxToast('hide');
    });
    return;
  }
  const containerElement = (0, _renderer.default)(container).get(0);
  toasts
  // @ts-expect-error
  .map(toast => (0, _renderer.default)(toast).dxToast('instance')).filter(instance => {
    const toastContainerElement = (0, _renderer.default)(instance.option('container')).get(0);
    return containerElement === toastContainerElement && containerElement;
  }).forEach(instance => {
    instance.hide();
  });
}
var _default = exports.default = hideAllToasts;