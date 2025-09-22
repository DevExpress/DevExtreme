import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Scheduler, { Properties } from "devextreme/ui/scheduler";
import  DataSource from "devextreme/data/data_source";
import  dxScheduler from "devextreme/ui/scheduler";
import  dxSortable from "devextreme/ui/sortable";
import  dxDraggable from "devextreme/ui/draggable";
import {
 AllDayPanelMode,
 ViewType,
 dxSchedulerAppointment,
 CellAppointmentsLimit,
 AppointmentAddedEvent,
 AppointmentAddingEvent,
 AppointmentClickEvent,
 AppointmentContextMenuEvent,
 AppointmentDblClickEvent,
 AppointmentDeletedEvent,
 AppointmentDeletingEvent,
 AppointmentFormOpeningEvent,
 AppointmentRenderedEvent,
 AppointmentTooltipShowingEvent,
 AppointmentUpdatedEvent,
 AppointmentUpdatingEvent,
 CellClickEvent,
 CellContextMenuEvent,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
 RecurrenceEditMode,
 dxSchedulerScrolling,
 dxSchedulerToolbar,
 SchedulerPredefinedToolbarItem,
 DateNavigatorItemProperties,
 SchedulerPredefinedDateNavigatorItem,
 dxSchedulerToolbarItem,
} from "devextreme/ui/scheduler";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 FirstDayOfWeek,
 ValidationRuleType,
 HorizontalAlignment,
 VerticalAlignment,
 ButtonStyle,
 ButtonType,
 ComparisonOperator,
 ToolbarItemLocation,
 ToolbarItemComponent,
 SingleMultipleOrNone,
 ScrollMode,
 TabsIconPosition,
 TabsStyle,
 Position,
 Orientation,
} from "devextreme/common";
import {
 event,
} from "devextreme/events/events.types";
import {
 dxButtonOptions,
 ClickEvent,
 ContentReadyEvent as ButtonContentReadyEvent,
 DisposingEvent as ButtonDisposingEvent,
 InitializedEvent as ButtonInitializedEvent,
 OptionChangedEvent as ButtonOptionChangedEvent,
} from "devextreme/ui/button";
import {
 FormItemType,
 FormPredefinedButtonItem,
 dxFormButtonItem,
 dxFormEmptyItem,
 dxFormGroupItem,
 dxFormSimpleItem,
 dxFormTabbedItem,
 FormItemComponent,
 LabelLocation,
} from "devextreme/ui/form";
import {
 dxTabPanelOptions,
 dxTabPanelItem,
 ContentReadyEvent as TabPanelContentReadyEvent,
 DisposingEvent as TabPanelDisposingEvent,
 InitializedEvent as TabPanelInitializedEvent,
 ItemClickEvent as TabPanelItemClickEvent,
 ItemContextMenuEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 OptionChangedEvent as TabPanelOptionChangedEvent,
 SelectionChangedEvent as TabPanelSelectionChangedEvent,
 SelectionChangingEvent,
 TitleClickEvent,
 TitleHoldEvent,
 TitleRenderedEvent,
} from "devextreme/ui/tab_panel";
import {
 LocateInMenuMode,
 ShowTextMode,
} from "devextreme/ui/toolbar";
import {
 dxButtonGroupOptions,
 dxButtonGroupItem,
 ContentReadyEvent as ButtonGroupContentReadyEvent,
 DisposingEvent as ButtonGroupDisposingEvent,
 InitializedEvent as ButtonGroupInitializedEvent,
 ItemClickEvent,
 OptionChangedEvent as ButtonGroupOptionChangedEvent,
 SelectionChangedEvent,
} from "devextreme/ui/button_group";
import  * as CommonTypes from "devextreme/common";
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
  "toolbar" |
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
    allDayPanelMode: String as PropType<AllDayPanelMode>,
    appointmentCollectorTemplate: {},
    appointmentDragging: Object as PropType<Record<string, any>>,
    appointmentTemplate: {},
    appointmentTooltipTemplate: {},
    cellDuration: Number,
    crossScrollingEnabled: Boolean,
    currentDate: [Date, Number, String],
    currentView: String as PropType<string | ViewType>,
    customizeDateNavigatorText: Function as PropType<((info: { endDate: Date, startDate: Date, text: string }) => string)>,
    dataCellTemplate: {},
    dataSource: [Array, Object, String] as PropType<Array<dxSchedulerAppointment> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    dateCellTemplate: {},
    dateSerializationFormat: String,
    descriptionExpr: String,
    disabled: Boolean,
    dropDownAppointmentTemplate: {},
    editing: [Boolean, Object] as PropType<boolean | Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    endDateExpr: String,
    endDateTimeZoneExpr: String,
    endDayHour: Number,
    firstDayOfWeek: Number as PropType<FirstDayOfWeek>,
    focusStateEnabled: Boolean,
    groupByDate: Boolean,
    groups: Array as PropType<Array<string>>,
    height: [Number, String],
    hint: String,
    indicatorUpdateInterval: Number,
    max: [Date, Number, String],
    maxAppointmentsPerCell: [String, Number] as PropType<CellAppointmentsLimit | number>,
    min: [Date, Number, String],
    noDataText: String,
    offset: Number,
    onAppointmentAdded: Function as PropType<((e: AppointmentAddedEvent) => void)>,
    onAppointmentAdding: Function as PropType<((e: AppointmentAddingEvent) => void)>,
    onAppointmentClick: Function as PropType<((e: AppointmentClickEvent) => void)>,
    onAppointmentContextMenu: Function as PropType<((e: AppointmentContextMenuEvent) => void)>,
    onAppointmentDblClick: Function as PropType<((e: AppointmentDblClickEvent) => void)>,
    onAppointmentDeleted: Function as PropType<((e: AppointmentDeletedEvent) => void)>,
    onAppointmentDeleting: Function as PropType<((e: AppointmentDeletingEvent) => void)>,
    onAppointmentFormOpening: Function as PropType<((e: AppointmentFormOpeningEvent) => void)>,
    onAppointmentRendered: Function as PropType<((e: AppointmentRenderedEvent) => void)>,
    onAppointmentTooltipShowing: Function as PropType<((e: AppointmentTooltipShowingEvent) => void)>,
    onAppointmentUpdated: Function as PropType<((e: AppointmentUpdatedEvent) => void)>,
    onAppointmentUpdating: Function as PropType<((e: AppointmentUpdatingEvent) => void)>,
    onCellClick: Function as PropType<((e: CellClickEvent) => void)>,
    onCellContextMenu: Function as PropType<((e: CellContextMenuEvent) => void)>,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    recurrenceEditMode: String as PropType<RecurrenceEditMode>,
    recurrenceExceptionExpr: String,
    recurrenceRuleExpr: String,
    remoteFiltering: Boolean,
    resourceCellTemplate: {},
    resources: Array as PropType<Array<Record<string, any>>>,
    rtlEnabled: Boolean,
    scrolling: Object as PropType<dxSchedulerScrolling>,
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
    toolbar: Object as PropType<dxSchedulerToolbar | Record<string, any>>,
    useDropDownViewSwitcher: Boolean,
    views: Array as PropType<Array<Record<string, any> | string>>,
    visible: Boolean,
    width: [Number, String]
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
    "update:toolbar": null,
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
      toolbar: { isCollectionItem: false, optionName: "toolbar" },
      view: { isCollectionItem: true, optionName: "views" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxScheduler = defineComponent(componentConfig);


const DxAiOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:instruction": null,
  },
  props: {
    disabled: Boolean,
    instruction: String
  }
};

