"use strict";

exports.viewFunction = exports.PageSizeLargeProps = exports.PageSizeLarge = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _combine_classes = require("../../../utils/combine_classes");
var _light_button = require("../common/light_button");
var _pager_props = require("../common/pager_props");
var _consts = require("../common/consts");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _string = require("../../../../core/utils/string");
const _excluded = ["pageSize", "pageSizeChange", "pageSizes"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const viewFunction = _ref => {
  let {
    pageSizesText
  } = _ref;
  return (0, _inferno.createFragment)(pageSizesText.map(_ref2 => {
    let {
      className,
      click,
      label,
      text
    } = _ref2;
    return (0, _inferno.createComponentVNode)(2, _light_button.LightButton, {
      "className": className,
      "label": label,
      "onClick": click,
      children: text
    }, text);
  }), 0);
};
exports.viewFunction = viewFunction;
const PageSizeLargeProps = exports.PageSizeLargeProps = {};
const PageSizeLargePropsType = {
  get pageSize() {
    return _pager_props.InternalPagerProps.pageSize;
  }
};
class PageSizeLarge extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
  }
  get pageSizesText() {
    if (this.__getterCache['pageSizesText'] !== undefined) {
      return this.__getterCache['pageSizesText'];
    }
    return this.__getterCache['pageSizesText'] = (() => {
      const {
        pageSize,
        pageSizes
      } = this.props;
      return pageSizes.map((_ref3, index) => {
        let {
          text,
          value: processedPageSize
        } = _ref3;
        const selected = processedPageSize === pageSize;
        const className = (0, _combine_classes.combineClasses)({
          [selected ? _consts.PAGER_SELECTED_PAGE_SIZE_CLASS : _consts.PAGER_PAGE_SIZE_CLASS]: true,
          [_consts.FIRST_CHILD_CLASS]: index === 0
        });
        return {
          className,
          click: this.onPageSizeChange(processedPageSize),
          label: (0, _string.format)(_message.default.getFormatter('dxPager-pageSize'), processedPageSize || _message.default.getFormatter('dxPager-pageSizesAllText')),
          text
        };
      });
    })();
  }
  onPageSizeChange(processedPageSize) {
    return () => {
      this.props.pageSizeChange(processedPageSize);
      return this.props.pageSize;
    };
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['pageSize'] !== nextProps['pageSize'] || this.props['pageSizes'] !== nextProps['pageSizes'] || this.props['pageSizeChange'] !== nextProps['pageSizeChange']) {
      this.__getterCache['pageSizesText'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      pageSizesText: this.pageSizesText,
      restAttributes: this.restAttributes
    });
  }
}
exports.PageSizeLarge = PageSizeLarge;
PageSizeLarge.defaultProps = PageSizeLargePropsType;