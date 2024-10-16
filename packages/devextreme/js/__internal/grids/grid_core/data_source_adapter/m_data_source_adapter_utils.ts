import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import commonUtils from '@ts/core/utils/m_common';

import gridCoreUtils from '../m_utils';

export const cloneItems = function (items, groupCount) {
  if (items) {
    items = items.slice(0);
    if (groupCount) {
      for (let i = 0; i < items.length; i++) {
        items[i] = extend({ key: items[i].key }, items[i]);
        items[i].items = cloneItems(items[i].items, groupCount - 1);
      }
    }
  }
  return items;
};

export const calculateOperationTypes = function (loadOptions, lastLoadOptions, isFullReload?) {
  let operationTypes: any = { reload: true, fullReload: true };

  if (lastLoadOptions) {
    operationTypes = {
      sorting: !gridCoreUtils.equalSortParameters(loadOptions.sort, lastLoadOptions.sort),
      grouping: !gridCoreUtils.equalSortParameters(loadOptions.group, lastLoadOptions.group, true),
      groupExpanding: !gridCoreUtils.equalSortParameters(loadOptions.group, lastLoadOptions.group) || lastLoadOptions.groupExpand,
      filtering: !gridCoreUtils.equalFilterParameters(loadOptions.filter, lastLoadOptions.filter),
      pageIndex: loadOptions.pageIndex !== lastLoadOptions.pageIndex,
      skip: loadOptions.skip !== lastLoadOptions.skip,
      take: loadOptions.take !== lastLoadOptions.take,
      pageSize: loadOptions.pageSize !== lastLoadOptions.pageSize,
      fullReload: isFullReload,
      reload: false,
      paging: false,
    };

    operationTypes.reload = isFullReload || operationTypes.sorting || operationTypes.grouping || operationTypes.filtering;
    operationTypes.paging = operationTypes.pageIndex || operationTypes.pageSize || operationTypes.take;
  }

  return operationTypes;
};

export const executeTask = function (action, timeout) {
  if (isDefined(timeout)) {
    commonUtils.executeAsync(action, timeout);
  } else {
    action();
  }
};

export const createEmptyCachedData = function () {
  return { items: {} };
};

export const getPageDataFromCache = function (options, updatePaging?): any {
  const groupCount = gridCoreUtils.normalizeSortingInfo(options.group || options.storeLoadOptions.group || options.loadOptions.group).length;
  const items = [];
  if (fillItemsFromCache(items, options, groupCount)) {
    return items;
  } if (updatePaging) {
    updatePagingOptionsByCache(items, options, groupCount);
  }
};

export const fillItemsFromCache = function (items, options, groupCount, fromEnd?) {
  const { storeLoadOptions } = options;
  const take = options.take ?? storeLoadOptions.take ?? 0;
  const cachedItems = options.cachedData?.items;

  if (take && cachedItems) {
    const skip: number = options.skip ?? storeLoadOptions.skip ?? 0;
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

export const getItemFromCache = function (options, cacheItem, groupCount, index, take) {
  if (groupCount && cacheItem) {
    const skips = (index === 0 && options.skips) || [];
    const takes = (index === take - 1 && options.takes) || [];

    return getGroupItemFromCache(cacheItem, groupCount, skips, takes);
  }
  return cacheItem;
};

export const getGroupItemFromCache = function (cacheItem, groupCount, skips, takes) {
  if (groupCount && cacheItem) {
    const result = { ...cacheItem };
    const skip: number = skips[0] || 0;
    const take = takes[0];
    const { items } = cacheItem;

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

export const updatePagingOptionsByCache = function (cacheItemsFromBegin, options, groupCount) {
  const cacheItemBeginCount = cacheItemsFromBegin.length;
  const { storeLoadOptions } = options;
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

export const setPageDataToCache = function (options, data, groupCount) {
  const { storeLoadOptions } = options;
  const skip: number = options.skip ?? storeLoadOptions.skip ?? 0;
  const take: number = options.take ?? storeLoadOptions.take ?? 0;

  for (let i = 0; i < take; i += 1) {
    const globalIndex = i + skip;
    const cacheItems = options.cachedData.items;
    const skips = (i === 0 && options.skips) || [];
    cacheItems[globalIndex] = getCacheItem(cacheItems[globalIndex], data[i], groupCount, skips);
  }
};

export const getCacheItem = function (cacheItem, loadedItem, groupCount, skips) {
  if (groupCount && loadedItem) {
    const result = { ...loadedItem };
    delete result.isContinuation;
    delete result.isContinuationOnNextPage;
    const skip: number = skips[0] || 0;

    if (loadedItem.items) {
      result.items = cacheItem?.items || {};
      loadedItem.items.forEach((item, index: number) => {
        const globalIndex = index + skip;
        const childSkips = index === 0 ? skips.slice(1) : [];
        result.items[globalIndex] = getCacheItem(
          result.items[globalIndex],
          item,
          groupCount - 1,
          childSkips,
        );
      });
    }

    return result;
  }

  return loadedItem;
};
