"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _extend = require("../../../../core/utils/extend");
var _size = require("../../../../core/utils/size");
var _window = require("../../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _index = require("../../../../events/utils/index");
var _list_light = _interopRequireDefault(require("../../../../ui/list_light"));
var _popup = _interopRequireDefault(require("../../../../ui/popup"));
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _m_base = _interopRequireDefault(require("./m_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MODULE_NAMESPACE = 'dxHtmlEditorPopupModule';
// eslint-disable-next-line import/no-mutable-exports
let ListPopupModule = _m_base.default;
if (_devextremeQuill.default) {
  const SUGGESTION_LIST_CLASS = 'dx-suggestion-list';
  const SUGGESTION_LIST_WRAPPER_CLASS = 'dx-suggestion-list-wrapper';
  const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
  const MIN_HEIGHT = 100;
  // @ts-expect-error
  ListPopupModule = class ListPopupModule extends _m_base.default {
    constructor(quill, options) {
      // @ts-expect-error
      super(quill, options);
      this.options = (0, _extend.extend)({}, this._getDefaultOptions(), options);
      this._popup = this.renderPopup();
      // @ts-expect-error
      this._popup.$wrapper().addClass(`${SUGGESTION_LIST_WRAPPER_CLASS} ${DROPDOWN_EDITOR_OVERLAY_CLASS}`);
      this._renderPreventFocusOut();
    }
    _getDefaultOptions() {
      return {
        dataSource: null
      };
    }
    renderList($container, options) {
      const $list = (0, _renderer.default)('<div>').addClass(SUGGESTION_LIST_CLASS).appendTo($container);
      this._list = this.options.editorInstance._createComponent($list, _list_light.default, options);
    }
    renderPopup() {
      const {
        editorInstance
      } = this.options;
      const $container = (0, _renderer.default)('<div>').appendTo(editorInstance.$element());
      const popupConfig = this._getPopupConfig();
      return editorInstance._createComponent($container, _popup.default, popupConfig);
    }
    _getPopupConfig() {
      return {
        contentTemplate: contentElem => {
          const listConfig = this._getListConfig(this.options);
          this.renderList((0, _renderer.default)(contentElem), listConfig);
        },
        deferRendering: false,
        onShown: () => {
          this._list.focus();
        },
        onHidden: () => {
          this._list.unselectAll();
          this._list.option('focusedElement', null);
        },
        showTitle: false,
        width: 'auto',
        height: 'auto',
        shading: false,
        hideOnParentScroll: true,
        hideOnOutsideClick: true,
        animation: {
          show: {
            type: 'fade',
            duration: 0,
            from: 0,
            to: 1
          },
          hide: {
            type: 'fade',
            duration: 400,
            from: 1,
            to: 0
          }
        },
        fullScreen: false,
        maxHeight: this.maxHeight
      };
    }
    _getListConfig(options) {
      return {
        dataSource: options.dataSource,
        onSelectionChanged: this.selectionChangedHandler.bind(this),
        selectionMode: 'single',
        pageLoadMode: 'scrollBottom'
      };
    }
    get maxHeight() {
      const window = (0, _window.getWindow)();
      const windowHeight = window && (0, _size.getHeight)(window) || 0;
      return Math.max(MIN_HEIGHT, windowHeight * 0.5);
    }
    selectionChangedHandler(e) {
      if (this._popup.option('visible')) {
        this._popup.hide();
        this.insertEmbedContent(e);
      }
    }
    _renderPreventFocusOut() {
      const eventName = (0, _index.addNamespace)('mousedown', MODULE_NAMESPACE);
      // @ts-expect-error
      _events_engine.default.on(this._popup.$wrapper(), eventName, e => {
        e.preventDefault();
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    insertEmbedContent(selectionChangedEvent) {}
    showPopup() {
      this._popup && this._popup.show();
    }
    savePosition(position) {
      this.caretPosition = position;
    }
    getPosition() {
      return this.caretPosition;
    }
  };
}
var _default = exports.default = ListPopupModule;