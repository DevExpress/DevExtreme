import CheckBox, { Properties } from "devextreme/ui/check_box";
import { defineComponent } from "vue";
import { prepareComponentConfig, } from "./core/strategy/vue3";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "disabled" |
  "elementAttr" |
  "enableThreeStateBehavior" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "iconSize" |
  "isDirty" |
  "isValid" |
  "name" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "readOnly" |
  "rtlEnabled" |
  "tabIndex" |
  "text" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "visible" |
  "width"
>;

interface DxCheckBox extends AccessibleOptions {
  readonly instance?: CheckBox;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    enableThreeStateBehavior: Boolean,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    iconSize: [Number, String],
    isDirty: Boolean,
    isValid: Boolean,
    name: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    tabIndex: Number,
    text: String,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: String,
    validationMessagePosition: String,
    validationStatus: String,
    value: {},
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
    "update:enableThreeStateBehavior": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:iconSize": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:name": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:text": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:visible": null,
    "update:width": null,
  },
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): CheckBox {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CheckBox;
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxCheckBox = defineComponent(componentConfig);

export default DxCheckBox;
export {
  DxCheckBox
};
import type * as DxCheckBoxTypes from "devextreme/ui/check_box_types";
export { DxCheckBoxTypes };
