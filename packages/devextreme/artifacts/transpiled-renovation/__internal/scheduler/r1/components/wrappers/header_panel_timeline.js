"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderPanelTimelineComponent = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../../core/component_registrator"));
var _header_panel_timeline = require("../timeline/header_panel_timeline");
var _header_panel = require("./header_panel");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HeaderPanelTimelineComponent extends _header_panel.HeaderPanelComponent {
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
  get _viewComponent() {
    return _header_panel_timeline.HeaderPanelTimeline;
  }
}
exports.HeaderPanelTimelineComponent = HeaderPanelTimelineComponent;
(0, _component_registrator.default)('dxTimelineHeaderPanelLayout', HeaderPanelTimelineComponent);