import { grep } from '../core/utils/common';
import { extend } from '../core/utils/extend';
import { each } from '../core/utils/iterator';
import arrayQuery from './array_query';
import { normalizeSortingInfo } from './utils';
import { isCompareOptions } from '../core/utils/data';

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

function _getOptionsAndFilters(filterWithOptions) {
    let options = {};

    if(!Array.isArray(filterWithOptions) || filterWithOptions.length === 0) {
        return { filters: filterWithOptions, options: options };
    }

    const handleCriteria = (criteria) => {
        const _empty = {};

        criteria.forEach((crit, i) => {
            if(Array.isArray(crit)) {
                criteria[i] = handleCriteria(crit);
            }
        });

        const optsIndex = criteria.findIndex((crit) => {
            return isCompareOptions(crit) || (Array.isArray(crit) && crit?.length === 0);
        });

        if(optsIndex !== -1) {
            options = { ...options, ...criteria[optsIndex] };
            criteria[optsIndex] = _empty;
            optsIndex > 0 && (criteria[optsIndex - 1] = _empty);
            (optsIndex + 1) !== criteria.length && (criteria[optsIndex + 1] = _empty);

            const cleanCriteria = criteria.filter((c) => c !== _empty);
            criteria.length = 0;
            criteria.push(...cleanCriteria);

            if(criteria.length === 1 && Array.isArray(criteria[0])) {
                criteria = criteria[0];
            }
        }

        return criteria;
    };

    let filters = handleCriteria(filterWithOptions);

    if(filters.length === 1) {
        filters = filters[0];
    } else if(filters.length === 0) {
        filters = null;
    }

    return { filters, options };
}

function queryByOptions(query, options, isCountQuery) {
    options = options || {};

    let filters = null;
    let compareOptions = options.compareOptions;

    if(options.filter) {
        const optionsAndFilters = _getOptionsAndFilters(options.filter);

        filters = optionsAndFilters.filters;
        compareOptions = { ...compareOptions, ...optionsAndFilters.options };
    }

    if(compareOptions) {
        query.setCompareOptions?.(compareOptions);
    }

    if(filters) {
        query = query.filter(filters);
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

export default {
    multiLevelGroup,
    arrangeSortingInfo,
    queryByOptions
};
