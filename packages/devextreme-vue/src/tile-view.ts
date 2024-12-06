export { ExplicitTypes } from "devextreme/ui/tile_view";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import TileView, { Properties } from "devextreme/ui/tile_view";
import  DataSource from "devextreme/data/data_source";
import {
 dxTileViewItem,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 OptionChangedEvent,
} from "devextreme/ui/tile_view";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 Orientation,
 ScrollbarMode,
} from "devextreme/common";
import { prepareConfigurationComponentConfig } from "./core/index";

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

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    baseItemHeight: Number,
    baseItemWidth: Number,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxTileViewItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    direction: String as PropType<Orientation>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    itemMargin: Number,
    items: Array as PropType<Array<any | dxTileViewItem | string>>,
    itemTemplate: {},
    noDataText: String,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    showScrollbar: String as PropType<ScrollbarMode>,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
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
};

prepareComponentConfig(componentConfig);

const DxTileView = defineComponent(componentConfig);


const DxItemConfig = {
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
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxTileView;
export {
  DxTileView,
  DxItem
};
import type * as DxTileViewTypes from "devextreme/ui/tile_view_types";
export { DxTileViewTypes };
