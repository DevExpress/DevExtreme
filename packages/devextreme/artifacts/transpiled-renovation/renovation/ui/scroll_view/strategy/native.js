"use strict";

exports.viewFunction = exports.ScrollableNative = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
require("../../../../events/gesture/emitter.gesture.scroll");
var _subscribe_to_event = require("../../../utils/subscribe_to_event");
var _widget = require("../../common/widget");
var _combine_classes = require("../../../utils/combine_classes");
var _get_scroll_left_max = require("../utils/get_scroll_left_max");
var _get_boundary_props = require("../utils/get_boundary_props");
var _normalize_offset_left = require("../utils/normalize_offset_left");
var _get_element_style = require("../utils/get_element_style");
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _type = require("../../../../core/utils/type");
var _top = require("../internal/pocket/top");
var _bottom = require("../internal/pocket/bottom");
var _index = require("../../../../events/utils/index");
var _scroll_direction = require("../utils/scroll_direction");
var _consts = require("../common/consts");
var _scrollbar = require("../scrollbar/scrollbar");
var _is_element_visible = require("../utils/is_element_visible");
var _native_strategy_props = require("../common/native_strategy_props");
var _get_allowed_direction = require("../utils/get_allowed_direction");
var _get_scroll_top_max = require("../utils/get_scroll_top_max");
var _subscribe_to_resize = require("../utils/subscribe_to_resize");
const _excluded = ["addWidgetClass", "aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "loadPanelTemplate", "needRenderScrollbars", "needScrollViewContentWrapper", "onPullDown", "onReachBottom", "onScroll", "onUpdated", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshStrategy", "refreshingText", "rtlEnabled", "scrollByContent", "showScrollbar", "useSimulatedScrollbar", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = viewModel => {
  const {
    bottomPocketRef,
    containerClientHeight,
    containerClientWidth,
    containerRef,
    contentHeight,
    contentRef,
    contentStyles,
    contentTranslateTop,
    contentWidth,
    cssClasses,
    direction,
    hScrollLocation,
    hScrollOffsetMax,
    hScrollbarRef,
    isLoadPanelVisible,
    props: {
      aria,
      children,
      disabled,
      forceGeneratePockets,
      height,
      loadPanelTemplate: LoadPanelTemplate,
      needRenderScrollbars,
      needScrollViewContentWrapper,
      pullDownEnabled,
      pulledDownText,
      pullingDownText,
      reachBottomEnabled,
      reachBottomText,
      refreshStrategy,
      refreshingText,
      rtlEnabled,
      showScrollbar,
      useSimulatedScrollbar,
      visible,
      width
    },
    pullDownIconAngle,
    pullDownOpacity,
    pullDownTranslateTop,
    restAttributes,
    scrollViewContentRef,
    scrollableRef,
    scrolling,
    topPocketHeight,
    topPocketRef,
    topPocketState,
    vScrollLocation,
    vScrollOffsetMax,
    vScrollbarRef,
    wrapperRef
  } = viewModel;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "rootElementRef": scrollableRef,
    "aria": aria,
    "addWidgetClass": false,
    "classes": cssClasses,
    "disabled": disabled,
    "rtlEnabled": rtlEnabled,
    "height": height,
    "width": width,
    "visible": visible
  }, restAttributes, {
    children: [(0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_WRAPPER_CLASS, (0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_CONTAINER_CLASS, (0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_CONTENT_CLASS, [forceGeneratePockets && (0, _inferno.createComponentVNode)(2, _top.TopPocket, {
      "topPocketRef": topPocketRef,
      "pullingDownText": pullingDownText,
      "pulledDownText": pulledDownText,
      "refreshingText": refreshingText,
      "pocketState": topPocketState,
      "refreshStrategy": refreshStrategy,
      "pullDownTranslateTop": pullDownTranslateTop,
      "pullDownIconAngle": pullDownIconAngle,
      "topPocketTranslateTop": contentTranslateTop,
      "pullDownOpacity": pullDownOpacity,
      "pocketTop": topPocketHeight,
      "visible": !!pullDownEnabled
    }), needScrollViewContentWrapper ? (0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_CONTENT_CLASS, children, 0, {
      "style": (0, _inferno2.normalizeStyles)(contentStyles)
    }, null, scrollViewContentRef) : children, forceGeneratePockets && (0, _inferno.createComponentVNode)(2, _bottom.BottomPocket, {
      "bottomPocketRef": bottomPocketRef,
      "reachBottomText": reachBottomText,
      "visible": !!reachBottomEnabled
    })], 0, null, null, contentRef), 2, null, null, containerRef), 2, null, null, wrapperRef), viewModel.props.loadPanelTemplate && LoadPanelTemplate({
      targetElement: scrollableRef,
      refreshingText: refreshingText,
      visible: isLoadPanelVisible
    }), needRenderScrollbars && showScrollbar !== 'never' && useSimulatedScrollbar && direction.isHorizontal && (0, _inferno.createComponentVNode)(2, _scrollbar.Scrollbar, {
      "direction": "horizontal",
      "showScrollbar": "onScroll",
      "contentSize": contentWidth,
      "containerSize": containerClientWidth,
      "maxOffset": hScrollOffsetMax,
      "scrollLocation": hScrollLocation,
      "visible": scrolling
    }, null, hScrollbarRef), needRenderScrollbars && showScrollbar !== 'never' && useSimulatedScrollbar && direction.isVertical && (0, _inferno.createComponentVNode)(2, _scrollbar.Scrollbar, {
      "direction": "vertical",
      "showScrollbar": "onScroll",
      "contentSize": contentHeight,
      "containerSize": containerClientHeight,
      "maxOffset": vScrollOffsetMax,
      "scrollLocation": vScrollLocation,
      "visible": scrolling
    }, null, vScrollbarRef)]
  })));
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
class ScrollableNative extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.scrollableRef = (0, _inferno.createRef)();
    this.topPocketRef = (0, _inferno.createRef)();
    this.bottomPocketRef = (0, _inferno.createRef)();
    this.wrapperRef = (0, _inferno.createRef)();
    this.contentRef = (0, _inferno.createRef)();
    this.scrollViewContentRef = (0, _inferno.createRef)();
    this.containerRef = (0, _inferno.createRef)();
    this.vScrollbarRef = (0, _inferno.createRef)();
    this.hScrollbarRef = (0, _inferno.createRef)();
    this.locked = false;
    this.loadingIndicatorEnabled = true;
    this.initPageY = 0;
    this.deltaY = 0;
    this.locationTop = 0;
    this.__getterCache = {};
    this.state = {
      containerClientWidth: 0,
      containerClientHeight: 0,
      contentClientWidth: 0,
      contentClientHeight: 0,
      contentScrollWidth: 0,
      contentScrollHeight: 0,
      topPocketHeight: 0,
      bottomPocketHeight: 0,
      scrolling: false,
      topPocketState: _consts.TopPocketState.STATE_RELEASED,
      isLoadPanelVisible: false,
      pullDownTranslateTop: 0,
      pullDownIconAngle: 0,
      pullDownOpacity: 0,
      contentTranslateTop: 0,
      vScrollLocation: 0,
      hScrollLocation: 0
    };
    this.content = this.content.bind(this);
    this.container = this.container.bind(this);
    this.refresh = this.refresh.bind(this);
    this.release = this.release.bind(this);
    this.disposeReleaseTimer = this.disposeReleaseTimer.bind(this);
    this.scrollHeight = this.scrollHeight.bind(this);
    this.scrollWidth = this.scrollWidth.bind(this);
    this.scrollOffset = this.scrollOffset.bind(this);
    this.scrollTop = this.scrollTop.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.clientHeight = this.clientHeight.bind(this);
    this.clientWidth = this.clientWidth.bind(this);
    this.scrollEffect = this.scrollEffect.bind(this);
    this.effectDisabledState = this.effectDisabledState.bind(this);
    this.resetInactiveOffsetToInitial = this.resetInactiveOffsetToInitial.bind(this);
    this.initEffect = this.initEffect.bind(this);
    this.moveEffect = this.moveEffect.bind(this);
    this.endEffect = this.endEffect.bind(this);
    this.stopEffect = this.stopEffect.bind(this);
    this.disposeRefreshTimer = this.disposeRefreshTimer.bind(this);
    this.validate = this.validate.bind(this);
    this.moveIsAllowed = this.moveIsAllowed.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.subscribeContainerToResize = this.subscribeContainerToResize.bind(this);
    this.subscribeContentToResize = this.subscribeContentToResize.bind(this);
    this.scrollByLocation = this.scrollByLocation.bind(this);
    this.clearReleaseTimer = this.clearReleaseTimer.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.onUpdated = this.onUpdated.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.finishLoading = this.finishLoading.bind(this);
    this.setPocketState = this.setPocketState.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handlePocketState = this.handlePocketState.bind(this);
    this.pullDownReady = this.pullDownReady.bind(this);
    this.onReachBottom = this.onReachBottom.bind(this);
    this.onPullDown = this.onPullDown.bind(this);
    this.stateReleased = this.stateReleased.bind(this);
    this.getEventArgs = this.getEventArgs.bind(this);
    this.lock = this.lock.bind(this);
    this.unlock = this.unlock.bind(this);
    this.updateElementDimensions = this.updateElementDimensions.bind(this);
    this.setContainerDimensions = this.setContainerDimensions.bind(this);
    this.setContentHeight = this.setContentHeight.bind(this);
    this.setContentWidth = this.setContentWidth.bind(this);
    this.syncScrollbarsWithContent = this.syncScrollbarsWithContent.bind(this);
    this.getInitEventData = this.getInitEventData.bind(this);
    this.handleInit = this.handleInit.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.pullDownComplete = this.pullDownComplete.bind(this);
    this.clearRefreshTimer = this.clearRefreshTimer.bind(this);
    this.pullDownRefreshing = this.pullDownRefreshing.bind(this);
    this.movePullDown = this.movePullDown.bind(this);
    this.getPullDownHeight = this.getPullDownHeight.bind(this);
    this.getPullDownStartPosition = this.getPullDownStartPosition.bind(this);
    this.complete = this.complete.bind(this);
    this.releaseState = this.releaseState.bind(this);
    this.isSwipeDown = this.isSwipeDown.bind(this);
    this.pulledDown = this.pulledDown.bind(this);
    this.isReachBottom = this.isReachBottom.bind(this);
    this.tryGetAllowedDirection = this.tryGetAllowedDirection.bind(this);
    this.isLocked = this.isLocked.bind(this);
    this.isScrollingOutOfBound = this.isScrollingOutOfBound.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.disposeReleaseTimer, []), new _inferno2.InfernoEffect(this.scrollEffect, [this.props.useSimulatedScrollbar, this.props.onScroll, this.props.rtlEnabled, this.props.direction, this.props.forceGeneratePockets, this.state.topPocketState, this.props.refreshStrategy, this.props.reachBottomEnabled, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.props.onReachBottom, this.props.pullDownEnabled, this.state.topPocketHeight]), new _inferno2.InfernoEffect(this.effectDisabledState, [this.props.disabled]), new _inferno2.InfernoEffect(this.resetInactiveOffsetToInitial, [this.props.direction]), new _inferno2.InfernoEffect(this.initEffect, [this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.direction, this.props.disabled]), new _inferno2.InfernoEffect(this.moveEffect, [this.props.direction, this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.pullDownEnabled, this.state.topPocketHeight]), new _inferno2.InfernoEffect(this.endEffect, [this.props.forceGeneratePockets, this.props.refreshStrategy, this.props.pullDownEnabled, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]), new _inferno2.InfernoEffect(this.stopEffect, [this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]), new _inferno2.InfernoEffect(this.disposeRefreshTimer, []), new _inferno2.InfernoEffect(this.updateDimensions, []), new _inferno2.InfernoEffect(this.subscribeContainerToResize, []), new _inferno2.InfernoEffect(this.subscribeContentToResize, [])];
  }
  updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7;
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.useSimulatedScrollbar, this.props.onScroll, this.props.rtlEnabled, this.props.direction, this.props.forceGeneratePockets, this.state.topPocketState, this.props.refreshStrategy, this.props.reachBottomEnabled, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.props.onReachBottom, this.props.pullDownEnabled, this.state.topPocketHeight]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 || _this$_effects$2.update([this.props.disabled]);
    (_this$_effects$3 = this._effects[3]) === null || _this$_effects$3 === void 0 || _this$_effects$3.update([this.props.direction]);
    (_this$_effects$4 = this._effects[4]) === null || _this$_effects$4 === void 0 || _this$_effects$4.update([this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.direction, this.props.disabled]);
    (_this$_effects$5 = this._effects[5]) === null || _this$_effects$5 === void 0 || _this$_effects$5.update([this.props.direction, this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.pullDownEnabled, this.state.topPocketHeight]);
    (_this$_effects$6 = this._effects[6]) === null || _this$_effects$6 === void 0 || _this$_effects$6.update([this.props.forceGeneratePockets, this.props.refreshStrategy, this.props.pullDownEnabled, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]);
    (_this$_effects$7 = this._effects[7]) === null || _this$_effects$7 === void 0 || _this$_effects$7.update([this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]);
  }
  disposeReleaseTimer() {
    return () => this.clearReleaseTimer();
  }
  scrollEffect() {
    return (0, _subscribe_to_event.subscribeToScrollEvent)(this.containerRef.current, event => {
      this.handleScroll(event);
    });
  }
  effectDisabledState() {
    if (this.props.disabled) {
      this.lock();
    } else {
      this.unlock();
    }
  }
  resetInactiveOffsetToInitial() {
    if (this.props.direction === _consts.DIRECTION_BOTH) {
      return;
    }
    this.containerRef.current[this.fullScrollInactiveProp] = 0;
  }
  initEffect() {
    return (0, _subscribe_to_event.subscribeToScrollInitEvent)(this.wrapperRef.current, event => {
      this.handleInit(event);
    }, this.getInitEventData());
  }
  moveEffect() {
    return (0, _subscribe_to_event.subscribeToDXScrollMoveEvent)(this.wrapperRef.current, event => {
      this.handleMove(event);
    });
  }
  endEffect() {
    return (0, _subscribe_to_event.subscribeToDXScrollEndEvent)(this.wrapperRef.current, () => {
      this.handleEnd();
    });
  }
  stopEffect() {
    return (0, _subscribe_to_event.subscribeToDXScrollStopEvent)(this.wrapperRef.current, () => {
      this.handleStop();
    });
  }
  disposeRefreshTimer() {
    return () => this.clearRefreshTimer();
  }
  updateDimensions() {
    this.updateElementDimensions();
  }
  subscribeContainerToResize() {
    return (0, _subscribe_to_resize.subscribeToResize)(this.containerRef.current, element => {
      this.setContainerDimensions(element);
    });
  }
  subscribeContentToResize() {
    return (0, _subscribe_to_resize.subscribeToResize)(this.content(), element => {
      this.setContentHeight(element);
      this.setContentWidth(element);
    });
  }
  clearReleaseTimer() {
    clearTimeout(this.releaseTimer);
    this.releaseTimer = undefined;
  }
  onRelease() {
    this.loadingIndicatorEnabled = true;
    this.finishLoading();
  }
  onUpdated() {
    var _this$props$onUpdated, _this$props;
    (_this$props$onUpdated = (_this$props = this.props).onUpdated) === null || _this$props$onUpdated === void 0 || _this$props$onUpdated.call(_this$props, this.getEventArgs());
  }
  startLoading() {
    if (this.loadingIndicatorEnabled && (0, _is_element_visible.isElementVisible)(this.scrollableRef.current)) {
      this.setState(__state_argument => ({
        isLoadPanelVisible: true
      }));
    }
    this.lock();
  }
  finishLoading() {
    this.setState(__state_argument => ({
      isLoadPanelVisible: false
    }));
    this.unlock();
  }
  setPocketState(newState) {
    this.setState(__state_argument => ({
      topPocketState: newState
    }));
  }
  handleScroll(event) {
    var _this$props$onScroll, _this$props2;
    this.eventForUserAction = event;
    if (this.props.useSimulatedScrollbar) {
      this.setState(__state_argument => ({
        scrolling: true
      }));
      this.syncScrollbarsWithContent();
      this.setState(__state_argument => ({
        scrolling: false
      }));
    }
    (_this$props$onScroll = (_this$props2 = this.props).onScroll) === null || _this$props$onScroll === void 0 || _this$props$onScroll.call(_this$props2, this.getEventArgs());
    this.handlePocketState();
  }
  handlePocketState() {
    if (this.props.forceGeneratePockets) {
      if (this.state.topPocketState === _consts.TopPocketState.STATE_REFRESHING) {
        return;
      }
      const {
        scrollTop
      } = this.containerRef.current;
      const scrollDelta = this.locationTop + scrollTop;
      this.locationTop = -scrollTop;
      if (this.isSwipeDownStrategy && scrollDelta > 0 && this.isReachBottom()) {
        this.onReachBottom();
        return;
      }
      if (this.isPullDownStrategy) {
        if (this.pulledDown()) {
          this.pullDownReady();
          return;
        }
        if (scrollDelta > 0 && this.isReachBottom()) {
          if (this.state.topPocketState !== _consts.TopPocketState.STATE_LOADING) {
            this.setPocketState(_consts.TopPocketState.STATE_LOADING);
            this.onReachBottom();
          }
          return;
        }
      }
      this.stateReleased();
    }
  }
  pullDownReady() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_READY) {
      return;
    }
    this.setPocketState(_consts.TopPocketState.STATE_READY);
  }
  onReachBottom() {
    var _this$props$onReachBo, _this$props3;
    (_this$props$onReachBo = (_this$props3 = this.props).onReachBottom) === null || _this$props$onReachBo === void 0 || _this$props$onReachBo.call(_this$props3, {});
  }
  onPullDown() {
    var _this$props$onPullDow, _this$props4;
    (_this$props$onPullDow = (_this$props4 = this.props).onPullDown) === null || _this$props$onPullDow === void 0 || _this$props$onPullDow.call(_this$props4, {});
  }
  stateReleased() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_RELEASED) {
      return;
    }
    this.releaseState();
  }
  getEventArgs() {
    const scrollOffset = this.scrollOffset();
    return _extends({
      event: this.eventForUserAction,
      scrollOffset
    }, (0, _get_boundary_props.getBoundaryProps)(this.props.direction, scrollOffset, this.containerRef.current));
  }
  lock() {
    this.locked = true;
  }
  unlock() {
    if (!this.props.disabled) {
      this.locked = false;
    }
  }
  get fullScrollInactiveProp() {
    return this.props.direction === _consts.DIRECTION_HORIZONTAL ? 'scrollTop' : 'scrollLeft';
  }
  updateElementDimensions() {
    this.setContentHeight(this.content());
    this.setContentWidth(this.content());
    this.setContainerDimensions(this.containerRef.current);
  }
  setContainerDimensions(containerEl) {
    this.setState(__state_argument => ({
      containerClientWidth: containerEl.clientWidth
    }));
    this.setState(__state_argument => ({
      containerClientHeight: containerEl.clientHeight
    }));
  }
  setContentHeight(contentEl) {
    this.setState(__state_argument => ({
      contentClientHeight: contentEl.clientHeight
    }));
    this.setState(__state_argument => ({
      contentScrollHeight: contentEl.scrollHeight
    }));
    if (this.props.forceGeneratePockets) {
      this.setState(__state_argument => {
        var _this$topPocketRef;
        return {
          topPocketHeight: ((_this$topPocketRef = this.topPocketRef) === null || _this$topPocketRef === void 0 ? void 0 : _this$topPocketRef.current.clientHeight) || 0
        };
      });
      this.setState(__state_argument => {
        var _this$bottomPocketRef;
        return {
          bottomPocketHeight: ((_this$bottomPocketRef = this.bottomPocketRef) === null || _this$bottomPocketRef === void 0 ? void 0 : _this$bottomPocketRef.current.clientHeight) || 0
        };
      });
    }
  }
  setContentWidth(contentEl) {
    this.setState(__state_argument => ({
      contentClientWidth: contentEl.clientWidth
    }));
    this.setState(__state_argument => ({
      contentScrollWidth: contentEl.scrollWidth
    }));
  }
  syncScrollbarsWithContent() {
    const {
      left,
      top
    } = this.scrollOffset();
    this.setState(__state_argument => ({
      hScrollLocation: -left
    }));
    this.setState(__state_argument => ({
      vScrollLocation: -top
    }));
  }
  getInitEventData() {
    return {
      getDirection: () => this.tryGetAllowedDirection(),
      validate: event => this.validate(event),
      isNative: true,
      scrollTarget: this.containerRef.current
    };
  }
  handleInit(event) {
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      const {
        scrollTop
      } = this.containerRef.current;
      if (this.state.topPocketState === _consts.TopPocketState.STATE_RELEASED && scrollTop === 0) {
        this.initPageY = event.originalEvent.pageY;
        this.setPocketState(_consts.TopPocketState.STATE_TOUCHED);
      }
    }
  }
  handleMove(e) {
    if (this.locked) {
      e.cancel = true;
      return;
    }
    if ((0, _type.isDefined)(this.tryGetAllowedDirection())) {
      e.originalEvent.isScrollingEvent = true;
    }
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      this.deltaY = e.originalEvent.pageY - this.initPageY;
      if (this.state.topPocketState === _consts.TopPocketState.STATE_TOUCHED) {
        if (this.pullDownEnabled && this.deltaY > 0) {
          this.setPocketState(_consts.TopPocketState.STATE_PULLED);
        } else {
          this.complete();
        }
      }
      if (this.state.topPocketState === _consts.TopPocketState.STATE_PULLED) {
        e.preventDefault();
        this.movePullDown();
      }
    }
  }
  handleEnd() {
    if (this.props.forceGeneratePockets) {
      if (this.isSwipeDownStrategy) {
        if (this.isSwipeDown()) {
          this.pullDownRefreshing();
        }
        this.complete();
      }
      if (this.isPullDownStrategy) {
        this.pullDownComplete();
      }
    }
  }
  handleStop() {
    if (this.props.forceGeneratePockets) {
      if (this.isSwipeDownStrategy) {
        this.complete();
      }
      if (this.isPullDownStrategy) {
        this.pullDownComplete();
      }
    }
  }
  pullDownComplete() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_READY) {
      this.setState(__state_argument => ({
        contentTranslateTop: this.state.topPocketHeight
      }));
      this.clearRefreshTimer();
      this.refreshTimer = setTimeout(() => {
        this.pullDownRefreshing();
      }, 400);
    }
  }
  clearRefreshTimer() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = undefined;
  }
  pullDownRefreshing() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_REFRESHING) {
      return;
    }
    this.setPocketState(_consts.TopPocketState.STATE_REFRESHING);
    if (this.isSwipeDownStrategy) {
      this.setState(__state_argument => ({
        pullDownTranslateTop: this.getPullDownHeight()
      }));
    }
    this.onPullDown();
  }
  movePullDown() {
    const pullDownHeight = this.getPullDownHeight();
    const top = Math.min(pullDownHeight * 3, this.deltaY + this.getPullDownStartPosition());
    const angle = 180 * top / pullDownHeight / 3;
    this.setState(__state_argument => ({
      pullDownOpacity: 1
    }));
    this.setState(__state_argument => ({
      pullDownTranslateTop: top
    }));
    this.setState(__state_argument => ({
      pullDownIconAngle: angle
    }));
  }
  getPullDownHeight() {
    return Math.round(this.scrollableRef.current.offsetHeight * 0.05);
  }
  getPullDownStartPosition() {
    return -Math.round(this.state.topPocketHeight * 1.5);
  }
  complete() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_TOUCHED || this.state.topPocketState === _consts.TopPocketState.STATE_PULLED) {
      this.releaseState();
    }
  }
  releaseState() {
    this.setPocketState(_consts.TopPocketState.STATE_RELEASED);
    this.setState(__state_argument => ({
      pullDownOpacity: 0
    }));
  }
  get isSwipeDownStrategy() {
    return this.props.refreshStrategy === 'swipeDown';
  }
  get isPullDownStrategy() {
    return this.props.refreshStrategy === 'pullDown';
  }
  isSwipeDown() {
    return this.pullDownEnabled && this.state.topPocketState === _consts.TopPocketState.STATE_PULLED && this.deltaY >= this.getPullDownHeight() - this.getPullDownStartPosition();
  }
  pulledDown() {
    const {
      scrollTop
    } = this.containerRef.current;
    return this.pullDownEnabled && scrollTop <= -this.state.topPocketHeight;
  }
  isReachBottom() {
    const {
      scrollTop
    } = this.containerRef.current;
    return this.props.reachBottomEnabled && Math.round(-scrollTop - this.vScrollOffsetMax) <= 1;
  }
  tryGetAllowedDirection() {
    const containerEl = this.containerRef.current;
    return (0, _get_allowed_direction.allowedDirection)(this.props.direction, (0, _get_scroll_top_max.getScrollTopMax)(containerEl), (0, _get_scroll_left_max.getScrollLeftMax)(containerEl), false);
  }
  isLocked() {
    return this.locked;
  }
  isScrollingOutOfBound(event) {
    const {
      delta,
      shiftKey
    } = event;
    const {
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth
    } = this.containerRef.current;
    if (delta > 0) {
      return shiftKey ? !scrollLeft : !scrollTop;
    }
    return shiftKey ? clientWidth >= scrollWidth - scrollLeft : clientHeight >= scrollHeight - scrollTop;
  }
  get cssClasses() {
    const {
      classes,
      direction,
      disabled,
      showScrollbar
    } = this.props;
    const classesMap = {
      [`dx-scrollable dx-scrollable-native dx-scrollable-native-${_devices.default.real().platform}`]: true,
      [`dx-scrollable-${direction}`]: true,
      [_consts.SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [_consts.SCROLLABLE_SCROLLBAR_SIMULATED]: showScrollbar !== 'never' && this.props.useSimulatedScrollbar,
      [_consts.SCROLLABLE_SCROLLBARS_HIDDEN]: showScrollbar === 'never',
      [String(classes)]: !!classes
    };
    return (0, _combine_classes.combineClasses)(classesMap);
  }
  get direction() {
    if (this.__getterCache['direction'] !== undefined) {
      return this.__getterCache['direction'];
    }
    return this.__getterCache['direction'] = (() => {
      return new _scroll_direction.ScrollDirection(this.props.direction);
    })();
  }
  get pullDownEnabled() {
    return this.props.pullDownEnabled && _devices.default.real().platform !== 'generic';
  }
  get contentStyles() {
    if (this.__getterCache['contentStyles'] !== undefined) {
      return this.__getterCache['contentStyles'];
    }
    return this.__getterCache['contentStyles'] = (() => {
      if (this.props.forceGeneratePockets && this.isPullDownStrategy) {
        return {
          transform: `translate(0px, ${this.state.contentTranslateTop}px)`
        };
      }
      return undefined;
    })();
  }
  get contentHeight() {
    var _this$contentRef;
    return (0, _get_element_style.getElementOverflowY)((_this$contentRef = this.contentRef) === null || _this$contentRef === void 0 ? void 0 : _this$contentRef.current) === 'hidden' ? this.state.contentClientHeight : Math.max(this.state.contentScrollHeight, this.state.contentClientHeight);
  }
  get contentWidth() {
    var _this$contentRef2;
    return (0, _get_element_style.getElementOverflowX)((_this$contentRef2 = this.contentRef) === null || _this$contentRef2 === void 0 ? void 0 : _this$contentRef2.current) === 'hidden' ? this.state.contentClientWidth : Math.max(this.state.contentScrollWidth, this.state.contentClientWidth);
  }
  get hScrollOffsetMax() {
    return -Math.max(this.contentWidth - this.state.containerClientWidth, 0);
  }
  get vScrollOffsetMax() {
    return -Math.max(this.contentHeight - this.state.containerClientHeight, 0);
  }
  get restAttributes() {
    const _this$props5 = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props5, _excluded);
    return restProps;
  }
  content() {
    if (this.props.needScrollViewContentWrapper) {
      return this.scrollViewContentRef.current;
    }
    return this.contentRef.current;
  }
  container() {
    return this.containerRef.current;
  }
  refresh() {
    this.setPocketState(_consts.TopPocketState.STATE_READY);
    this.startLoading();
    this.onPullDown();
  }
  release() {
    this.clearReleaseTimer();
    if (this.isPullDownStrategy) {
      if (this.state.topPocketState === _consts.TopPocketState.STATE_LOADING) {
        this.setPocketState(_consts.TopPocketState.STATE_RELEASED);
      }
    }
    this.releaseTimer = setTimeout(() => {
      if (this.isPullDownStrategy) {
        this.setState(__state_argument => ({
          contentTranslateTop: 0
        }));
      }
      this.stateReleased();
      this.onRelease();
    }, this.isSwipeDownStrategy ? 800 : 400);
  }
  scrollHeight() {
    return this.content().offsetHeight;
  }
  scrollWidth() {
    return this.content().offsetWidth;
  }
  scrollOffset() {
    return {
      top: this.scrollTop(),
      left: this.scrollLeft()
    };
  }
  scrollTop() {
    return this.containerRef.current.scrollTop;
  }
  scrollLeft() {
    const containerEl = this.containerRef.current;
    const scrollLeftMax = (0, _get_scroll_left_max.getScrollLeftMax)(containerEl);
    return (0, _normalize_offset_left.normalizeOffsetLeft)(containerEl.scrollLeft, scrollLeftMax, !!this.props.rtlEnabled);
  }
  clientHeight() {
    return this.containerRef.current.clientHeight;
  }
  clientWidth() {
    return this.containerRef.current.clientWidth;
  }
  validate(event) {
    if (this.isLocked()) {
      return false;
    }
    return this.moveIsAllowed(event);
  }
  moveIsAllowed(event) {
    if (this.props.disabled || (0, _index.isDxMouseWheelEvent)(event) && this.isScrollingOutOfBound(event)) {
      return false;
    }
    return (0, _type.isDefined)(this.tryGetAllowedDirection());
  }
  updateHandler() {
    this.updateElementDimensions();
    this.onUpdated();
  }
  scrollByLocation(location) {
    const containerEl = this.containerRef.current;
    if (this.direction.isVertical) {
      containerEl.scrollTop += location.top;
    }
    if (this.direction.isHorizontal) {
      containerEl.scrollLeft += location.left;
    }
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (this.props['direction'] !== nextProps['direction']) {
      this.__getterCache['direction'] = undefined;
    }
    if (this.props['forceGeneratePockets'] !== nextProps['forceGeneratePockets'] || this.props['refreshStrategy'] !== nextProps['refreshStrategy'] || this.state['contentTranslateTop'] !== nextState['contentTranslateTop']) {
      this.__getterCache['contentStyles'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        loadPanelTemplate: getTemplate(props.loadPanelTemplate)
      }),
      containerClientWidth: this.state.containerClientWidth,
      containerClientHeight: this.state.containerClientHeight,
      contentClientWidth: this.state.contentClientWidth,
      contentClientHeight: this.state.contentClientHeight,
      contentScrollWidth: this.state.contentScrollWidth,
      contentScrollHeight: this.state.contentScrollHeight,
      topPocketHeight: this.state.topPocketHeight,
      bottomPocketHeight: this.state.bottomPocketHeight,
      scrolling: this.state.scrolling,
      topPocketState: this.state.topPocketState,
      isLoadPanelVisible: this.state.isLoadPanelVisible,
      pullDownTranslateTop: this.state.pullDownTranslateTop,
      pullDownIconAngle: this.state.pullDownIconAngle,
      pullDownOpacity: this.state.pullDownOpacity,
      contentTranslateTop: this.state.contentTranslateTop,
      vScrollLocation: this.state.vScrollLocation,
      hScrollLocation: this.state.hScrollLocation,
      wrapperRef: this.wrapperRef,
      contentRef: this.contentRef,
      scrollViewContentRef: this.scrollViewContentRef,
      containerRef: this.containerRef,
      scrollableRef: this.scrollableRef,
      topPocketRef: this.topPocketRef,
      bottomPocketRef: this.bottomPocketRef,
      vScrollbarRef: this.vScrollbarRef,
      hScrollbarRef: this.hScrollbarRef,
      clearReleaseTimer: this.clearReleaseTimer,
      onRelease: this.onRelease,
      onUpdated: this.onUpdated,
      startLoading: this.startLoading,
      finishLoading: this.finishLoading,
      setPocketState: this.setPocketState,
      handleScroll: this.handleScroll,
      handlePocketState: this.handlePocketState,
      pullDownReady: this.pullDownReady,
      onReachBottom: this.onReachBottom,
      onPullDown: this.onPullDown,
      stateReleased: this.stateReleased,
      getEventArgs: this.getEventArgs,
      lock: this.lock,
      unlock: this.unlock,
      fullScrollInactiveProp: this.fullScrollInactiveProp,
      updateElementDimensions: this.updateElementDimensions,
      setContainerDimensions: this.setContainerDimensions,
      setContentHeight: this.setContentHeight,
      setContentWidth: this.setContentWidth,
      syncScrollbarsWithContent: this.syncScrollbarsWithContent,
      getInitEventData: this.getInitEventData,
      handleInit: this.handleInit,
      handleMove: this.handleMove,
      handleEnd: this.handleEnd,
      handleStop: this.handleStop,
      pullDownComplete: this.pullDownComplete,
      clearRefreshTimer: this.clearRefreshTimer,
      pullDownRefreshing: this.pullDownRefreshing,
      movePullDown: this.movePullDown,
      getPullDownHeight: this.getPullDownHeight,
      getPullDownStartPosition: this.getPullDownStartPosition,
      complete: this.complete,
      releaseState: this.releaseState,
      isSwipeDownStrategy: this.isSwipeDownStrategy,
      isPullDownStrategy: this.isPullDownStrategy,
      isSwipeDown: this.isSwipeDown,
      pulledDown: this.pulledDown,
      isReachBottom: this.isReachBottom,
      tryGetAllowedDirection: this.tryGetAllowedDirection,
      isLocked: this.isLocked,
      isScrollingOutOfBound: this.isScrollingOutOfBound,
      cssClasses: this.cssClasses,
      direction: this.direction,
      pullDownEnabled: this.pullDownEnabled,
      contentStyles: this.contentStyles,
      contentHeight: this.contentHeight,
      contentWidth: this.contentWidth,
      hScrollOffsetMax: this.hScrollOffsetMax,
      vScrollOffsetMax: this.vScrollOffsetMax,
      restAttributes: this.restAttributes
    });
  }
}
exports.ScrollableNative = ScrollableNative;
ScrollableNative.defaultProps = _native_strategy_props.ScrollableNativeProps;