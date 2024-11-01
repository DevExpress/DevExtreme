import arrayQuery from '@js/common/data/array_query';
import { normalizeSortingInfo } from '@js/common/data/utils';
// @ts-expect-error
import { grep } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';

function multiLevelGroup(query, groupInfo) {
  query = query.groupBy(groupInfo[0].selector);

  if (groupInfo.length > 1) {
    query = query.select((g) => extend({}, g, {
      // @ts-expect-error
      items: multiLevelGroup(arrayQuery(g.items), groupInfo.slice(1)).toArray(),
    }));
  }

  return query;
}

function arrangeSortingInfo(groupInfo, sortInfo) {
  const filteredGroup = [];
  each(groupInfo, (_, group) => {
    const collision = grep(sortInfo, (sort) => group.selector === sort.selector);

    if (collision.length < 1) {
      // @ts-expect-error
      filteredGroup.push(group);
    }
  });
  return filteredGroup.concat(sortInfo);
}

function queryByOptions(query, options, isCountQuery) {
  options = options || {};

  const { filter } = options;

  if (options?.langParams) {
    query.setLangParams?.(options.langParams);
  }

  if (filter) {
    query = query.filter(filter);
  }

  if (isCountQuery) {
    return query;
  }

  let { sort } = options;
  const { select } = options;
  let { group } = options;
  const { skip } = options;
  const { take } = options;

  if (group) {
    group = normalizeSortingInfo(group);
    group.keepInitialKeyOrder = !!options.group.keepInitialKeyOrder;
  }
  if (sort || group) {
    sort = normalizeSortingInfo(sort || []);
    if (group && !group.keepInitialKeyOrder) {
      sort = arrangeSortingInfo(group, sort);
    }
    each(sort, function (index) {
      query = query[index ? 'thenBy' : 'sortBy'](this.selector, this.desc, this.compare);
    });
  }

  if (select) {
    query = query.select(select);
  }

  if (group) {
    query = multiLevelGroup(query, group);
  }

  if (take || skip) {
    query = query.slice(skip || 0, take);
  }

  return query;
}

export default {
  multiLevelGroup,
  arrangeSortingInfo,
  queryByOptions,
};
