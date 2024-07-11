"use strict";

exports.viewFunction = exports.Scrollable = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _native = require("./strategy/native");
var _simulated = require("./strategy/simulated");
var _get_element_location_internal = require("./utils/get_element_location_internal");
var _convert_location = require("./utils/convert_location");
var _get_offset_distance = require("./utils/get_offset_distance");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _consts = require("./common/consts");
var _scrollable_props = require("./common/scrollable_props");
var _resolve_rtl = require("../../utils/resolve_rtl");
var _config_context = require("../../common/config_context");
const _excluded = ["addWidgetClass", "aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "inertiaEnabled", "loadPanelTemplate", "needRenderScrollbars", "needScrollViewContentWrapper", "onBounce", "onEnd", "onPullDown", "onReachBottom", "onScroll", "onStart", "onUpdated", "onVisibilityChange", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshStrategy", "refreshingText", "rtlEnabled", "scrollByContent", "scrollByThumb", "scrollLocationChange", "showScrollbar", "useKeyboard", "useNative", "useSimulatedScrollbar", "visible", "width"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = viewModel => {
  const {
    isServerSide,
    props: {
      aria,
      bounceEnabled,
      children,
      classes,
      direction,
      disabled,
      forceGeneratePockets,
      height,
      inertiaEnabled,
      loadPanelTemplate,
      needScrollViewContentWrapper,
      onBounce,
      onEnd,
      onPullDown,
      onReachBottom,
      onScroll,
      onStart,
      onUpdated,
      onVisibilityChange,
      pullDownEnabled,
      pulledDownText,
      pullingDownText,
      reachBottomEnabled,
      reachBottomText,
      refreshStrategy,
      refreshingText,
      scrollByContent,
      scrollByThumb,
      showScrollbar,
      useKeyboard,
      useNative,
      useSimulatedScrollbar,
      visible,
      width
    },
    restAttributes,
    rtlEnabled,
    scrollableNativeRef,
    scrollableSimulatedRef
  } = viewModel;
  return useNative ? (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _native.ScrollableNative, _extends({
    "aria": aria,
    "classes": classes,
    "width": width,
    "height": height,
    "disabled": disabled,
    "visible": visible,
    "rtlEnabled": rtlEnabled,
    "direction": direction,
    "showScrollbar": showScrollbar,
    "pullDownEnabled": pullDownEnabled,
    "reachBottomEnabled": reachBottomEnabled,
    "forceGeneratePockets": forceGeneratePockets && !isServerSide,
    "needScrollViewContentWrapper": needScrollViewContentWrapper,
    "loadPanelTemplate": !isServerSide ? loadPanelTemplate : undefined,
    "needRenderScrollbars": !isServerSide,
    "onScroll": onScroll,
    "onUpdated": onUpdated,
    "onPullDown": onPullDown,
    "onReachBottom": onReachBottom,
    "refreshStrategy": refreshStrategy,
    "pulledDownText": pulledDownText,
    "pullingDownText": pullingDownText,
    "refreshingText": refreshingText,
    "reachBottomText": reachBottomText,
    "useSimulatedScrollbar": useSimulatedScrollbar
  }, restAttributes, {
    children: children
  }), null, scrollableNativeRef)) : (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _simulated.ScrollableSimulated, _extends({
    "aria": aria,
    "classes": classes,
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
    "forceGeneratePockets": forceGeneratePockets && !isServerSide,
    "needScrollViewContentWrapper": needScrollViewContentWrapper,
    "loadPanelTemplate": !isServerSide ? loadPanelTemplate : undefined,
    "needRenderScrollbars": !isServerSide,
    "onScroll": onScroll,
    "onUpdated": onUpdated,
    "onPullDown": onPullDown,
    "onReachBottom": onReachBottom,
    "refreshStrategy": "simulated",
    "pulledDownText": pulledDownText,
    "pullingDownText": pullingDownText,
    "refreshingText": refreshingText,
    "reachBottomText": reachBottomText,
    "onVisibilityChange": onVisibilityChange,
    "inertiaEnabled": inertiaEnabled,
    "bounceEnabled": bounceEnabled,
    "scrollByContent": scrollByContent,
    "useKeyboard": useKeyboard,
    "onStart": onStart,
    "onEnd": onEnd,
    "onBounce": onBounce
  }, restAttributes, {
    children: children
  }), null, scrollableSimulatedRef));
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
class Scrollable extends _inferno2.InfernoWrapperComponent {
  get config() {
    if (this.context[_config_context.ConfigContext.id]) {
      return this.context[_config_context.ConfigContext.id];
    }
    return _config_context.ConfigContext.defaultValue;
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.scrollableNativeRef = (0, _inferno.createRef)();
    this.scrollableSimulatedRef = (0, _inferno.createRef)();
    this.content = this.content.bind(this);
    this.container = this.container.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.scrollBy = this.scrollBy.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.release = this.release.bind(this);
    this.refresh = this.refresh.bind(this);
    this.scrollToElement = this.scrollToElement.bind(this);
    this.scrollHeight = this.scrollHeight.bind(this);
    this.scrollWidth = this.scrollWidth.bind(this);
    this.scrollOffset = this.scrollOffset.bind(this);
    this.scrollTop = this.scrollTop.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.clientHeight = this.clientHeight.bind(this);
    this.clientWidth = this.clientWidth.bind(this);
    this.getScrollElementPosition = this.getScrollElementPosition.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.finishLoading = this.finishLoading.bind(this);
    this.validate = this.validate.bind(this);
  }
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  validate(event) {
    return this.scrollableRef.validate(event);
  }
  get scrollableRef() {
    if (this.props.useNative) {
      return this.scrollableNativeRef.current;
    }
    return this.scrollableSimulatedRef.current;
  }
  get rtlEnabled() {
    const {
      rtlEnabled
    } = this.props;
    return !!(0, _resolve_rtl.resolveRtlEnabled)(rtlEnabled, this.config);
  }
  get isServerSide() {
    return !(0, _window.hasWindow)();
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  content() {
    return this.scrollableRef.content();
  }
  container() {
    return this.scrollableRef.container();
  }
  scrollTo(targetLocation) {
    if (!this.props.useNative) {
      this.updateHandler();
    }
    const currentScrollOffset = this.props.useNative ? this.scrollOffset() : {
      top: this.container().scrollTop,
      left: this.container().scrollLeft
    };
    const distance = (0, _get_offset_distance.getOffsetDistance)((0, _convert_location.convertToLocation)(targetLocation, this.props.direction), currentScrollOffset);
    this.scrollBy(distance);
  }
  scrollBy(distance) {
    let {
      left,
      top
    } = (0, _convert_location.convertToLocation)(distance, this.props.direction);
    if (!(0, _type.isDefined)(top) || !(0, _type.isNumeric)(top)) {
      top = 0;
    }
    if (!(0, _type.isDefined)(left) || !(0, _type.isNumeric)(top)) {
      left = 0;
    }
    if (top === 0 && left === 0) {
      return;
    }
    this.scrollableRef.scrollByLocation({
      top,
      left
    });
  }
  updateHandler() {
    this.scrollableRef.updateHandler();
  }
  release() {
    if (!this.isServerSide) {
      this.scrollableRef.release();
    }
  }
  refresh() {
    if (!this.isServerSide) {
      this.scrollableRef.refresh();
    }
  }
  scrollToElement(element, offset) {
    if (!this.content().contains(element)) {
      return;
    }
    const scrollPosition = {
      top: 0,
      left: 0
    };
    const {
      direction
    } = this.props;
    if (direction !== _consts.DIRECTION_VERTICAL) {
      scrollPosition.left = this.getScrollElementPosition(element, _consts.DIRECTION_HORIZONTAL, offset);
    }
    if (direction !== _consts.DIRECTION_HORIZONTAL) {
      scrollPosition.top = this.getScrollElementPosition(element, _consts.DIRECTION_VERTICAL, offset);
    }
    this.scrollTo(scrollPosition);
  }
  scrollHeight() {
    return this.scrollableRef.scrollHeight();
  }
  scrollWidth() {
    return this.scrollableRef.scrollWidth();
  }
  scrollOffset() {
    if (!this.isServerSide) {
      return this.scrollableRef.scrollOffset();
    }
    return {
      top: 0,
      left: 0
    };
  }
  scrollTop() {
    return this.scrollableRef.scrollTop();
  }
  scrollLeft() {
    return this.scrollableRef.scrollLeft();
  }
  clientHeight() {
    return this.scrollableRef.clientHeight();
  }
  clientWidth() {
    return this.scrollableRef.clientWidth();
  }
  getScrollElementPosition(targetElement, direction, offset) {
    const scrollOffset = this.scrollOffset();
    return (0, _get_element_location_internal.getElementLocationInternal)(targetElement, direction, this.container(), scrollOffset, offset);
  }
  startLoading() {
    this.scrollableRef.startLoading();
  }
  finishLoading() {
    if (!this.isServerSide) {
      this.scrollableRef.finishLoading();
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        loadPanelTemplate: getTemplate(props.loadPanelTemplate)
      }),
      scrollableNativeRef: this.scrollableNativeRef,
      scrollableSimulatedRef: this.scrollableSimulatedRef,
      config: this.config,
      validate: this.validate,
      scrollableRef: this.scrollableRef,
      rtlEnabled: this.rtlEnabled,
      isServerSide: this.isServerSide,
      restAttributes: this.restAttributes
    });
  }
}
exports.Scrollable = Scrollable;
Scrollable.defaultProps = _scrollable_props.ScrollableProps;