import SpeedDialAction, { Properties } from "devextreme/ui/speed_dial_action";
import { createComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "hint" |
  "hoverStateEnabled" |
  "icon" |
  "index" |
  "label" |
  "onClick" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "rtlEnabled" |
  "tabIndex" |
  "visible"
>;

interface DxSpeedDialAction extends AccessibleOptions {
  readonly instance?: SpeedDialAction;
}
const DxSpeedDialAction = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    index: Number,
    label: String,
    onClick: Function,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    tabIndex: Number,
    visible: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:icon": null,
    "update:index": null,
    "update:label": null,
    "update:onClick": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:visible": null,
  },
  computed: {
    instance(): SpeedDialAction {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = SpeedDialAction;
    (this as any).$_hasAsyncTemplate = true;
  }
});

export default DxSpeedDialAction;
export {
  DxSpeedDialAction
};
import type * as DxSpeedDialActionTypes from "devextreme/ui/speed_dial_action_types";
export { DxSpeedDialActionTypes };