prepareConfigurationComponentConfig(DxAiOptionsConfig);

const DxAiOptions = defineComponent(DxAiOptionsConfig);

(DxAiOptions as any).$_optionName = "aiOptions";

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
    onAdd: Function as PropType<((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void)>,
    onDragEnd: Function as PropType<((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toItemData: any }) => void)>,
    onDragMove: Function as PropType<((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void)>,
    onDragStart: Function as PropType<((e: { cancel: boolean, component: dxScheduler, event: event, fromData: any, itemData: any, itemElement: any }) => void)>,
    onRemove: Function as PropType<((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable }) => void)>,
    scrollSensitivity: Number,
    scrollSpeed: Number
  }
};

prepareConfigurationComponentConfig(DxAppointmentDraggingConfig);

const DxAppointmentDragging = defineComponent(DxAppointmentDraggingConfig);

(DxAppointmentDragging as any).$_optionName = "appointmentDragging";

const DxAsyncRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any)>
  }
};

prepareConfigurationComponentConfig(DxAsyncRuleConfig);

const DxAsyncRule = defineComponent(DxAsyncRuleConfig);

(DxAsyncRule as any).$_optionName = "validationRules";
(DxAsyncRule as any).$_isCollectionItem = true;
(DxAsyncRule as any).$_predefinedProps = {
  type: "async"
};

const DxButtonItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:buttonOptions": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:horizontalAlignment": null,
    "update:itemType": null,
    "update:name": null,
    "update:verticalAlignment": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    buttonOptions: Object as PropType<dxButtonOptions | Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    itemType: String as PropType<FormItemType>,
    name: String as PropType<FormPredefinedButtonItem | string>,
    verticalAlignment: String as PropType<VerticalAlignment>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxButtonItemConfig);

const DxButtonItem = defineComponent(DxButtonItemConfig);

(DxButtonItem as any).$_optionName = "items";
(DxButtonItem as any).$_isCollectionItem = true;
(DxButtonItem as any).$_predefinedProps = {
  itemType: "button"
};
(DxButtonItem as any).$_expectedChildren = {
  buttonOptions: { isCollectionItem: false, optionName: "buttonOptions" }
};

const DxButtonOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:icon": null,
    "update:onClick": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:template": null,
    "update:text": null,
    "update:type": null,
    "update:useSubmitBehavior": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<((e: ClickEvent) => void)>,
    onContentReady: Function as PropType<((e: ButtonContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: ButtonDisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: ButtonInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: ButtonOptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    template: {},
    text: String,
    type: String as PropType<ButtonType | string>,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxButtonOptionsConfig);

const DxButtonOptions = defineComponent(DxButtonOptionsConfig);

(DxButtonOptions as any).$_optionName = "buttonOptions";

const DxColCountByScreenConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:lg": null,
    "update:md": null,
    "update:sm": null,
    "update:xs": null,
  },
  props: {
    lg: Number,
    md: Number,
    sm: Number,
    xs: Number
  }
};

prepareConfigurationComponentConfig(DxColCountByScreenConfig);

const DxColCountByScreen = defineComponent(DxColCountByScreenConfig);

(DxColCountByScreen as any).$_optionName = "colCountByScreen";

const DxCompareRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    comparisonTarget: Function as PropType<(() => any)>,
    comparisonType: String as PropType<ComparisonOperator>,
    ignoreEmptyValue: Boolean,
    message: String,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxCompareRuleConfig);

const DxCompareRule = defineComponent(DxCompareRuleConfig);

(DxCompareRule as any).$_optionName = "validationRules";
(DxCompareRule as any).$_isCollectionItem = true;
(DxCompareRule as any).$_predefinedProps = {
  type: "compare"
};

const DxCustomRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean)>
  }
};

prepareConfigurationComponentConfig(DxCustomRuleConfig);

const DxCustomRule = defineComponent(DxCustomRuleConfig);

(DxCustomRule as any).$_optionName = "validationRules";
(DxCustomRule as any).$_isCollectionItem = true;
(DxCustomRule as any).$_predefinedProps = {
  type: "custom"
};

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
    "update:form": null,
  },
  props: {
    allowAdding: Boolean,
    allowDeleting: Boolean,
    allowDragging: Boolean,
    allowResizing: Boolean,
    allowTimeZoneEditing: Boolean,
    allowUpdating: Boolean,
    form: Object as PropType<Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxEditingConfig);

const DxEditing = defineComponent(DxEditingConfig);

(DxEditing as any).$_optionName = "editing";
(DxEditing as any).$_expectedChildren = {
  form: { isCollectionItem: false, optionName: "form" }
};

const DxEmailRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxEmailRuleConfig);

const DxEmailRule = defineComponent(DxEmailRuleConfig);

(DxEmailRule as any).$_optionName = "validationRules";
(DxEmailRule as any).$_isCollectionItem = true;
(DxEmailRule as any).$_predefinedProps = {
  type: "email"
};

const DxEmptyItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:itemType": null,
    "update:name": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    itemType: String as PropType<FormItemType>,
    name: String,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxEmptyItemConfig);

const DxEmptyItem = defineComponent(DxEmptyItemConfig);

(DxEmptyItem as any).$_optionName = "items";
(DxEmptyItem as any).$_isCollectionItem = true;
(DxEmptyItem as any).$_predefinedProps = {
  itemType: "empty"
};

const DxFormConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:items": null,
    "update:onCancel": null,
    "update:onSubmit": null,
  },
  props: {
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    onCancel: Function as PropType<((formData: any) => void)>,
    onSubmit: Function as PropType<((formData: any) => void)>
  }
};

