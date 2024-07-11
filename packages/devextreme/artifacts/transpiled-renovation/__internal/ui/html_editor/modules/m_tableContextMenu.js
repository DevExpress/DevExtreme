"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _extend = require("../../../../core/utils/extend");
var _inflector = require("../../../../core/utils/inflector");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _index = require("../../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _context_menu = _interopRequireDefault(require("../../../../ui/context_menu"));
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _m_table_helper = require("../utils/m_table_helper");
var _m_toolbar_helper = require("../utils/m_toolbar_helper");
var _m_base = _interopRequireDefault(require("./m_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MODULE_NAMESPACE = 'dxHtmlEditorTableContextMenu';
const CONTEXT_MENU_EVENT = (0, _index.addNamespace)('dxcontextmenu', MODULE_NAMESPACE);
// eslint-disable-next-line import/no-mutable-exports
let TableContextMenuModule = _m_base.default;
const localize = name => _message.default.format(`dxHtmlEditor-${(0, _inflector.camelize)(name)}`);
if (_devextremeQuill.default) {
  // @ts-expect-error
  TableContextMenuModule = class TableContextMenuModule extends _m_base.default {
    constructor(quill, options) {
      // @ts-expect-error
      super(quill, options);
      this.enabled = !!options.enabled;
      this._quillContainer = this.editorInstance._getQuillContainer();
      // @ts-expect-error
      this.addCleanCallback(this.prepareCleanCallback());
      this._formatHandlers = (0, _m_toolbar_helper.getFormatHandlers)(this);
      this._tableFormats = (0, _m_table_helper.getTableFormats)(quill);
      if (this.enabled) {
        this._enableContextMenu(options.items);
      }
    }
    _enableContextMenu(items) {
      var _this$_contextMenu;
      (_this$_contextMenu = this._contextMenu) === null || _this$_contextMenu === void 0 || _this$_contextMenu.dispose();
      this._contextMenu = this._createContextMenu(items);
      this._attachEvents();
    }
    _attachEvents() {
      _events_engine.default.on(this.editorInstance._getContent(), CONTEXT_MENU_EVENT, this._prepareContextMenuHandler());
    }
    _detachEvents() {
      _events_engine.default.off(this.editorInstance._getContent(), CONTEXT_MENU_EVENT);
    }
    _createContextMenu(items) {
      const $container = (0, _renderer.default)('<div>').appendTo(this.editorInstance.$element());
      const menuConfig = this._getMenuConfig(items);
      return this.editorInstance._createComponent($container, _context_menu.default, menuConfig);
    }
    showPropertiesForm() {
      let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'cell';
      const $element = (0, _renderer.default)(this._targetElement).closest(type === 'cell' ? 'th, td' : 'table');
      this._contextMenu.hide();
      this._formatHandlers[`${type}Properties`]($element);
      this._targetElement = null;
    }
    _isAcceptableItem(widget, acceptableWidgetName) {
      return !widget || widget === acceptableWidgetName;
    }
    _handleObjectItem(item) {
      if (item.name && this._isAcceptableItem(item.widget, 'dxButton')) {
        const defaultButtonItemConfig = this._prepareMenuItemConfig(item.name);
        const buttonItemConfig = (0, _extend.extend)(true, defaultButtonItemConfig, item);
        return buttonItemConfig;
      }
      if (item.items) {
        item.items = this._prepareMenuItems(item.items);
        return item;
      }
      return item;
    }
    _prepareMenuItemConfig(name) {
      const iconName = _m_toolbar_helper.ICON_MAP[name] ?? name;
      const buttonText = (0, _inflector.titleize)(name);
      return {
        text: localize(buttonText),
        icon: iconName.toLowerCase(),
        onClick: this._formatHandlers[name] ?? (0, _m_toolbar_helper.getDefaultClickHandler)(this, name)
      };
    }
    _prepareMenuItems(items) {
      const resultItems = [];
      (0, _iterator.each)(items, (_, item) => {
        let newItem;
        if ((0, _type.isObject)(item)) {
          newItem = this._handleObjectItem(item);
        } else if ((0, _type.isString)(item)) {
          newItem = this._prepareMenuItemConfig(item);
        }
        if (newItem) {
          resultItems.push(newItem);
        }
      });
      return resultItems;
    }
    _getMenuConfig(items) {
      const defaultItems = [{
        text: localize('insert'),
        items: ['insertHeaderRow', 'insertRowAbove', 'insertRowBelow', (0, _extend.extend)(this._prepareMenuItemConfig('insertColumnLeft'), {
          beginGroup: true
        }), 'insertColumnRight']
      }, {
        text: localize('delete'),
        items: ['deleteColumn', 'deleteRow', 'deleteTable']
      }, (0, _extend.extend)(this._prepareMenuItemConfig('cellProperties'), {
        onClick: () => {
          this.showPropertiesForm('cell');
        }
      }), (0, _extend.extend)(this._prepareMenuItemConfig('tableProperties'), {
        onClick: () => {
          this.showPropertiesForm('table');
        }
      })];
      const customItems = this._prepareMenuItems(items !== null && items !== void 0 && items.length ? items : defaultItems);
      return {
        target: this._quillContainer,
        showEvent: null,
        hideOnParentScroll: false,
        items: customItems
      };
    }
    _prepareContextMenuHandler() {
      return event => {
        if (this._isTableTarget(event.target)) {
          this._targetElement = event.target;
          this._setContextMenuPosition(event);
          this._contextMenu.show();
          event.preventDefault();
        }
      };
    }
    _setContextMenuPosition(event) {
      const startPosition = this._quillContainer.get(0).getBoundingClientRect();
      // @ts-expect-error
      this._contextMenu.option({
        position: {
          my: 'left top',
          at: 'left top',
          collision: 'fit fit',
          offset: {
            x: event.clientX - startPosition.left,
            y: event.clientY - startPosition.top
          }
        }
      });
    }
    _isTableTarget(targetElement) {
      return !!(0, _renderer.default)(targetElement).closest('.dx-htmleditor-content td, .dx-htmleditor-content th').length;
    }
    clean() {
      this._detachEvents();
    }
    option(option, value) {
      if (option === 'tableContextMenu') {
        // @ts-expect-error
        this.handleOptionChangeValue(value);
        return;
      }
      if (option === 'enabled') {
        this.enabled = value;
        value ? this._enableContextMenu() : this.clean();
      } else if (option === 'items') {
        var _this$_contextMenu2;
        (_this$_contextMenu2 = this._contextMenu) === null || _this$_contextMenu2 === void 0 || _this$_contextMenu2.dispose();
        this._contextMenu = this._createContextMenu(value);
      }
    }
    prepareCleanCallback() {
      return () => {
        this.clean();
      };
    }
  };
}
var _default = exports.default = TableContextMenuModule;