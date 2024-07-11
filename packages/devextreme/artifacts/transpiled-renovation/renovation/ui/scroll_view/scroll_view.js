"use strict";

exports.viewFunction = exports.ScrollView = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _type = require("../../../core/utils/type");
var _scrollable = require("./scrollable");
var _scrollview_props = require("./common/scrollview_props");
var _load_panel = require("./internal/load_panel");
const _excluded = ["addWidgetClass", "aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "inertiaEnabled", "loadPanelTemplate", "needRenderScrollbars", "needScrollViewContentWrapper", "onBounce", "onEnd", "onPullDown", "onReachBottom", "onScroll", "onStart", "onUpdated", "onVisibilityChange", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshStrategy", "refreshingText", "rtlEnabled", "scrollByContent", "scrollByThumb", "scrollLocationChange", "showScrollbar", "useKeyboard", "useNative", "useSimulatedScrollbar", "visible", "width"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = viewModel => {
  const {
    props: {
      aria,
      bounceEnabled,
      children,
      direction,
      disabled,
      height,
      inertiaEnabled,
      onBounce,
      onEnd,
      onPullDown,
      onReachBottom,
      onScroll,
      onStart,
      onUpdated,
      pullDownEnabled,
      pulledDownText,
      pullingDownText,
      reachBottomText,
      refreshStrategy,
      refreshingText,
      rtlEnabled,
      scrollByContent,
      scrollByThumb,
      showScrollbar,
      useKeyboard,
      useNative,
      useSimulatedScrollbar,
      visible,
      width
    },
    reachBottomEnabled,
    restAttributes,
    scrollableRef
  } = viewModel;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _scrollable.Scrollable, _extends({
    "useNative": useNative,
    "classes": "dx-scrollview",
    "aria": aria,
    "width": width,
    "height": height,
    "disabled": disabled,
    "visible": visible,
    "rtlEnabled": rtlEnabled,
    "direction": direction,
    "showScrollbar": showScrollbar,
    "scrollByThumb": scrollByThumb,
    "pullDownEnabled": pullDownEnabled,
    "reachBottomEnabled": reachBottomEnabled,
    "onScroll": onScroll,
    "onUpdated": onUpdated,
    "onPullDown": onPullDown,
    "onReachBottom": onReachBottom,
    "refreshStrategy": refreshStrategy,
    "pulledDownText": pulledDownText,
    "pullingDownText": pullingDownText,
    "refreshingText": refreshingText,
    "reachBottomText": reachBottomText,
    "forceGeneratePockets": true,
    "needScrollViewContentWrapper": true,
    "useSimulatedScrollbar": useSimulatedScrollbar,
    "inertiaEnabled": inertiaEnabled,
    "bounceEnabled": bounceEnabled,
    "scrollByContent": scrollByContent,
    "useKeyboard": useKeyboard,
    "onStart": onStart,
    "onEnd": onEnd,
    "onBounce": onBounce,
    "loadPanelTemplate": _load_panel.ScrollViewLoadPanel
  }, restAttributes, {
    children: children
  }), null, scrollableRef));
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
class ScrollView extends _inferno2.InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.scrollableRef = (0, _inferno.createRef)();
    this.state = {
      forceReachBottom: undefined
    };
    this.release = this.release.bind(this);
    this.refresh = this.refresh.bind(this);
    this.content = this.content.bind(this);
    this.container = this.container.bind(this);
    this.scrollBy = this.scrollBy.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.scrollToElement = this.scrollToElement.bind(this);
    this.scrollHeight = this.scrollHeight.bind(this);
    this.scrollWidth = this.scrollWidth.bind(this);
    this.scrollOffset = this.scrollOffset.bind(this);
    this.scrollTop = this.scrollTop.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.clientHeight = this.clientHeight.bind(this);
    this.clientWidth = this.clientWidth.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.finishLoading = this.finishLoading.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
  }
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  get reachBottomEnabled() {
    if ((0, _type.isDefined)(this.state.forceReachBottom)) {
      return this.state.forceReachBottom;
    }
    return this.props.reachBottomEnabled;
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  release(preventScrollBottom) {
    if (preventScrollBottom !== undefined) {
      this.toggleLoading(!preventScrollBottom);
    }
    this.scrollableRef.current.release();
  }
  refresh() {
    if (this.props.pullDownEnabled) {
      this.scrollableRef.current.refresh();
    }
  }
  content() {
    return this.scrollableRef.current.content();
  }
  container() {
    return this.scrollableRef.current.container();
  }
  scrollBy(distance) {
    this.scrollableRef.current.scrollBy(distance);
  }
  scrollTo(targetLocation) {
    this.scrollableRef.current.scrollTo(targetLocation);
  }
  scrollToElement(element, offset) {
    this.scrollableRef.current.scrollToElement(element, offset);
  }
  scrollHeight() {
    return this.scrollableRef.current.scrollHeight();
  }
  scrollWidth() {
    return this.scrollableRef.current.scrollWidth();
  }
  scrollOffset() {
    return this.scrollableRef.current.scrollOffset();
  }
  scrollTop() {
    return this.scrollableRef.current.scrollTop();
  }
  scrollLeft() {
    return this.scrollableRef.current.scrollLeft();
  }
  clientHeight() {
    return this.scrollableRef.current.clientHeight();
  }
  clientWidth() {
    return this.scrollableRef.current.clientWidth();
  }
  toggleLoading(showOrHide) {
    this.setState(__state_argument => ({
      forceReachBottom: showOrHide
    }));
  }
  startLoading() {
    this.scrollableRef.current.startLoading();
  }
  finishLoading() {
    this.scrollableRef.current.finishLoading();
  }
  updateHandler() {
    this.scrollableRef.current.updateHandler();
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        loadPanelTemplate: getTemplate(props.loadPanelTemplate)
      }),
      forceReachBottom: this.state.forceReachBottom,
      scrollableRef: this.scrollableRef,
      reachBottomEnabled: this.reachBottomEnabled,
      restAttributes: this.restAttributes
    });
  }
}
exports.ScrollView = ScrollView;
ScrollView.defaultProps = _scrollview_props.ScrollViewProps;