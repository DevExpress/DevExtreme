import { PropType } from "vue";
import Resizable, { Properties } from "devextreme/ui/resizable";
import {  DisposingEvent , InitializedEvent , OptionChangedEvent , ResizeEvent , ResizeEndEvent , ResizeStartEvent ,} from "devextreme/ui/resizable";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "area" |
  "elementAttr" |
  "handles" |
  "height" |
  "keepAspectRatio" |
  "maxHeight" |
  "maxWidth" |
  "minHeight" |
  "minWidth" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onResize" |
  "onResizeEnd" |
  "onResizeStart" |
  "rtlEnabled" |
  "width"
>;

interface DxResizable extends AccessibleOptions {
  readonly instance?: Resizable;
}

const componentConfig = {
  props: {
    area: {},
    elementAttr: Object,
    handles: {},
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    keepAspectRatio: Boolean,
    maxHeight: Number,
    maxWidth: Number,
    minHeight: Number,
    minWidth: Number,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onResize: Function as PropType<(e: ResizeEvent) => void>,
    onResizeEnd: Function as PropType<(e: ResizeEndEvent) => void>,
    onResizeStart: Function as PropType<(e: ResizeStartEvent) => void>,
    rtlEnabled: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:area": null,
    "update:elementAttr": null,
    "update:handles": null,
    "update:height": null,
    "update:keepAspectRatio": null,
    "update:maxHeight": null,
    "update:maxWidth": null,
    "update:minHeight": null,
    "update:minWidth": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onResize": null,
    "update:onResizeEnd": null,
    "update:onResizeStart": null,
    "update:rtlEnabled": null,
    "update:width": null,
  },
  computed: {
    instance(): Resizable {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Resizable;
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxResizable = defineComponent(componentConfig);

export default DxResizable;
export {
  DxResizable
};
import type * as DxResizableTypes from "devextreme/ui/resizable_types";
export { DxResizableTypes };
