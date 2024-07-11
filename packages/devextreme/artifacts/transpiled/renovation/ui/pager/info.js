"use strict";

exports.viewFunction = exports.PAGER_INFO_CLASS = exports.InfoTextProps = exports.InfoText = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _string = require("../../../core/utils/string");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _pager_props = require("./common/pager_props");
const _excluded = ["infoText", "pageCount", "pageIndex", "rootElementRef", "totalCount"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const PAGER_INFO_CLASS = exports.PAGER_INFO_CLASS = 'dx-info';
const viewFunction = _ref => {
  let {
    props: {
      rootElementRef
    },
    text
  } = _ref;
  return (0, _inferno.createVNode)(1, "div", PAGER_INFO_CLASS, text, 0, null, null, rootElementRef);
};
exports.viewFunction = viewFunction;
const InfoTextProps = exports.InfoTextProps = {};
const InfoTextPropsType = {
  get pageIndex() {
    return _pager_props.InternalPagerProps.pageIndex;
  },
  get pageCount() {
    return _pager_props.InternalPagerProps.pageCount;
  },
  get totalCount() {
    return _pager_props.InternalPagerProps.totalCount;
  }
};
class InfoText extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get infoText() {
    return (this.props.infoText ?? '') || _message.default.getFormatter('dxPager-infoText')();
  }
  get text() {
    const {
      pageCount,
      pageIndex,
      totalCount
    } = this.props;
    return (0, _string.format)(this.infoText, (pageIndex + 1).toString(), pageCount.toString(), totalCount.toString());
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      infoText: this.infoText,
      text: this.text,
      restAttributes: this.restAttributes
    });
  }
}
exports.InfoText = InfoText;
InfoText.defaultProps = InfoTextPropsType;