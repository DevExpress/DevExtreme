export { ExplicitTypes } from "devextreme/ui/gallery";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Gallery, { Properties } from "devextreme/ui/gallery";
import  DataSource from "devextreme/data/data_source";
import {
 dxGalleryItem,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 OptionChangedEvent,
 SelectionChangedEvent,
} from "devextreme/ui/gallery";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "animationDuration" |
  "animationEnabled" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "indicatorEnabled" |
  "initialItemWidth" |
  "itemHoldTimeout" |
  "items" |
  "itemTemplate" |
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
  "rtlEnabled" |
  "selectedIndex" |
  "selectedItem" |
  "showIndicator" |
  "showNavButtons" |
  "slideshowDelay" |
  "stretchImages" |
  "swipeEnabled" |
  "tabIndex" |
  "visible" |
  "width" |
  "wrapAround"
>;

interface DxGallery extends AccessibleOptions {
  readonly instance?: Gallery;
}

const componentConfig = {
  props: {
    accessKey: String,
    animationDuration: Number,
    animationEnabled: Boolean,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxGalleryItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    indicatorEnabled: Boolean,
    initialItemWidth: Number,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any | dxGalleryItem | string>>,
    itemTemplate: {},
    loop: Boolean,
    noDataText: String,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    selectedIndex: Number,
    selectedItem: {},
    showIndicator: Boolean,
    showNavButtons: Boolean,
    slideshowDelay: Number,
    stretchImages: Boolean,
    swipeEnabled: Boolean,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    wrapAround: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:animationDuration": null,
    "update:animationEnabled": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:indicatorEnabled": null,
    "update:initialItemWidth": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemTemplate": null,
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
    "update:rtlEnabled": null,
    "update:selectedIndex": null,
    "update:selectedItem": null,
    "update:showIndicator": null,
    "update:showNavButtons": null,
    "update:slideshowDelay": null,
    "update:stretchImages": null,
    "update:swipeEnabled": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapAround": null,
  },
  computed: {
    instance(): Gallery {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Gallery;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxGallery = defineComponent(componentConfig);


const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:html": null,
    "update:imageAlt": null,
    "update:imageSrc": null,
    "update:template": null,
    "update:text": null,
  },
  props: {
    disabled: Boolean,
    html: String,
    imageAlt: String,
    imageSrc: String,
    template: {},
    text: String
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxGallery;
export {
  DxGallery,
  DxItem
};
import type * as DxGalleryTypes from "devextreme/ui/gallery_types";
export { DxGalleryTypes };
