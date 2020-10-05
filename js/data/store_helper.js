import { grep } from '../core/utils/common';
import { extend } from '../core/utils/extend';
import { each } from '../core/utils/iterator';
import arrayQuery from './array_query';
import dataUtils from './utils';

function multiLevelGroup(query, groupInfo) {
    query = query.groupBy(groupInfo[0].selector);

    if(groupInfo.length > 1) {
        query = query.select(function(g) {
            return extend({}, g, {
                items: multiLevelGroup(arrayQuery(g.items), groupInfo.slice(1)).toArray()
            });
        });
    }

    return query;
}

function arrangeSortingInfo(groupInfo, sortInfo) {
    const filteredGroup = [];
    each(groupInfo, function(_, group) {
        const collision = grep(sortInfo, function(sort) {
            return group.selector === sort.selector;
        });

        if(collision.length < 1) {
            filteredGroup.push(group);
        }
    });
    return filteredGroup.concat(sortInfo);
}

function queryByOptions(query, options, isCountQuery) {
    options = options || {};

    const filter = options.filter;

    if(filter) {
        query = query.filter(filter);
    }

    if(isCountQuery) {
        return query;
    }

    let sort = options.sort;
    const select = options.select;
    let group = options.group;
    const skip = options.skip;
    const take = options.take;

    if(group) {
        group = dataUtils.normalizeSortingInfo(group);
        group.keepInitialKeyOrder = !!options.group.keepInitialKeyOrder;
    }

    if(sort || group) {
        sort = dataUtils.normalizeSortingInfo(sort || []);
        if(group && !group.keepInitialKeyOrder) {
            sort = arrangeSortingInfo(group, sort);
        }
        each(sort, function(index) {
            query = query[index ? 'thenBy' : 'sortBy'](this.selector, this.desc, this.compare);
        });
    }

    if(select) {
        query = query.select(select);
    }

    if(group) {
        query = multiLevelGroup(query, group);
    }

    if(take || skip) {
        query = query.slice(skip || 0, take);
    }

    return query;
}

export default {
    multiLevelGroup,
    arrangeSortingInfo,
    queryByOptions
};
