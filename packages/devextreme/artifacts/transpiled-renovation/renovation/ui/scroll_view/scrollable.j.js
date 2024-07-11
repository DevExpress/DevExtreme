"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _scrollable = require("../../component_wrapper/navigation/scrollable");
var _scrollable2 = require("./scrollable");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Scrollable extends _scrollable.ScrollableWrapper {
  content() {
    var _this$viewRef;
    return this._toPublicElement((_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.content(...arguments));
  }
  container() {
    var _this$viewRef2;
    return this._toPublicElement((_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.container(...arguments));
  }
  scrollTo(targetLocation) {
    var _this$viewRef3;
    return (_this$viewRef3 = this.viewRef) === null || _this$viewRef3 === void 0 ? void 0 : _this$viewRef3.scrollTo(...arguments);
  }
  scrollBy(distance) {
    var _this$viewRef4;
    return (_this$viewRef4 = this.viewRef) === null || _this$viewRef4 === void 0 ? void 0 : _this$viewRef4.scrollBy(...arguments);
  }
  updateHandler() {
    var _this$viewRef5;
    return (_this$viewRef5 = this.viewRef) === null || _this$viewRef5 === void 0 ? void 0 : _this$viewRef5.updateHandler(...arguments);
  }
  release() {
    var _this$viewRef6;
    return (_this$viewRef6 = this.viewRef) === null || _this$viewRef6 === void 0 ? void 0 : _this$viewRef6.release(...arguments);
  }
  refresh() {
    var _this$viewRef7;
    return (_this$viewRef7 = this.viewRef) === null || _this$viewRef7 === void 0 ? void 0 : _this$viewRef7.refresh(...arguments);
  }
  scrollToElement(element, offset) {
    var _this$viewRef8;
    const params = [this._patchElementParam(element), offset];
    return (_this$viewRef8 = this.viewRef) === null || _this$viewRef8 === void 0 ? void 0 : _this$viewRef8.scrollToElement(...params.slice(0, arguments.length));
  }
  scrollHeight() {
    var _this$viewRef9;
    return (_this$viewRef9 = this.viewRef) === null || _this$viewRef9 === void 0 ? void 0 : _this$viewRef9.scrollHeight(...arguments);
  }
  scrollWidth() {
    var _this$viewRef10;
    return (_this$viewRef10 = this.viewRef) === null || _this$viewRef10 === void 0 ? void 0 : _this$viewRef10.scrollWidth(...arguments);
  }
  scrollOffset() {
    var _this$viewRef11;
    return (_this$viewRef11 = this.viewRef) === null || _this$viewRef11 === void 0 ? void 0 : _this$viewRef11.scrollOffset(...arguments);
  }
  scrollTop() {
    var _this$viewRef12;
    return (_this$viewRef12 = this.viewRef) === null || _this$viewRef12 === void 0 ? void 0 : _this$viewRef12.scrollTop(...arguments);
  }
  scrollLeft() {
    var _this$viewRef13;
    return (_this$viewRef13 = this.viewRef) === null || _this$viewRef13 === void 0 ? void 0 : _this$viewRef13.scrollLeft(...arguments);
  }
  clientHeight() {
    var _this$viewRef14;
    return (_this$viewRef14 = this.viewRef) === null || _this$viewRef14 === void 0 ? void 0 : _this$viewRef14.clientHeight(...arguments);
  }
  clientWidth() {
    var _this$viewRef15;
    return (_this$viewRef15 = this.viewRef) === null || _this$viewRef15 === void 0 ? void 0 : _this$viewRef15.clientWidth(...arguments);
  }
  getScrollElementPosition(targetElement, direction, offset) {
    var _this$viewRef16;
    const params = [this._patchElementParam(targetElement), direction, offset];
    return (_this$viewRef16 = this.viewRef) === null || _this$viewRef16 === void 0 ? void 0 : _this$viewRef16.getScrollElementPosition(...params.slice(0, arguments.length));
  }
  startLoading() {
    var _this$viewRef17;
    return (_this$viewRef17 = this.viewRef) === null || _this$viewRef17 === void 0 ? void 0 : _this$viewRef17.startLoading(...arguments);
  }
  finishLoading() {
    var _this$viewRef18;
    return (_this$viewRef18 = this.viewRef) === null || _this$viewRef18 === void 0 ? void 0 : _this$viewRef18.finishLoading(...arguments);
  }
  _getActionConfigs() {
    return {
      onVisibilityChange: {},
      onStart: {},
      onEnd: {},
      onBounce: {},
      scrollLocationChange: {},
      onScroll: {},
      onUpdated: {},
      onPullDown: {},
      onReachBottom: {}
    };
  }
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['loadPanelTemplate'],
      props: ['useNative', 'useSimulatedScrollbar', 'refreshStrategy', 'inertiaEnabled', 'useKeyboard', 'showScrollbar', 'scrollByThumb', 'onVisibilityChange', 'onStart', 'onEnd', 'onBounce', 'scrollLocationChange', 'loadPanelTemplate', 'aria', 'addWidgetClass', 'disabled', 'height', 'width', 'visible', 'rtlEnabled', 'classes', 'direction', 'bounceEnabled', 'scrollByContent', 'pullDownEnabled', 'reachBottomEnabled', 'forceGeneratePockets', 'needScrollViewContentWrapper', 'needRenderScrollbars', 'onScroll', 'onUpdated', 'onPullDown', 'onReachBottom', 'pullingDownText', 'pulledDownText', 'refreshingText', 'reachBottomText']
    };
  }
  get _viewComponent() {
    return _scrollable2.Scrollable;
  }
}
exports.default = Scrollable;
(0, _component_registrator.default)('dxScrollable', Scrollable);
module.exports = exports.default;
module.exports.default = exports.default;