export { ExplicitTypes } from "devextreme/ui/gallery";
import Gallery, { Properties } from "devextreme/ui/gallery";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

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
const DxGallery = createComponent({
  props: {
    accessKey: String,
    animationDuration: Number,
    animationEnabled: Boolean,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    indicatorEnabled: Boolean,
    initialItemWidth: Number,
    itemHoldTimeout: Number,
    items: Array,
    itemTemplate: {},
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
    width: [Function, Number, String],
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
});

const DxItem = createConfigurationComponent({
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
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxGallery;
export {
  DxGallery,
  DxItem
};
import type * as DxGalleryTypes from "devextreme/ui/gallery_types";
export { DxGalleryTypes };
