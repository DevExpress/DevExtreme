"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderPanelComponent = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../../core/component_registrator"));
var _index = require("../../../../core/r1/index");
var _header_panel = require("../base/header_panel");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable class-methods-use-this */
class HeaderPanelComponent extends _index.ComponentWrapper {
  _setOptionsByReference() {
    // @ts-expect-error badly typed DomComponent
    super._setOptionsByReference();
    // @ts-expect-error badly typed DomComponent
    this._optionsByReference = _extends({}, this._optionsByReference, {
      dateHeaderData: true,
      resourceCellTemplate: true,
      dateCellTemplate: true,
      timeCellTemplate: true
    });
  }
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['dateCellTemplate', 'timeCellTemplate', 'dateHeaderTemplate', 'resourceCellTemplate'],
      props: ['viewContext', 'dateHeaderData', 'isRenderDateHeader', 'dateCellTemplate', 'timeCellTemplate', 'dateHeaderTemplate', 'groups', 'groupOrientation', 'groupPanelData', 'groupByDate', 'height', 'className', 'resourceCellTemplate']
    };
  }
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */
  // @ts-expect-error types error in R1
  get _viewComponent() {
    return _header_panel.HeaderPanel;
  }
}
exports.HeaderPanelComponent = HeaderPanelComponent;
(0, _component_registrator.default)('dxHeaderPanelLayout', HeaderPanelComponent);