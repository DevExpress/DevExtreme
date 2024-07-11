"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _extend = require("../../../../core/utils/extend");
var _position = require("../../../../core/utils/position");
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _m_variable = _interopRequireDefault(require("../formats/m_variable"));
var _m_base = _interopRequireDefault(require("./m_base"));
var _m_popup = _interopRequireDefault(require("./m_popup"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-mutable-exports
let VariableModule = _m_base.default;
if (_devextremeQuill.default) {
  const VARIABLE_FORMAT_CLASS = 'dx-variable-format';
  const ACTIVE_FORMAT_CLASS = 'dx-format-active';
  const SELECTED_STATE_CLASS = 'dx-state-selected';
  _devextremeQuill.default.register({
    'formats/variable': _m_variable.default
  }, true);
  // @ts-expect-error
  VariableModule = class VariableModule extends _m_popup.default {
    constructor(quill, options) {
      // @ts-expect-error
      super(quill, options);
      const toolbar = quill.getModule('toolbar');
      if (toolbar) {
        toolbar.addClickHandler('variable', this.showPopup.bind(this));
      }
      quill.keyboard.addBinding({
        key: 'P',
        altKey: true
      }, this.showPopup.bind(this));
      this._popup.on('shown', e => {
        const $ofElement = (0, _renderer.default)(e.component.option('position').of);
        if ($ofElement.hasClass(VARIABLE_FORMAT_CLASS)) {
          $ofElement.addClass(ACTIVE_FORMAT_CLASS);
          $ofElement.addClass(SELECTED_STATE_CLASS);
        }
      });
    }
    _getDefaultOptions() {
      // @ts-expect-error
      const baseConfig = super._getDefaultOptions();
      return (0, _extend.extend)(baseConfig, {
        escapeChar: ''
      });
    }
    showPopup(event) {
      const selection = this.quill.getSelection(true);
      const position = selection ? selection.index : this.quill.getLength();
      // @ts-expect-error
      this.savePosition(position);
      this._resetPopupPosition(event, position);
      // @ts-expect-error
      super.showPopup();
    }
    _resetPopupPosition(event, position) {
      if (event && event.element) {
        this._popup.option('position', {
          of: event.element,
          offset: {
            h: 0,
            v: 0
          },
          my: 'top center',
          at: 'bottom center',
          collision: 'fit'
        });
      } else {
        const mentionBounds = this.quill.getBounds(position);
        const rootRect = (0, _position.getBoundingRect)(this.quill.root);
        this._popup.option('position', {
          of: this.quill.root,
          offset: {
            h: mentionBounds.left,
            v: mentionBounds.bottom - rootRect.height
          },
          my: 'top center',
          at: 'bottom left',
          collision: 'fit flip'
        });
      }
    }
    insertEmbedContent(selectionChangedEvent) {
      // @ts-expect-error
      const caretPosition = this.getPosition();
      const selectedItem = selectionChangedEvent.component.option('selectedItem');
      const variableData = (0, _extend.extend)({}, {
        value: selectedItem,
        escapeChar: this.options.escapeChar
      });
      setTimeout(() => {
        this.quill.insertEmbed(caretPosition, 'variable', variableData);
        this.quill.setSelection(caretPosition + 1);
      });
    }
  };
}
var _default = exports.default = VariableModule;