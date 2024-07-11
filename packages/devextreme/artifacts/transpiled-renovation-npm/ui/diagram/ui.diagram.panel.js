"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _index = require("../../events/utils/index");
var _pointer = _interopRequireDefault(require("../../events/pointer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const POINTERUP_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.up, 'dxDiagramPanel');
const PREVENT_REFOCUS_SELECTOR = '.dx-textbox';
class DiagramPanel extends _ui.default {
  _init() {
    super._init();
    this._createOnPointerUpAction();
  }
  _render() {
    super._render();
    this._attachPointerUpEvent();
  }
  _getPointerUpElements() {
    return [this.$element()];
  }
  _attachPointerUpEvent() {
    const elements = this._getPointerUpElements();
    elements.forEach(element => {
      _events_engine.default.off(element, POINTERUP_EVENT_NAME);
      _events_engine.default.on(element, POINTERUP_EVENT_NAME, e => {
        if (!(0, _renderer.default)(e.target).closest(PREVENT_REFOCUS_SELECTOR).length) {
          this._onPointerUpAction();
        }
      });
    });
  }
  _createOnPointerUpAction() {
    this._onPointerUpAction = this._createActionByOption('onPointerUp');
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'onPointerUp':
        this._createOnPointerUpAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
}
var _default = exports.default = DiagramPanel;
module.exports = exports.default;
module.exports.default = exports.default;