prepareConfigurationComponentConfig(DxFormConfig);

const DxForm = defineComponent(DxFormConfig);

(DxForm as any).$_optionName = "form";
(DxForm as any).$_expectedChildren = {
  ButtonItem: { isCollectionItem: true, optionName: "items" },
  EmptyItem: { isCollectionItem: true, optionName: "items" },
  GroupItem: { isCollectionItem: true, optionName: "items" },
  item: { isCollectionItem: true, optionName: "items" },
  SimpleItem: { isCollectionItem: true, optionName: "items" },
  TabbedItem: { isCollectionItem: true, optionName: "items" }
};

const DxGroupItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignItemLabels": null,
    "update:caption": null,
    "update:captionTemplate": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:items": null,
    "update:itemType": null,
    "update:name": null,
    "update:template": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    alignItemLabels: Boolean,
    caption: String,
    captionTemplate: {},
    colCount: Number,
    colCountByScreen: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    itemType: String as PropType<FormItemType>,
    name: String,
    template: {},
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxGroupItemConfig);

const DxGroupItem = defineComponent(DxGroupItemConfig);

(DxGroupItem as any).$_optionName = "items";
(DxGroupItem as any).$_isCollectionItem = true;
(DxGroupItem as any).$_predefinedProps = {
  itemType: "group"
};
(DxGroupItem as any).$_expectedChildren = {
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" }
};

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiOptions": null,
    "update:alignItemLabels": null,
    "update:badge": null,
    "update:buttonOptions": null,
    "update:caption": null,
    "update:captionTemplate": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:disabled": null,
    "update:editorOptions": null,
    "update:editorType": null,
    "update:elementAttr": null,
    "update:helpText": null,
    "update:hint": null,
    "update:horizontalAlignment": null,
    "update:html": null,
    "update:icon": null,
    "update:isRequired": null,
    "update:items": null,
    "update:itemType": null,
    "update:label": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:tabPanelOptions": null,
    "update:tabs": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
    "update:type": null,
    "update:validationRules": null,
    "update:verticalAlignment": null,
    "update:visible": null,
    "update:visibleIndex": null,
    "update:widget": null,
  },
  props: {
    aiOptions: Object as PropType<Record<string, any>>,
    alignItemLabels: Boolean,
    badge: String,
    buttonOptions: Object as PropType<dxButtonOptions | Record<string, any>>,
    caption: String,
    captionTemplate: {},
    colCount: Number,
    colCountByScreen: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    dataField: String,
    disabled: Boolean,
    editorOptions: {},
    editorType: String as PropType<FormItemComponent>,
    elementAttr: Object as PropType<Record<string, any>>,
    helpText: String,
    hint: String,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    html: String,
    icon: String,
    isRequired: Boolean,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    itemType: String as PropType<FormItemType>,
    label: Object as PropType<Record<string, any>>,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<string | FormPredefinedButtonItem | SchedulerPredefinedToolbarItem>,
    options: Object as PropType<DateNavigatorItemProperties | Record<string, any> | dxButtonGroupOptions>,
    showText: String as PropType<ShowTextMode>,
    tabPanelOptions: Object as PropType<dxTabPanelOptions | Record<string, any>>,
    tabs: Array as PropType<Array<Record<string, any>>>,
    tabTemplate: {},
    template: {},
    text: String,
    title: String,
    type: String as PropType<ButtonType | string>,
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    verticalAlignment: String as PropType<VerticalAlignment>,
    visible: Boolean,
    visibleIndex: Number,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
(DxItem as any).$_expectedChildren = {
  aiOptions: { isCollectionItem: false, optionName: "aiOptions" },
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  buttonOptions: { isCollectionItem: false, optionName: "buttonOptions" },
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  label: { isCollectionItem: false, optionName: "label" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  options: { isCollectionItem: false, optionName: "options" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  tab: { isCollectionItem: true, optionName: "tabs" },
  tabPanelOptions: { isCollectionItem: false, optionName: "tabPanelOptions" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};

const DxLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:location": null,
    "update:showColon": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    location: String as PropType<LabelLocation>,
    showColon: Boolean,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";

const DxNumericRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxNumericRuleConfig);

const DxNumericRule = defineComponent(DxNumericRuleConfig);

(DxNumericRule as any).$_optionName = "validationRules";
(DxNumericRule as any).$_isCollectionItem = true;
(DxNumericRule as any).$_predefinedProps = {
  type: "numeric"
};

const DxOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:buttonTemplate": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:keyExpr": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:rtlEnabled": null,
    "update:selectedItemKeys": null,
    "update:selectedItems": null,
    "update:selectionMode": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    buttonTemplate: {},
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array as PropType<Array<dxButtonGroupItem | SchedulerPredefinedDateNavigatorItem>>,
    keyExpr: [Function, String] as PropType<((() => void)) | string>,
    onContentReady: Function as PropType<((e: ButtonGroupContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: ButtonGroupDisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: ButtonGroupInitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onOptionChanged: Function as PropType<((e: ButtonGroupOptionChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    selectedItemKeys: Array as PropType<Array<any>>,
    selectedItems: Array as PropType<Array<any>>,
    selectionMode: String as PropType<SingleMultipleOrNone>,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxOptionsConfig);

const DxOptions = defineComponent(DxOptionsConfig);

(DxOptions as any).$_optionName = "options";
(DxOptions as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  optionsItem: { isCollectionItem: true, optionName: "items" }
};

const DxOptionsItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:hint": null,
    "update:icon": null,
    "update:template": null,
    "update:text": null,
    "update:type": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    hint: String,
    icon: String,
    template: {},
    text: String,
    type: String as PropType<ButtonType | string>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxOptionsItemConfig);

const DxOptionsItem = defineComponent(DxOptionsItemConfig);

(DxOptionsItem as any).$_optionName = "items";
(DxOptionsItem as any).$_isCollectionItem = true;

const DxPatternRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:pattern": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    pattern: [RegExp, String],
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxPatternRuleConfig);

const DxPatternRule = defineComponent(DxPatternRuleConfig);

(DxPatternRule as any).$_optionName = "validationRules";
(DxPatternRule as any).$_isCollectionItem = true;
(DxPatternRule as any).$_predefinedProps = {
  type: "pattern"
};

const DxRangeRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:reevaluate": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: [Date, Number, String],
    message: String,
    min: [Date, Number, String],
    reevaluate: Boolean,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxRangeRuleConfig);

const DxRangeRule = defineComponent(DxRangeRuleConfig);

(DxRangeRule as any).$_optionName = "validationRules";
(DxRangeRule as any).$_isCollectionItem = true;
(DxRangeRule as any).$_predefinedProps = {
  type: "range"
};

const DxRequiredRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:message": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    message: String,
    trim: Boolean,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxRequiredRuleConfig);

const DxRequiredRule = defineComponent(DxRequiredRuleConfig);

(DxRequiredRule as any).$_optionName = "validationRules";
(DxRequiredRule as any).$_isCollectionItem = true;
(DxRequiredRule as any).$_predefinedProps = {
  type: "required"
};

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
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    displayExpr: [Function, String] as PropType<(((resource: any) => string)) | string>,
    fieldExpr: String,
    label: String,
    useColorAsDefault: Boolean,
    valueExpr: [Function, String] as PropType<((() => void)) | string>
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
    mode: String as PropType<ScrollMode>
  }
};

