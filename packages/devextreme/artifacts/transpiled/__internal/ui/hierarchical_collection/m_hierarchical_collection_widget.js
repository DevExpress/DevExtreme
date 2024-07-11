"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _bindable_template = require("../../../core/templates/bindable_template");
var _common = require("../../../core/utils/common");
var _data = require("../../../core/utils/data");
var _extend = require("../../../core/utils/extend");
var _icon = require("../../../core/utils/icon");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _uiCollection_widget = _interopRequireDefault(require("../../../ui/collection/ui.collection_widget.edit"));
var _m_data_adapter = _interopRequireDefault(require("./m_data_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const ITEM_URL_CLASS = 'dx-item-url';
const HierarchicalCollectionWidget = _uiCollection_widget.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      keyExpr: 'id',
      displayExpr: 'text',
      selectedExpr: 'selected',
      disabledExpr: 'disabled',
      itemsExpr: 'items',
      hoverStateEnabled: true,
      parentIdExpr: 'parentId',
      expandedExpr: 'expanded'
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  },
  _init() {
    this.callBase();
    this._initAccessors();
    this._initDataAdapter();
    this._initDynamicTemplates();
  },
  _initDataSource() {
    this.callBase();
    this._dataSource && this._dataSource.paginate(false);
  },
  _initDataAdapter() {
    const accessors = this._createDataAdapterAccessors();
    this._dataAdapter = new _m_data_adapter.default((0, _extend.extend)({
      dataAccessors: {
        getters: accessors.getters,
        setters: accessors.setters
      },
      items: this.option('items')
    }, this._getDataAdapterOptions()));
  },
  _getDataAdapterOptions: _common.noop,
  _getItemExtraPropNames: _common.noop,
  _initDynamicTemplates() {
    const fields = ['text', 'html', 'items', 'icon'].concat(this._getItemExtraPropNames());
    this._templateManager.addDefaultTemplates({
      item: new _bindable_template.BindableTemplate(this._addContent.bind(this), fields, this.option('integrationOptions.watchMethod'), {
        text: this._displayGetter,
        items: this._itemsGetter
      })
    });
  },
  _addContent($container, itemData) {
    $container.html(itemData.html).append(this._getIconContainer(itemData)).append(this._getTextContainer(itemData));
  },
  _getLinkContainer(iconContainer, textContainer, _ref) {
    let {
      linkAttr,
      url
    } = _ref;
    const linkAttributes = (0, _type.isObject)(linkAttr) ? linkAttr : {};
    return (0, _renderer.default)('<a>').addClass(ITEM_URL_CLASS)
    // @ts-expect-error
    .attr(_extends({}, linkAttributes, {
      href: url
    })).append(iconContainer).append(textContainer);
  },
  _getIconContainer(itemData) {
    if (!itemData.icon) {
      return undefined;
    }
    const $imageContainer = (0, _icon.getImageContainer)(itemData.icon);
    // @ts-expect-error
    if ($imageContainer.is('img')) {
      const componentName = this.NAME.startsWith('dxPrivateComponent') ? '' : `${this.NAME} `;
      // @ts-expect-error
      $imageContainer.attr('alt', `${componentName}item icon`);
    }
    return $imageContainer;
  },
  _getTextContainer(itemData) {
    return (0, _renderer.default)('<span>').text(itemData.text);
  },
  _initAccessors() {
    const that = this;
    (0, _iterator.each)(this._getAccessors(), (_, accessor) => {
      that._compileAccessor(accessor);
    });
    this._compileDisplayGetter();
  },
  _getAccessors() {
    return ['key', 'selected', 'items', 'disabled', 'parentId', 'expanded'];
  },
  _getChildNodes(node) {
    const that = this;
    const arr = [];
    (0, _iterator.each)(node.internalFields.childrenKeys, (_, key) => {
      const childNode = that._dataAdapter.getNodeByKey(key);
      // @ts-expect-error
      arr.push(childNode);
    });
    return arr;
  },
  _hasChildren(node) {
    return node && node.internalFields.childrenKeys.length;
  },
  _compileAccessor(optionName) {
    const getter = `_${optionName}Getter`;
    const setter = `_${optionName}Setter`;
    const optionExpr = this.option(`${optionName}Expr`);
    if (!optionExpr) {
      this[getter] = _common.noop;
      this[setter] = _common.noop;
      return;
    }
    if ((0, _type.isFunction)(optionExpr)) {
      this[setter] = function (obj, value) {
        obj[optionExpr()] = value;
      };
      this[getter] = function (obj) {
        return obj[optionExpr()];
      };
      return;
    }
    this[getter] = (0, _data.compileGetter)(optionExpr);
    this[setter] = (0, _data.compileSetter)(optionExpr);
  },
  _createDataAdapterAccessors() {
    const that = this;
    const accessors = {
      getters: {},
      setters: {}
    };
    (0, _iterator.each)(this._getAccessors(), (_, accessor) => {
      const getterName = `_${accessor}Getter`;
      const setterName = `_${accessor}Setter`;
      const newAccessor = accessor === 'parentId' ? 'parentKey' : accessor;
      accessors.getters[newAccessor] = that[getterName];
      accessors.setters[newAccessor] = that[setterName];
    });
    // @ts-expect-error
    accessors.getters.display = !this._displayGetter ? itemData => itemData.text : this._displayGetter;
    return accessors;
  },
  _initMarkup() {
    this.callBase();
    this._addWidgetClass();
  },
  _addWidgetClass() {
    this._focusTarget().addClass(this._widgetClass());
  },
  _widgetClass: _common.noop,
  _renderItemFrame(index, itemData) {
    const $itemFrame = this.callBase.apply(this, arguments);
    $itemFrame.toggleClass(DISABLED_STATE_CLASS, !!this._disabledGetter(itemData));
    return $itemFrame;
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'displayExpr':
      case 'keyExpr':
        this._initAccessors();
        this._initDynamicTemplates();
        this.repaint();
        break;
      case 'itemsExpr':
      case 'selectedExpr':
      case 'disabledExpr':
      case 'expandedExpr':
      case 'parentIdExpr':
        this._initAccessors();
        this._initDataAdapter();
        this.repaint();
        break;
      case 'items':
        this._initDataAdapter();
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  }
});
var _default = exports.default = HierarchicalCollectionWidget;