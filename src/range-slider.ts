import RangeSlider, { Properties } from "devextreme/ui/range_slider";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

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
const DxRangeSlider = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    end: Number,
    endName: String,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    isValid: Boolean,
    keyStep: Number,
    label: Object,
    max: Number,
    min: Number,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showRange: Boolean,
    start: Number,
    startName: String,
    step: Number,
    tabIndex: Number,
    tooltip: Object,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: String,
    validationMessagePosition: String,
    validationStatus: String,
    value: Array,
    valueChangeMode: String,
    visible: Boolean,
    width: [Function, Number, String]
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
});

const DxFormat = createConfigurationComponent({
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
    formatter: Function,
    parser: Function,
    precision: Number,
    type: String,
    useCurrencyAccountingStyle: Boolean
  }
});
(DxFormat as any).$_optionName = "format";
const DxLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:format": null,
    "update:position": null,
    "update:visible": null,
  },
  props: {
    format: [Object, Function, String],
    position: String,
    visible: Boolean
  }
});
(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  format: { isCollectionItem: false, optionName: "format" }
};
const DxTooltip = createConfigurationComponent({
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
    format: [Object, Function, String],
    position: String,
    showMode: String
  }
});
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
