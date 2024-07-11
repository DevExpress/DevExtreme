"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FormItemsRunTimeInfo {
  constructor() {
    this._map = {};
  }
  _findWidgetInstance(condition) {
    let result;
    // @ts-expect-error
    (0, _iterator.each)(this._map, (guid, _ref) => {
      let {
        widgetInstance,
        item
      } = _ref;
      if (condition(item)) {
        result = widgetInstance;
        return false;
      }
    });
    return result;
  }
  _findFieldByCondition(callback, valueExpr) {
    let result;
    // @ts-expect-error
    (0, _iterator.each)(this._map, (key, value) => {
      if (callback(value)) {
        result = valueExpr === 'guid' ? key : value[valueExpr];
        return false;
      }
    });
    return result;
  }
  clear() {
    this._map = {};
  }
  removeItemsByItems(itemsRunTimeInfo) {
    (0, _iterator.each)(itemsRunTimeInfo.getItems(), guid => this.removeItemByKey(guid));
  }
  removeItemByKey(key) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this._map[key];
  }
  add(options) {
    const key = options.guid || new _guid.default();
    this._map[key] = options;
    return key;
  }
  addItemsOrExtendFrom(itemsRunTimeInfo) {
    itemsRunTimeInfo.each((key, itemRunTimeInfo) => {
      if (this._map[key]) {
        if (itemRunTimeInfo.widgetInstance) {
          this._map[key].widgetInstance = itemRunTimeInfo.widgetInstance;
        }
        this._map[key].$itemContainer = itemRunTimeInfo.$itemContainer;
      } else {
        this.add({
          item: itemRunTimeInfo.item,
          widgetInstance: itemRunTimeInfo.widgetInstance,
          guid: key,
          $itemContainer: itemRunTimeInfo.$itemContainer
        });
      }
    });
  }
  extendRunTimeItemInfoByKey(key, options) {
    if (this._map[key]) {
      this._map[key] = (0, _extend.extend)(this._map[key], options);
    }
  }
  findWidgetInstanceByItem(item) {
    return this._findWidgetInstance(storedItem => storedItem === item);
  }
  findGroupOrTabLayoutManagerByPath(targetPath) {
    return this._findFieldByCondition(_ref2 => {
      let {
        path
      } = _ref2;
      return path === targetPath;
    }, 'layoutManager');
  }
  findKeyByPath(targetPath) {
    return this._findFieldByCondition(_ref3 => {
      let {
        path
      } = _ref3;
      return path === targetPath;
    }, 'guid');
  }
  findWidgetInstanceByName(name) {
    return this._findWidgetInstance(item => name === item.name);
  }
  findWidgetInstanceByDataField(dataField) {
    return this._findWidgetInstance(item => dataField === ((0, _type.isString)(item) ? item : item.dataField));
  }
  findItemContainerByItem(item) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this._map) {
      if (this._map[key].item === item) {
        return this._map[key].$itemContainer;
      }
    }
    return null;
  }
  findItemIndexByItem(targetItem) {
    return this._findFieldByCondition(_ref4 => {
      let {
        item
      } = _ref4;
      return item === targetItem;
    }, 'itemIndex');
  }
  findPreparedItemByItem(item) {
    return this._findFieldByCondition(_ref5 => {
      let {
        item: currentItem
      } = _ref5;
      return currentItem === item;
    }, 'preparedItem');
  }
  getItems() {
    return this._map;
  }
  each(handler) {
    (0, _iterator.each)(this._map, (key, itemRunTimeInfo) => {
      handler(key, itemRunTimeInfo);
    });
  }
  removeItemsByPathStartWith(path) {
    const keys = Object.keys(this._map);
    const filteredKeys = keys.filter(key => {
      if (this._map[key].path) {
        return this._map[key].path.indexOf(path, 0) > -1;
      }
      return false;
    });
    filteredKeys.forEach(key => this.removeItemByKey(key));
  }
}
exports.default = FormItemsRunTimeInfo;