import arrayQuery from '@js/common/data/array_query';
import type { SortingInfo } from '@js/common/data/utils';
import { normalizeSortingInfo } from '@js/common/data/utils';
import { extend } from '@js/core/utils/extend';
import { isObject } from '@js/core/utils/type';
import type { LangParams } from '@ts/data/array_query';

export interface DataQuery {
  /* eslint-disable @typescript-eslint/method-signature-style */
  setLangParams?(langParams: LangParams): void;
  filter(criteria: unknown): this;
  sortBy(getter: unknown, desc?: unknown, compare?: unknown): this;
  thenBy(getter: unknown, desc?: unknown, compare?: unknown): this;
  select(getter: unknown): this;
  slice(skip: number, take?: number): this;
  groupBy(getter: unknown): this;
  toArray(): unknown[];
  /* eslint-enable @typescript-eslint/method-signature-style */
}

interface GroupingInfo extends Array<SortingInfo> {
  keepInitialKeyOrder?: boolean;
}

export interface QueryByOptions {
  filter?: unknown;
  sort?: unknown;
  select?: unknown;
  group?: unknown;
  skip?: number;
  take?: number;
  langParams?: LangParams;
}

interface GroupResult {
  items?: unknown[];
}

function multiLevelGroup<TQuery extends DataQuery>(
  query: TQuery,
  groupInfo: SortingInfo[],
): TQuery {
  let result = query.groupBy(groupInfo[0].selector);

  if (groupInfo.length > 1) {
    result = result.select((group: unknown) => {
      const { items }: GroupResult = isObject(group) ? group : {};

      const merged: unknown = extend({}, group, {
        items: multiLevelGroup(arrayQuery(items ?? []), groupInfo.slice(1)).toArray(),
      });

      return merged;
    });
  }

  return result;
}

function arrangeSortingInfo(groupInfo: SortingInfo[], sortInfo: SortingInfo[]): SortingInfo[] {
  const filteredGroup = groupInfo.filter(
    (group) => !sortInfo.some((sort) => group.selector === sort.selector),
  );

  return filteredGroup.concat(sortInfo);
}

function queryByOptions<TQuery extends DataQuery>(
  query: TQuery,
  options?: QueryByOptions,
  isCountQuery?: boolean,
): TQuery {
  const queryOptions: QueryByOptions = options ?? {};
  let result = query;

  const { filter } = queryOptions;

  if (queryOptions.langParams) {
    result.setLangParams?.(queryOptions.langParams);
  }

  if (filter) {
    result = result.filter(filter);
  }

  if (isCountQuery) {
    return result;
  }

  const {
    sort, select, skip, take,
  } = queryOptions;

  // eslint-disable-next-line @typescript-eslint/init-declarations
  let group: GroupingInfo | undefined;
  if (queryOptions.group) {
    const groupOption: { keepInitialKeyOrder?: unknown } = isObject(queryOptions.group)
      ? queryOptions.group
      : {};

    group = normalizeSortingInfo(queryOptions.group);
    group.keepInitialKeyOrder = !!groupOption.keepInitialKeyOrder;
  }

  if (sort || group) {
    const sortInfo = normalizeSortingInfo(sort ?? []);
    const sortRules = group && !group.keepInitialKeyOrder
      ? arrangeSortingInfo(group, sortInfo)
      : sortInfo;

    sortRules.forEach((rule, index) => {
      result = index
        ? result.thenBy(rule.selector, rule.desc, rule.compare)
        : result.sortBy(rule.selector, rule.desc, rule.compare);
    });
  }

  if (select) {
    result = result.select(select);
  }

  if (group) {
    result = multiLevelGroup(result, group);
  }

  if (take || skip) {
    result = result.slice(skip ?? 0, take);
  }

  return result;
}

export default {
  multiLevelGroup,
  arrangeSortingInfo,
  queryByOptions,
};
