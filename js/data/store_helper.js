"use strict";

var $ = require("../core/renderer"),
    grep = require("../core/utils/common").grep,
    extend = require("../core/utils/extend").extend,
    arrayQuery = require("./array_query"),
    normalizeSortingInfo = require("./utils").normalizeSortingInfo;

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
    var filteredGroup = [];
    $.each(groupInfo, function(_, group) {
        var collision = grep(sortInfo, function(sort) {
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

    var filter = options.filter,
        sort = options.sort,
        select = options.select,
        group = options.group,
        skip = options.skip,
        take = options.take;

    if(filter) {
        query = query.filter(filter);
    }

    if(group) {
        group = normalizeSortingInfo(group);
    }

    if(!isCountQuery) {
        if(sort || group) {
            sort = normalizeSortingInfo(sort || []);
            if(group) {
                sort = arrangeSortingInfo(group, sort);
            }
            $.each(sort, function(index) {
                query = query[index ? "thenBy" : "sortBy"](this.selector, this.desc);
            });
        }

        if(select) {
            query = query.select(select);
        }
    }

    if(group) {
        query = multiLevelGroup(query, group);
    }

    if(!isCountQuery) {
        if(take || skip) {
            query = query.slice(skip || 0, take);
        }
    }

    return query;
}

module.exports = {
    multiLevelGroup: multiLevelGroup,
    arrangeSortingInfo: arrangeSortingInfo,
    queryByOptions: queryByOptions
};
