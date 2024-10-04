import { PropType } from "vue";
import DateRangeBox, { Properties } from "devextreme/ui/date_range_box";
import { 
ApplyValueMode,
Format,
LabelMode,
EditorStyle,
ValidationMessageMode,
Mode,
Position,
ValidationStatus,
HorizontalAlignment,
VerticalAlignment,
TextEditorButtonLocation,
FirstDayOfWeek,
PositionAlignment,
Direction,
ButtonStyle,
ButtonType,
ToolbarItemLocation,
ToolbarItemComponent,
 } from "devextreme/common";
import { 
DropDownPredefinedButton,
 } from "devextreme/ui/drop_down_editor/ui.drop_down_editor";
import { 
ChangeEvent,
ClosedEvent,
ContentReadyEvent,
CopyEvent,
CutEvent,
DisposingEvent,
EnterKeyEvent,
FocusInEvent,
FocusOutEvent,
InitializedEvent,
InputEvent,
KeyDownEvent,
KeyUpEvent,
OpenedEvent,
OptionChangedEvent,
PasteEvent,
ValueChangedEvent,
 } from "devextreme/ui/date_range_box";
import { 
CalendarZoomLevel,
DisposingEvent as CalendarDisposingEvent,
InitializedEvent as CalendarInitializedEvent,
OptionChangedEvent as CalendarOptionChangedEvent,
ValueChangedEvent as CalendarValueChangedEvent,
CalendarSelectionMode,
WeekNumberRule,
 } from "devextreme/ui/calendar";
import { 
CollisionResolution,
CollisionResolutionCombination,
 } from "devextreme/animation/position";
import { 
AnimationType,
 } from "devextreme/animation/fx";
import { 
ClickEvent,
ContentReadyEvent as ButtonContentReadyEvent,
DisposingEvent as ButtonDisposingEvent,
InitializedEvent as ButtonInitializedEvent,
OptionChangedEvent as ButtonOptionChangedEvent,
 } from "devextreme/ui/button";
import { 
LocateInMenuMode,
ShowTextMode,
 } from "devextreme/ui/toolbar";
import { 
ToolbarLocation,
 } from "devextreme/ui/popup";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "acceptCustomValue" |
  "accessKey" |
  "activeStateEnabled" |
  "applyButtonText" |
  "applyValueMode" |
  "buttons" |
  "calendarOptions" |
  "cancelButtonText" |
  "dateSerializationFormat" |
  "deferRendering" |
  "disabled" |
  "disableOutOfRangeSelection" |
  "displayFormat" |
  "dropDownButtonTemplate" |
  "dropDownOptions" |
  "elementAttr" |
  "endDate" |
  "endDateInputAttr" |
  "endDateLabel" |
  "endDateName" |
  "endDateOutOfRangeMessage" |
  "endDatePlaceholder" |
  "endDateText" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "invalidEndDateMessage" |
  "invalidStartDateMessage" |
  "isDirty" |
  "isValid" |
  "labelMode" |
  "max" |
  "min" |
  "multiView" |
  "onChange" |
  "onClosed" |
  "onContentReady" |
  "onCopy" |
  "onCut" |
  "onDisposing" |
  "onEnterKey" |
  "onFocusIn" |
  "onFocusOut" |
  "onInitialized" |
  "onInput" |
  "onKeyDown" |
  "onKeyUp" |
  "onOpened" |
  "onOptionChanged" |
  "onPaste" |
  "onValueChanged" |
  "opened" |
  "openOnFieldClick" |
  "readOnly" |
  "rtlEnabled" |
  "showClearButton" |
  "showDropDownButton" |
  "spellcheck" |
  "startDate" |
  "startDateInputAttr" |
  "startDateLabel" |
  "startDateName" |
  "startDateOutOfRangeMessage" |
  "startDatePlaceholder" |
  "startDateText" |
  "stylingMode" |
  "tabIndex" |
  "todayButtonText" |
  "useMaskBehavior" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "valueChangeEvent" |
  "visible" |
  "width"
>;

interface DxDateRangeBox extends AccessibleOptions {
  readonly instance?: DateRangeBox;
}

