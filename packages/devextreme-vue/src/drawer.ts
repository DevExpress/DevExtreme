import Drawer, { Properties } from "devextreme/ui/drawer";
import { createComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "activeStateEnabled" |
  "animationDuration" |
  "animationEnabled" |
  "closeOnOutsideClick" |
  "disabled" |
  "elementAttr" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "maxSize" |
  "minSize" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "opened" |
  "openedStateMode" |
  "position" |
  "revealMode" |
  "rtlEnabled" |
  "shading" |
  "template" |
  "visible" |
  "width"
>;

interface DxDrawer extends AccessibleOptions {
  readonly instance?: Drawer;
}
const DxDrawer = createComponent({
  props: {
    activeStateEnabled: Boolean,
    animationDuration: Number,
    animationEnabled: Boolean,
    closeOnOutsideClick: [Boolean, Function],
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    maxSize: Number,
    minSize: Number,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    opened: Boolean,
    openedStateMode: String,
    position: String,
    revealMode: String,
    rtlEnabled: Boolean,
    shading: Boolean,
    template: {},
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:activeStateEnabled": null,
    "update:animationDuration": null,
    "update:animationEnabled": null,
    "update:closeOnOutsideClick": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:maxSize": null,
    "update:minSize": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:opened": null,
    "update:openedStateMode": null,
    "update:position": null,
    "update:revealMode": null,
    "update:rtlEnabled": null,
    "update:shading": null,
    "update:template": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Drawer {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Drawer;
    (this as any).$_hasAsyncTemplate = true;
  }
});

export default DxDrawer;
export {
  DxDrawer
};
import type * as DxDrawerTypes from "devextreme/ui/drawer_types";
export { DxDrawerTypes };
