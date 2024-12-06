import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Drawer, { Properties } from "devextreme/ui/drawer";
import {
 event,
} from "devextreme/events/events.types";
import {
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
 OpenedStateMode,
 PanelLocation,
 RevealMode,
} from "devextreme/ui/drawer";

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
    closeOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    maxSize: Number,
    minSize: Number,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    opened: Boolean,
    openedStateMode: String as PropType<OpenedStateMode>,
    position: String as PropType<PanelLocation>,
    revealMode: String as PropType<RevealMode>,
    rtlEnabled: Boolean,
    shading: Boolean,
    template: {},
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
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
