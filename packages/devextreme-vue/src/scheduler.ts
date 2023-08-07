import Scheduler, { Properties } from "devextreme/ui/scheduler";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "adaptivityEnabled" |
  "allDayExpr" |
  "allDayPanelMode" |
  "appointmentCollectorTemplate" |
  "appointmentDragging" |
  "appointmentTemplate" |
  "appointmentTooltipTemplate" |
  "cellDuration" |
  "crossScrollingEnabled" |
  "currentDate" |
  "currentView" |
  "customizeDateNavigatorText" |
  "dataCellTemplate" |
  "dataSource" |
  "dateCellTemplate" |
  "dateSerializationFormat" |
  "descriptionExpr" |
  "disabled" |
  "dropDownAppointmentTemplate" |
  "editing" |
  "elementAttr" |
  "endDateExpr" |
  "endDateTimeZoneExpr" |
  "endDayHour" |
  "firstDayOfWeek" |
  "focusStateEnabled" |
  "groupByDate" |
  "groups" |
  "height" |
  "hint" |
  "indicatorUpdateInterval" |
  "max" |
  "maxAppointmentsPerCell" |
  "min" |
  "noDataText" |
  "onAppointmentAdded" |
  "onAppointmentAdding" |
  "onAppointmentClick" |
  "onAppointmentContextMenu" |
  "onAppointmentDblClick" |
  "onAppointmentDeleted" |
  "onAppointmentDeleting" |
  "onAppointmentFormOpening" |
  "onAppointmentRendered" |
  "onAppointmentTooltipShowing" |
  "onAppointmentUpdated" |
  "onAppointmentUpdating" |
  "onCellClick" |
  "onCellContextMenu" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "recurrenceEditMode" |
  "recurrenceExceptionExpr" |
  "recurrenceRuleExpr" |
  "remoteFiltering" |
  "resourceCellTemplate" |
  "resources" |
  "rtlEnabled" |
  "scrolling" |
  "selectedCellData" |
  "shadeUntilCurrentTime" |
  "showAllDayPanel" |
  "showCurrentTimeIndicator" |
  "startDateExpr" |
  "startDateTimeZoneExpr" |
  "startDayHour" |
  "tabIndex" |
  "textExpr" |
  "timeCellTemplate" |
  "timeZone" |
  "useDropDownViewSwitcher" |
  "views" |
  "visible" |
  "width"
>;

