export { ExplicitTypes } from "devextreme/ui/accordion";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Accordion, { Properties } from "devextreme/ui/accordion";
import  DataSource from "devextreme/data/data_source";
import {
 dxAccordionItem,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 ItemTitleClickEvent,
 OptionChangedEvent,
 SelectionChangedEvent,
} from "devextreme/ui/accordion";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import { prepareConfigurationComponentConfig } from "./core/index";

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

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animationDuration: Number,
    collapsible: Boolean,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxAccordionItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    deferRendering: Boolean,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any | dxAccordionItem | string>>,
    itemTemplate: {},
    itemTitleTemplate: {},
    keyExpr: [Function, String] as PropType<((() => void)) | string>,
    multiple: Boolean,
    noDataText: String,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onItemTitleClick: Function as PropType<((e: ItemTitleClickEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    repaintChangesOnly: Boolean,
    rtlEnabled: Boolean,
    selectedIndex: Number,
    selectedItem: {},
    selectedItemKeys: Array as PropType<Array<any>>,
    selectedItems: Array as PropType<Array<any>>,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
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
};

prepareComponentConfig(componentConfig);

const DxAccordion = defineComponent(componentConfig);


const DxItemConfig = {
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
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxAccordion;
export {
  DxAccordion,
  DxItem
};
import type * as DxAccordionTypes from "devextreme/ui/accordion_types";
export { DxAccordionTypes };
