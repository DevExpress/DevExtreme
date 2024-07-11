"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hide = hide;
exports.show = show;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _deferred = require("../../core/utils/deferred");
var _view_port = require("../../core/utils/view_port");
var _load_panel = _interopRequireDefault(require("../../ui/load_panel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let loading = null;
const createLoadPanel = function (options) {
  return new _load_panel.default((0, _renderer.default)('<div>').appendTo(options && options.container || (0, _view_port.value)()), options);
};
const removeLoadPanel = function () {
  if (!loading) {
    return;
  }
  loading.$element().remove();
  loading = null;
};
function show(options) {
  removeLoadPanel();
  loading = createLoadPanel(options);
  return loading.show();
}
function hide() {
  // todo: hot fix for case without viewport
  if (!loading) {
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  }
  return loading.hide().done(removeLoadPanel).promise();
}