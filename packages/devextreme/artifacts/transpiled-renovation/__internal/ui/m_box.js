"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _inflector = require("../../core/utils/inflector");
var _iterator = require("../../core/utils/iterator");
var _style = require("../../core/utils/style");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _uiCollection_widget = _interopRequireDefault(require("../../ui/collection/ui.collection_widget.edit"));
var _m_item = _interopRequireDefault(require("../ui/collection/m_item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line max-classes-per-file

const BOX_CLASS = 'dx-box';
const BOX_FLEX_CLASS = 'dx-box-flex';
const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_DATA_KEY = 'dxBoxItemData';
const SHRINK = 1;
const MINSIZE_MAP = {
  row: 'minWidth',
  col: 'minHeight'
};
const MAXSIZE_MAP = {
  row: 'maxWidth',
  col: 'maxHeight'
};
const FLEX_JUSTIFY_CONTENT_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-between': 'space-between',
  'space-around': 'space-around'
};
const FLEX_ALIGN_ITEMS_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch'
};
const FLEX_DIRECTION_MAP = {
  row: 'row',
  col: 'column'
};
const setFlexProp = (element, prop, value) => {
  // NOTE: workaround for jQuery version < 1.11.1 (T181692)
  value = (0, _style.normalizeStyleProp)(prop, value);
  element.style[(0, _style.styleProp)(prop)] = value;
  // NOTE: workaround for Domino issue https://github.com/fgnass/domino/issues/119
  if (!(0, _window.hasWindow)()) {
    if (value === '' || !(0, _type.isDefined)(value)) {
      return;
    }
    const cssName = (0, _inflector.dasherize)(prop);
    const styleExpr = `${cssName}: ${value};`;
    (0, _style.setStyle)(element, styleExpr, false);
  }
};
class BoxItem extends _m_item.default {
  _renderVisible(value, oldValue) {
    // @ts-expect-error
    super._renderVisible(value);
    if ((0, _type.isDefined)(oldValue)) {
      // @ts-expect-error
      this._options.fireItemStateChangedAction({
        name: 'visible',
        state: value,
        oldState: oldValue
      });
    }
  }
}
class LayoutStrategy {
  constructor($element, option) {
    this._$element = $element;
    this._option = option;
  }
  renderBox() {
    this._$element.css({
      display: `${(0, _style.stylePropPrefix)('flexDirection')}flex`
    });
    setFlexProp(this._$element.get(0), 'flexDirection', FLEX_DIRECTION_MAP[this._option('direction')]);
  }
  renderAlign() {
    this._$element.css({
      justifyContent: this._normalizedAlign()
    });
  }
  _normalizedAlign() {
    const align = this._option('align');
    return align in FLEX_JUSTIFY_CONTENT_MAP ? FLEX_JUSTIFY_CONTENT_MAP[align] : align;
  }
  renderCrossAlign() {
    this._$element.css({
      alignItems: this._normalizedCrossAlign()
    });
  }
  _normalizedCrossAlign() {
    const crossAlign = this._option('crossAlign');
    return crossAlign in FLEX_ALIGN_ITEMS_MAP ? FLEX_ALIGN_ITEMS_MAP[crossAlign] : crossAlign;
  }
  renderItems($items) {
    const flexPropPrefix = (0, _style.stylePropPrefix)('flexDirection');
    const direction = this._option('direction');
    (0, _iterator.each)($items, function () {
      const $item = (0, _renderer.default)(this);
      const item = $item.data(BOX_ITEM_DATA_KEY);
      // @ts-expect-error
      $item.css({
        display: `${flexPropPrefix}flex`
      }).css(MAXSIZE_MAP[direction], item.maxSize || 'none').css(MINSIZE_MAP[direction], item.minSize || '0');
      setFlexProp($item.get(0), 'flexBasis', item.baseSize || 0);
      setFlexProp($item.get(0), 'flexGrow', item.ratio);
      setFlexProp($item.get(0), 'flexShrink', (0, _type.isDefined)(item.shrink) ? item.shrink : SHRINK);
      // @ts-expect-error
      $item.children().each((_, itemContent) => {
        // @ts-expect-error
        (0, _renderer.default)(itemContent).css({
          width: 'auto',
          height: 'auto',
          display: `${(0, _style.stylePropPrefix)('flexDirection')}flex`,
          flexBasis: 0
        });
        setFlexProp(itemContent, 'flexGrow', 1);
        setFlexProp(itemContent, 'flexDirection', (0, _renderer.default)(itemContent)[0].style.flexDirection || 'column');
      });
    });
  }
}
class Box extends _uiCollection_widget.default {
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      direction: 'row',
      align: 'start',
      crossAlign: 'stretch',
      activeStateEnabled: false,
      focusStateEnabled: false,
      onItemStateChanged: undefined,
      _queue: undefined
    });
  }
  _itemClass() {
    return BOX_ITEM_CLASS;
  }
  _itemDataKey() {
    return BOX_ITEM_DATA_KEY;
  }
  _itemElements() {
    // @ts-expect-error
    return this._itemContainer().children(this._itemSelector());
  }
  _init() {
    super._init();
    // @ts-expect-error
    this.$element().addClass(BOX_FLEX_CLASS);
    this._initLayout();
    this._initBoxQueue();
  }
  _initLayout() {
    // @ts-expect-error
    this._layout = new LayoutStrategy(this.$element(), this.option.bind(this));
  }
  _initBoxQueue() {
    // @ts-expect-error
    this._queue = this.option('_queue') || [];
  }
  _queueIsNotEmpty() {
    // @ts-expect-error
    return this.option('_queue') ? false : !!this._queue.length;
  }
  _pushItemToQueue($item, config) {
    this._queue.push({
      $item,
      config
    });
  }
  _shiftItemFromQueue() {
    return this._queue.shift();
  }
  _initMarkup() {
    // @ts-expect-error
    this.$element().addClass(BOX_CLASS);
    this._layout.renderBox();
    super._initMarkup();
    this._renderAlign();
    this._renderActions();
  }
  _renderActions() {
    // @ts-expect-error
    this._onItemStateChanged = this._createActionByOption('onItemStateChanged');
  }
  _renderAlign() {
    this._layout.renderAlign();
    this._layout.renderCrossAlign();
  }
  _renderItems(items) {
    super._renderItems(items);
    while (this._queueIsNotEmpty()) {
      const item = this._shiftItemFromQueue();
      // @ts-expect-error
      this._createComponent(item.$item, Box, (0, _extend.extend)({
        // @ts-expect-error
        itemTemplate: this.option('itemTemplate'),
        // @ts-expect-error
        itemHoldTimeout: this.option('itemHoldTimeout'),
        // @ts-expect-error
        onItemHold: this.option('onItemHold'),
        // @ts-expect-error
        onItemClick: this.option('onItemClick'),
        // @ts-expect-error
        onItemContextMenu: this.option('onItemContextMenu'),
        // @ts-expect-error
        onItemRendered: this.option('onItemRendered'),
        _queue: this._queue
      }, item.config));
    }
    this._layout.renderItems(this._itemElements());
  }
  _renderItemContent(args) {
    const $itemNode = args.itemData && args.itemData.node;
    if ($itemNode) {
      // @ts-expect-error
      return this._renderItemContentByNode(args, $itemNode);
    }
    return super._renderItemContent(args);
  }
  _postprocessRenderItem(args) {
    const boxConfig = args.itemData.box;
    if (!boxConfig) {
      return;
    }
    this._pushItemToQueue(args.itemContent, boxConfig);
  }
  _createItemByTemplate(itemTemplate, args) {
    if (args.itemData.box) {
      // @ts-expect-error
      return itemTemplate.source ? itemTemplate.source() : (0, _renderer.default)();
    }
    return super._createItemByTemplate(itemTemplate, args);
  }
  _itemOptionChanged(item, property, value, oldValue) {
    if (property === 'visible') {
      // @ts-expect-error
      this._onItemStateChanged({
        name: property,
        state: value,
        oldState: oldValue !== false
      });
    }
    super._itemOptionChanged(item, property, value);
  }
  _optionChanged(args) {
    switch (args.name) {
      case '_queue':
      case 'direction':
        // @ts-expect-error
        this._invalidate();
        break;
      case 'align':
        this._layout.renderAlign();
        break;
      case 'crossAlign':
        this._layout.renderCrossAlign();
        break;
      default:
        super._optionChanged(args);
    }
  }
  _itemOptions() {
    const options = super._itemOptions();
    options.fireItemStateChangedAction = e => {
      // @ts-expect-error
      this._onItemStateChanged(e);
    };
    return options;
  }
}
// @ts-expect-error
Box.ItemClass = BoxItem;
// @ts-expect-error
(0, _component_registrator.default)('dxBox', Box);
var _default = exports.default = Box;