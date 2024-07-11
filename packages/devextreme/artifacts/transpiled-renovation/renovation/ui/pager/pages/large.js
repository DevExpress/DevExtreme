"use strict";

exports.viewFunction = exports.PagesLarge = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _page = require("./page");
var _pager_props = require("../common/pager_props");
var _config_context = require("../../../common/config_context");
const _excluded = ["pageIndexes"],
  _excluded2 = ["maxPagesCount", "pageCount", "pageIndex", "pageIndexChange"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const PAGER_PAGE_SEPARATOR_CLASS = 'dx-separator';
const viewFunction = _ref => {
  let {
    pages
  } = _ref;
  const PagesMarkup = pages.map(_ref2 => {
    let {
      key,
      pageProps
    } = _ref2;
    return pageProps ? (0, _inferno.createComponentVNode)(2, _page.Page, {
      "index": pageProps.index,
      "selected": pageProps.selected,
      "onClick": pageProps.onClick
    }, key) : (0, _inferno.createVNode)(1, "div", PAGER_PAGE_SEPARATOR_CLASS, ". . .", 16, null, key);
  });
  return (0, _inferno.createFragment)(PagesMarkup, 0);
};
exports.viewFunction = viewFunction;
const PAGES_LIMITER = 4;
function getDelimiterType(startIndex, slidingWindowSize, pageCount) {
  if (startIndex === 1) {
    return 'high';
  }
  if (startIndex + slidingWindowSize === pageCount - 1) {
    return 'low';
  }
  return 'both';
}
function createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter) {
  let pageIndexes = [];
  let indexesForReuse = [];
  switch (delimiter) {
    case 'none':
      pageIndexes = [...slidingWindowIndexes];
      break;
    case 'both':
      pageIndexes = [0, 'low', ...slidingWindowIndexes, 'high', pageCount - 1];
      indexesForReuse = slidingWindowIndexes.slice(1, -1);
      break;
    case 'high':
      pageIndexes = [0, ...slidingWindowIndexes, 'high', pageCount - 1];
      indexesForReuse = slidingWindowIndexes.slice(0, -1);
      break;
    case 'low':
      pageIndexes = [0, 'low', ...slidingWindowIndexes, pageCount - 1];
      indexesForReuse = slidingWindowIndexes.slice(1);
      break;
  }
  return {
    slidingWindowIndexes,
    indexesForReuse,
    pageIndexes
  };
}
function createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter) {
  const slidingWindowIndexes = [];
  for (let i = 0; i < slidingWindowSize; i += 1) {
    slidingWindowIndexes.push(i + startIndex);
  }
  return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter);
}
const PagesLargePropsType = {
  get pageIndex() {
    return _pager_props.InternalPagerProps.pageIndex;
  },
  get maxPagesCount() {
    return _pager_props.InternalPagerProps.maxPagesCount;
  },
  get pageCount() {
    return _pager_props.InternalPagerProps.pageCount;
  }
};
class PagesLarge extends _inferno2.BaseInfernoComponent {
  get config() {
    if (this.context[_config_context.ConfigContext.id]) {
      return this.context[_config_context.ConfigContext.id];
    }
    return _config_context.ConfigContext.defaultValue;
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.canReuseSlidingWindow = this.canReuseSlidingWindow.bind(this);
    this.generatePageIndexes = this.generatePageIndexes.bind(this);
    this.isSlidingWindowMode = this.isSlidingWindowMode.bind(this);
    this.onPageClick = this.onPageClick.bind(this);
  }
  get slidingWindowState() {
    const slidingWindowState = this.slidingWindowStateHolder;
    if (!slidingWindowState) {
      return {
        indexesForReuse: [],
        slidingWindowIndexes: []
      };
    }
    return slidingWindowState;
  }
  canReuseSlidingWindow(currentPageCount, pageIndex) {
    const {
      indexesForReuse
    } = this.slidingWindowState;
    const lastPageIsFartherThanWindow = indexesForReuse.slice(-1)[0] < currentPageCount - 1;
    const pageIndexExistInIndexes = indexesForReuse.includes(pageIndex);
    return lastPageIsFartherThanWindow && pageIndexExistInIndexes;
  }
  generatePageIndexes() {
    const {
      pageCount,
      pageIndex
    } = this.props;
    let startIndex = 0;
    const {
      slidingWindowIndexes
    } = this.slidingWindowState;
    if (pageIndex === slidingWindowIndexes[0]) {
      startIndex = pageIndex - 1;
    } else if (pageIndex === slidingWindowIndexes[slidingWindowIndexes.length - 1]) {
      startIndex = pageIndex + 2 - PAGES_LIMITER;
    } else if (pageIndex < PAGES_LIMITER) {
      startIndex = 1;
    } else if (pageIndex >= pageCount - PAGES_LIMITER) {
      startIndex = pageCount - PAGES_LIMITER - 1;
    } else {
      startIndex = pageIndex - 1;
    }
    const slidingWindowSize = PAGES_LIMITER;
    const delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);
    const _createPageIndexes = createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter),
      {
        pageIndexes
      } = _createPageIndexes,
      slidingWindowState = _objectWithoutPropertiesLoose(_createPageIndexes, _excluded);
    this.slidingWindowStateHolder = slidingWindowState;
    return pageIndexes;
  }
  isSlidingWindowMode() {
    const {
      maxPagesCount,
      pageCount
    } = this.props;
    return pageCount <= PAGES_LIMITER || pageCount <= maxPagesCount;
  }
  onPageClick(pageIndex) {
    this.props.pageIndexChange(pageIndex);
  }
  get pageIndexes() {
    const {
      pageCount
    } = this.props;
    if (this.isSlidingWindowMode()) {
      return createPageIndexes(0, pageCount, pageCount, 'none').pageIndexes;
    }
    if (this.canReuseSlidingWindow(pageCount, this.props.pageIndex)) {
      const {
        slidingWindowIndexes
      } = this.slidingWindowState;
      const delimiter = getDelimiterType(slidingWindowIndexes[0], PAGES_LIMITER, pageCount);
      return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter).pageIndexes;
    }
    return this.generatePageIndexes();
  }
  get pages() {
    var _this$config;
    const {
      pageIndex
    } = this.props;
    const createPage = index => {
      const pagerProps = index === 'low' || index === 'high' ? null : {
        index,
        onClick: () => this.onPageClick(index),
        selected: pageIndex === index
      };
      return {
        key: index.toString(),
        pageProps: pagerProps
      };
    };
    const rtlPageIndexes = (_this$config = this.config) !== null && _this$config !== void 0 && _this$config.rtlEnabled ? [...this.pageIndexes].reverse() : this.pageIndexes;
    return rtlPageIndexes.map(index => createPage(index));
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded2);
    return restProps;
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      pageIndexes: this.pageIndexes,
      pages: this.pages,
      restAttributes: this.restAttributes
    });
  }
}
exports.PagesLarge = PagesLarge;
PagesLarge.defaultProps = PagesLargePropsType;