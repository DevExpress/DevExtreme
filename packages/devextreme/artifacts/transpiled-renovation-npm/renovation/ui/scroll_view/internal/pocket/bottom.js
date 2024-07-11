"use strict";

exports.viewFunction = exports.BottomPocketProps = exports.BottomPocket = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _load_indicator = require("../../../load_indicator");
var _consts = require("../../common/consts");
var _themes = require("../../../../../ui/themes");
var _combine_classes = require("../../../../utils/combine_classes");
var _message = _interopRequireDefault(require("../../../../../localization/message"));
const _excluded = ["bottomPocketRef", "reachBottomText", "visible"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const viewFunction = viewModel => {
  const {
    props: {
      bottomPocketRef,
      reachBottomText
    },
    reachBottomClasses
  } = viewModel;
  return (0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_BOTTOM_POCKET_CLASS, (0, _inferno.createVNode)(1, "div", reachBottomClasses, [(0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS, (0, _inferno.createComponentVNode)(2, _load_indicator.LoadIndicator), 2), (0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_REACHBOTTOM_TEXT_CLASS, (0, _inferno.createVNode)(1, "div", null, reachBottomText, 0), 2)], 4), 2, null, null, bottomPocketRef);
};
exports.viewFunction = viewFunction;
const BottomPocketProps = exports.BottomPocketProps = {
  get reachBottomText() {
    return (0, _themes.isMaterial)((0, _themes.current)()) ? '' : _message.default.format('dxScrollView-reachBottomText');
  },
  visible: true
};
class BottomPocket extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get reachBottomClasses() {
    const {
      visible
    } = this.props;
    const classesMap = {
      [_consts.SCROLLVIEW_REACHBOTTOM_CLASS]: true,
      'dx-state-invisible': !visible
    };
    return (0, _combine_classes.combineClasses)(classesMap);
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
      reachBottomClasses: this.reachBottomClasses,
      restAttributes: this.restAttributes
    });
  }
}
exports.BottomPocket = BottomPocket;
BottomPocket.defaultProps = BottomPocketProps;