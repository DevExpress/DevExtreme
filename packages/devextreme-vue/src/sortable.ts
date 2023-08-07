import Sortable, { Properties } from "devextreme/ui/sortable";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "allowDropInsideItem" |
  "allowReordering" |
  "autoScroll" |
  "boundary" |
  "container" |
  "cursorOffset" |
  "data" |
  "dragDirection" |
  "dragTemplate" |
  "dropFeedbackMode" |
  "elementAttr" |
  "filter" |
  "group" |
  "handle" |
  "height" |
  "itemOrientation" |
  "moveItemOnDrop" |
  "onAdd" |
  "onDisposing" |
  "onDragChange" |
  "onDragEnd" |
  "onDragMove" |
  "onDragStart" |
  "onInitialized" |
  "onOptionChanged" |
  "onRemove" |
  "onReorder" |
  "rtlEnabled" |
  "scrollSensitivity" |
  "scrollSpeed" |
  "width"
>;

interface DxSortable extends AccessibleOptions {
  readonly instance?: Sortable;
}
const DxSortable = createComponent({
  props: {
    allowDropInsideItem: Boolean,
    allowReordering: Boolean,
    autoScroll: Boolean,
    boundary: {},
    container: {},
    cursorOffset: [Object, String],
    data: {},
    dragDirection: String,
    dragTemplate: {},
    dropFeedbackMode: String,
    elementAttr: Object,
    filter: String,
    group: String,
    handle: String,
    height: [Function, Number, String],
    itemOrientation: String,
    moveItemOnDrop: Boolean,
    onAdd: Function,
    onDisposing: Function,
    onDragChange: Function,
    onDragEnd: Function,
    onDragMove: Function,
    onDragStart: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onRemove: Function,
    onReorder: Function,
    rtlEnabled: Boolean,
    scrollSensitivity: Number,
    scrollSpeed: Number,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDropInsideItem": null,
    "update:allowReordering": null,
    "update:autoScroll": null,
    "update:boundary": null,
    "update:container": null,
    "update:cursorOffset": null,
    "update:data": null,
    "update:dragDirection": null,
    "update:dragTemplate": null,
    "update:dropFeedbackMode": null,
    "update:elementAttr": null,
    "update:filter": null,
    "update:group": null,
    "update:handle": null,
    "update:height": null,
    "update:itemOrientation": null,
    "update:moveItemOnDrop": null,
    "update:onAdd": null,
    "update:onDisposing": null,
    "update:onDragChange": null,
    "update:onDragEnd": null,
    "update:onDragMove": null,
    "update:onDragStart": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onRemove": null,
    "update:onReorder": null,
    "update:rtlEnabled": null,
    "update:scrollSensitivity": null,
    "update:scrollSpeed": null,
    "update:width": null,
  },
  computed: {
    instance(): Sortable {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Sortable;
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

export default DxSortable;
export {
  DxSortable,
  DxCursorOffset
};
import type * as DxSortableTypes from "devextreme/ui/sortable_types";
export { DxSortableTypes };
