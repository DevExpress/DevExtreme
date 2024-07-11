"use strict";

exports.viewFunction = exports.IconProps = exports.Icon = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _icon = require("../../../core/utils/icon");
var _combine_classes = require("../../utils/combine_classes");
const _excluded = ["iconTemplate", "position", "source"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    iconClassName,
    props: {
      iconTemplate: IconTemplate,
      source
    },
    sourceType
  } = _ref;
  return (0, _inferno.createFragment)([sourceType === 'dxIcon' && (0, _inferno.createVNode)(1, "i", iconClassName), sourceType === 'fontIcon' && (0, _inferno.createVNode)(1, "i", iconClassName), sourceType === 'image' && (0, _inferno.createVNode)(1, "img", iconClassName, null, 1, {
    "alt": "",
    "src": source
  }), IconTemplate && (0, _inferno.createVNode)(1, "i", iconClassName, IconTemplate({}), 0)], 0);
};
exports.viewFunction = viewFunction;
const IconProps = exports.IconProps = {
  position: 'left',
  source: ''
};
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
class Icon extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get sourceType() {
    return (0, _icon.getImageSourceType)(this.props.source);
  }
  get cssClass() {
    return this.props.position !== 'left' ? 'dx-icon-right' : '';
  }
  get iconClassName() {
    const generalClasses = {
      'dx-icon': true,
      [this.cssClass]: !!this.cssClass
    };
    const {
      source
    } = this.props;
    if (this.sourceType === 'dxIcon') {
      return (0, _combine_classes.combineClasses)(_extends({}, generalClasses, {
        [`dx-icon-${source}`]: true
      }));
    }
    if (this.sourceType === 'fontIcon') {
      return (0, _combine_classes.combineClasses)(_extends({}, generalClasses, {
        [String(source)]: !!source
      }));
    }
    if (this.sourceType === 'image') {
      return (0, _combine_classes.combineClasses)(generalClasses);
    }
    if (this.sourceType === 'svg') {
      return (0, _combine_classes.combineClasses)(_extends({}, generalClasses, {
        'dx-svg-icon': true
      }));
    }
    return '';
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
        iconTemplate: getTemplate(props.iconTemplate)
      }),
      sourceType: this.sourceType,
      cssClass: this.cssClass,
      iconClassName: this.iconClassName,
      restAttributes: this.restAttributes
    });
  }
}
exports.Icon = Icon;
Icon.defaultProps = IconProps;