prepareConfigurationComponentConfig(DxScrollingConfig);

const DxScrolling = defineComponent(DxScrollingConfig);

(DxScrolling as any).$_optionName = "scrolling";

const DxSimpleItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiOptions": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:editorOptions": null,
    "update:editorType": null,
    "update:helpText": null,
    "update:isRequired": null,
    "update:itemType": null,
    "update:label": null,
    "update:name": null,
    "update:template": null,
    "update:validationRules": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    aiOptions: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    dataField: String,
    editorOptions: {},
    editorType: String as PropType<FormItemComponent>,
    helpText: String,
    isRequired: Boolean,
    itemType: String as PropType<FormItemType>,
    label: Object as PropType<Record<string, any>>,
    name: String,
    template: {},
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxSimpleItemConfig);

const DxSimpleItem = defineComponent(DxSimpleItemConfig);

(DxSimpleItem as any).$_optionName = "items";
(DxSimpleItem as any).$_isCollectionItem = true;
(DxSimpleItem as any).$_predefinedProps = {
  itemType: "simple"
};
(DxSimpleItem as any).$_expectedChildren = {
  aiOptions: { isCollectionItem: false, optionName: "aiOptions" },
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  label: { isCollectionItem: false, optionName: "label" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};

const DxStringLengthRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: Number,
    message: String,
    min: Number,
    trim: Boolean,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxStringLengthRuleConfig);

