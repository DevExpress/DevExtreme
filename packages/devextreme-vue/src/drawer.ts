import { PropType } from "vue";
import Drawer, { Properties } from "devextreme/ui/drawer";
import { 
DisposingEvent,
InitializedEvent,
OptionChangedEvent,
 } from "devextreme/ui/drawer";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";

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

const componentConfig = {
  props: {
    activeStateEnabled: Boolean,
    animationDuration: Number,
    animationEnabled: Boolean,
    closeOnOutsideClick: [Boolean, Function] as PropType<Boolean | ((event: Object) => Boolean)>,
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    maxSize: Number,
    minSize: Number,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    opened: Boolean,
    openedStateMode: String as PropType<"overlap" | "shrink" | "push">,
    position: String as PropType<"left" | "right" | "top" | "bottom" | "before" | "after">,
    revealMode: String as PropType<"slide" | "expand">,
    rtlEnabled: Boolean,
    shading: Boolean,
    template: {},
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
};

prepareComponentConfig(componentConfig);

const DxDrawer = defineComponent(componentConfig);

export default DxDrawer;
export {
  DxDrawer
};
import type * as DxDrawerTypes from "devextreme/ui/drawer_types";
export { DxDrawerTypes };
