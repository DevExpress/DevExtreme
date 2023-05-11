import ProgressBar, { Properties } from "devextreme/ui/progress_bar";
import { createComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "disabled" |
  "elementAttr" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "isValid" |
  "max" |
  "min" |
  "onComplete" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "readOnly" |
  "rtlEnabled" |
  "showStatus" |
  "statusFormat" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "visible" |
  "width"
>;

interface DxProgressBar extends AccessibleOptions {
  readonly instance?: ProgressBar;
}
const DxProgressBar = createComponent({
  props: {
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    isValid: Boolean,
    max: Number,
    min: Number,
    onComplete: Function,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showStatus: Boolean,
    statusFormat: [Function, String],
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
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:isValid": null,
    "update:max": null,
    "update:min": null,
    "update:onComplete": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showStatus": null,
    "update:statusFormat": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): ProgressBar {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = ProgressBar;
  }
});

export default DxProgressBar;
export {
  DxProgressBar
};
import type * as DxProgressBarTypes from "devextreme/ui/progress_bar_types";
export { DxProgressBarTypes };
