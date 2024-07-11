"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTemplateArgs = exports.TemplateWrapper = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element = require("../../../core/element");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _dom = require("../../../core/utils/dom");
var _type = require("../../../core/utils/type");
var _inferno2 = require("inferno");
var _shallow_equals = require("./utils/shallow_equals");
const _excluded = ["isEqual"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable class-methods-use-this */ // eslint-disable-next-line spellcheck/spell-checker
const isDxElementWrapper = element => !!element.toArray;
const buildTemplateArgs = (model, template) => {
  const args = {
    template,
    model: _extends({}, model)
  };
  const _ref = model.data ?? {},
    {
      isEqual
    } = _ref,
    data = _objectWithoutPropertiesLoose(_ref, _excluded);
  if (isEqual) {
    args.model.data = data;
    args.isEqual = isEqual;
  }
  return args;
};
exports.buildTemplateArgs = buildTemplateArgs;
const renderTemplateContent = (props, container) => {
  const {
    data,
    index
  } = props.model ?? {
    data: {}
  };
  if (data) {
    Object.keys(data).forEach(name => {
      if (data[name] && _dom_adapter.default.isNode(data[name])) {
        data[name] = (0, _element.getPublicElement)((0, _renderer.default)(data[name]));
      }
    });
  }
  const rendered = props.template.render(_extends({
    container,
    transclude: props.transclude
  }, {
    renovated: props.renovated
  }, !props.transclude ? {
    model: data
  } : {}, !props.transclude && Number.isFinite(index) ? {
    index
  } : {}));
  if (rendered === undefined) {
    return [];
  }
  return isDxElementWrapper(rendered) ? rendered.toArray() : [(0, _renderer.default)(rendered).get(0)];
};
const removeDifferentElements = (oldChildren, newChildren) => {
  newChildren.forEach(newElement => {
    const hasOldChild = !!oldChildren.find(oldElement => newElement === oldElement);
    if (!hasOldChild && newElement.parentNode) {
      (0, _renderer.default)(newElement).remove();
    }
  });
};
class TemplateWrapper extends _inferno.InfernoComponent {
  constructor(props) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }
  renderTemplate() {
    // eslint-disable-next-line spellcheck/spell-checker
    const node = (0, _inferno2.findDOMfromVNode)(this.$LI, true);
    /* istanbul ignore next */
    if (!(node !== null && node !== void 0 && node.parentNode)) {
      return () => {};
    }
    const container = node.parentNode;
    const $container = (0, _renderer.default)(container);
    const $oldContainerContent = $container.contents().toArray();
    const content = renderTemplateContent(this.props, (0, _element.getPublicElement)($container));
    // TODO Vinogradov: Fix the renderer function type.
    // @ts-expect-error The renderer function's argument hasn't the full range of possible types
    // (the Element[] type is missing).
    (0, _dom.replaceWith)((0, _renderer.default)(node), (0, _renderer.default)(content));
    // NOTE: This is a dispose method that called before renderTemplate.
    return () => {
      const $actualContainerContent = (0, _renderer.default)(container).contents().toArray();
      removeDifferentElements($oldContainerContent, $actualContainerContent);
      container.appendChild(node);
    };
  }
  shouldComponentUpdate(nextProps) {
    const {
      template,
      model
    } = this.props;
    const {
      template: nextTemplate,
      model: nextModel,
      isEqual
    } = nextProps;
    const equalityComparer = isEqual ?? _shallow_equals.shallowEquals;
    if (template !== nextTemplate) {
      return true;
    }
    if (!(0, _type.isDefined)(model) || !(0, _type.isDefined)(nextModel)) {
      return model !== nextModel;
    }
    const {
      data,
      index
    } = model;
    const {
      data: nextData,
      index: nextIndex
    } = nextModel;
    if (index !== nextIndex) {
      return true;
    }
    return !equalityComparer(data, nextData);
  }
  createEffects() {
    return [new _inferno.InfernoEffect(this.renderTemplate, [this.props.template, this.props.model])];
  }
  updateEffects() {
    this._effects[0].update([this.props.template, this.props.model]);
  }
  // NOTE: Prevent nodes clearing on unmount.
  //       Nodes will be destroyed by inferno on markup update
  componentWillUnmount() {}
  render() {
    return null;
  }
}
exports.TemplateWrapper = TemplateWrapper;