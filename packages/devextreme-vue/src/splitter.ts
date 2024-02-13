export { ExplicitTypes } from "devextreme/ui/splitter";
import Splitter, { Properties } from "devextreme/ui/splitter";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "allowKeyboardNavigation" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "height" |
  "hoverStateEnabled" |
  "items" |
  "itemTemplate" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemRendered" |
  "onOptionChanged" |
  "onResize" |
  "onResizeEnd" |
  "onResizeStart" |
  "orientation" |
  "repaintChangesOnly" |
  "resizeMode" |
  "rtlEnabled" |
  "visible" |
  "width"
>;

interface DxSplitter extends AccessibleOptions {
  readonly instance?: Splitter;
}
const DxSplitter = createComponent({
  props: {
    allowKeyboardNavigation: Boolean,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String],
    hoverStateEnabled: Boolean,
    items: Array,
    itemTemplate: {},
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemRendered: Function,
    onOptionChanged: Function,
    onResize: Function,
    onResizeEnd: Function,
    onResizeStart: Function,
    orientation: String,
    repaintChangesOnly: Boolean,
    resizeMode: String,
    rtlEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowKeyboardNavigation": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onResize": null,
    "update:onResizeEnd": null,
    "update:onResizeStart": null,
    "update:orientation": null,
    "update:repaintChangesOnly": null,
    "update:resizeMode": null,
    "update:rtlEnabled": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Splitter {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Splitter;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
});

const DxItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:collapsed": null,
    "update:collapsible": null,
    "update:disabled": null,
    "update:maxSize": null,
    "update:minSize": null,
    "update:resizable": null,
    "update:size": null,
    "update:splitterComponent": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    collapsed: Boolean,
    collapsible: Boolean,
    disabled: Boolean,
    maxSize: [Number, String],
    minSize: [Number, String],
    resizable: Boolean,
    size: [Number, String],
    splitterComponent: Object,
    template: {},
    text: String,
    visible: Boolean
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
(DxItem as any).$_expectedChildren = {
  splitterComponent: { isCollectionItem: false, optionName: "splitterComponent" }
};
const DxSplitterComponent = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowKeyboardNavigation": null,
    "update:bindingOptions": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onResize": null,
    "update:onResizeEnd": null,
    "update:onResizeStart": null,
    "update:orientation": null,
    "update:repaintChangesOnly": null,
    "update:resizeMode": null,
    "update:rtlEnabled": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    allowKeyboardNavigation: Boolean,
    bindingOptions: Object,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String],
    hoverStateEnabled: Boolean,
    items: Array,
    itemTemplate: {},
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemRendered: Function,
    onOptionChanged: Function,
    onResize: Function,
    onResizeEnd: Function,
    onResizeStart: Function,
    orientation: String,
    repaintChangesOnly: Boolean,
    resizeMode: String,
    rtlEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String]
  }
});
(DxSplitterComponent as any).$_optionName = "splitterComponent";

export default DxSplitter;
export {
  DxSplitter,
  DxItem,
  DxSplitterComponent
};
import type * as DxSplitterTypes from "devextreme/ui/splitter_types";
export { DxSplitterTypes };
