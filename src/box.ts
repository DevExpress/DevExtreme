export { ExplicitTypes } from "devextreme/ui/box";
import Box, { Properties } from "devextreme/ui/box";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "align" |
  "crossAlign" |
  "dataSource" |
  "direction" |
  "disabled" |
  "elementAttr" |
  "height" |
  "hoverStateEnabled" |
  "itemHoldTimeout" |
  "items" |
  "itemTemplate" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemHold" |
  "onItemRendered" |
  "onOptionChanged" |
  "rtlEnabled" |
  "visible" |
  "width"
>;

interface DxBox extends AccessibleOptions {
  readonly instance?: Box;
}
const DxBox = createComponent({
  props: {
    align: String,
    crossAlign: String,
    dataSource: {},
    direction: String,
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String],
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array,
    itemTemplate: {},
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemHold: Function,
    onItemRendered: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:align": null,
    "update:crossAlign": null,
    "update:dataSource": null,
    "update:direction": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hoverStateEnabled": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Box {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Box;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
});

const DxItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:baseSize": null,
    "update:box": null,
    "update:disabled": null,
    "update:html": null,
    "update:ratio": null,
    "update:shrink": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    baseSize: [Number, String],
    box: Object,
    disabled: Boolean,
    html: String,
    ratio: Number,
    shrink: Number,
    template: {},
    text: String,
    visible: Boolean
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxBox;
export {
  DxBox,
  DxItem
};
import type * as DxBoxTypes from "devextreme/ui/box_types";
export { DxBoxTypes };
