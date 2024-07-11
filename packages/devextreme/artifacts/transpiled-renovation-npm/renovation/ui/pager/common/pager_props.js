"use strict";

exports.PagerProps = exports.InternalPagerProps = void 0;
var _base_pager_props = require("./base_pager_props");
const PagerProps = exports.PagerProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_base_pager_props.BasePagerProps), Object.getOwnPropertyDescriptors({
  defaultPageSize: 5,
  pageSizeChange: () => {},
  defaultPageIndex: 1,
  pageIndexChange: () => {}
})));
const InternalPagerProps = exports.InternalPagerProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(_base_pager_props.BasePagerProps), Object.getOwnPropertyDescriptors({
  pageSize: 5,
  pageIndex: 1
})));