"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hide = hide;
exports.show = show;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _view_port = require("../../../core/utils/view_port");
var _tooltip = _interopRequireDefault(require("../../../ui/tooltip"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let tooltip = null;
let removeTooltipElement = null;
const createTooltip = function (options) {
  options = (0, _extend.extend)({
    position: 'top'
  }, options);
  const {
    content
  } = options;
  delete options.content;
  const $tooltip = (0, _renderer.default)('<div>').html(content).appendTo((0, _view_port.value)());
  // @ts-expect-error
  removeTooltipElement = function () {
    $tooltip.remove();
  };
  // @ts-expect-error
  tooltip = new _tooltip.default($tooltip, options);
};
const removeTooltip = function () {
  if (!tooltip) {
    return;
  }
  // @ts-expect-error
  removeTooltipElement();
  tooltip = null;
};
function show(options) {
  removeTooltip();
  createTooltip(options);
  // @ts-expect-error
  return tooltip.show();
}
function hide() {
  if (!tooltip) {
    return (0, _deferred.Deferred)().resolve();
  }
  // @ts-expect-error
  return tooltip.hide().done(removeTooltip).promise();
}