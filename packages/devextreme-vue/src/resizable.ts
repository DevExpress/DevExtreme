import Resizable, { Properties } from "devextreme/ui/resizable";
import { createComponent } from "./core/index";

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
const DxResizable = createComponent({
  props: {
    area: {},
    elementAttr: Object,
    handles: String,
    height: [Function, Number, String],
    keepAspectRatio: Boolean,
    maxHeight: Number,
    maxWidth: Number,
    minHeight: Number,
    minWidth: Number,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onResize: Function,
    onResizeEnd: Function,
    onResizeStart: Function,
    rtlEnabled: Boolean,
    width: [Function, Number, String]
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
});

export default DxResizable;
export {
  DxResizable
};
import type * as DxResizableTypes from "devextreme/ui/resizable_types";
export { DxResizableTypes };
