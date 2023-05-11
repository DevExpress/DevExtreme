export { ExplicitTypes } from "devextreme/ui/accordion";
import Accordion, { Properties } from "devextreme/ui/accordion";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "animationDuration" |
  "collapsible" |
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
  "keyExpr" |
  "multiple" |
  "noDataText" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemHold" |
  "onItemRendered" |
  "onItemTitleClick" |
  "onOptionChanged" |
  "onSelectionChanged" |
  "repaintChangesOnly" |
  "rtlEnabled" |
  "selectedIndex" |
  "selectedItem" |
  "selectedItemKeys" |
  "selectedItems" |
  "tabIndex" |
  "visible" |
  "width"
>;

interface DxAccordion extends AccessibleOptions {
  readonly instance?: Accordion;
}
const DxAccordion = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animationDuration: Number,
    collapsible: Boolean,
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
    keyExpr: [Function, String],
    multiple: Boolean,
    noDataText: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemHold: Function,
    onItemRendered: Function,
    onItemTitleClick: Function,
    onOptionChanged: Function,
    onSelectionChanged: Function,
    repaintChangesOnly: Boolean,
    rtlEnabled: Boolean,
    selectedIndex: Number,
    selectedItem: {},
    selectedItemKeys: Array,
    selectedItems: Array,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:animationDuration": null,
    "update:collapsible": null,
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
    "update:keyExpr": null,
    "update:multiple": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onItemTitleClick": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:repaintChangesOnly": null,
    "update:rtlEnabled": null,
    "update:selectedIndex": null,
    "update:selectedItem": null,
    "update:selectedItemKeys": null,
    "update:selectedItems": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Accordion {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Accordion;
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
    "update:html": null,
    "update:icon": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
    "update:titleTemplate": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    html: String,
    icon: String,
    template: {},
    text: String,
    title: String,
    titleTemplate: {},
    visible: Boolean
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxAccordion;
export {
  DxAccordion,
  DxItem
};
import type * as DxAccordionTypes from "devextreme/ui/accordion_types";
export { DxAccordionTypes };
