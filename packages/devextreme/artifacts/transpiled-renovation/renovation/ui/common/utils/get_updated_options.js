"use strict";

exports.getUpdatedOptions = getUpdatedOptions;
var _type = require("../../../../core/utils/type");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const defaultNotDeepCopyArrays = ['dataSource', 'selectedRowKeys'];
const propsToIgnore = {
  integrationOptions: true
};
function getDiffItem(key, value, previousValue) {
  return {
    path: key,
    value,
    previousValue
  };
}
function compare(resultPaths, item1, item2, key, fullPropName, notDeepCopyArrays) {
  if (propsToIgnore[key]) {
    return;
  }
  const type1 = (0, _type.type)(item1);
  const type2 = (0, _type.type)(item2);
  if (item1 === item2) return;
  if (type1 !== type2) {
    resultPaths.push(getDiffItem(key, item2, item1));
  } else if (type1 === 'object') {
    if (!(0, _type.isPlainObject)(item2)) {
      resultPaths.push(getDiffItem(key, item2, item1));
    } else {
      const diffPaths = objectDiffs(item1, item2, fullPropName, notDeepCopyArrays);
      resultPaths.push(...diffPaths.map(item => _extends({}, item, {
        path: `${key}.${item.path}`
      })));
    }
  } else if (type1 === 'array') {
    const notDeepCopy = notDeepCopyArrays.some(prop => fullPropName.includes(prop));
    if (notDeepCopy && item1 !== item2) {
      resultPaths.push(getDiffItem(key, item2, item1));
    } else if (item1.length !== item2.length) {
      resultPaths.push(getDiffItem(key, item2, item1));
    } else {
      const diffPaths = objectDiffs(item1, item2, fullPropName, notDeepCopyArrays);
      [].push.apply(resultPaths, diffPaths.map(item => _extends({}, item, {
        path: `${key}${item.path}`
      })));
    }
  } else {
    resultPaths.push(getDiffItem(key, item2, item1));
  }
}
const objectDiffsFiltered = propsEnumerator => (oldProps, props, fullPropName, notDeepCopyArrays) => {
  const resultPaths = [];
  const processItem = !Array.isArray(oldProps) ? propName => {
    compare(resultPaths, oldProps[propName], props[propName], propName, `${fullPropName}.${propName}`, notDeepCopyArrays);
  } : propName => {
    compare(resultPaths, oldProps[propName], props[propName], `[${propName}]`, `${fullPropName}.${propName}`, notDeepCopyArrays);
  };
  propsEnumerator(oldProps).forEach(processItem);
  Object.keys(props).filter(propName => !Object.prototype.hasOwnProperty.call(oldProps, propName) && oldProps[propName] !== props[propName]).forEach(propName => {
    resultPaths.push({
      path: propName,
      value: props[propName],
      previousValue: oldProps[propName]
    });
  });
  return resultPaths;
};
const objectDiffs = objectDiffsFiltered(oldProps => Object.keys(oldProps));
const reactProps = {
  key: true,
  ref: true,
  children: true,
  style: true
};
const objectDiffsWithoutReactProps = objectDiffsFiltered(prop => Object.keys(prop).filter(p => !reactProps[p]));
function getUpdatedOptions(oldProps, props) {
  let notDeepCopyArrays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultNotDeepCopyArrays;
  return objectDiffsWithoutReactProps(oldProps, props, '', notDeepCopyArrays);
}