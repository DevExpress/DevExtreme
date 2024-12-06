export { ExplicitTypes } from "devextreme/ui/responsive_box";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import ResponsiveBox, { Properties } from "devextreme/ui/responsive_box";
import  DataSource from "devextreme/data/data_source";
import {
 dxResponsiveBoxItem,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 OptionChangedEvent,
} from "devextreme/ui/responsive_box";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "cols" |
  "dataSource" |
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
  "rows" |
  "rtlEnabled" |
  "screenByWidth" |
  "singleColumnScreen" |
  "visible" |
  "width"
>;

interface DxResponsiveBox extends AccessibleOptions {
  readonly instance?: ResponsiveBox;
}

const componentConfig = {
  props: {
    cols: Array as PropType<Array<Record<string, any>>>,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxResponsiveBoxItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any | dxResponsiveBoxItem | string>>,
    itemTemplate: {},
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    rows: Array as PropType<Array<Record<string, any>>>,
    rtlEnabled: Boolean,
    screenByWidth: Function as PropType<(() => void)>,
    singleColumnScreen: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cols": null,
    "update:dataSource": null,
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
    "update:rows": null,
    "update:rtlEnabled": null,
    "update:screenByWidth": null,
    "update:singleColumnScreen": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): ResponsiveBox {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = ResponsiveBox;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      col: { isCollectionItem: true, optionName: "cols" },
      item: { isCollectionItem: true, optionName: "items" },
      row: { isCollectionItem: true, optionName: "rows" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxResponsiveBox = defineComponent(componentConfig);


const DxColConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:baseSize": null,
    "update:ratio": null,
    "update:screen": null,
    "update:shrink": null,
  },
  props: {
    baseSize: [Number, String],
    ratio: Number,
    screen: String,
    shrink: Number
  }
};

prepareConfigurationComponentConfig(DxColConfig);

const DxCol = defineComponent(DxColConfig);

(DxCol as any).$_optionName = "cols";
(DxCol as any).$_isCollectionItem = true;

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:html": null,
    "update:location": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    html: String,
    location: [Array, Object] as PropType<Array<Record<string, any>> | Record<string, any>>,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
(DxItem as any).$_expectedChildren = {
  location: { isCollectionItem: true, optionName: "location" }
};

const DxLocationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:col": null,
    "update:colspan": null,
    "update:row": null,
    "update:rowspan": null,
    "update:screen": null,
  },
  props: {
    col: Number,
    colspan: Number,
    row: Number,
    rowspan: Number,
    screen: String
  }
};

prepareConfigurationComponentConfig(DxLocationConfig);

const DxLocation = defineComponent(DxLocationConfig);

(DxLocation as any).$_optionName = "location";
(DxLocation as any).$_isCollectionItem = true;

const DxRowConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:baseSize": null,
    "update:ratio": null,
    "update:screen": null,
    "update:shrink": null,
  },
  props: {
    baseSize: [Number, String],
    ratio: Number,
    screen: String,
    shrink: Number
  }
};

prepareConfigurationComponentConfig(DxRowConfig);

const DxRow = defineComponent(DxRowConfig);

(DxRow as any).$_optionName = "rows";
(DxRow as any).$_isCollectionItem = true;

export default DxResponsiveBox;
export {
  DxResponsiveBox,
  DxCol,
  DxItem,
  DxLocation,
  DxRow
};
import type * as DxResponsiveBoxTypes from "devextreme/ui/responsive_box_types";
export { DxResponsiveBoxTypes };