const componentConfig = {
  props: {
    acceptCustomValue: Boolean,
    accessKey: String,
    activeStateEnabled: Boolean,
    applyButtonText: String,
    applyValueMode: Object as PropType<ApplyValueMode>,
    buttons: Array as PropType<Array<DropDownPredefinedButton> | Array<Object>>,
    calendarOptions: Object,
    cancelButtonText: String,
    dateSerializationFormat: String,
    deferRendering: Boolean,
    disabled: Boolean,
    disableOutOfRangeSelection: Boolean,
    displayFormat: [Object, Function, String] as PropType<Object | Format | ((value: number | Date) => string) | Object | string>,
    dropDownButtonTemplate: {},
    dropDownOptions: Object,
    elementAttr: Object,
    endDate: [Date, Number, String],
    endDateInputAttr: {},
    endDateLabel: String,
    endDateName: String,
    endDateOutOfRangeMessage: String,
    endDatePlaceholder: String,
    endDateText: String,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    invalidEndDateMessage: String,
    invalidStartDateMessage: String,
    isDirty: Boolean,
    isValid: Boolean,
    labelMode: Object as PropType<LabelMode>,
    max: [Date, Number, String],
    min: [Date, Number, String],
    multiView: Boolean,
    onChange: Function as PropType<(e: ChangeEvent) => void>,
    onClosed: Function as PropType<(e: ClosedEvent) => void>,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onCopy: Function as PropType<(e: CopyEvent) => void>,
    onCut: Function as PropType<(e: CutEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onEnterKey: Function as PropType<(e: EnterKeyEvent) => void>,
    onFocusIn: Function as PropType<(e: FocusInEvent) => void>,
    onFocusOut: Function as PropType<(e: FocusOutEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onInput: Function as PropType<(e: InputEvent) => void>,
    onKeyDown: Function as PropType<(e: KeyDownEvent) => void>,
    onKeyUp: Function as PropType<(e: KeyUpEvent) => void>,
    onOpened: Function as PropType<(e: OpenedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onPaste: Function as PropType<(e: PasteEvent) => void>,
    onValueChanged: Function as PropType<(e: ValueChangedEvent) => void>,
    opened: Boolean,
    openOnFieldClick: Boolean,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showClearButton: Boolean,
    showDropDownButton: Boolean,
    spellcheck: Boolean,
    startDate: [Date, Number, String],
    startDateInputAttr: {},
    startDateLabel: String,
    startDateName: String,
    startDateOutOfRangeMessage: String,
    startDatePlaceholder: String,
    startDateText: String,
    stylingMode: Object as PropType<EditorStyle>,
    tabIndex: Number,
    todayButtonText: String,
    useMaskBehavior: Boolean,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: Object as PropType<ValidationMessageMode>,
    validationMessagePosition: Object as PropType<Mode | Position>,
    validationStatus: Object as PropType<ValidationStatus>,
    value: Array as PropType<Array<Date> | Array<number> | Array<string>>,
    valueChangeEvent: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:acceptCustomValue": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:applyButtonText": null,
    "update:applyValueMode": null,
    "update:buttons": null,
    "update:calendarOptions": null,
    "update:cancelButtonText": null,
    "update:dateSerializationFormat": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:disableOutOfRangeSelection": null,
    "update:displayFormat": null,
    "update:dropDownButtonTemplate": null,
    "update:dropDownOptions": null,
    "update:elementAttr": null,
    "update:endDate": null,
    "update:endDateInputAttr": null,
    "update:endDateLabel": null,
    "update:endDateName": null,
    "update:endDateOutOfRangeMessage": null,
    "update:endDatePlaceholder": null,
    "update:endDateText": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:invalidEndDateMessage": null,
    "update:invalidStartDateMessage": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:labelMode": null,
    "update:max": null,
    "update:min": null,
    "update:multiView": null,
    "update:onChange": null,
    "update:onClosed": null,
    "update:onContentReady": null,
    "update:onCopy": null,
    "update:onCut": null,
    "update:onDisposing": null,
    "update:onEnterKey": null,
    "update:onFocusIn": null,
    "update:onFocusOut": null,
    "update:onInitialized": null,
    "update:onInput": null,
    "update:onKeyDown": null,
    "update:onKeyUp": null,
    "update:onOpened": null,
    "update:onOptionChanged": null,
    "update:onPaste": null,
    "update:onValueChanged": null,
    "update:opened": null,
    "update:openOnFieldClick": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showClearButton": null,
    "update:showDropDownButton": null,
    "update:spellcheck": null,
    "update:startDate": null,
    "update:startDateInputAttr": null,
    "update:startDateLabel": null,
    "update:startDateName": null,
    "update:startDateOutOfRangeMessage": null,
    "update:startDatePlaceholder": null,
    "update:startDateText": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:todayButtonText": null,
    "update:useMaskBehavior": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:valueChangeEvent": null,
    "update:visible": null,
    "update:width": null,
  },
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): DateRangeBox {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = DateRangeBox;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      button: { isCollectionItem: true, optionName: "buttons" },
      calendarOptions: { isCollectionItem: false, optionName: "calendarOptions" },
      displayFormat: { isCollectionItem: false, optionName: "displayFormat" },
      dropDownOptions: { isCollectionItem: false, optionName: "dropDownOptions" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxDateRangeBox = defineComponent(componentConfig);


const DxAnimationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:hide": null,
    "update:show": null,
  },
  props: {
    hide: [Object, Number, String],
    show: [Object, Number, String]
  }
};

prepareConfigurationComponentConfig(DxAnimationConfig);

const DxAnimation = defineComponent(DxAnimationConfig);

(DxAnimation as any).$_optionName = "animation";
(DxAnimation as any).$_expectedChildren = {
  hide: { isCollectionItem: false, optionName: "hide" },
  show: { isCollectionItem: false, optionName: "show" }
};

const DxAtConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Object as PropType<HorizontalAlignment>,
    y: Object as PropType<VerticalAlignment>
  }
};

prepareConfigurationComponentConfig(DxAtConfig);

const DxAt = defineComponent(DxAtConfig);

(DxAt as any).$_optionName = "at";

const DxBoundaryOffsetConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
};

