import { PropType } from "vue";
import { defineComponent } from "vue";
import SpeedDialAction, { Properties } from "devextreme/ui/speed_dial_action";
import { prepareComponentConfig } from "./core/index";
import {
 ClickEvent,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
} from "devextreme/ui/speed_dial_action";

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

const componentConfig = {
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
    onClick: Function as PropType<(e: ClickEvent) => void>,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
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
};

prepareComponentConfig(componentConfig);

const DxSpeedDialAction = defineComponent(componentConfig);

export default DxSpeedDialAction;
export {
  DxSpeedDialAction
};
import type * as DxSpeedDialActionTypes from "devextreme/ui/speed_dial_action_types";
export { DxSpeedDialActionTypes };
