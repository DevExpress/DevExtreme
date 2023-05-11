import Draggable, { Properties } from "devextreme/ui/draggable";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "autoScroll" |
  "boundary" |
  "clone" |
  "container" |
  "cursorOffset" |
  "data" |
  "dragDirection" |
  "dragTemplate" |
  "elementAttr" |
  "group" |
  "handle" |
  "height" |
  "onDisposing" |
  "onDragEnd" |
  "onDragMove" |
  "onDragStart" |
  "onInitialized" |
  "onOptionChanged" |
  "rtlEnabled" |
  "scrollSensitivity" |
  "scrollSpeed" |
  "width"
>;

interface DxDraggable extends AccessibleOptions {
  readonly instance?: Draggable;
}
const DxDraggable = createComponent({
  props: {
    autoScroll: Boolean,
    boundary: {},
    clone: Boolean,
    container: {},
    cursorOffset: [Object, String],
    data: {},
    dragDirection: String,
    dragTemplate: {},
    elementAttr: Object,
    group: String,
    handle: String,
    height: [Function, Number, String],
    onDisposing: Function,
    onDragEnd: Function,
    onDragMove: Function,
    onDragStart: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    scrollSensitivity: Number,
    scrollSpeed: Number,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:autoScroll": null,
    "update:boundary": null,
    "update:clone": null,
    "update:container": null,
    "update:cursorOffset": null,
    "update:data": null,
    "update:dragDirection": null,
    "update:dragTemplate": null,
    "update:elementAttr": null,
    "update:group": null,
    "update:handle": null,
    "update:height": null,
    "update:onDisposing": null,
    "update:onDragEnd": null,
    "update:onDragMove": null,
    "update:onDragStart": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:scrollSensitivity": null,
    "update:scrollSpeed": null,
    "update:width": null,
  },
  computed: {
    instance(): Draggable {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Draggable;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      cursorOffset: { isCollectionItem: false, optionName: "cursorOffset" }
    };
  }
});

const DxCursorOffset = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
});
(DxCursorOffset as any).$_optionName = "cursorOffset";

export default DxDraggable;
export {
  DxDraggable,
  DxCursorOffset
};
import type * as DxDraggableTypes from "devextreme/ui/draggable_types";
export { DxDraggableTypes };
