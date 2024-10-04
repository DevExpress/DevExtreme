import { PropType } from "vue";
import Scheduler, { Properties } from "devextreme/ui/scheduler";
import {  AppointmentAddedEvent , AppointmentAddingEvent , AppointmentClickEvent , AppointmentContextMenuEvent , AppointmentDblClickEvent , AppointmentDeletedEvent , AppointmentDeletingEvent , AppointmentFormOpeningEvent , AppointmentRenderedEvent , AppointmentTooltipShowingEvent , AppointmentUpdatedEvent , AppointmentUpdatingEvent , CellClickEvent , CellContextMenuEvent , ContentReadyEvent , DisposingEvent , InitializedEvent , OptionChangedEvent ,} from "devextreme/ui/scheduler";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

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
  "offset" |
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

const componentConfig = {
  props: {
    accessKey: String,
    adaptivityEnabled: Boolean,
    allDayExpr: String,
    allDayPanelMode: {},
    appointmentCollectorTemplate: {},
    appointmentDragging: Object,
    appointmentTemplate: {},
    appointmentTooltipTemplate: {},
    cellDuration: Number,
    crossScrollingEnabled: Boolean,
    currentDate: [Date, Number, String],
    currentView: {},
    customizeDateNavigatorText: Function as PropType<(info: Object) => string>,
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
    firstDayOfWeek: {},
    focusStateEnabled: Boolean,
    groupByDate: Boolean,
    groups: Array as PropType<Array<string>>,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    indicatorUpdateInterval: Number,
    max: [Date, Number, String],
    maxAppointmentsPerCell: {},
    min: [Date, Number, String],
    noDataText: String,
    offset: Number,
    onAppointmentAdded: Function as PropType<(e: AppointmentAddedEvent) => void>,
    onAppointmentAdding: Function as PropType<(e: AppointmentAddingEvent) => void>,
    onAppointmentClick: Function as PropType<(e: AppointmentClickEvent) => void>,
    onAppointmentContextMenu: Function as PropType<(e: AppointmentContextMenuEvent) => void>,
    onAppointmentDblClick: Function as PropType<(e: AppointmentDblClickEvent) => void>,
    onAppointmentDeleted: Function as PropType<(e: AppointmentDeletedEvent) => void>,
    onAppointmentDeleting: Function as PropType<(e: AppointmentDeletingEvent) => void>,
    onAppointmentFormOpening: Function as PropType<(e: AppointmentFormOpeningEvent) => void>,
    onAppointmentRendered: Function as PropType<(e: AppointmentRenderedEvent) => void>,
    onAppointmentTooltipShowing: Function as PropType<(e: AppointmentTooltipShowingEvent) => void>,
    onAppointmentUpdated: Function as PropType<(e: AppointmentUpdatedEvent) => void>,
    onAppointmentUpdating: Function as PropType<(e: AppointmentUpdatingEvent) => void>,
    onCellClick: Function as PropType<(e: CellClickEvent) => void>,
    onCellContextMenu: Function as PropType<(e: CellContextMenuEvent) => void>,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    recurrenceEditMode: {},
    recurrenceExceptionExpr: String,
    recurrenceRuleExpr: String,
    remoteFiltering: Boolean,
    resourceCellTemplate: {},
    resources: Array as PropType<Array<Object>>,
    rtlEnabled: Boolean,
    scrolling: Object,
    selectedCellData: Array as PropType<Array<any>>,
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
    views: Array as PropType<Array<Object> | Array<string>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
    "update:offset": null,
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
};

prepareComponentConfig(componentConfig);

const DxScheduler = defineComponent(componentConfig);


const DxAppointmentDraggingConfig = {
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
    onAdd: Function as PropType<(e: Object) => void>,
    onDragEnd: Function as PropType<(e: Object) => void>,
    onDragMove: Function as PropType<(e: Object) => void>,
    onDragStart: Function as PropType<(e: Object) => void>,
    onRemove: Function as PropType<(e: Object) => void>,
    scrollSensitivity: Number,
    scrollSpeed: Number
  }
};

prepareConfigurationComponentConfig(DxAppointmentDraggingConfig);

const DxAppointmentDragging = defineComponent(DxAppointmentDraggingConfig);

(DxAppointmentDragging as any).$_optionName = "appointmentDragging";

const DxEditingConfig = {
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
};

prepareConfigurationComponentConfig(DxEditingConfig);

const DxEditing = defineComponent(DxEditingConfig);

(DxEditing as any).$_optionName = "editing";

const DxResourceConfig = {
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
    displayExpr: [Function, String] as PropType<((resource: Object) => string) | string>,
    fieldExpr: String,
    label: String,
    useColorAsDefault: Boolean,
    valueExpr: [Function, String] as PropType<(() => void) | string>
  }
};

prepareConfigurationComponentConfig(DxResourceConfig);

const DxResource = defineComponent(DxResourceConfig);

(DxResource as any).$_optionName = "resources";
(DxResource as any).$_isCollectionItem = true;

const DxScrollingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:mode": null,
  },
  props: {
    mode: {}
  }
};

prepareConfigurationComponentConfig(DxScrollingConfig);

const DxScrolling = defineComponent(DxScrollingConfig);

(DxScrolling as any).$_optionName = "scrolling";

const DxViewConfig = {
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
    "update:offset": null,
    "update:resourceCellTemplate": null,
    "update:scrolling": null,
    "update:startDate": null,
    "update:startDayHour": null,
    "update:timeCellTemplate": null,
    "update:type": null,
  },
  props: {
    agendaDuration: Number,
    allDayPanelMode: {},
    appointmentCollectorTemplate: {},
    appointmentTemplate: {},
    appointmentTooltipTemplate: {},
    cellDuration: Number,
    dataCellTemplate: {},
    dateCellTemplate: {},
    dropDownAppointmentTemplate: {},
    endDayHour: Number,
    firstDayOfWeek: {},
    groupByDate: Boolean,
    groupOrientation: {},
    groups: Array as PropType<Array<string>>,
    intervalCount: Number,
    maxAppointmentsPerCell: {},
    name: String,
    offset: Number,
    resourceCellTemplate: {},
    scrolling: Object,
    startDate: [Date, Number, String],
    startDayHour: Number,
    timeCellTemplate: {},
    type: {}
  }
};

prepareConfigurationComponentConfig(DxViewConfig);

const DxView = defineComponent(DxViewConfig);

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
