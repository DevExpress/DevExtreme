"use strict";

exports.default = void 0;
var _common = require("../core/utils/common");
var _extend = require("../core/utils/extend");
var _iterator = require("../core/utils/iterator");
var _array_query = _interopRequireDefault(require("./array_query"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function multiLevelGroup(query, groupInfo) {
  query = query.groupBy(groupInfo[0].selector);
  if (groupInfo.length > 1) {
    query = query.select(function (g) {
      return (0, _extend.extend)({}, g, {
        items: multiLevelGroup((0, _array_query.default)(g.items), groupInfo.slice(1)).toArray()
      });
    });
  }
  return query;
}
function arrangeSortingInfo(groupInfo, sortInfo) {
  const filteredGroup = [];
  (0, _iterator.each)(groupInfo, function (_, group) {
    const collision = (0, _common.grep)(sortInfo, function (sort) {
      return group.selector === sort.selector;
    });
    if (collision.length < 1) {
      filteredGroup.push(group);
    }
  });
  return filteredGroup.concat(sortInfo);
}
function queryByOptions(query, options, isCountQuery) {
  var _options;
  options = options || {};
  const filter = options.filter;
  if ((_options = options) !== null && _options !== void 0 && _options.langParams) {
    var _query$setLangParams, _query;
    (_query$setLangParams = (_query = query).setLangParams) === null || _query$setLangParams === void 0 || _query$setLangParams.call(_query, options.langParams);
  }
  if (filter) {
    query = query.filter(filter);
  }
  if (isCountQuery) {
    return query;
  }
  let sort = options.sort;
  const select = options.select;
  let group = options.group;
  const skip = options.skip;
  const take = options.take;
  if (group) {
    group = (0, _utils.normalizeSortingInfo)(group);
    group.keepInitialKeyOrder = !!options.group.keepInitialKeyOrder;
  }
  if (sort || group) {
    sort = (0, _utils.normalizeSortingInfo)(sort || []);
    if (group && !group.keepInitialKeyOrder) {
      sort = arrangeSortingInfo(group, sort);
    }
    (0, _iterator.each)(sort, function (index) {
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
var _default = exports.default = {
  multiLevelGroup,
  arrangeSortingInfo,
  queryByOptions
};
module.exports = exports.default;
module.exports.default = exports.default;