"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComponentInstance = getComponentInstance;
function getComponentInstance($element) {
  var _$element$data, _$element$data2;
  const componentName = (_$element$data = $element.data) === null || _$element$data === void 0 ? void 0 : _$element$data.call($element, 'dxComponents')[0];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return componentName && ((_$element$data2 = $element.data) === null || _$element$data2 === void 0 ? void 0 : _$element$data2.call($element, `${componentName}`));
}