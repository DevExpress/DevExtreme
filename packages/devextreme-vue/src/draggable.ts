import { PropType } from "vue";
import Draggable, { Properties } from "devextreme/ui/draggable";
import { 
DragDirection,
 } from "devextreme/common";
import { 
DisposingEvent,
DragEndEvent,
DragMoveEvent,
DragStartEvent,
InitializedEvent,
OptionChangedEvent,
 } from "devextreme/ui/draggable";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

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

const componentConfig = {
  props: {
    autoScroll: Boolean,
    boundary: {},
    clone: Boolean,
    container: {},
    cursorOffset: [Object, String],
    data: {},
    dragDirection: Object as PropType<DragDirection>,
    dragTemplate: {},
    elementAttr: Object,
    group: String,
    handle: String,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onDragEnd: Function as PropType<(e: DragEndEvent) => void>,
    onDragMove: Function as PropType<(e: DragMoveEvent) => void>,
    onDragStart: Function as PropType<(e: DragStartEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    rtlEnabled: Boolean,
    scrollSensitivity: Number,
    scrollSpeed: Number,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
};

prepareComponentConfig(componentConfig);

const DxDraggable = defineComponent(componentConfig);


const DxCursorOffsetConfig = {
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
};

prepareConfigurationComponentConfig(DxCursorOffsetConfig);

const DxCursorOffset = defineComponent(DxCursorOffsetConfig);

(DxCursorOffset as any).$_optionName = "cursorOffset";

export default DxDraggable;
export {
  DxDraggable,
  DxCursorOffset
};
import type * as DxDraggableTypes from "devextreme/ui/draggable_types";
export { DxDraggableTypes };
