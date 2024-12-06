export { ExplicitTypes } from "devextreme/ui/box";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Box, { Properties } from "devextreme/ui/box";
import  DataSource from "devextreme/data/data_source";
import {
 Distribution,
 CrosswiseDistribution,
 dxBoxItem,
 BoxDirection,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 OptionChangedEvent,
 dxBoxOptions,
} from "devextreme/ui/box";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import { prepareConfigurationComponentConfig } from "./core/index";

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

const componentConfig = {
  props: {
    align: String as PropType<Distribution>,
    crossAlign: String as PropType<CrosswiseDistribution>,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxBoxItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    direction: String as PropType<BoxDirection>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any | dxBoxItem | string>>,
    itemTemplate: {},
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
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
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxBox = defineComponent(componentConfig);


const DxItemConfig = {
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
    box: Object as PropType<dxBoxOptions | Record<string, any>>,
    disabled: Boolean,
    html: String,
    ratio: Number,
    shrink: Number,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxBox;
export {
  DxBox,
  DxItem
};
import type * as DxBoxTypes from "devextreme/ui/box_types";
export { DxBoxTypes };
