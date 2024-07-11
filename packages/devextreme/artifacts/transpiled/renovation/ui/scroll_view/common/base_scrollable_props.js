"use strict";

exports.BaseScrollableProps = void 0;
var _support = require("../../../../core/utils/support");
var _get_default_option_value = require("../utils/get_default_option_value");
var _themes = require("../../../../ui/themes");
var _message = _interopRequireDefault(require("../../../../localization/message"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const BaseScrollableProps = exports.BaseScrollableProps = {
  aria: Object.freeze({}),
  addWidgetClass: false,
  disabled: false,
  visible: true,
  classes: '',
  direction: 'vertical',
  get bounceEnabled() {
    return (0, _get_default_option_value.getDefaultBounceEnabled)();
  },
  get scrollByContent() {
    return (0, _get_default_option_value.isDesktop)() ? _support.touch : true;
  },
  pullDownEnabled: false,
  reachBottomEnabled: false,
  forceGeneratePockets: false,
  needScrollViewContentWrapper: false,
  needRenderScrollbars: true,
  refreshStrategy: 'simulated',
  get pullingDownText() {
    return (0, _themes.isMaterial)((0, _themes.current)()) ? '' : _message.default.format('dxScrollView-pullingDownText');
  },
  get pulledDownText() {
    return (0, _themes.isMaterial)((0, _themes.current)()) ? '' : _message.default.format('dxScrollView-pulledDownText');
  },
  get refreshingText() {
    return (0, _themes.isMaterial)((0, _themes.current)()) ? '' : _message.default.format('dxScrollView-refreshingText');
  },
  get reachBottomText() {
    return (0, _themes.isMaterial)((0, _themes.current)()) ? '' : _message.default.format('dxScrollView-reachBottomText');
  }
};