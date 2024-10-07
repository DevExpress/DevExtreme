import { PropType } from "vue";
import RangeSlider, { Properties } from "devextreme/ui/range_slider";
import { 
ContentReadyEvent,
DisposingEvent,
InitializedEvent,
OptionChangedEvent,
ValueChangedEvent,
 } from "devextreme/ui/range_slider";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "disabled" |
  "elementAttr" |
  "end" |
  "endName" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "isDirty" |
  "isValid" |
  "keyStep" |
  "label" |
  "max" |
  "min" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "readOnly" |
  "rtlEnabled" |
  "showRange" |
  "start" |
  "startName" |
  "step" |
  "tabIndex" |
  "tooltip" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "valueChangeMode" |
  "visible" |
  "width"
>;

interface DxRangeSlider extends AccessibleOptions {
  readonly instance?: RangeSlider;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    end: Number,
    endName: String,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    isValid: Boolean,
    keyStep: Number,
    label: Object,
    max: Number,
    min: Number,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onValueChanged: Function as PropType<(e: ValueChangedEvent) => void>,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showRange: Boolean,
    start: Number,
    startName: String,
    step: Number,
    tabIndex: Number,
    tooltip: Object,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<"always" | "auto">,
    validationMessagePosition: String as PropType<"bottom" | "left" | "right" | "top">,
    validationStatus: String as PropType<"valid" | "invalid" | "pending">,
    value: Array as PropType<Array<number>>,
    valueChangeMode: String as PropType<"onHandleMove" | "onHandleRelease">,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:end": null,
    "update:endName": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:keyStep": null,
    "update:label": null,
    "update:max": null,
    "update:min": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showRange": null,
    "update:start": null,
    "update:startName": null,
    "update:step": null,
    "update:tabIndex": null,
    "update:tooltip": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:valueChangeMode": null,
    "update:visible": null,
    "update:width": null,
  },
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): RangeSlider {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = RangeSlider;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      label: { isCollectionItem: false, optionName: "label" },
      tooltip: { isCollectionItem: false, optionName: "tooltip" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxRangeSlider = defineComponent(componentConfig);


const DxFormatConfig = {
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
    type: String as PropType<"billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime">,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxFormatConfig);

const DxFormat = defineComponent(DxFormatConfig);

(DxFormat as any).$_optionName = "format";

const DxLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:format": null,
    "update:position": null,
    "update:visible": null,
  },
  props: {
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    position: String as PropType<"bottom" | "top">,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  format: { isCollectionItem: false, optionName: "format" }
};

const DxTooltipConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:format": null,
    "update:position": null,
    "update:showMode": null,
  },
  props: {
    enabled: Boolean,
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    position: String as PropType<"bottom" | "top">,
    showMode: String as PropType<"always" | "onHover">
  }
};

prepareConfigurationComponentConfig(DxTooltipConfig);

const DxTooltip = defineComponent(DxTooltipConfig);

(DxTooltip as any).$_optionName = "tooltip";
(DxTooltip as any).$_expectedChildren = {
  format: { isCollectionItem: false, optionName: "format" }
};

export default DxRangeSlider;
export {
  DxRangeSlider,
  DxFormat,
  DxLabel,
  DxTooltip
};
import type * as DxRangeSliderTypes from "devextreme/ui/range_slider_types";
export { DxRangeSliderTypes };