prepareConfigurationComponentConfig(DxBoundaryOffsetConfig);

const DxBoundaryOffset = defineComponent(DxBoundaryOffsetConfig);

(DxBoundaryOffset as any).$_optionName = "boundaryOffset";

const DxButtonConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
  },
  props: {
    location: Object as PropType<TextEditorButtonLocation>,
    name: String,
    options: Object
  }
};

prepareConfigurationComponentConfig(DxButtonConfig);

const DxButton = defineComponent(DxButtonConfig);

(DxButton as any).$_optionName = "buttons";
(DxButton as any).$_isCollectionItem = true;
(DxButton as any).$_expectedChildren = {
  options: { isCollectionItem: false, optionName: "options" }
};

const DxCalendarOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:bindingOptions": null,
    "update:cellTemplate": null,
    "update:dateSerializationFormat": null,
    "update:disabled": null,
    "update:disabledDates": null,
    "update:elementAttr": null,
    "update:firstDayOfWeek": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:max": null,
    "update:maxZoomLevel": null,
    "update:min": null,
    "update:minZoomLevel": null,
    "update:name": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:selectionMode": null,
    "update:selectWeekOnClick": null,
    "update:showTodayButton": null,
    "update:showWeekNumbers": null,
    "update:tabIndex": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:visible": null,
    "update:weekNumberRule": null,
    "update:width": null,
    "update:zoomLevel": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    bindingOptions: Object,
    cellTemplate: {},
    dateSerializationFormat: String,
    disabled: Boolean,
    disabledDates: [Array, Function] as PropType<Array<Date> | ((data: Object) => Boolean)>,
    elementAttr: Object,
    firstDayOfWeek: Object as PropType<FirstDayOfWeek>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    isValid: Boolean,
    max: [Date, Number, String],
    maxZoomLevel: Object as PropType<CalendarZoomLevel>,
    min: [Date, Number, String],
    minZoomLevel: Object as PropType<CalendarZoomLevel>,
    name: String,
    onDisposing: Function as PropType<(e: CalendarDisposingEvent) => void>,
    onInitialized: Function as PropType<(e: CalendarInitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: CalendarOptionChangedEvent) => void>,
    onValueChanged: Function as PropType<(e: CalendarValueChangedEvent) => void>,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    selectionMode: Object as PropType<CalendarSelectionMode>,
    selectWeekOnClick: Boolean,
    showTodayButton: Boolean,
    showWeekNumbers: Boolean,
    tabIndex: Number,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: Object as PropType<ValidationMessageMode>,
    validationMessagePosition: Object as PropType<Position>,
    validationStatus: Object as PropType<ValidationStatus>,
    value: [Array, Date, Number, String] as PropType<(Array<Date> | Array<number> | Array<string>) | Date | number | string>,
    visible: Boolean,
    weekNumberRule: Object as PropType<WeekNumberRule>,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    zoomLevel: Object as PropType<CalendarZoomLevel>
  }
};

prepareConfigurationComponentConfig(DxCalendarOptionsConfig);

const DxCalendarOptions = defineComponent(DxCalendarOptionsConfig);

(DxCalendarOptions as any).$_optionName = "calendarOptions";

const DxCollisionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Object as PropType<CollisionResolution>,
    y: Object as PropType<CollisionResolution>
  }
};

prepareConfigurationComponentConfig(DxCollisionConfig);

