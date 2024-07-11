"use strict";

exports.default = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _infernoCreateElement = require("inferno-create-element");
var _dom_adapter = _interopRequireDefault(require("./dom_adapter"));
var _element_data = require("./element_data");
var _dependency_injector = _interopRequireDefault(require("./utils/dependency_injector"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const remove = element => {
  const {
    parentNode
  } = element;
  if (parentNode) {
    const nextSibling = element.nextSibling;
    (0, _element_data.cleanDataRecursive)(element);
    parentNode.$V = element.$V;
    (0, _inferno.render)(null, parentNode);
    parentNode.insertBefore(element, nextSibling);
    element.innerHTML = '';
    delete parentNode.$V;
  }
  delete element.$V;
};
var _default = exports.default = (0, _dependency_injector.default)({
  createElement: (component, props) => (0, _infernoCreateElement.createElement)(component, props),
  remove,
  onAfterRender: () => {
    _inferno2.InfernoEffectHost.callEffects();
  },
  onPreRender: () => {
    _inferno2.InfernoEffectHost.lock();
  },
  render: (component, props, container, replace) => {
    if (!replace) {
      const {
        parentNode
      } = container;
      const nextNode = container === null || container === void 0 ? void 0 : container.nextSibling;
      const rootNode = _dom_adapter.default.createElement('div');
      rootNode.appendChild(container);
      const mountNode = _dom_adapter.default.createDocumentFragment().appendChild(rootNode);
      const vNodeAlreadyExists = !!container.$V;
      vNodeAlreadyExists && remove(container);
      (0, _inferno2.hydrate)((0, _infernoCreateElement.createElement)(component, props), mountNode);
      container.$V = mountNode.$V;
      if (parentNode) {
        parentNode.insertBefore(container, nextNode);
      }
    } else {
      (0, _inferno.render)((0, _infernoCreateElement.createElement)(component, props), container);
    }
  }
});
module.exports = exports.default;
module.exports.default = exports.default;