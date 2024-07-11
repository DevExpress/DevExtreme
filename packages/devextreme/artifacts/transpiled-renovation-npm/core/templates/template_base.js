"use strict";

exports.renderedCallbacks = exports.TemplateBase = void 0;
var _renderer = _interopRequireDefault(require("../renderer"));
var _dom_adapter = _interopRequireDefault(require("../dom_adapter"));
var _callbacks = _interopRequireDefault(require("../utils/callbacks"));
var _dom = require("../utils/dom");
var _visibility_change = require("../../events/visibility_change");
var _errors = _interopRequireDefault(require("../errors"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
const renderedCallbacks = exports.renderedCallbacks = (0, _callbacks.default)({
  syncStrategy: true
});
class TemplateBase {
  render(options) {
    options = options || {};
    const onRendered = options.onRendered;
    delete options.onRendered;
    let $result;
    if (options.renovated && options.transclude && this._element) {
      $result = (0, _renderer.default)('<div>').append(this._element).contents();
    } else {
      $result = this._renderCore(options);
    }
    this._ensureResultInContainer($result, options.container);
    renderedCallbacks.fire($result, options.container);
    onRendered && onRendered();
    return $result;
  }
  _ensureResultInContainer($result, container) {
    if (!container) {
      return;
    }
    const $container = (0, _renderer.default)(container);
    const resultInContainer = (0, _dom.contains)($container.get(0), $result.get(0));
    $container.append($result);
    if (resultInContainer) {
      return;
    }
    const resultInBody = (0, _dom.contains)(_dom_adapter.default.getBody(), $container.get(0));
    if (!resultInBody) {
      return;
    }
    (0, _visibility_change.triggerShownEvent)($result);
  }
  _renderCore() {
    throw _errors.default.Error('E0001');
  }
}
exports.TemplateBase = TemplateBase;