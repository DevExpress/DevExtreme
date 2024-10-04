import NumberBox, { Properties } from "devextreme/ui/number_box";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "buttons" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "format" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "inputAttr" |
  "invalidValueMessage" |
  "isDirty" |
  "isValid" |
  "label" |
  "labelMode" |
  "max" |
  "min" |
  "mode" |
  "name" |
  "onChange" |
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
  "onOptionChanged" |
  "onPaste" |
  "onValueChanged" |
  "placeholder" |
  "readOnly" |
  "rtlEnabled" |
  "showClearButton" |
  "showSpinButtons" |
  "step" |
  "stylingMode" |
  "tabIndex" |
  "text" |
  "useLargeSpinButtons" |
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

interface DxNumberBox extends AccessibleOptions {
  readonly instance?: NumberBox;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    buttons: Array,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    format: {},
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    invalidValueMessage: String,
    isDirty: Boolean,
    isValid: Boolean,
    label: String,
    labelMode: {},
    max: Number,
    min: Number,
    mode: {},
    name: String,
    onChange: Function,
    onContentReady: Function,
    onCopy: Function,
    onCut: Function,
    onDisposing: Function,
    onEnterKey: Function,
    onFocusIn: Function,
    onFocusOut: Function,
    onInitialized: Function,
    onInput: Function,
    onKeyDown: Function,
    onKeyUp: Function,
    onOptionChanged: Function,
    onPaste: Function,
    onValueChanged: Function,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showClearButton: Boolean,
    showSpinButtons: Boolean,
    step: Number,
    stylingMode: {},
    tabIndex: Number,
    text: String,
    useLargeSpinButtons: Boolean,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: {},
    validationMessagePosition: {},
    validationStatus: {},
    value: Number,
    valueChangeEvent: String,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:buttons": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:format": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:invalidValueMessage": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:label": null,
    "update:labelMode": null,
    "update:max": null,
    "update:min": null,
    "update:mode": null,
    "update:name": null,
    "update:onChange": null,
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
    "update:onOptionChanged": null,
    "update:onPaste": null,
    "update:onValueChanged": null,
    "update:placeholder": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showClearButton": null,
    "update:showSpinButtons": null,
    "update:step": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:text": null,
    "update:useLargeSpinButtons": null,
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
    instance(): NumberBox {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = NumberBox;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      button: { isCollectionItem: true, optionName: "buttons" },
      format: { isCollectionItem: false, optionName: "format" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxNumberBox = defineComponent(componentConfig);


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
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    stylingMode: {},
    tabIndex: Number,
    template: {},
    text: String,
    type: {},
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String]
  }
};

prepareConfigurationComponentConfig(DxOptionsConfig);

const DxOptions = defineComponent(DxOptionsConfig);

(DxOptions as any).$_optionName = "options";

export default DxNumberBox;
export {
  DxNumberBox,
  DxButton,
  DxFormat,
  DxOptions
};
import type * as DxNumberBoxTypes from "devextreme/ui/number_box_types";
export { DxNumberBoxTypes };