const DxStringLengthRule = defineComponent(DxStringLengthRuleConfig);

(DxStringLengthRule as any).$_optionName = "validationRules";
(DxStringLengthRule as any).$_isCollectionItem = true;
(DxStringLengthRule as any).$_predefinedProps = {
  type: "stringLength"
};

const DxTabConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignItemLabels": null,
    "update:badge": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:disabled": null,
    "update:icon": null,
    "update:items": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:title": null,
  },
  props: {
    alignItemLabels: Boolean,
    badge: String,
    colCount: Number,
    colCountByScreen: Object as PropType<Record<string, any>>,
    disabled: Boolean,
    icon: String,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    tabTemplate: {},
    template: {},
    title: String
  }
};

prepareConfigurationComponentConfig(DxTabConfig);

const DxTab = defineComponent(DxTabConfig);

(DxTab as any).$_optionName = "tabs";
(DxTab as any).$_isCollectionItem = true;
(DxTab as any).$_expectedChildren = {
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" }
};

const DxTabbedItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:itemType": null,
    "update:name": null,
    "update:tabPanelOptions": null,
    "update:tabs": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    itemType: String as PropType<FormItemType>,
    name: String,
    tabPanelOptions: Object as PropType<dxTabPanelOptions | Record<string, any>>,
    tabs: Array as PropType<Array<Record<string, any>>>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxTabbedItemConfig);

const DxTabbedItem = defineComponent(DxTabbedItemConfig);

(DxTabbedItem as any).$_optionName = "items";
(DxTabbedItem as any).$_isCollectionItem = true;
(DxTabbedItem as any).$_predefinedProps = {
  itemType: "tabbed"
};
(DxTabbedItem as any).$_expectedChildren = {
  tab: { isCollectionItem: true, optionName: "tabs" },
  tabPanelOptions: { isCollectionItem: false, optionName: "tabPanelOptions" }
};

const DxTabPanelOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:animationEnabled": null,
    "update:dataSource": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:iconPosition": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:itemTitleTemplate": null,
    "update:keyExpr": null,
    "update:loop": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:onSelectionChanging": null,
    "update:onTitleClick": null,
    "update:onTitleHold": null,
    "update:onTitleRendered": null,
    "update:repaintChangesOnly": null,
    "update:rtlEnabled": null,
    "update:scrollByContent": null,
    "update:scrollingEnabled": null,
    "update:selectedIndex": null,
    "update:selectedItem": null,
    "update:showNavButtons": null,
    "update:stylingMode": null,
    "update:swipeEnabled": null,
    "update:tabIndex": null,
    "update:tabsPosition": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animationEnabled: Boolean,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxTabPanelItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    deferRendering: Boolean,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    iconPosition: String as PropType<TabsIconPosition>,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any | dxTabPanelItem | string>>,
    itemTemplate: {},
    itemTitleTemplate: {},
    keyExpr: [Function, String] as PropType<((() => void)) | string>,
    loop: Boolean,
    noDataText: String,
    onContentReady: Function as PropType<((e: TabPanelContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: TabPanelDisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: TabPanelInitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: TabPanelItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: TabPanelOptionChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: TabPanelSelectionChangedEvent) => void)>,
    onSelectionChanging: Function as PropType<((e: SelectionChangingEvent) => void)>,
    onTitleClick: Function as PropType<((e: TitleClickEvent) => void)>,
    onTitleHold: Function as PropType<((e: TitleHoldEvent) => void)>,
    onTitleRendered: Function as PropType<((e: TitleRenderedEvent) => void)>,
    repaintChangesOnly: Boolean,
    rtlEnabled: Boolean,
    scrollByContent: Boolean,
    scrollingEnabled: Boolean,
    selectedIndex: Number,
    selectedItem: {},
    showNavButtons: Boolean,
    stylingMode: String as PropType<TabsStyle>,
    swipeEnabled: Boolean,
    tabIndex: Number,
    tabsPosition: String as PropType<Position>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxTabPanelOptionsConfig);

const DxTabPanelOptions = defineComponent(DxTabPanelOptionsConfig);

(DxTabPanelOptions as any).$_optionName = "tabPanelOptions";
(DxTabPanelOptions as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  tabPanelOptionsItem: { isCollectionItem: true, optionName: "items" }
};

const DxTabPanelOptionsItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:badge": null,
    "update:disabled": null,
    "update:html": null,
    "update:icon": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
    "update:visible": null,
  },
  props: {
    badge: String,
    disabled: Boolean,
    html: String,
    icon: String,
    tabTemplate: {},
    template: {},
    text: String,
    title: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxTabPanelOptionsItemConfig);

const DxTabPanelOptionsItem = defineComponent(DxTabPanelOptionsItemConfig);

(DxTabPanelOptionsItem as any).$_optionName = "items";
(DxTabPanelOptionsItem as any).$_isCollectionItem = true;

const DxToolbarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:items": null,
    "update:multiline": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    items: Array as PropType<Array<dxSchedulerToolbarItem | SchedulerPredefinedToolbarItem>>,
    multiline: Boolean,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxToolbarConfig);

const DxToolbar = defineComponent(DxToolbarConfig);

(DxToolbar as any).$_optionName = "toolbar";
(DxToolbar as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  toolbarItem: { isCollectionItem: true, optionName: "items" }
};

const DxToolbarItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:html": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    html: String,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<SchedulerPredefinedToolbarItem>,
    options: Object as PropType<DateNavigatorItemProperties | Record<string, any> | dxButtonGroupOptions>,
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxToolbarItemConfig);

const DxToolbarItem = defineComponent(DxToolbarItemConfig);

(DxToolbarItem as any).$_optionName = "items";
(DxToolbarItem as any).$_isCollectionItem = true;
(DxToolbarItem as any).$_expectedChildren = {
  options: { isCollectionItem: false, optionName: "options" }
};

const DxValidationRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:pattern": null,
    "update:reevaluate": null,
    "update:trim": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    comparisonTarget: Function as PropType<(() => any)>,
    comparisonType: String as PropType<ComparisonOperator>,
    ignoreEmptyValue: Boolean,
    max: [Date, Number, String],
    message: String,
    min: [Date, Number, String],
    pattern: [RegExp, String],
    reevaluate: Boolean,
    trim: Boolean,
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean)>
  }
};

prepareConfigurationComponentConfig(DxValidationRuleConfig);

const DxValidationRule = defineComponent(DxValidationRuleConfig);

(DxValidationRule as any).$_optionName = "validationRules";
(DxValidationRule as any).$_isCollectionItem = true;
(DxValidationRule as any).$_predefinedProps = {
  type: "required"
};

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
    allDayPanelMode: String as PropType<AllDayPanelMode>,
    appointmentCollectorTemplate: {},
    appointmentTemplate: {},
    appointmentTooltipTemplate: {},
    cellDuration: Number,
    dataCellTemplate: {},
    dateCellTemplate: {},
    dropDownAppointmentTemplate: {},
    endDayHour: Number,
    firstDayOfWeek: Number as PropType<FirstDayOfWeek>,
    groupByDate: Boolean,
    groupOrientation: String as PropType<Orientation>,
    groups: Array as PropType<Array<string>>,
    intervalCount: Number,
    maxAppointmentsPerCell: [String, Number] as PropType<CellAppointmentsLimit | number>,
    name: String,
    offset: Number,
    resourceCellTemplate: {},
    scrolling: Object as PropType<dxSchedulerScrolling>,
    startDate: [Date, Number, String],
    startDayHour: Number,
    timeCellTemplate: {},
    type: String as PropType<ViewType>
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
  DxAiOptions,
  DxAppointmentDragging,
  DxAsyncRule,
  DxButtonItem,
  DxButtonOptions,
  DxColCountByScreen,
  DxCompareRule,
  DxCustomRule,
  DxEditing,
  DxEmailRule,
  DxEmptyItem,
  DxForm,
  DxGroupItem,
  DxItem,
  DxLabel,
  DxNumericRule,
  DxOptions,
  DxOptionsItem,
  DxPatternRule,
  DxRangeRule,
  DxRequiredRule,
  DxResource,
  DxScrolling,
  DxSimpleItem,
  DxStringLengthRule,
  DxTab,
  DxTabbedItem,
  DxTabPanelOptions,
  DxTabPanelOptionsItem,
  DxToolbar,
  DxToolbarItem,
  DxValidationRule,
  DxView
};
import type * as DxSchedulerTypes from "devextreme/ui/scheduler_types";
export { DxSchedulerTypes };
