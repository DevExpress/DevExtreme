"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePagingOptionsByCache = exports.setPageDataToCache = exports.getPageDataFromCache = exports.getItemFromCache = exports.getGroupItemFromCache = exports.getCacheItem = exports.fillItemsFromCache = exports.executeTask = exports.createEmptyCachedData = exports.cloneItems = exports.calculateOperationTypes = void 0;
var _common = require("../../../../core/utils/common");
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-expect-error
const cloneItems = function (items, groupCount) {
  if (items) {
    items = items.slice(0);
    if (groupCount) {
      for (let i = 0; i < items.length; i++) {
        items[i] = (0, _extend.extend)({
          key: items[i].key
        }, items[i]);
        items[i].items = cloneItems(items[i].items, groupCount - 1);
      }
    }
  }
  return items;
};
exports.cloneItems = cloneItems;
const calculateOperationTypes = function (loadOptions, lastLoadOptions, isFullReload) {
  let operationTypes = {
    reload: true,
    fullReload: true
  };
  if (lastLoadOptions) {
    operationTypes = {
      sorting: !_m_utils.default.equalSortParameters(loadOptions.sort, lastLoadOptions.sort),
      grouping: !_m_utils.default.equalSortParameters(loadOptions.group, lastLoadOptions.group, true),
      groupExpanding: !_m_utils.default.equalSortParameters(loadOptions.group, lastLoadOptions.group) || lastLoadOptions.groupExpand,
      filtering: !_m_utils.default.equalFilterParameters(loadOptions.filter, lastLoadOptions.filter),
      pageIndex: loadOptions.pageIndex !== lastLoadOptions.pageIndex,
      skip: loadOptions.skip !== lastLoadOptions.skip,
      take: loadOptions.take !== lastLoadOptions.take,
      pageSize: loadOptions.pageSize !== lastLoadOptions.pageSize,
      fullReload: isFullReload,
      reload: false,
      paging: false
    };
    operationTypes.reload = isFullReload || operationTypes.sorting || operationTypes.grouping || operationTypes.filtering;
    operationTypes.paging = operationTypes.pageIndex || operationTypes.pageSize || operationTypes.take;
  }
  return operationTypes;
};
exports.calculateOperationTypes = calculateOperationTypes;
const executeTask = function (action, timeout) {
  if ((0, _type.isDefined)(timeout)) {
    (0, _common.executeAsync)(action, timeout);
  } else {
    action();
  }
};
exports.executeTask = executeTask;
const createEmptyCachedData = function () {
  return {
    items: {}
  };
};
exports.createEmptyCachedData = createEmptyCachedData;
const getPageDataFromCache = function (options, updatePaging) {
  const groupCount = _m_utils.default.normalizeSortingInfo(options.group || options.storeLoadOptions.group || options.loadOptions.group).length;
  const items = [];
  if (fillItemsFromCache(items, options, groupCount)) {
    return items;
  }
  if (updatePaging) {
    updatePagingOptionsByCache(items, options, groupCount);
  }
};
exports.getPageDataFromCache = getPageDataFromCache;
const fillItemsFromCache = function (items, options, groupCount, fromEnd) {
  var _options$cachedData;
  const {
    storeLoadOptions
  } = options;
  const take = options.take ?? storeLoadOptions.take ?? 0;
  const cachedItems = (_options$cachedData = options.cachedData) === null || _options$cachedData === void 0 ? void 0 : _options$cachedData.items;
  if (take && cachedItems) {
    const skip = options.skip ?? storeLoadOptions.skip ?? 0;
    for (let i = 0; i < take; i += 1) {
      const localIndex = fromEnd ? take - 1 - i : i;
      const cacheItemIndex = localIndex + skip;
      const cacheItem = cachedItems[cacheItemIndex];
      if (cacheItem === undefined && cacheItemIndex in cachedItems) {
        return true;
      }
      const item = getItemFromCache(options, cacheItem, groupCount, localIndex, take);
      if (item) {
        items.push(item);
      } else {
        return false;
      }
    }
    return true;
  }
  return false;
};
exports.fillItemsFromCache = fillItemsFromCache;
const getItemFromCache = function (options, cacheItem, groupCount, index, take) {
  if (groupCount && cacheItem) {
    const skips = index === 0 && options.skips || [];
    const takes = index === take - 1 && options.takes || [];
    return getGroupItemFromCache(cacheItem, groupCount, skips, takes);
  }
  return cacheItem;
};
exports.getItemFromCache = getItemFromCache;
const getGroupItemFromCache = function (cacheItem, groupCount, skips, takes) {
  if (groupCount && cacheItem) {
    const result = _extends({}, cacheItem);
    const skip = skips[0] || 0;
    const take = takes[0];
    const {
      items
    } = cacheItem;
    if (items) {
      if (take === undefined && !items[skip]) {
        return;
      }
      result.items = [];
      if (skips.length) {
        result.isContinuation = true;
      }
      if (take) {
        result.isContinuationOnNextPage = cacheItem.count > take;
      }
      for (let i = 0; take === undefined ? items[i + skip] : i < take; i += 1) {
        const childCacheItem = items[i + skip];
        const isLast = i + 1 === take;
        const item = getGroupItemFromCache(childCacheItem, groupCount - 1, i === 0 ? skips.slice(1) : [], isLast ? takes.slice(1) : []);
        if (item !== undefined) {
          result.items.push(item);
        } else {
          return;
        }
      }
    }
    return result;
  }
  return cacheItem;
};
exports.getGroupItemFromCache = getGroupItemFromCache;
const updatePagingOptionsByCache = function (cacheItemsFromBegin, options, groupCount) {
  const cacheItemBeginCount = cacheItemsFromBegin.length;
  const {
    storeLoadOptions
  } = options;
  if (storeLoadOptions.skip !== undefined && storeLoadOptions.take && !groupCount) {
    const cacheItemsFromEnd = [];
    fillItemsFromCache(cacheItemsFromEnd, options, groupCount, true);
    const cacheItemEndCount = cacheItemsFromEnd.length;
    if (cacheItemBeginCount || cacheItemEndCount) {
      options.skip = options.skip ?? storeLoadOptions.skip;
      options.take = options.take ?? storeLoadOptions.take;
    }
    if (cacheItemBeginCount) {
      storeLoadOptions.skip += cacheItemBeginCount;
      storeLoadOptions.take -= cacheItemBeginCount;
      options.cachedDataPartBegin = cacheItemsFromBegin;
    }
    if (cacheItemEndCount) {
      storeLoadOptions.take -= cacheItemEndCount;
      options.cachedDataPartEnd = cacheItemsFromEnd.reverse();
    }
  }
};
exports.updatePagingOptionsByCache = updatePagingOptionsByCache;
const setPageDataToCache = function (options, data, groupCount) {
  const {
    storeLoadOptions
  } = options;
  const skip = options.skip ?? storeLoadOptions.skip ?? 0;
  const take = options.take ?? storeLoadOptions.take ?? 0;
  for (let i = 0; i < take; i += 1) {
    const globalIndex = i + skip;
    const cacheItems = options.cachedData.items;
    const skips = i === 0 && options.skips || [];
    cacheItems[globalIndex] = getCacheItem(cacheItems[globalIndex], data[i], groupCount, skips);
  }
};
exports.setPageDataToCache = setPageDataToCache;
const getCacheItem = function (cacheItem, loadedItem, groupCount, skips) {
  if (groupCount && loadedItem) {
    const result = _extends({}, loadedItem);
    delete result.isContinuation;
    delete result.isContinuationOnNextPage;
    const skip = skips[0] || 0;
    if (loadedItem.items) {
      result.items = (cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.items) || {};
      loadedItem.items.forEach((item, index) => {
        const globalIndex = index + skip;
        const childSkips = index === 0 ? skips.slice(1) : [];
        result.items[globalIndex] = getCacheItem(result.items[globalIndex], item, groupCount - 1, childSkips);
      });
    }
    return result;
  }
  return loadedItem;
};
exports.getCacheItem = getCacheItem;