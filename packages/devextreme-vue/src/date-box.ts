import { PropType } from "vue";
import DateBox, { Properties } from "devextreme/ui/date_box";
import {  ChangeEvent , ClosedEvent , ContentReadyEvent , CopyEvent , CutEvent , DisposingEvent , EnterKeyEvent , FocusInEvent , FocusOutEvent , InitializedEvent , InputEvent , KeyDownEvent , KeyUpEvent , OpenedEvent , OptionChangedEvent , PasteEvent , ValueChangedEvent ,} from "devextreme/ui/date_box";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";
import { 
 DisposingEvent  as CalendarOptionsDisposingEvent,
 InitializedEvent  as CalendarOptionsInitializedEvent,
 OptionChangedEvent  as CalendarOptionsOptionChangedEvent,
 ValueChangedEvent  as CalendarOptionsValueChangedEvent,
} from "devextreme/ui/calendar";
import { 
 ClickEvent  as OptionsClickEvent,
 ContentReadyEvent  as OptionsContentReadyEvent,
 DisposingEvent  as OptionsDisposingEvent,
 InitializedEvent  as OptionsInitializedEvent,
 OptionChangedEvent  as OptionsOptionChangedEvent,
} from "devextreme/ui/button";

type AccessibleOptions = Pick<Properties,
  "acceptCustomValue" |
  "accessKey" |
  "activeStateEnabled" |
  "adaptivityEnabled" |
  "applyButtonText" |
  "applyValueMode" |
  "buttons" |
  "calendarOptions" |
  "cancelButtonText" |
  "dateOutOfRangeMessage" |
  "dateSerializationFormat" |
  "deferRendering" |
  "disabled" |
  "disabledDates" |
  "displayFormat" |
  "dropDownButtonTemplate" |
  "dropDownOptions" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "inputAttr" |
  "interval" |
  "invalidDateMessage" |
  "isDirty" |
  "isValid" |
  "label" |
  "labelMode" |
  "max" |
  "maxLength" |
  "min" |
  "name" |
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
  "pickerType" |
  "placeholder" |
  "readOnly" |
  "rtlEnabled" |
  "showAnalogClock" |
  "showClearButton" |
  "showDropDownButton" |
  "spellcheck" |
  "stylingMode" |
  "tabIndex" |
  "text" |
  "todayButtonText" |
  "type" |
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

interface DxDateBox extends AccessibleOptions {
  readonly instance?: DateBox;
}

const componentConfig = {
  props: {
    acceptCustomValue: Boolean,
    accessKey: String,
    activeStateEnabled: Boolean,
    adaptivityEnabled: Boolean,
    applyButtonText: String,
    applyValueMode: {},
    buttons: Array as PropType<Array<DropDownPredefinedButton> | Array<Object>>,
    calendarOptions: Object,
    cancelButtonText: String,
    dateOutOfRangeMessage: String,
    dateSerializationFormat: String,
    deferRendering: Boolean,
    disabled: Boolean,
    disabledDates: [Array, Function] as PropType<Array<Date> | ((data: Object) => Boolean)>,
    displayFormat: {},
    dropDownButtonTemplate: {},
    dropDownOptions: Object,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    interval: Number,
    invalidDateMessage: String,
    isDirty: Boolean,
    isValid: Boolean,
    label: String,
    labelMode: {},
    max: [Date, Number, String],
    maxLength: [Number, String],
    min: [Date, Number, String],
    name: String,
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
    pickerType: {},
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showAnalogClock: Boolean,
    showClearButton: Boolean,
    showDropDownButton: Boolean,
    spellcheck: Boolean,
    stylingMode: {},
    tabIndex: Number,
    text: String,
    todayButtonText: String,
    type: {},
    useMaskBehavior: Boolean,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: {},
    validationMessagePosition: {},
    validationStatus: {},
    value: [Date, Number, String],
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
    "update:adaptivityEnabled": null,
    "update:applyButtonText": null,
    "update:applyValueMode": null,
    "update:buttons": null,
    "update:calendarOptions": null,
    "update:cancelButtonText": null,
    "update:dateOutOfRangeMessage": null,
    "update:dateSerializationFormat": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:disabledDates": null,
    "update:displayFormat": null,
    "update:dropDownButtonTemplate": null,
    "update:dropDownOptions": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:interval": null,
    "update:invalidDateMessage": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:label": null,
    "update:labelMode": null,
    "update:max": null,
    "update:maxLength": null,
    "update:min": null,
    "update:name": null,
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
    "update:pickerType": null,
    "update:placeholder": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showAnalogClock": null,
    "update:showClearButton": null,
    "update:showDropDownButton": null,
    "update:spellcheck": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:text": null,
    "update:todayButtonText": null,
    "update:type": null,
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
    instance(): DateBox {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = DateBox;
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

const DxDateBox = defineComponent(componentConfig);


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
    x: {},
    y: {}
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
    location: {},
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
    firstDayOfWeek: {},
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    isValid: Boolean,
    max: [Date, Number, String],
    maxZoomLevel: {},
    min: [Date, Number, String],
    minZoomLevel: {},
    name: String,
    onDisposing: Function as PropType<(e: CalendarOptionsDisposingEvent) => void>,
    onInitialized: Function as PropType<(e: CalendarOptionsInitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: CalendarOptionsOptionChangedEvent) => void>,
    onValueChanged: Function as PropType<(e: CalendarOptionsValueChangedEvent) => void>,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    selectionMode: {},
    selectWeekOnClick: Boolean,
    showTodayButton: Boolean,
    showWeekNumbers: Boolean,
    tabIndex: Number,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: {},
    validationMessagePosition: {},
    validationStatus: {},
    value: [Array, Date, Number, String] as PropType<(Array<Date> | Array<number> | Array<string>) | Date | number | string>,
    visible: Boolean,
    weekNumberRule: {},
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    zoomLevel: {}
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
    x: {},
    y: {}
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
    type: {},
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
    position: {},
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
    direction: {},
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function as PropType<($element: any, config: Object) => void>,
    to: Object,
    type: {}
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
    x: {},
    y: {}
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
    onClick: Function as PropType<(e: OptionsClickEvent) => void>,
    onContentReady: Function as PropType<(e: OptionsContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: OptionsDisposingEvent) => void>,
    onInitialized: Function as PropType<(e: OptionsInitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionsOptionChangedEvent) => void>,
    rtlEnabled: Boolean,
    stylingMode: {},
    tabIndex: Number,
    template: {},
    text: String,
    type: {},
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
    at: {},
    boundary: {},
    boundaryOffset: [Object, String],
    collision: {},
    my: {},
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
    direction: {},
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function as PropType<($element: any, config: Object) => void>,
    to: Object,
    type: {}
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
    locateInMenu: {},
    location: {},
    menuItemTemplate: {},
    options: {},
    showText: {},
    template: {},
    text: String,
    toolbar: {},
    visible: Boolean,
    widget: {}
  }
};

prepareConfigurationComponentConfig(DxToolbarItemConfig);

const DxToolbarItem = defineComponent(DxToolbarItemConfig);

(DxToolbarItem as any).$_optionName = "toolbarItems";
(DxToolbarItem as any).$_isCollectionItem = true;

export default DxDateBox;
export {
  DxDateBox,
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
import type * as DxDateBoxTypes from "devextreme/ui/date_box_types";
export { DxDateBoxTypes };
