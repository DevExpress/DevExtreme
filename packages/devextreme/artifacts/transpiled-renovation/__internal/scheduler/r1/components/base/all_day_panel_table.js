"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllDayTable = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _const = require("../const");
var _all_day_panel_table_body = require("./all_day_panel_table_body");
var _layout_props = require("./layout_props");
var _table = require("./table");
class AllDayTable extends _inferno2.InfernoWrapperComponent {
  constructor() {
    super(...arguments);
    this.allDayPanelData = null;
  }
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  getAllDayPanelData() {
    if (this.allDayPanelData !== null) {
      return this.allDayPanelData;
    }
    this.allDayPanelData = this.props.viewData.groupedData[0].allDayPanel;
    return this.allDayPanelData;
  }
  componentWillUpdate(nextProps) {
    super.componentWillUpdate();
    if (this.props.viewData !== nextProps.viewData) {
      this.allDayPanelData = null;
    }
  }
  render() {
    const {
      viewData,
      viewContext,
      width,
      tableRef,
      dataCellTemplate
    } = this.props;
    const allDayPanelData = this.getAllDayPanelData();
    const DataCellTemplateComponent = (0, _index.getTemplate)(dataCellTemplate);
    return (0, _inferno.createComponentVNode)(2, _table.Table, {
      "className": "dx-scheduler-all-day-table",
      "height": allDayPanelData ? undefined : _const.DefaultSizes.allDayPanelHeight,
      "width": width,
      "tableRef": tableRef,
      children: (0, _inferno.createComponentVNode)(2, _all_day_panel_table_body.AllDayPanelTableBody, {
        "viewData": allDayPanelData ?? _all_day_panel_table_body.AllDayPanelTableBodyDefaultProps.viewData,
        "viewContext": viewContext,
        "leftVirtualCellWidth": viewData.leftVirtualCellWidth ?? _all_day_panel_table_body.AllDayPanelTableBodyDefaultProps.leftVirtualCellWidth,
        "rightVirtualCellWidth": viewData.rightVirtualCellWidth ?? _all_day_panel_table_body.AllDayPanelTableBodyDefaultProps.rightVirtualCellWidth,
        "leftVirtualCellCount": viewData.leftVirtualCellCount,
        "rightVirtualCellCount": viewData.rightVirtualCellCount,
        "dataCellTemplate": DataCellTemplateComponent
      })
    });
  }
}
exports.AllDayTable = AllDayTable;
AllDayTable.defaultProps = _layout_props.LayoutDefaultProps;