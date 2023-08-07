export { ExplicitTypes } from "devextreme/ui/tab_panel";
import TabPanel, { Properties } from "devextreme/ui/tab_panel";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "animationEnabled" |
  "dataSource" |
  "deferRendering" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "itemHoldTimeout" |
  "items" |
  "itemTemplate" |
  "itemTitleTemplate" |
  "loop" |
  "noDataText" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemHold" |
  "onItemRendered" |
  "onOptionChanged" |
  "onSelectionChanged" |
  "onTitleClick" |
  "onTitleHold" |
  "onTitleRendered" |
  "repaintChangesOnly" |
  "rtlEnabled" |
  "scrollByContent" |
  "scrollingEnabled" |
  "selectedIndex" |
  "selectedItem" |
  "showNavButtons" |
  "swipeEnabled" |
  "tabIndex" |
  "visible" |
  "width"
>;

interface DxTabPanel extends AccessibleOptions {
  readonly instance?: TabPanel;
}
const DxTabPanel = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animationEnabled: Boolean,
    dataSource: {},
    deferRendering: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array,
    itemTemplate: {},
    itemTitleTemplate: {},
    loop: Boolean,
    noDataText: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemHold: Function,
    onItemRendered: Function,
    onOptionChanged: Function,
    onSelectionChanged: Function,
    onTitleClick: Function,
    onTitleHold: Function,
    onTitleRendered: Function,
    repaintChangesOnly: Boolean,
    rtlEnabled: Boolean,
    scrollByContent: Boolean,
    scrollingEnabled: Boolean,
    selectedIndex: Number,
    selectedItem: {},
    showNavButtons: Boolean,
    swipeEnabled: Boolean,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:animationEnabled": null,
    "update:dataSource": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:itemTitleTemplate": null,
    "update:loop": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:onTitleClick": null,
    "update:onTitleHold": null,
    "update:onTitleRendered": null,
    "update:repaintChangesOnly": null,
    "update:rtlEnabled": null,
    "update:scrollByContent": null,
    "update:scrollingEnabled": null,
    "update:selectedIndex": null,
    "update:selectedItem": null,
    "update:showNavButtons": null,
    "update:swipeEnabled": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): TabPanel {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = TabPanel;
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
    "update:badge": null,
    "update:disabled": null,
    "update:html": null,
    "update:icon": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
  },
  props: {
    badge: String,
    disabled: Boolean,
    html: String,
    icon: String,
    tabTemplate: {},
    template: {},
    text: String,
    title: String
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxTabPanel;
export {
  DxTabPanel,
  DxItem
};
import type * as DxTabPanelTypes from "devextreme/ui/tab_panel_types";
export { DxTabPanelTypes };
