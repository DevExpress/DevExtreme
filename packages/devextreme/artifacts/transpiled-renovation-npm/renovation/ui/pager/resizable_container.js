"use strict";

exports.ResizableContainerProps = exports.ResizableContainer = void 0;
exports.calculateInfoTextVisible = calculateInfoTextVisible;
exports.calculateLargeDisplayMode = calculateLargeDisplayMode;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _resize_callbacks = _interopRequireDefault(require("../../../core/utils/resize_callbacks"));
var _get_element_width = require("./utils/get_element_width");
var _type = require("../../../core/utils/type");
const _excluded = ["contentTemplate", "pagerProps"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    contentAttributes,
    infoTextRef,
    infoTextVisible,
    isLargeDisplayMode,
    pageSizesRef,
    pagesRef,
    parentRef,
    props: {
      contentTemplate: Content
    }
  } = _ref;
  return Content(_extends({
    rootElementRef: parentRef,
    pageSizesRef: pageSizesRef,
    infoTextRef: infoTextRef,
    pagesRef: pagesRef,
    infoTextVisible: infoTextVisible,
    isLargeDisplayMode: isLargeDisplayMode
  }, contentAttributes));
};
exports.viewFunction = viewFunction;
function calculateLargeDisplayMode(_ref2) {
  let {
    pageSizes: pageSizesWidth,
    pages: pagesWidth,
    parent: parentWidth
  } = _ref2;
  return parentWidth - (pageSizesWidth + pagesWidth) > 0;
}
function calculateInfoTextVisible(_ref3) {
  let {
    info: infoWidth,
    pageSizes: pageSizesWidth,
    pages: pagesWidth,
    parent: parentWidth
  } = _ref3;
  const minimalWidth = pageSizesWidth + pagesWidth + infoWidth;
  return parentWidth - minimalWidth > 0;
}
function getElementsWidth(_ref4) {
  let {
    info,
    pageSizes,
    pages,
    parent
  } = _ref4;
  const parentWidth = (0, _get_element_width.getElementContentWidth)(parent);
  const pageSizesWidth = (0, _get_element_width.getElementWidth)(pageSizes);
  const infoWidth = (0, _get_element_width.getElementWidth)(info);
  const pagesHtmlWidth = (0, _get_element_width.getElementWidth)(pages);
  return {
    parent: parentWidth,
    pageSizes: pageSizesWidth,
    info: infoWidth + (0, _get_element_width.getElementStyle)('marginLeft', info) + (0, _get_element_width.getElementStyle)('marginRight', info),
    pages: pagesHtmlWidth
  };
}
const ResizableContainerProps = exports.ResizableContainerProps = {};
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
class ResizableContainer extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.parentRef = (0, _inferno.createRef)();
    this.pageSizesRef = (0, _inferno.createRef)();
    this.infoTextRef = (0, _inferno.createRef)();
    this.pagesRef = (0, _inferno.createRef)();
    this.actualIsLargeDisplayMode = true;
    this.actualInfoTextVisible = true;
    this.state = {
      infoTextVisible: true,
      isLargeDisplayMode: true
    };
    this.subscribeToResize = this.subscribeToResize.bind(this);
    this.effectUpdateChildProps = this.effectUpdateChildProps.bind(this);
    this.updateAdaptivityProps = this.updateAdaptivityProps.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.subscribeToResize, [this.state.infoTextVisible, this.state.isLargeDisplayMode]), new _inferno2.InfernoEffect(this.effectUpdateChildProps, [this.props, this.state.infoTextVisible, this.state.isLargeDisplayMode, this.props.pagerProps, this.props.contentTemplate])];
  }
  updateEffects() {
    var _this$_effects$, _this$_effects$2;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.state.infoTextVisible, this.state.isLargeDisplayMode]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 || _this$_effects$2.update([this.props, this.state.infoTextVisible, this.state.isLargeDisplayMode, this.props.pagerProps, this.props.contentTemplate]);
  }
  subscribeToResize() {
    const callback = () => {
      this.parentWidth > 0 && this.updateAdaptivityProps();
    };
    _resize_callbacks.default.add(callback);
    return () => {
      _resize_callbacks.default.remove(callback);
    };
  }
  effectUpdateChildProps() {
    if (this.parentWidth > 0) {
      this.updateAdaptivityProps();
    }
  }
  get contentAttributes() {
    const {
      className,
      displayMode,
      gridCompatibility,
      hasKnownLastPage,
      infoText,
      label,
      lightModeEnabled,
      maxPagesCount,
      onKeyDown,
      pageCount,
      pageIndex,
      pageIndexChange,
      pageSize,
      pageSizeChange,
      pageSizes,
      pagesCountText,
      pagesNavigatorVisible,
      rtlEnabled,
      showInfo,
      showNavigationButtons,
      showPageSizes,
      totalCount,
      visible
    } = this.props.pagerProps;
    return _extends({}, this.restAttributes, {
      pageSize,
      pageIndex,
      pageIndexChange,
      pageSizeChange,
      gridCompatibility,
      className,
      showInfo,
      infoText,
      lightModeEnabled,
      displayMode,
      maxPagesCount,
      pageCount,
      pagesCountText,
      visible,
      hasKnownLastPage,
      pagesNavigatorVisible,
      showPageSizes,
      pageSizes,
      rtlEnabled,
      showNavigationButtons,
      totalCount,
      onKeyDown,
      label
    });
  }
  get parentWidth() {
    return this.parentRef.current ? (0, _get_element_width.getElementWidth)(this.parentRef.current) : 0;
  }
  updateAdaptivityProps() {
    const currentElementsWidth = getElementsWidth({
      parent: this.parentRef.current,
      pageSizes: this.pageSizesRef.current,
      info: this.infoTextRef.current,
      pages: this.pagesRef.current
    });
    if (this.actualInfoTextVisible !== this.state.infoTextVisible || this.actualIsLargeDisplayMode !== this.state.isLargeDisplayMode) {
      return;
    }
    const isEmpty = !(0, _type.isDefined)(this.elementsWidth);
    if (isEmpty) {
      this.elementsWidth = {};
    }
    if (isEmpty || this.state.isLargeDisplayMode) {
      this.elementsWidth.pageSizes = currentElementsWidth.pageSizes;
      this.elementsWidth.pages = currentElementsWidth.pages;
    }
    if (isEmpty || this.state.infoTextVisible) {
      this.elementsWidth.info = currentElementsWidth.info;
    }
    this.actualIsLargeDisplayMode = calculateLargeDisplayMode(_extends({
      parent: currentElementsWidth.parent
    }, {
      pageSizes: this.elementsWidth.pageSizes,
      pages: this.elementsWidth.pages
    }));
    this.actualInfoTextVisible = calculateInfoTextVisible(_extends({}, currentElementsWidth, {
      info: this.elementsWidth.info
    }));
    this.setState(__state_argument => ({
      infoTextVisible: this.actualInfoTextVisible
    }));
    this.setState(__state_argument => ({
      isLargeDisplayMode: this.actualIsLargeDisplayMode
    }));
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        contentTemplate: getTemplate(props.contentTemplate)
      }),
      infoTextVisible: this.state.infoTextVisible,
      isLargeDisplayMode: this.state.isLargeDisplayMode,
      parentRef: this.parentRef,
      pageSizesRef: this.pageSizesRef,
      infoTextRef: this.infoTextRef,
      pagesRef: this.pagesRef,
      contentAttributes: this.contentAttributes,
      parentWidth: this.parentWidth,
      updateAdaptivityProps: this.updateAdaptivityProps,
      restAttributes: this.restAttributes
    });
  }
}
exports.ResizableContainer = ResizableContainer;
ResizableContainer.defaultProps = ResizableContainerProps;