"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelDefaultProps = exports.GroupPanel = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _const = require("../../const");
var _index2 = require("../../utils/index");
var _group_panel_horizontal = require("./group_panel_horizontal");
var _group_panel_props = require("./group_panel_props");
var _group_panel_vertical = require("./group_panel_vertical");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const GroupPanelDefaultProps = exports.GroupPanelDefaultProps = _extends({}, _group_panel_props.GroupPanelBaseDefaultProps, {
  groups: [],
  groupOrientation: _const.VERTICAL_GROUP_ORIENTATION
});
class GroupPanel extends _inferno2.InfernoWrapperComponent {
  // eslint-disable-next-line class-methods-use-this
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  render() {
    const {
      className,
      viewContext,
      elementRef,
      groupPanelData,
      height,
      resourceCellTemplate,
      groupOrientation,
      groups,
      styles
    } = this.props;
    const ResourceCellTemplateComponent = (0, _index.getTemplate)(resourceCellTemplate);
    const isVerticalLayout = (0, _index2.isVerticalGroupingApplied)(groups, groupOrientation);
    const Layout = isVerticalLayout ? _group_panel_vertical.GroupPanelVertical : _group_panel_horizontal.GroupPanelHorizontal;
    return (0, _inferno.createComponentVNode)(2, Layout, {
      "viewContext": viewContext,
      "height": height,
      "resourceCellTemplate": ResourceCellTemplateComponent,
      "className": className,
      "groupPanelData": groupPanelData,
      "elementRef": elementRef,
      "styles": styles,
      "groups": GroupPanelDefaultProps.groups,
      "groupOrientation": GroupPanelDefaultProps.groupOrientation,
      "groupByDate": GroupPanelDefaultProps.groupByDate
    });
  }
}
exports.GroupPanel = GroupPanel;
GroupPanel.defaultProps = GroupPanelDefaultProps;