interface DxScheduler extends AccessibleOptions {
  readonly instance?: Scheduler;
}
const DxScheduler = createComponent({
  props: {
    accessKey: String,
    adaptivityEnabled: Boolean,
    allDayExpr: String,
    allDayPanelMode: String,
    appointmentCollectorTemplate: {},
    appointmentDragging: Object,
    appointmentTemplate: {},
    appointmentTooltipTemplate: {},
    cellDuration: Number,
    crossScrollingEnabled: Boolean,
    currentDate: {},
    currentView: String,
    customizeDateNavigatorText: Function,
    dataCellTemplate: {},
    dataSource: {},
    dateCellTemplate: {},
    dateSerializationFormat: String,
    descriptionExpr: String,
    disabled: Boolean,
    dropDownAppointmentTemplate: {},
    editing: [Boolean, Object],
    elementAttr: Object,
    endDateExpr: String,
    endDateTimeZoneExpr: String,
    endDayHour: Number,
    firstDayOfWeek: {
      type: Number,
      validator: (v) => typeof(v) !== "number" || [
        0,
        1,
        2,
        3,
        4,
        5,
        6
      ].indexOf(v) !== -1
    },
    focusStateEnabled: Boolean,
    groupByDate: Boolean,
    groups: Array,
    height: [Function, Number, String],
    hint: String,
    indicatorUpdateInterval: Number,
    max: {},
    maxAppointmentsPerCell: [Number, String],
    min: {},
    noDataText: String,
    onAppointmentAdded: Function,
    onAppointmentAdding: Function,
    onAppointmentClick: Function,
    onAppointmentContextMenu: Function,
    onAppointmentDblClick: Function,
    onAppointmentDeleted: Function,
    onAppointmentDeleting: Function,
    onAppointmentFormOpening: Function,
    onAppointmentRendered: Function,
    onAppointmentTooltipShowing: Function,
    onAppointmentUpdated: Function,
    onAppointmentUpdating: Function,
    onCellClick: Function,
    onCellContextMenu: Function,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    recurrenceEditMode: String,
    recurrenceExceptionExpr: String,
    recurrenceRuleExpr: String,
    remoteFiltering: Boolean,
    resourceCellTemplate: {},
    resources: Array,
    rtlEnabled: Boolean,
    scrolling: Object,
    selectedCellData: Array,
    shadeUntilCurrentTime: Boolean,
    showAllDayPanel: Boolean,
    showCurrentTimeIndicator: Boolean,
    startDateExpr: String,
    startDateTimeZoneExpr: String,
    startDayHour: Number,
    tabIndex: Number,
    textExpr: String,
    timeCellTemplate: {},
    timeZone: String,
    useDropDownViewSwitcher: Boolean,
    views: Array,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:adaptivityEnabled": null,
    "update:allDayExpr": null,
    "update:allDayPanelMode": null,
    "update:appointmentCollectorTemplate": null,
    "update:appointmentDragging": null,
    "update:appointmentTemplate": null,
    "update:appointmentTooltipTemplate": null,
    "update:cellDuration": null,
    "update:crossScrollingEnabled": null,
    "update:currentDate": null,
    "update:currentView": null,
    "update:customizeDateNavigatorText": null,
    "update:dataCellTemplate": null,
    "update:dataSource": null,
    "update:dateCellTemplate": null,
    "update:dateSerializationFormat": null,
    "update:descriptionExpr": null,
    "update:disabled": null,
    "update:dropDownAppointmentTemplate": null,
    "update:editing": null,
    "update:elementAttr": null,
    "update:endDateExpr": null,
    "update:endDateTimeZoneExpr": null,
    "update:endDayHour": null,
    "update:firstDayOfWeek": null,
    "update:focusStateEnabled": null,
    "update:groupByDate": null,
    "update:groups": null,
    "update:height": null,
    "update:hint": null,
    "update:indicatorUpdateInterval": null,
    "update:max": null,
    "update:maxAppointmentsPerCell": null,
    "update:min": null,
    "update:noDataText": null,
    "update:onAppointmentAdded": null,
    "update:onAppointmentAdding": null,
    "update:onAppointmentClick": null,
    "update:onAppointmentContextMenu": null,
    "update:onAppointmentDblClick": null,
    "update:onAppointmentDeleted": null,
    "update:onAppointmentDeleting": null,
    "update:onAppointmentFormOpening": null,
    "update:onAppointmentRendered": null,
    "update:onAppointmentTooltipShowing": null,
    "update:onAppointmentUpdated": null,
    "update:onAppointmentUpdating": null,
    "update:onCellClick": null,
    "update:onCellContextMenu": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:recurrenceEditMode": null,
    "update:recurrenceExceptionExpr": null,
    "update:recurrenceRuleExpr": null,
    "update:remoteFiltering": null,
    "update:resourceCellTemplate": null,
    "update:resources": null,
    "update:rtlEnabled": null,
    "update:scrolling": null,
    "update:selectedCellData": null,
    "update:shadeUntilCurrentTime": null,
    "update:showAllDayPanel": null,
    "update:showCurrentTimeIndicator": null,
    "update:startDateExpr": null,
    "update:startDateTimeZoneExpr": null,
    "update:startDayHour": null,
    "update:tabIndex": null,
    "update:textExpr": null,
    "update:timeCellTemplate": null,
    "update:timeZone": null,
    "update:useDropDownViewSwitcher": null,
    "update:views": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Scheduler {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Scheduler;
    (this as any).$_hasAsyncTemplate = false;
    (this as any).$_expectedChildren = {
      appointmentDragging: { isCollectionItem: false, optionName: "appointmentDragging" },
      editing: { isCollectionItem: false, optionName: "editing" },
      resource: { isCollectionItem: true, optionName: "resources" },
      scrolling: { isCollectionItem: false, optionName: "scrolling" },
      view: { isCollectionItem: true, optionName: "views" }
    };
  }
});

const DxAppointmentDragging = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:autoScroll": null,
    "update:data": null,
    "update:group": null,
    "update:onAdd": null,
    "update:onDragEnd": null,
    "update:onDragMove": null,
    "update:onDragStart": null,
    "update:onRemove": null,
    "update:scrollSensitivity": null,
    "update:scrollSpeed": null,
  },
  props: {
    autoScroll: Boolean,
    data: {},
    group: String,
    onAdd: Function,
    onDragEnd: Function,
    onDragMove: Function,
    onDragStart: Function,
    onRemove: Function,
    scrollSensitivity: Number,
    scrollSpeed: Number
  }
});
(DxAppointmentDragging as any).$_optionName = "appointmentDragging";
const DxEditing = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowAdding": null,
    "update:allowDeleting": null,
    "update:allowDragging": null,
    "update:allowResizing": null,
    "update:allowTimeZoneEditing": null,
    "update:allowUpdating": null,
  },
  props: {
    allowAdding: Boolean,
    allowDeleting: Boolean,
    allowDragging: Boolean,
    allowResizing: Boolean,
    allowTimeZoneEditing: Boolean,
    allowUpdating: Boolean
  }
});
(DxEditing as any).$_optionName = "editing";
const DxResource = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowMultiple": null,
    "update:colorExpr": null,
    "update:dataSource": null,
    "update:displayExpr": null,
    "update:fieldExpr": null,
    "update:label": null,
    "update:useColorAsDefault": null,
    "update:valueExpr": null,
  },
  props: {
    allowMultiple: Boolean,
    colorExpr: String,
    dataSource: {},
    displayExpr: [Function, String],
    fieldExpr: String,
    label: String,
    useColorAsDefault: Boolean,
    valueExpr: [Function, String]
  }
});
(DxResource as any).$_optionName = "resources";
(DxResource as any).$_isCollectionItem = true;
const DxScrolling = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:mode": null,
  },
  props: {
    mode: String
  }
});
(DxScrolling as any).$_optionName = "scrolling";
const DxView = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:agendaDuration": null,
    "update:allDayPanelMode": null,
    "update:appointmentCollectorTemplate": null,
    "update:appointmentTemplate": null,
    "update:appointmentTooltipTemplate": null,
    "update:cellDuration": null,
    "update:dataCellTemplate": null,
    "update:dateCellTemplate": null,
    "update:dropDownAppointmentTemplate": null,
    "update:endDayHour": null,
    "update:firstDayOfWeek": null,
    "update:groupByDate": null,
    "update:groupOrientation": null,
    "update:groups": null,
    "update:intervalCount": null,
    "update:maxAppointmentsPerCell": null,
    "update:name": null,
    "update:resourceCellTemplate": null,
    "update:scrolling": null,
    "update:startDate": null,
    "update:startDayHour": null,
    "update:timeCellTemplate": null,
    "update:type": null,
  },
  props: {
    agendaDuration: Number,
    allDayPanelMode: String,
    appointmentCollectorTemplate: {},
    appointmentTemplate: {},
    appointmentTooltipTemplate: {},
    cellDuration: Number,
    dataCellTemplate: {},
    dateCellTemplate: {},
    dropDownAppointmentTemplate: {},
    endDayHour: Number,
    firstDayOfWeek: {
      type: Number,
      validator: (v) => typeof(v) !== "number" || [
        0,
        1,
        2,
        3,
        4,
        5,
        6
      ].indexOf(v) !== -1
    },
    groupByDate: Boolean,
    groupOrientation: String,
    groups: Array,
    intervalCount: Number,
    maxAppointmentsPerCell: [Number, String],
    name: String,
    resourceCellTemplate: {},
    scrolling: Object,
    startDate: {},
    startDayHour: Number,
    timeCellTemplate: {},
    type: String
  }
});
(DxView as any).$_optionName = "views";
(DxView as any).$_isCollectionItem = true;
(DxView as any).$_expectedChildren = {
  scrolling: { isCollectionItem: false, optionName: "scrolling" }
};

export default DxScheduler;
export {
  DxScheduler,
  DxAppointmentDragging,
  DxEditing,
  DxResource,
  DxScrolling,
  DxView
};
import type * as DxSchedulerTypes from "devextreme/ui/scheduler_types";
export { DxSchedulerTypes };