const DxCollision = defineComponent(DxCollisionConfig);

(DxCollision as any).$_optionName = "collision";

const DxDisplayFormatConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function as PropType<(value: number | Date) => string>,
    parser: Function as PropType<(value: string) => (number | Date)>,
    precision: Number,
    type: [Object, String] as PropType<Format | string>,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxDisplayFormatConfig);

const DxDisplayFormat = defineComponent(DxDisplayFormatConfig);

(DxDisplayFormat as any).$_optionName = "displayFormat";

const DxDropDownOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:animation": null,
    "update:bindingOptions": null,
    "update:closeOnOutsideClick": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:dragAndResizeArea": null,
    "update:dragEnabled": null,
    "update:dragOutsideBoundary": null,
    "update:enableBodyScroll": null,
    "update:focusStateEnabled": null,
    "update:fullScreen": null,
    "update:height": null,
    "update:hideOnOutsideClick": null,
    "update:hideOnParentScroll": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:maxHeight": null,
    "update:maxWidth": null,
    "update:minHeight": null,
    "update:minWidth": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onHidden": null,
    "update:onHiding": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onResize": null,
    "update:onResizeEnd": null,
    "update:onResizeStart": null,
    "update:onShowing": null,
    "update:onShown": null,
    "update:onTitleRendered": null,
    "update:position": null,
    "update:resizeEnabled": null,
    "update:restorePosition": null,
    "update:rtlEnabled": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showCloseButton": null,
    "update:showTitle": null,
    "update:tabIndex": null,
    "update:title": null,
    "update:titleTemplate": null,
    "update:toolbarItems": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapperAttr": null,
  },
  props: {
    accessKey: String,
    animation: Object,
    bindingOptions: Object,
    closeOnOutsideClick: [Boolean, Function] as PropType<Boolean | ((event: Object) => Boolean)>,
    container: {},
    contentTemplate: {},
    deferRendering: Boolean,
    disabled: Boolean,
    dragAndResizeArea: {},
    dragEnabled: Boolean,
    dragOutsideBoundary: Boolean,
    enableBodyScroll: Boolean,
    focusStateEnabled: Boolean,
    fullScreen: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hideOnOutsideClick: [Boolean, Function] as PropType<Boolean | ((event: Object) => Boolean)>,
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    maxHeight: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    maxWidth: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    minHeight: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    minWidth: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    onContentReady: Function as PropType<(e: Object) => void>,
    onDisposing: Function as PropType<(e: Object) => void>,
    onHidden: Function as PropType<(e: Object) => void>,
    onHiding: Function as PropType<(e: Object) => void>,
    onInitialized: Function as PropType<(e: Object) => void>,
    onOptionChanged: Function as PropType<(e: Object) => void>,
    onResize: Function as PropType<(e: Object) => void>,
    onResizeEnd: Function as PropType<(e: Object) => void>,
    onResizeStart: Function as PropType<(e: Object) => void>,
    onShowing: Function as PropType<(e: Object) => void>,
    onShown: Function as PropType<(e: Object) => void>,
    onTitleRendered: Function as PropType<(e: Object) => void>,
    position: [Function, Object] as PropType<(() => void) | PositionAlignment | Object | Object>,
    resizeEnabled: Boolean,
    restorePosition: Boolean,
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showTitle: Boolean,
    tabIndex: Number,
    title: String,
    titleTemplate: {},
    toolbarItems: Array as PropType<Array<Object>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    wrapperAttr: {}
  }
};

prepareConfigurationComponentConfig(DxDropDownOptionsConfig);

const DxDropDownOptions = defineComponent(DxDropDownOptionsConfig);

(DxDropDownOptions as any).$_optionName = "dropDownOptions";
(DxDropDownOptions as any).$_expectedChildren = {
  animation: { isCollectionItem: false, optionName: "animation" },
  position: { isCollectionItem: false, optionName: "position" },
  toolbarItem: { isCollectionItem: true, optionName: "toolbarItems" }
};

const DxFromConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:left": null,
    "update:opacity": null,
    "update:position": null,
    "update:scale": null,
    "update:top": null,
  },
  props: {
    left: Number,
    opacity: Number,
    position: Object,
    scale: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxFromConfig);

const DxFrom = defineComponent(DxFromConfig);

(DxFrom as any).$_optionName = "from";
(DxFrom as any).$_expectedChildren = {
  position: { isCollectionItem: false, optionName: "position" }
};

const DxHideConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:complete": null,
    "update:delay": null,
    "update:direction": null,
    "update:duration": null,
    "update:easing": null,
    "update:from": null,
    "update:staggerDelay": null,
    "update:start": null,
    "update:to": null,
    "update:type": null,
  },
  props: {
    complete: Function as PropType<($element: any, config: Object) => void>,
    delay: Number,
    direction: Object as PropType<Direction>,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function as PropType<($element: any, config: Object) => void>,
    to: Object,
    type: Object as PropType<AnimationType>
  }
};

prepareConfigurationComponentConfig(DxHideConfig);

const DxHide = defineComponent(DxHideConfig);

(DxHide as any).$_optionName = "hide";
(DxHide as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
};

const DxMyConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Object as PropType<HorizontalAlignment>,
    y: Object as PropType<VerticalAlignment>
  }
};

prepareConfigurationComponentConfig(DxMyConfig);

const DxMy = defineComponent(DxMyConfig);

(DxMy as any).$_optionName = "my";

const DxOffsetConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
};

prepareConfigurationComponentConfig(DxOffsetConfig);

const DxOffset = defineComponent(DxOffsetConfig);

(DxOffset as any).$_optionName = "offset";

const DxOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:bindingOptions": null,
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
    bindingOptions: Object,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<(e: ClickEvent) => void>,
    onContentReady: Function as PropType<(e: ButtonContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: ButtonDisposingEvent) => void>,
    onInitialized: Function as PropType<(e: ButtonInitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: ButtonOptionChangedEvent) => void>,
    rtlEnabled: Boolean,
    stylingMode: Object as PropType<ButtonStyle>,
    tabIndex: Number,
    template: {},
    text: String,
    type: Object as PropType<ButtonType>,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
  }
};

prepareConfigurationComponentConfig(DxOptionsConfig);

const DxOptions = defineComponent(DxOptionsConfig);

(DxOptions as any).$_optionName = "options";

const DxPositionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:at": null,
    "update:boundary": null,
    "update:boundaryOffset": null,
    "update:collision": null,
    "update:my": null,
    "update:of": null,
    "update:offset": null,
  },
  props: {
    at: Object as PropType<Object | PositionAlignment>,
    boundary: {},
    boundaryOffset: [Object, String],
    collision: Object as PropType<CollisionResolutionCombination | Object>,
    my: Object as PropType<Object | PositionAlignment>,
    of: {},
    offset: [Object, String]
  }
};

prepareConfigurationComponentConfig(DxPositionConfig);

const DxPosition = defineComponent(DxPositionConfig);

(DxPosition as any).$_optionName = "position";

const DxShowConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:complete": null,
    "update:delay": null,
    "update:direction": null,
    "update:duration": null,
    "update:easing": null,
    "update:from": null,
    "update:staggerDelay": null,
    "update:start": null,
    "update:to": null,
    "update:type": null,
  },
  props: {
    complete: Function as PropType<($element: any, config: Object) => void>,
    delay: Number,
    direction: Object as PropType<Direction>,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function as PropType<($element: any, config: Object) => void>,
    to: Object,
    type: Object as PropType<AnimationType>
  }
};

prepareConfigurationComponentConfig(DxShowConfig);

const DxShow = defineComponent(DxShowConfig);

(DxShow as any).$_optionName = "show";

const DxToConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:left": null,
    "update:opacity": null,
    "update:position": null,
    "update:scale": null,
    "update:top": null,
  },
  props: {
    left: Number,
    opacity: Number,
    position: Object,
    scale: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxToConfig);

const DxTo = defineComponent(DxToConfig);

(DxTo as any).$_optionName = "to";

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
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:toolbar": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    html: String,
    locateInMenu: Object as PropType<LocateInMenuMode>,
    location: Object as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    options: {},
    showText: Object as PropType<ShowTextMode>,
    template: {},
    text: String,
    toolbar: Object as PropType<ToolbarLocation>,
    visible: Boolean,
    widget: Object as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxToolbarItemConfig);

const DxToolbarItem = defineComponent(DxToolbarItemConfig);

(DxToolbarItem as any).$_optionName = "toolbarItems";
(DxToolbarItem as any).$_isCollectionItem = true;

export default DxDateRangeBox;
export {
  DxDateRangeBox,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxButton,
  DxCalendarOptions,
  DxCollision,
  DxDisplayFormat,
  DxDropDownOptions,
  DxFrom,
  DxHide,
  DxMy,
  DxOffset,
  DxOptions,
  DxPosition,
  DxShow,
  DxTo,
  DxToolbarItem
};
import type * as DxDateRangeBoxTypes from "devextreme/ui/date_range_box_types";
export { DxDateRangeBoxTypes };
