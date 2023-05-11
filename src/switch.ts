import Switch, { Properties } from "devextreme/ui/switch";
import { createComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "isValid" |
  "name" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "readOnly" |
  "rtlEnabled" |
  "switchedOffText" |
  "switchedOnText" |
  "tabIndex" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "visible" |
  "width"
>;

interface DxSwitch extends AccessibleOptions {
  readonly instance?: Switch;
}
const DxSwitch = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    isValid: Boolean,
    name: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    switchedOffText: String,
    switchedOnText: String,
    tabIndex: Number,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: String,
    validationMessagePosition: String,
    validationStatus: String,
    value: Boolean,
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
    "update:isValid": null,
    "update:name": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:switchedOffText": null,
    "update:switchedOnText": null,
    "update:tabIndex": null,
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
    instance(): Switch {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Switch;
  }
});

export default DxSwitch;
export {
  DxSwitch
};
import type * as DxSwitchTypes from "devextreme/ui/switch_types";
export { DxSwitchTypes };
