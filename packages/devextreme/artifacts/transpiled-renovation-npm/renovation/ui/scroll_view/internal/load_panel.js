"use strict";

exports.viewFunction = exports.ScrollViewLoadPanel = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _load_panel = require("../../overlays/load_panel");
var _scrollview_loadpanel_props = require("../common/scrollview_loadpanel_props");
const _excluded = ["refreshingText", "targetElement", "visible"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const SCROLLVIEW_LOADPANEL = 'dx-scrollview-loadpanel';
const viewFunction = viewModel => {
  const {
    position,
    props: {
      visible
    },
    refreshingText
  } = viewModel;
  return (0, _inferno.createComponentVNode)(2, _load_panel.LoadPanel, {
    "className": SCROLLVIEW_LOADPANEL,
    "shading": false,
    "delay": 400,
    "message": refreshingText,
    "position": position,
    "visible": visible
  });
};
exports.viewFunction = viewFunction;
class ScrollViewLoadPanel extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
  }
  get refreshingText() {
    const {
      refreshingText
    } = this.props;
    if ((0, _type.isDefined)(refreshingText)) {
      return refreshingText;
    }
    return _message.default.format('dxScrollView-refreshingText');
  }
  get position() {
    if (this.__getterCache['position'] !== undefined) {
      return this.__getterCache['position'];
    }
    return this.__getterCache['position'] = (() => {
      if (this.props.targetElement) {
        return {
          of: this.props.targetElement.current
        };
      }
      return undefined;
    })();
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['targetElement?.current'] !== nextProps['targetElement?.current']) {
      this.__getterCache['position'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      refreshingText: this.refreshingText,
      position: this.position,
      restAttributes: this.restAttributes
    });
  }
}
exports.ScrollViewLoadPanel = ScrollViewLoadPanel;
ScrollViewLoadPanel.defaultProps = _scrollview_loadpanel_props.ScrollViewLoadPanelProps;