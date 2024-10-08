import { PropType } from "vue";
import Calendar, { Properties } from "devextreme/ui/calendar";
import {
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
 ValueChangedEvent,
} from "devextreme/ui/calendar";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";

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
    disabledDates: [Array, Function] as PropType<Array<Date> | ((data: Object) => Boolean)>,
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
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    isValid: Boolean,
    max: [Date, Number, String],
    maxZoomLevel: String as PropType<"century" | "decade" | "month" | "year">,
    min: [Date, Number, String],
    minZoomLevel: String as PropType<"century" | "decade" | "month" | "year">,
    name: String,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onValueChanged: Function as PropType<(e: ValueChangedEvent) => void>,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    selectionMode: String as PropType<"single" | "multiple" | "range">,
    selectWeekOnClick: Boolean,
    showTodayButton: Boolean,
    showWeekNumbers: Boolean,
    tabIndex: Number,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<"always" | "auto">,
    validationMessagePosition: String as PropType<"bottom" | "left" | "right" | "top">,
    validationStatus: String as PropType<"valid" | "invalid" | "pending">,
    value: [Array, Date, Number, String] as PropType<(Array<Date | number | string>) | Date | number | string>,
    visible: Boolean,
    weekNumberRule: String as PropType<"auto" | "firstDay" | "fullWeek" | "firstFourDays">,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    zoomLevel: String as PropType<"century" | "decade" | "month" | "year">
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
