import Slider, { Properties } from "devextreme/ui/slider";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "disabled" |
  "elementAttr" |
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
  "name" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "readOnly" |
  "rtlEnabled" |
  "showRange" |
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

interface DxSlider extends AccessibleOptions {
  readonly instance?: Slider;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    isValid: Boolean,
    keyStep: Number,
    label: Object,
    max: Number,
    min: Number,
    name: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showRange: Boolean,
    step: Number,
    tabIndex: Number,
    tooltip: Object,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: {},
    validationMessagePosition: {},
    validationStatus: {},
    value: Number,
    valueChangeMode: {},
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
    "update:name": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showRange": null,
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
    instance(): Slider {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Slider;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      label: { isCollectionItem: false, optionName: "label" },
      tooltip: { isCollectionItem: false, optionName: "tooltip" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxSlider = defineComponent(componentConfig);


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
    formatter: Function,
    parser: Function,
    precision: Number,
    type: {},
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
    format: {},
    position: {},
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
    format: {},
    position: {},
    showMode: {}
  }
};

prepareConfigurationComponentConfig(DxTooltipConfig);

const DxTooltip = defineComponent(DxTooltipConfig);

(DxTooltip as any).$_optionName = "tooltip";
(DxTooltip as any).$_expectedChildren = {
  format: { isCollectionItem: false, optionName: "format" }
};

export default DxSlider;
export {
  DxSlider,
  DxFormat,
  DxLabel,
  DxTooltip
};
import type * as DxSliderTypes from "devextreme/ui/slider_types";
export { DxSliderTypes };
