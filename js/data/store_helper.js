const grep = require('../core/utils/common').grep;
const extend = require('../core/utils/extend').extend;
const each = require('../core/utils/iterator').each;
const arrayQuery = require('./array_query');
const normalizeSortingInfo = require('./utils').normalizeSortingInfo;

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
        group = normalizeSortingInfo(group);
        group.keepInitialKeyOrder = !!options.group.keepInitialKeyOrder;
    }

    if(sort || group) {
        sort = normalizeSortingInfo(sort || []);
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

module.exports = {
    multiLevelGroup: multiLevelGroup,
    arrangeSortingInfo: arrangeSortingInfo,
    queryByOptions: queryByOptions
};
