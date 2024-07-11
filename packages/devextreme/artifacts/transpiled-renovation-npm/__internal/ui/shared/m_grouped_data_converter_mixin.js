"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _type = require("../../../core/utils/type");
const isCorrectStructure = data => Array.isArray(data) && data.every(item => {
  const hasTwoFields = Object.keys(item).length === 2;
  const hasCorrectFields = 'key' in item && 'items' in item;
  return hasTwoFields && hasCorrectFields && Array.isArray(item.items);
});
var _default = exports.default = {
  _getSpecificDataSourceOption() {
    const groupKey = 'key';
    let dataSource = this.option('dataSource');
    let hasSimpleItems = false;
    let data = {};
    if (this._getGroupedOption() && isCorrectStructure(dataSource)) {
      data = dataSource.reduce((accumulator, item) => {
        const items = item.items.map(innerItem => {
          if (!(0, _type.isObject)(innerItem)) {
            innerItem = {
              text: innerItem
            };
            hasSimpleItems = true;
          }
          if (!(groupKey in innerItem)) {
            innerItem[groupKey] = item.key;
          }
          return innerItem;
        });
        return accumulator.concat(items);
      }, []);
      dataSource = {
        store: {
          type: 'array',
          data
        },
        group: {
          selector: 'key',
          keepInitialKeyOrder: true
        }
      };
      if (hasSimpleItems) {
        dataSource.searchExpr = 'text';
      }
    }
    return dataSource;
  }
};