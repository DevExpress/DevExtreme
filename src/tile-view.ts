export { ExplicitTypes } from "devextreme/ui/tile_view";
import TileView, { Properties } from "devextreme/ui/tile_view";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "baseItemHeight" |
  "baseItemWidth" |
  "dataSource" |
  "direction" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "itemHoldTimeout" |
  "itemMargin" |
  "items" |
  "itemTemplate" |
  "noDataText" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemHold" |
  "onItemRendered" |
  "onOptionChanged" |
  "rtlEnabled" |
  "showScrollbar" |
  "tabIndex" |
  "visible" |
  "width"
>;

interface DxTileView extends AccessibleOptions {
  readonly instance?: TileView;
}
const DxTileView = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    baseItemHeight: Number,
    baseItemWidth: Number,
    dataSource: {},
    direction: String,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    itemMargin: Number,
    items: Array,
    itemTemplate: {},
    noDataText: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemHold: Function,
    onItemRendered: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    showScrollbar: String,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:baseItemHeight": null,
    "update:baseItemWidth": null,
    "update:dataSource": null,
    "update:direction": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:itemHoldTimeout": null,
    "update:itemMargin": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:showScrollbar": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): TileView {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = TileView;
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
    "update:disabled": null,
    "update:heightRatio": null,
    "update:html": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widthRatio": null,
  },
  props: {
    disabled: Boolean,
    heightRatio: Number,
    html: String,
    template: {},
    text: String,
    visible: Boolean,
    widthRatio: Number
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxTileView;
export {
  DxTileView,
  DxItem
};
import type * as DxTileViewTypes from "devextreme/ui/tile_view_types";
export { DxTileViewTypes };
