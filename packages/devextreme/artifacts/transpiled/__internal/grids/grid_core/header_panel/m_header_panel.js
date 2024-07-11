"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headerPanelModule = exports.HeaderPanel = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _data = require("../../../../core/utils/data");
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _toolbar = _interopRequireDefault(require("../../../../ui/toolbar"));
var _m_columns_view = require("../views/m_columns_view");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable max-classes-per-file */
const HEADER_PANEL_CLASS = 'header-panel';
const TOOLBAR_BUTTON_CLASS = 'toolbar-button';
const TOOLBAR_ARIA_LABEL = '-ariaToolbar';
const DEFAULT_TOOLBAR_ITEM_NAMES = ['addRowButton', 'applyFilterButton', 'columnChooserButton', 'exportButton', 'groupPanel', 'revertButton', 'saveButton', 'searchPanel'];
class HeaderPanel extends _m_columns_view.ColumnsView {
  init() {
    super.init();
    this._editingController = this.getController('editing');
    this._headerFilterController = this.getController('headerFilter');
    this.createAction('onToolbarPreparing', {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
  /**
   * @extended: column_chooser, editing, filter_row, search
   */
  _getToolbarItems() {
    return [];
  }
  _getButtonContainer() {
    return (0, _renderer.default)('<div>').addClass(this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS));
  }
  _getToolbarButtonClass(specificClass) {
    const secondClass = specificClass ? ` ${specificClass}` : '';
    return this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS) + secondClass;
  }
  _getToolbarOptions() {
    const userToolbarOptions = this.option('toolbar');
    const options = {
      toolbarOptions: {
        items: this._getToolbarItems(),
        visible: userToolbarOptions === null || userToolbarOptions === void 0 ? void 0 : userToolbarOptions.visible,
        disabled: userToolbarOptions === null || userToolbarOptions === void 0 ? void 0 : userToolbarOptions.disabled,
        onItemRendered(e) {
          const itemRenderedCallback = e.itemData.onItemRendered;
          if (itemRenderedCallback) {
            itemRenderedCallback(e);
          }
        }
      }
    };
    const userItems = userToolbarOptions === null || userToolbarOptions === void 0 ? void 0 : userToolbarOptions.items;
    options.toolbarOptions.items = this._normalizeToolbarItems(options.toolbarOptions.items, userItems);
    this.executeAction('onToolbarPreparing', options);
    if (options.toolbarOptions && !(0, _type.isDefined)(options.toolbarOptions.visible)) {
      const toolbarItems = options.toolbarOptions.items;
      options.toolbarOptions.visible = !!(toolbarItems !== null && toolbarItems !== void 0 && toolbarItems.length);
    }
    return options.toolbarOptions;
  }
  _normalizeToolbarItems(defaultItems, userItems) {
    defaultItems.forEach(button => {
      if (!DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
        throw new Error(`Default toolbar item '${button.name}' is not added to DEFAULT_TOOLBAR_ITEM_NAMES`);
      }
    });
    const defaultProps = {
      location: 'after'
    };
    const isArray = Array.isArray(userItems);
    if (!(0, _type.isDefined)(userItems)) {
      return defaultItems;
    }
    if (!isArray) {
      userItems = [userItems];
    }
    const defaultButtonsByNames = {};
    defaultItems.forEach(button => {
      defaultButtonsByNames[button.name] = button;
    });
    const normalizedItems = userItems.map(button => {
      if ((0, _type.isString)(button)) {
        button = {
          name: button
        };
      }
      if ((0, _type.isDefined)(button.name)) {
        if ((0, _type.isDefined)(defaultButtonsByNames[button.name])) {
          button = (0, _extend.extend)(true, {}, defaultButtonsByNames[button.name], button);
        } else if (DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
          button = _extends({}, button, {
            visible: false
          });
        }
      }
      return (0, _extend.extend)(true, {}, defaultProps, button);
    });
    return isArray ? normalizedItems : normalizedItems[0];
  }
  _renderCore() {
    if (!this._toolbar) {
      const $headerPanel = this.element();
      $headerPanel.addClass(this.addWidgetPrefix(HEADER_PANEL_CLASS));
      const label = _message.default.format(this.component.NAME + TOOLBAR_ARIA_LABEL);
      const $toolbar = (0, _renderer.default)('<div>').attr('aria-label', label).appendTo($headerPanel);
      this._toolbar = this._createComponent($toolbar, _toolbar.default, this._toolbarOptions);
    } else {
      this._toolbar.option(this._toolbarOptions);
    }
  }
  _columnOptionChanged() {}
  _handleDataChanged() {
    if (this._requireReady) {
      this.render();
    }
  }
  _isDisabledDefinedByUser(name) {
    var _this$option;
    const userItems = (_this$option = this.option('toolbar')) === null || _this$option === void 0 ? void 0 : _this$option.items;
    const userItem = userItems === null || userItems === void 0 ? void 0 : userItems.find(item => (item === null || item === void 0 ? void 0 : item.name) === name);
    return (0, _type.isDefined)(userItem === null || userItem === void 0 ? void 0 : userItem.disabled);
  }
  render() {
    this._toolbarOptions = this._getToolbarOptions();
    super.render.apply(this, arguments);
  }
  setToolbarItemDisabled(name, disabled) {
    const toolbar = this._toolbar;
    const isDefinedByUser = this._isDisabledDefinedByUser(name);
    if (!toolbar || isDefinedByUser) {
      return;
    }
    const items = toolbar.option('items') ?? [];
    const itemIndex = items.findIndex(item => item.name === name);
    if (itemIndex < 0) {
      return;
    }
    const item = toolbar.option(`items[${itemIndex}]`);
    toolbar.option(`items[${itemIndex}].disabled`, disabled);
    if (item.options) {
      toolbar.option(`items[${itemIndex}].options.disabled`, disabled);
    }
  }
  updateToolbarDimensions() {
    var _this$_toolbar;
    (_this$_toolbar = this._toolbar) === null || _this$_toolbar === void 0 || _this$_toolbar.updateDimensions();
  }
  getHeaderPanel() {
    return this.element();
  }
  getHeight() {
    return this.getElementHeight();
  }
  optionChanged(args) {
    if (args.name === 'onToolbarPreparing') {
      this._invalidate();
      args.handled = true;
    }
    if (args.name === 'toolbar') {
      const parts = (0, _data.getPathParts)(args.fullName);
      const optionName = args.fullName.replace(/^toolbar\./, '');
      if (parts.length === 1) {
        // `toolbar` case
        this._invalidate();
      } else if (parts[1] === 'items') {
        if (parts.length === 2) {
          var _this$_toolbar2;
          // `toolbar.items` case
          const toolbarOptions = this._getToolbarOptions();
          (_this$_toolbar2 = this._toolbar) === null || _this$_toolbar2 === void 0 || _this$_toolbar2.option('items', toolbarOptions.items);
        } else if (parts.length === 3) {
          var _this$_toolbar3;
          // `toolbar.items[i]` case
          const normalizedItem = this._normalizeToolbarItems(this._getToolbarItems(), args.value);
          (_this$_toolbar3 = this._toolbar) === null || _this$_toolbar3 === void 0 || _this$_toolbar3.option(optionName, normalizedItem);
        } else if (parts.length >= 4) {
          var _this$_toolbar4;
          // `toolbar.items[i].prop` case
          (_this$_toolbar4 = this._toolbar) === null || _this$_toolbar4 === void 0 || _this$_toolbar4.option(optionName, args.value);
        }
      } else {
        // `toolbar.visible`, `toolbar.disabled` case
        this._invalidate();
      }
      args.handled = true;
    }
    super.optionChanged(args);
  }
  /**
   * @extended: column_chooser, editing
   */
  isVisible() {
    return !!(this._toolbarOptions && this._toolbarOptions.visible);
  }
  /**
   * @extended: DataGrid's grouping
   */
  allowDragging() {}
  hasGroupedColumns() {}
}
exports.HeaderPanel = HeaderPanel;
const resizing = Base => class HeaderPanelResizingExtender extends Base {
  _updateDimensionsCore() {
    // @ts-expect-error
    super._updateDimensionsCore.apply(this, arguments);
    this.getView('headerPanel').updateToolbarDimensions();
  }
};
const headerPanelModule = exports.headerPanelModule = {
  defaultOptions() {
    return {};
  },
  views: {
    headerPanel: HeaderPanel
  },
  extenders: {
    controllers: {
      resizing
    }
  }
};