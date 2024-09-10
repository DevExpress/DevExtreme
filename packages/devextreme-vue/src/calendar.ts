import Calendar, { Properties } from "devextreme/ui/calendar";
import { defineComponent } from "vue";
import { prepareComponentConfig, } from "./core/strategy/vue3";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "cellTemplate" |
  "dateSerializationFormat" |
  "disabled" |
  "disabledDates" |
  "elementAttr" |
  "firstDayOfWeek" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "isDirty" |
  "isValid" |
  "max" |
  "maxZoomLevel" |
  "min" |
  "minZoomLevel" |
  "name" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "readOnly" |
  "rtlEnabled" |
  "selectionMode" |
  "selectWeekOnClick" |
  "showTodayButton" |
  "showWeekNumbers" |
  "tabIndex" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "visible" |
  "weekNumberRule" |
  "width" |
  "zoomLevel"
>;

interface DxCalendar extends AccessibleOptions {
  readonly instance?: Calendar;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    cellTemplate: {},
    dateSerializationFormat: String,
    disabled: Boolean,
    disabledDates: [Array, Function],
    elementAttr: Object,
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
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    isValid: Boolean,
    max: [Date, Number, String],
    maxZoomLevel: String,
    min: [Date, Number, String],
    minZoomLevel: String,
    name: String,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    selectionMode: String,
    selectWeekOnClick: Boolean,
    showTodayButton: Boolean,
    showWeekNumbers: Boolean,
    tabIndex: Number,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: String,
    validationMessagePosition: String,
    validationStatus: String,
    value: [Array, Date, Number, String],
    visible: Boolean,
    weekNumberRule: String,
    width: [Function, Number, String],
    zoomLevel: String
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
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
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): Calendar {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Calendar;
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxCalendar = defineComponent(componentConfig);

export default DxCalendar;
export {
  DxCalendar
};
import type * as DxCalendarTypes from "devextreme/ui/calendar_types";
export { DxCalendarTypes };
