"use strict";

exports.viewFunction = exports.THUMB_MIN_SIZE = exports.ScrollbarPropsType = exports.Scrollbar = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _combine_classes = require("../../../utils/combine_classes");
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _consts = require("../common/consts");
var _subscribe_to_event = require("../../../utils/subscribe_to_event");
var _scrollbar_props = require("../common/scrollbar_props");
var _simulated_strategy_props = require("../common/simulated_strategy_props");
const _excluded = ["bounceEnabled", "containerHasSizes", "containerSize", "contentSize", "direction", "maxOffset", "minOffset", "scrollByThumb", "scrollLocation", "showScrollbar", "visible"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const THUMB_MIN_SIZE = exports.THUMB_MIN_SIZE = 15;
const viewFunction = viewModel => {
  const {
    hidden,
    scrollbarClasses,
    scrollbarRef,
    thumbClasses,
    thumbRef,
    thumbStyles
  } = viewModel;
  return (0, _inferno.createVNode)(1, "div", scrollbarClasses, (0, _inferno.createVNode)(1, "div", thumbClasses, (0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_SCROLL_CONTENT_CLASS), 2, {
    "style": (0, _inferno2.normalizeStyles)(thumbStyles)
  }, null, thumbRef), 2, {
    "hidden": hidden
  }, null, scrollbarRef);
};
exports.viewFunction = viewFunction;
const ScrollbarPropsType = exports.ScrollbarPropsType = {
  get direction() {
    return _scrollbar_props.ScrollbarProps.direction;
  },
  get containerSize() {
    return _scrollbar_props.ScrollbarProps.containerSize;
  },
  get contentSize() {
    return _scrollbar_props.ScrollbarProps.contentSize;
  },
  get visible() {
    return _scrollbar_props.ScrollbarProps.visible;
  },
  get containerHasSizes() {
    return _scrollbar_props.ScrollbarProps.containerHasSizes;
  },
  get scrollLocation() {
    return _scrollbar_props.ScrollbarProps.scrollLocation;
  },
  get minOffset() {
    return _scrollbar_props.ScrollbarProps.minOffset;
  },
  get maxOffset() {
    return _scrollbar_props.ScrollbarProps.maxOffset;
  },
  get showScrollbar() {
    return _simulated_strategy_props.ScrollableSimulatedProps.showScrollbar;
  },
  get scrollByThumb() {
    return _simulated_strategy_props.ScrollableSimulatedProps.scrollByThumb;
  },
  get bounceEnabled() {
    return _simulated_strategy_props.ScrollableSimulatedProps.bounceEnabled;
  }
};
class Scrollbar extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.scrollbarRef = (0, _inferno.createRef)();
    this.scrollRef = (0, _inferno.createRef)();
    this.thumbRef = (0, _inferno.createRef)();
    this.__getterCache = {};
    this.state = {
      hovered: false,
      active: false
    };
    this.pointerDownEffect = this.pointerDownEffect.bind(this);
    this.pointerUpEffect = this.pointerUpEffect.bind(this);
    this.mouseEnterEffect = this.mouseEnterEffect.bind(this);
    this.mouseLeaveEffect = this.mouseLeaveEffect.bind(this);
    this.isThumb = this.isThumb.bind(this);
    this.isScrollbar = this.isScrollbar.bind(this);
    this.setActiveState = this.setActiveState.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.pointerDownEffect, []), new _inferno2.InfernoEffect(this.pointerUpEffect, []), new _inferno2.InfernoEffect(this.mouseEnterEffect, [this.props.showScrollbar, this.props.scrollByThumb]), new _inferno2.InfernoEffect(this.mouseLeaveEffect, [this.props.showScrollbar, this.props.scrollByThumb])];
  }
  updateEffects() {
    var _this$_effects$, _this$_effects$2;
    (_this$_effects$ = this._effects[2]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.showScrollbar, this.props.scrollByThumb]);
    (_this$_effects$2 = this._effects[3]) === null || _this$_effects$2 === void 0 || _this$_effects$2.update([this.props.showScrollbar, this.props.scrollByThumb]);
  }
  pointerDownEffect() {
    return (0, _subscribe_to_event.subscribeToDXPointerDownEvent)(this.thumbRef.current, () => {
      this.setState(__state_argument => ({
        active: true
      }));
    });
  }
  pointerUpEffect() {
    return (0, _subscribe_to_event.subscribeToDXPointerUpEvent)(_dom_adapter.default.getDocument(), () => {
      this.setState(__state_argument => ({
        active: false
      }));
    });
  }
  mouseEnterEffect() {
    if (this.isExpandable) {
      return (0, _subscribe_to_event.subscribeToMouseEnterEvent)(this.scrollbarRef.current, () => {
        this.setState(__state_argument => ({
          hovered: true
        }));
      });
    }
    return undefined;
  }
  mouseLeaveEffect() {
    if (this.isExpandable) {
      return (0, _subscribe_to_event.subscribeToMouseLeaveEvent)(this.scrollbarRef.current, () => {
        this.setState(__state_argument => ({
          hovered: false
        }));
      });
    }
    return undefined;
  }
  get dimension() {
    return this.isHorizontal ? 'width' : 'height';
  }
  get isHorizontal() {
    return this.props.direction === _consts.DIRECTION_HORIZONTAL;
  }
  get scrollSize() {
    return Math.max(this.props.containerSize * this.containerToContentRatio, THUMB_MIN_SIZE);
  }
  get containerToContentRatio() {
    return this.props.contentSize ? this.props.containerSize / this.props.contentSize : this.props.containerSize;
  }
  get scrollRatio() {
    const scrollOffsetMax = Math.abs(this.props.maxOffset);
    if (scrollOffsetMax) {
      return (this.props.containerSize - this.scrollSize) / scrollOffsetMax;
    }
    return 1;
  }
  get scrollbarClasses() {
    const classesMap = {
      [_consts.SCROLLABLE_SCROLLBAR_CLASS]: true,
      [`dx-scrollbar-${this.props.direction}`]: true,
      [_consts.SCROLLABLE_SCROLLBAR_ACTIVE_CLASS]: this.state.active,
      [_consts.HOVER_ENABLED_STATE]: this.isExpandable,
      'dx-state-invisible': this.hidden,
      'dx-state-hover': this.isExpandable && this.state.hovered
    };
    return (0, _combine_classes.combineClasses)(classesMap);
  }
  get thumbStyles() {
    if (this.__getterCache['thumbStyles'] !== undefined) {
      return this.__getterCache['thumbStyles'];
    }
    return this.__getterCache['thumbStyles'] = (() => {
      return {
        [this.dimension]: Math.round(this.scrollSize) || THUMB_MIN_SIZE,
        transform: this.isNeverMode ? 'none' : this.thumbTransform
      };
    })();
  }
  get thumbTransform() {
    const translateValue = -this.props.scrollLocation * this.scrollRatio;
    if (this.isHorizontal) {
      return `translate(${translateValue}px, 0px)`;
    }
    return `translate(0px, ${translateValue}px)`;
  }
  get thumbClasses() {
    return (0, _combine_classes.combineClasses)({
      [_consts.SCROLLABLE_SCROLL_CLASS]: true,
      'dx-state-invisible': !this.isThumbVisible
    });
  }
  get hidden() {
    return this.isNeverMode || this.props.maxOffset === 0 || this.props.containerSize < 15;
  }
  get isThumbVisible() {
    if (this.hidden) {
      return false;
    }
    if (this.isHoverMode) {
      return this.props.visible || this.state.hovered || this.state.active;
    }
    if (this.isAlwaysMode) {
      return true;
    }
    return this.props.visible;
  }
  get isExpandable() {
    return (this.isHoverMode || this.isAlwaysMode) && this.props.scrollByThumb;
  }
  get isHoverMode() {
    return this.props.showScrollbar === _consts.ShowScrollbarMode.HOVER;
  }
  get isAlwaysMode() {
    return this.props.showScrollbar === _consts.ShowScrollbarMode.ALWAYS;
  }
  get isNeverMode() {
    return this.props.showScrollbar === _consts.ShowScrollbarMode.NEVER;
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  isThumb(element) {
    return this.scrollbarRef.current.querySelector(`.${_consts.SCROLLABLE_SCROLL_CLASS}`) === element || this.scrollbarRef.current.querySelector(`.${_consts.SCROLLABLE_SCROLL_CONTENT_CLASS}`) === element;
  }
  isScrollbar(element) {
    return element === this.scrollbarRef.current;
  }
  setActiveState() {
    this.setState(__state_argument => ({
      active: true
    }));
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (this.props['direction'] !== nextProps['direction'] || this.props['containerSize'] !== nextProps['containerSize'] || this.props['contentSize'] !== nextProps['contentSize'] || this.props['showScrollbar'] !== nextProps['showScrollbar'] || this.props['scrollLocation'] !== nextProps['scrollLocation'] || this.props['maxOffset'] !== nextProps['maxOffset']) {
      this.__getterCache['thumbStyles'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      hovered: this.state.hovered,
      active: this.state.active,
      scrollbarRef: this.scrollbarRef,
      scrollRef: this.scrollRef,
      thumbRef: this.thumbRef,
      dimension: this.dimension,
      isHorizontal: this.isHorizontal,
      scrollSize: this.scrollSize,
      containerToContentRatio: this.containerToContentRatio,
      scrollRatio: this.scrollRatio,
      scrollbarClasses: this.scrollbarClasses,
      thumbStyles: this.thumbStyles,
      thumbTransform: this.thumbTransform,
      thumbClasses: this.thumbClasses,
      hidden: this.hidden,
      isThumbVisible: this.isThumbVisible,
      isExpandable: this.isExpandable,
      isHoverMode: this.isHoverMode,
      isAlwaysMode: this.isAlwaysMode,
      isNeverMode: this.isNeverMode,
      restAttributes: this.restAttributes
    });
  }
}
exports.Scrollbar = Scrollbar;
Scrollbar.defaultProps = ScrollbarPropsType;