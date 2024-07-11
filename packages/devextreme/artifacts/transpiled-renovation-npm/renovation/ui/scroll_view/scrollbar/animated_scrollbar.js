"use strict";

exports.viewFunction = exports.OUT_BOUNDS_ACCELERATION = exports.MIN_VELOCITY_LIMIT = exports.BOUNCE_MIN_VELOCITY_LIMIT = exports.BOUNCE_ACCELERATION_SUM = exports.AnimatedScrollbar = exports.ACCELERATION = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _scrollbar = require("./scrollbar");
var _frame = require("../../../../animation/frame");
var _simulated_strategy_props = require("../common/simulated_strategy_props");
var _math = require("../../../../core/utils/math");
var _clamp_into_range = require("../utils/clamp_into_range");
var _animated_scrollbar_props = require("../common/animated_scrollbar_props");
var _index = require("../../../../events/utils/index");
var _consts = require("../common/consts");
var _config_context = require("../../../common/config_context");
const _excluded = ["bottomPocketSize", "bounceEnabled", "containerHasSizes", "containerSize", "contentPaddingBottom", "contentSize", "direction", "forceGeneratePockets", "inertiaEnabled", "maxOffset", "minOffset", "onBounce", "onEnd", "onLock", "onPullDown", "onReachBottom", "onScroll", "onUnlock", "pulledDown", "reachBottomEnabled", "rtlEnabled", "scrollByThumb", "scrollLocation", "scrollLocationChange", "showScrollbar", "visible"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const OUT_BOUNDS_ACCELERATION = exports.OUT_BOUNDS_ACCELERATION = 0.5;
const ACCELERATION = exports.ACCELERATION = 0.92;
const MIN_VELOCITY_LIMIT = exports.MIN_VELOCITY_LIMIT = 1;
const BOUNCE_MIN_VELOCITY_LIMIT = exports.BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;
const FRAME_DURATION = 17;
const BOUNCE_DURATION = 400;
const BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
const BOUNCE_ACCELERATION_SUM = exports.BOUNCE_ACCELERATION_SUM = (1 - ACCELERATION ** BOUNCE_FRAMES) / (1 - ACCELERATION);
const viewFunction = viewModel => {
  const {
    newScrollLocation,
    props: {
      bounceEnabled,
      containerHasSizes,
      containerSize,
      contentSize,
      direction,
      maxOffset,
      minOffset,
      scrollByThumb,
      showScrollbar,
      visible
    },
    scrollbarRef
  } = viewModel;
  return (0, _inferno.createComponentVNode)(2, _scrollbar.Scrollbar, {
    "direction": direction,
    "contentSize": contentSize,
    "containerSize": containerSize,
    "visible": visible,
    "minOffset": minOffset,
    "maxOffset": maxOffset,
    "scrollLocation": newScrollLocation,
    "scrollByThumb": scrollByThumb,
    "bounceEnabled": bounceEnabled,
    "showScrollbar": showScrollbar,
    "containerHasSizes": containerHasSizes
  }, null, scrollbarRef);
};
exports.viewFunction = viewFunction;
const AnimatedScrollbarPropsType = {
  get pulledDown() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.pulledDown;
  },
  get bottomPocketSize() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.bottomPocketSize;
  },
  get contentPaddingBottom() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.contentPaddingBottom;
  },
  get direction() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.direction;
  },
  get containerSize() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.containerSize;
  },
  get contentSize() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.contentSize;
  },
  get visible() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.visible;
  },
  get containerHasSizes() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.containerHasSizes;
  },
  get scrollLocation() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.scrollLocation;
  },
  get minOffset() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.minOffset;
  },
  get maxOffset() {
    return _animated_scrollbar_props.AnimatedScrollbarProps.maxOffset;
  },
  get inertiaEnabled() {
    return _simulated_strategy_props.ScrollableSimulatedProps.inertiaEnabled;
  },
  get showScrollbar() {
    return _simulated_strategy_props.ScrollableSimulatedProps.showScrollbar;
  },
  get scrollByThumb() {
    return _simulated_strategy_props.ScrollableSimulatedProps.scrollByThumb;
  },
  get bounceEnabled() {
    return _simulated_strategy_props.ScrollableSimulatedProps.bounceEnabled;
  },
  get reachBottomEnabled() {
    return _simulated_strategy_props.ScrollableSimulatedProps.reachBottomEnabled;
  },
  get forceGeneratePockets() {
    return _simulated_strategy_props.ScrollableSimulatedProps.forceGeneratePockets;
  }
};
class AnimatedScrollbar extends _inferno2.InfernoComponent {
  get config() {
    if (this.context[_config_context.ConfigContext.id]) {
      return this.context[_config_context.ConfigContext.id];
    }
    return _config_context.ConfigContext.defaultValue;
  }
  constructor(props) {
    super(props);
    this.scrollbarRef = (0, _inferno.createRef)();
    this.rightScrollLocation = 0;
    this.prevScrollLocation = 0;
    this.thumbScrolling = false;
    this.crossThumbScrolling = false;
    this.stepAnimationFrame = 0;
    this.velocity = 0;
    this.refreshing = false;
    this.loading = false;
    this.state = {
      canceled: false,
      newScrollLocation: 0,
      forceAnimationToBottomBound: false,
      pendingRefreshing: false,
      pendingLoading: false,
      pendingBounceAnimator: false,
      pendingInertiaAnimator: false,
      needRiseEnd: false,
      wasRelease: false
    };
    this.isThumb = this.isThumb.bind(this);
    this.isScrollbar = this.isScrollbar.bind(this);
    this.reachedMin = this.reachedMin.bind(this);
    this.reachedMax = this.reachedMax.bind(this);
    this.initHandler = this.initHandler.bind(this);
    this.moveHandler = this.moveHandler.bind(this);
    this.endHandler = this.endHandler.bind(this);
    this.stopHandler = this.stopHandler.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.releaseHandler = this.releaseHandler.bind(this);
    this.disposeAnimationFrame = this.disposeAnimationFrame.bind(this);
    this.risePullDown = this.risePullDown.bind(this);
    this.riseEnd = this.riseEnd.bind(this);
    this.riseReachBottom = this.riseReachBottom.bind(this);
    this.startAnimator = this.startAnimator.bind(this);
    this.updateScrollLocationInRTL = this.updateScrollLocationInRTL.bind(this);
    this.performAnimation = this.performAnimation.bind(this);
    this.updateLockedState = this.updateLockedState.bind(this);
    this.suppressVelocityBeforeBoundary = this.suppressVelocityBeforeBoundary.bind(this);
    this.scrollToNextStep = this.scrollToNextStep.bind(this);
    this.setActiveState = this.setActiveState.bind(this);
    this.moveTo = this.moveTo.bind(this);
    this.moveToMouseLocation = this.moveToMouseLocation.bind(this);
    this.resetThumbScrolling = this.resetThumbScrolling.bind(this);
    this.stop = this.stop.bind(this);
    this.cancel = this.cancel.bind(this);
    this.calcThumbScrolling = this.calcThumbScrolling.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.disposeAnimationFrame, []), new _inferno2.InfernoEffect(this.risePullDown, [this.props.forceGeneratePockets, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.scrollLocation, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.props.pulledDown, this.props.onPullDown]), new _inferno2.InfernoEffect(this.riseEnd, [this.props.scrollLocation, this.props.maxOffset, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.forceGeneratePockets, this.props.pulledDown, this.props.reachBottomEnabled, this.state.wasRelease, this.props.onEnd, this.props.direction]), new _inferno2.InfernoEffect(this.riseReachBottom, [this.props.forceGeneratePockets, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.scrollLocation, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.props.onReachBottom]), new _inferno2.InfernoEffect(this.startAnimator, [this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.scrollLocation, this.props.forceGeneratePockets, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.props.bounceEnabled, this.props.onBounce, this.props.inertiaEnabled]), new _inferno2.InfernoEffect(this.updateScrollLocationInRTL, [this.props.containerHasSizes, this.props.direction, this.props.rtlEnabled, this.props.maxOffset, this.props.scrollLocation, this.props.scrollLocationChange, this.props.onScroll]), new _inferno2.InfernoEffect(this.performAnimation, [this.state.pendingInertiaAnimator, this.state.canceled, this.state.pendingBounceAnimator, this.props.bounceEnabled, this.props.minOffset, this.props.scrollLocation, this.props.forceGeneratePockets, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.scrollLocationChange, this.props.direction, this.props.onScroll]), new _inferno2.InfernoEffect(this.updateLockedState, [this.state.pendingBounceAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.onLock, this.props.onUnlock])];
  }
  updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7;
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.forceGeneratePockets, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.scrollLocation, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.props.pulledDown, this.props.onPullDown]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 || _this$_effects$2.update([this.props.scrollLocation, this.props.maxOffset, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.forceGeneratePockets, this.props.pulledDown, this.props.reachBottomEnabled, this.state.wasRelease, this.props.onEnd, this.props.direction]);
    (_this$_effects$3 = this._effects[3]) === null || _this$_effects$3 === void 0 || _this$_effects$3.update([this.props.forceGeneratePockets, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.scrollLocation, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.props.onReachBottom]);
    (_this$_effects$4 = this._effects[4]) === null || _this$_effects$4 === void 0 || _this$_effects$4.update([this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.scrollLocation, this.props.forceGeneratePockets, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.props.bounceEnabled, this.props.onBounce, this.props.inertiaEnabled]);
    (_this$_effects$5 = this._effects[5]) === null || _this$_effects$5 === void 0 || _this$_effects$5.update([this.props.containerHasSizes, this.props.direction, this.props.rtlEnabled, this.props.maxOffset, this.props.scrollLocation, this.props.scrollLocationChange, this.props.onScroll]);
    (_this$_effects$6 = this._effects[6]) === null || _this$_effects$6 === void 0 || _this$_effects$6.update([this.state.pendingInertiaAnimator, this.state.canceled, this.state.pendingBounceAnimator, this.props.bounceEnabled, this.props.minOffset, this.props.scrollLocation, this.props.forceGeneratePockets, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.scrollLocationChange, this.props.direction, this.props.onScroll]);
    (_this$_effects$7 = this._effects[7]) === null || _this$_effects$7 === void 0 || _this$_effects$7.update([this.state.pendingBounceAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.onLock, this.props.onUnlock]);
  }
  disposeAnimationFrame() {
    return () => {
      this.cancel();
    };
  }
  risePullDown() {
    if (this.props.forceGeneratePockets && this.isReadyToStart && this.inRange && this.props.pulledDown && !this.refreshing) {
      var _this$props$onPullDow, _this$props;
      this.refreshing = true;
      this.setState(__state_argument => ({
        pendingRefreshing: true
      }));
      (_this$props$onPullDow = (_this$props = this.props).onPullDown) === null || _this$props$onPullDow === void 0 || _this$props$onPullDow.call(_this$props);
    }
  }
  riseEnd() {
    const isInsideBounds = (0, _math.inRange)(this.props.scrollLocation, this.props.maxOffset, 0);
    if (isInsideBounds && this.isReadyToStart && this.finished && !this.pendingRelease) {
      var _this$props$onEnd, _this$props2;
      this.setState(__state_argument => ({
        needRiseEnd: false
      }));
      this.setState(__state_argument => ({
        wasRelease: false
      }));
      this.setState(__state_argument => ({
        forceAnimationToBottomBound: false
      }));
      (_this$props$onEnd = (_this$props2 = this.props).onEnd) === null || _this$props$onEnd === void 0 || _this$props$onEnd.call(_this$props2, this.props.direction);
    }
  }
  riseReachBottom() {
    if (this.props.forceGeneratePockets && this.isReadyToStart && this.inRange && this.isReachBottom && !this.loading && this.finished) {
      var _this$props$onReachBo, _this$props3;
      this.loading = true;
      this.setState(__state_argument => ({
        pendingLoading: true
      }));
      (_this$props$onReachBo = (_this$props3 = this.props).onReachBottom) === null || _this$props$onReachBo === void 0 || _this$props$onReachBo.call(_this$props3);
    }
  }
  startAnimator() {
    if (this.isReadyToStart) {
      this.setState(__state_argument => ({
        canceled: false
      }));
      if (!this.inRange && this.props.bounceEnabled && !this.state.pendingBounceAnimator) {
        var _this$props$onBounce, _this$props4;
        const distanceToBound = (0, _clamp_into_range.clampIntoRange)(this.props.scrollLocation, this.props.minOffset, this.maxOffset) - this.props.scrollLocation;
        this.velocity = distanceToBound / BOUNCE_ACCELERATION_SUM;
        (_this$props$onBounce = (_this$props4 = this.props).onBounce) === null || _this$props$onBounce === void 0 || _this$props$onBounce.call(_this$props4);
        this.setState(__state_argument => ({
          pendingBounceAnimator: true
        }));
      }
      if (this.inRange && this.props.inertiaEnabled && !this.finished && !this.state.pendingInertiaAnimator) {
        if (this.thumbScrolling || !this.thumbScrolling && this.crossThumbScrolling) {
          this.velocity = 0;
        }
        this.setState(__state_argument => ({
          pendingInertiaAnimator: true
        }));
      }
    }
  }
  updateScrollLocationInRTL() {
    if (this.props.containerHasSizes && this.isHorizontal && this.props.rtlEnabled) {
      if (this.props.maxOffset === 0 && this.props.scrollLocation) {
        this.rightScrollLocation = 0;
      }
      this.moveTo(this.props.maxOffset - this.rightScrollLocation);
    }
  }
  performAnimation() {
    if (this.state.pendingInertiaAnimator) {
      if (this.state.canceled) {
        this.setState(__state_argument => ({
          needRiseEnd: false
        }));
        this.stop();
        return;
      }
      if (this.finished || !this.props.bounceEnabled && this.distanceToNearestBoundary === 0) {
        this.stop();
        return;
      }
      if (!this.props.bounceEnabled) {
        this.suppressVelocityBeforeBoundary();
      }
      this.scrollToNextStep();
    }
    if (this.state.pendingBounceAnimator) {
      if (this.distanceToNearestBoundary === 0) {
        this.stop();
        return;
      }
      this.suppressVelocityBeforeBoundary();
      this.scrollToNextStep();
    }
  }
  updateLockedState() {
    if (this.state.pendingBounceAnimator || this.state.pendingRefreshing || this.state.pendingLoading) {
      var _this$props$onLock, _this$props5;
      (_this$props$onLock = (_this$props5 = this.props).onLock) === null || _this$props$onLock === void 0 || _this$props$onLock.call(_this$props5);
    } else {
      var _this$props$onUnlock, _this$props6;
      (_this$props$onUnlock = (_this$props6 = this.props).onUnlock) === null || _this$props$onUnlock === void 0 || _this$props$onUnlock.call(_this$props6);
    }
  }
  get isReadyToStart() {
    return this.state.needRiseEnd && !this.inProgress && !(this.state.pendingRefreshing || this.state.pendingLoading);
  }
  get distanceToNearestBoundary() {
    return Math.min(Math.abs(this.distanceToMin), Math.abs(this.distanceToMax));
  }
  suppressVelocityBeforeBoundary() {
    if (Math.abs(this.distanceToMin) - Math.abs(this.velocity) <= 0) {
      this.velocity = this.distanceToMin;
    }
    if (Math.abs(this.distanceToMax) - Math.abs(this.velocity) <= 0) {
      this.velocity = this.distanceToMax;
    }
  }
  scrollToNextStep() {
    (0, _frame.cancelAnimationFrame)(this.stepAnimationFrame);
    this.stepAnimationFrame = (0, _frame.requestAnimationFrame)(() => {
      const prevVelocity = this.velocity;
      this.velocity *= this.acceleration;
      this.moveTo(this.props.scrollLocation + prevVelocity);
    });
  }
  setActiveState() {
    this.scrollbarRef.current.setActiveState();
  }
  moveTo(value) {
    var _this$props$scrollLoc, _this$props7;
    this.rightScrollLocation = this.props.maxOffset - value;
    this.setState(__state_argument => ({
      newScrollLocation: value
    }));
    const scrollDelta = Math.abs(this.prevScrollLocation - value);
    this.prevScrollLocation = value;
    (_this$props$scrollLoc = (_this$props7 = this.props).scrollLocationChange) === null || _this$props$scrollLoc === void 0 || _this$props$scrollLoc.call(_this$props7, {
      fullScrollProp: this.fullScrollProp,
      location: -value
    });
    if (scrollDelta > 0) {
      var _this$props$onScroll, _this$props8;
      (_this$props$onScroll = (_this$props8 = this.props).onScroll) === null || _this$props$onScroll === void 0 || _this$props$onScroll.call(_this$props8);
    }
  }
  moveToMouseLocation(event, offset) {
    const mouseLocation = event[`page${this.axis.toUpperCase()}`] - offset;
    const containerToContentRatio = this.props.containerSize / this.props.contentSize;
    const delta = mouseLocation / containerToContentRatio - this.props.containerSize / 2;
    this.moveTo(Math.round(-delta));
  }
  resetThumbScrolling() {
    this.thumbScrolling = false;
    this.crossThumbScrolling = false;
  }
  stop() {
    this.velocity = 0;
    this.setState(__state_argument => ({
      pendingBounceAnimator: false
    }));
    this.setState(__state_argument => ({
      pendingInertiaAnimator: false
    }));
  }
  cancel() {
    this.setState(__state_argument => ({
      canceled: true
    }));
    this.stop();
    (0, _frame.cancelAnimationFrame)(this.stepAnimationFrame);
  }
  calcThumbScrolling(event, currentCrossThumbScrolling, isScrollbarClicked) {
    const {
      target
    } = event.originalEvent;
    this.thumbScrolling = isScrollbarClicked || this.props.scrollByThumb && this.isThumb(target);
    this.crossThumbScrolling = !this.thumbScrolling && currentCrossThumbScrolling;
  }
  get distanceToMin() {
    return this.props.minOffset - this.props.scrollLocation;
  }
  get distanceToMax() {
    return this.maxOffset - this.props.scrollLocation;
  }
  get pendingRelease() {
    return this.props.forceGeneratePockets && (this.props.pulledDown || this.isReachBottom) && !this.state.wasRelease;
  }
  get inProgress() {
    return this.state.pendingBounceAnimator || this.state.pendingInertiaAnimator;
  }
  get inRange() {
    return (0, _math.inRange)(this.props.scrollLocation, this.maxOffset, this.props.minOffset);
  }
  get isReachBottom() {
    return this.props.reachBottomEnabled && this.props.maxOffset < 0 && Math.round(-Math.ceil(-this.props.scrollLocation) - this.props.maxOffset) <= 1;
  }
  get finished() {
    if (this.state.pendingBounceAnimator) {
      return Math.abs(this.velocity) <= BOUNCE_MIN_VELOCITY_LIMIT;
    }
    return Math.abs(this.velocity) <= MIN_VELOCITY_LIMIT;
  }
  get acceleration() {
    return this.state.pendingBounceAnimator || this.inRange ? ACCELERATION : OUT_BOUNDS_ACCELERATION;
  }
  get maxOffset() {
    if (this.props.forceGeneratePockets && this.props.reachBottomEnabled && !this.state.forceAnimationToBottomBound) {
      return this.props.maxOffset - this.props.bottomPocketSize - this.props.contentPaddingBottom;
    }
    return this.props.maxOffset;
  }
  get isHorizontal() {
    return this.props.direction === _consts.DIRECTION_HORIZONTAL;
  }
  get axis() {
    return this.isHorizontal ? 'x' : 'y';
  }
  get fullScrollProp() {
    return this.isHorizontal ? 'scrollLeft' : 'scrollTop';
  }
  get restAttributes() {
    const _this$props9 = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props9, _excluded);
    return restProps;
  }
  isThumb(element) {
    return this.scrollbarRef.current.isThumb(element);
  }
  isScrollbar(element) {
    return this.scrollbarRef.current.isScrollbar(element);
  }
  reachedMin() {
    return this.props.scrollLocation <= this.maxOffset;
  }
  reachedMax() {
    return this.props.scrollLocation >= this.props.minOffset;
  }
  initHandler(event, crossThumbScrolling, offset) {
    this.cancel();
    this.refreshing = false;
    this.loading = false;
    if (!(0, _index.isDxMouseWheelEvent)(event.originalEvent)) {
      const {
        target
      } = event.originalEvent;
      const scrollbarClicked = this.props.scrollByThumb && this.isScrollbar(target);
      this.calcThumbScrolling(event, crossThumbScrolling, scrollbarClicked);
      if (scrollbarClicked) {
        this.moveToMouseLocation(event, offset);
      }
      if (this.thumbScrolling) {
        this.setActiveState();
      }
    }
  }
  moveHandler(delta, isDxMouseWheel) {
    if (this.crossThumbScrolling) {
      return;
    }
    let resultDelta = delta;
    if (this.thumbScrolling) {
      resultDelta = -Math.round(delta / (this.props.containerSize / this.props.contentSize));
    }
    const isOutBounds = !(0, _math.inRange)(this.props.scrollLocation, this.maxOffset, this.props.minOffset);
    if (isOutBounds) {
      resultDelta *= OUT_BOUNDS_ACCELERATION;
    }
    const scrollValue = this.props.scrollLocation + resultDelta;
    this.moveTo(this.props.bounceEnabled && !isDxMouseWheel ? scrollValue : (0, _clamp_into_range.clampIntoRange)(scrollValue, this.props.minOffset, this.maxOffset));
  }
  endHandler(receivedVelocity, needRiseEnd) {
    this.velocity = this.props.inertiaEnabled && !this.thumbScrolling ? receivedVelocity : 0;
    this.setState(__state_argument => ({
      needRiseEnd: needRiseEnd
    }));
    this.resetThumbScrolling();
  }
  stopHandler() {
    if (this.thumbScrolling) {
      this.setState(__state_argument => ({
        needRiseEnd: true
      }));
    }
    this.resetThumbScrolling();
  }
  scrollTo(value, needRiseEnd) {
    this.loading = false;
    this.refreshing = false;
    this.moveTo(-(0, _clamp_into_range.clampIntoRange)(value, -this.maxOffset, 0));
    this.setState(__state_argument => ({
      needRiseEnd: needRiseEnd
    }));
  }
  releaseHandler() {
    if (this.props.forceGeneratePockets && this.props.reachBottomEnabled && (0, _math.inRange)(this.props.scrollLocation, this.maxOffset, this.props.maxOffset)) {
      this.setState(__state_argument => ({
        forceAnimationToBottomBound: true
      }));
    }
    this.setState(__state_argument => ({
      wasRelease: true
    }));
    this.setState(__state_argument => ({
      needRiseEnd: true
    }));
    this.resetThumbScrolling();
    this.setState(__state_argument => ({
      pendingRefreshing: false
    }));
    this.setState(__state_argument => ({
      pendingLoading: false
    }));
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      canceled: this.state.canceled,
      newScrollLocation: this.state.newScrollLocation,
      forceAnimationToBottomBound: this.state.forceAnimationToBottomBound,
      pendingRefreshing: this.state.pendingRefreshing,
      pendingLoading: this.state.pendingLoading,
      pendingBounceAnimator: this.state.pendingBounceAnimator,
      pendingInertiaAnimator: this.state.pendingInertiaAnimator,
      needRiseEnd: this.state.needRiseEnd,
      wasRelease: this.state.wasRelease,
      scrollbarRef: this.scrollbarRef,
      config: this.config,
      isReadyToStart: this.isReadyToStart,
      distanceToNearestBoundary: this.distanceToNearestBoundary,
      suppressVelocityBeforeBoundary: this.suppressVelocityBeforeBoundary,
      scrollToNextStep: this.scrollToNextStep,
      setActiveState: this.setActiveState,
      moveTo: this.moveTo,
      moveToMouseLocation: this.moveToMouseLocation,
      resetThumbScrolling: this.resetThumbScrolling,
      stop: this.stop,
      cancel: this.cancel,
      calcThumbScrolling: this.calcThumbScrolling,
      distanceToMin: this.distanceToMin,
      distanceToMax: this.distanceToMax,
      pendingRelease: this.pendingRelease,
      inProgress: this.inProgress,
      inRange: this.inRange,
      isReachBottom: this.isReachBottom,
      finished: this.finished,
      acceleration: this.acceleration,
      maxOffset: this.maxOffset,
      isHorizontal: this.isHorizontal,
      axis: this.axis,
      fullScrollProp: this.fullScrollProp,
      restAttributes: this.restAttributes
    });
  }
}
exports.AnimatedScrollbar = AnimatedScrollbar;
AnimatedScrollbar.defaultProps = AnimatedScrollbarPropsType;