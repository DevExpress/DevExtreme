export { ExplicitTypes } from "devextreme/ui/box";
import { PropType } from "vue";
import Box, { Properties } from "devextreme/ui/box";
import {  ContentReadyEvent , DisposingEvent , InitializedEvent , ItemClickEvent , ItemContextMenuEvent , ItemHoldEvent , ItemRenderedEvent , OptionChangedEvent ,} from "devextreme/ui/box";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
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
    align: String as PropType<"center" | "end" | "space-around" | "space-between" | "start">,
    crossAlign: String as PropType<"center" | "end" | "start" | "stretch">,
    dataSource: {},
    direction: String as PropType<"col" | "row">,
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String] as PropType<(() => (Number | string)) | (Number) | (String)>,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array as PropType<any[]>,
    itemTemplate: {},
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onItemClick: Function as PropType<(e: ItemClickEvent) => void>,
    onItemContextMenu: Function as PropType<(e: ItemContextMenuEvent) => void>,
    onItemHold: Function as PropType<(e: ItemHoldEvent) => void>,
    onItemRendered: Function as PropType<(e: ItemRenderedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    rtlEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (Number | string)) | (Number) | (String)>
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
    box: Object,
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
