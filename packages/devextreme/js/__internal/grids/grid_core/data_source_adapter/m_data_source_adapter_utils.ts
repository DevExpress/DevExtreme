import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import commonUtils from '@ts/core/utils/m_common';
import type { StoreLoadOptions } from '@ts/data/data_source/types';

import { equalFilterParameters } from '../filter/utils';
import gridCoreUtils from '../m_utils';
import type {
  LoadOperation, OperationTypes, RawItemData,
} from './types';

export const cloneItems = (
  items: RawItemData[] | undefined,
  groupCount: number,
): RawItemData[] | undefined => {
  let result = items;
  if (result) {
    result = result.slice(0);
    if (groupCount) {
      for (let i = 0; i < result.length; i += 1) {
        result[i] = extend({ key: result[i].key }, result[i]);
        result[i].items = cloneItems(result[i].items as RawItemData[] | undefined, groupCount - 1);
      }
    }
  }
  return result;
};

export const calculateOperationTypes = (
  loadOptions: StoreLoadOptions,
  lastLoadOptions: (StoreLoadOptions & { groupExpand?: boolean }) | undefined,
  isFullReload?: boolean,
): OperationTypes => {
  let operationTypes: OperationTypes = { reload: true, fullReload: true };

  if (lastLoadOptions) {
    operationTypes = {
      sorting: !gridCoreUtils.equalSortParameters(loadOptions.sort, lastLoadOptions.sort),
      grouping: !gridCoreUtils.equalSortParameters(loadOptions.group, lastLoadOptions.group, true),
      groupExpanding: !gridCoreUtils.equalSortParameters(
        loadOptions.group,
        lastLoadOptions.group,
      ) || lastLoadOptions.groupExpand,
      filtering: !equalFilterParameters(
        loadOptions.filter,
        lastLoadOptions.filter,
        loadOptions.langParams,
      ),
      pageIndex: loadOptions.pageIndex !== lastLoadOptions.pageIndex,
      skip: loadOptions.skip !== lastLoadOptions.skip,
      take: loadOptions.take !== lastLoadOptions.take,
      pageSize: loadOptions.pageSize !== lastLoadOptions.pageSize,
      fullReload: Boolean(isFullReload),
      reload: false,
      paging: false,
    };

    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing -- OR of flags */
    operationTypes.reload = Boolean(
      isFullReload
      || operationTypes.sorting
      || operationTypes.grouping
      || operationTypes.filtering,
    );
    operationTypes.paging = Boolean(
      operationTypes.pageIndex
      || operationTypes.pageSize
      || operationTypes.take,
    );
    /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
  }

  return operationTypes;
};

export const executeTask = (action: () => void, timeout?: number): void => {
  if (isDefined(timeout)) {
    commonUtils.executeAsync(action, timeout);
  } else {
    action();
  }
};

export const createEmptyCachedData = (): { items: Record<string, unknown> } => ({ items: {} });

export const getGroupItemFromCache = (
  cacheItem: RawItemData | undefined,
  groupCount: number,
  skips: (number | undefined)[],
  takes: (number | undefined)[],
): RawItemData | undefined => {
  if (!groupCount || !cacheItem) {
    return cacheItem;
  }

  const result: RawItemData = { ...cacheItem };
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- NaN falls back to 0
  const skip = skips[0] || 0;
  const take = takes[0];
  const items = cacheItem.items as RawItemData[] | undefined;

  if (items) {
    if (take === undefined && !items[skip]) {
      return undefined;
    }
    result.items = [];
    if (skips.length) {
      result.isContinuation = true;
    }

    if (take) {
      result.isContinuationOnNextPage = Number(cacheItem.count) > take;
    }

    for (let i = 0; take === undefined ? items[i + skip] : i < take; i += 1) {
      const childCacheItem = items[i + skip];
      const isLast = i + 1 === take;
      const item = getGroupItemFromCache(
        childCacheItem,
        groupCount - 1,
        i === 0 ? skips.slice(1) : [],
        isLast ? takes.slice(1) : [],
      );

      if (item !== undefined) {
        (result.items as RawItemData[]).push(item);
      } else {
        return undefined;
      }
    }
  }

  return result;
};

export const getItemFromCache = (
  options: LoadOperation,
  cacheItem: RawItemData | undefined,
  groupCount: number,
  index: number,
  take: number,
): RawItemData | undefined => {
  if (groupCount && cacheItem) {
    const skips = index === 0 ? options.skips ?? [] : [];
    const takes = index === take - 1 ? options.takes ?? [] : [];

    return getGroupItemFromCache(cacheItem, groupCount, skips, takes);
  }
  return cacheItem;
};

export const fillItemsFromCache = (
  items: RawItemData[],
  options: LoadOperation,
  groupCount: number,
  fromEnd?: boolean,
): boolean => {
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

      const item = getItemFromCache(
        options,
        cacheItem as RawItemData | undefined,
        groupCount,
        localIndex,
        take,
      );

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

export const updatePagingOptionsByCache = (
  cacheItemsFromBegin: RawItemData[],
  options: LoadOperation,
  groupCount: number,
): void => {
  const cacheItemBeginCount = cacheItemsFromBegin.length;
  const { storeLoadOptions } = options;
  if (storeLoadOptions.skip !== undefined && storeLoadOptions.take && !groupCount) {
    const cacheItemsFromEnd: RawItemData[] = [];
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

export const getPageDataFromCache = (
  options: LoadOperation,
  updatePaging?: boolean,
): RawItemData[] | undefined => {
  const groupCount = gridCoreUtils.normalizeSortingInfo(
    // eslint-disable-next-line @stylistic/max-len
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/prefer-nullish-coalescing -- loadOptions is set when reached; group may be ''
    options.group || options.storeLoadOptions.group || options.loadOptions!.group,
  ).length;
  const items: RawItemData[] = [];
  if (fillItemsFromCache(items, options, groupCount)) {
    return items;
  }
  if (updatePaging) {
    updatePagingOptionsByCache(items, options, groupCount);
  }
  return undefined;
};

export const getCacheItem = (
  cacheItem: RawItemData | undefined,
  loadedItem: RawItemData | undefined,
  groupCount: number,
  skips: (number | undefined)[],
): RawItemData | undefined => {
  if (groupCount && loadedItem) {
    const result: RawItemData = { ...loadedItem };
    delete result.isContinuation;
    delete result.isContinuationOnNextPage;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- NaN falls back to 0
    const skip = skips[0] || 0;

    const loadedChildren = loadedItem.items as RawItemData[] | undefined;
    if (loadedChildren) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- items is untyped
      result.items = cacheItem?.items || {};
      const resultItems = result.items as Record<string, RawItemData | undefined>;
      loadedChildren.forEach((item, index: number) => {
        const globalIndex = index + skip;
        const childSkips = index === 0 ? skips.slice(1) : [];
        resultItems[globalIndex] = getCacheItem(
          resultItems[globalIndex],
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

export const setPageDataToCache = (
  options: LoadOperation,
  data: RawItemData[],
  groupCount: number,
): void => {
  const { storeLoadOptions } = options;
  const skip: number = options.skip ?? storeLoadOptions.skip ?? 0;
  const take: number = options.take ?? storeLoadOptions.take ?? 0;

  for (let i = 0; i < take; i += 1) {
    const globalIndex = i + skip;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- cachedData set by caller
    const cacheItems = options.cachedData!.items;
    const skips = i === 0 ? options.skips ?? [] : [];
    cacheItems[globalIndex] = getCacheItem(
      cacheItems[globalIndex] as RawItemData | undefined,
      data[i],
      groupCount,
      skips,
    );
  }
};
