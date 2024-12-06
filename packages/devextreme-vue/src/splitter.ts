export { ExplicitTypes } from "devextreme/ui/splitter";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Splitter, { Properties } from "devextreme/ui/splitter";
import  DataSource from "devextreme/data/data_source";
import {
 dxSplitterItem,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemCollapsedEvent,
 ItemContextMenuEvent,
 ItemExpandedEvent,
 ItemRenderedEvent,
 OptionChangedEvent,
 ResizeEvent,
 ResizeEndEvent,
 ResizeStartEvent,
 dxSplitterOptions,
} from "devextreme/ui/splitter";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 Orientation,
} from "devextreme/common";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "allowKeyboardNavigation" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "height" |
  "hoverStateEnabled" |
  "items" |
  "itemTemplate" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemCollapsed" |
  "onItemContextMenu" |
  "onItemExpanded" |
  "onItemRendered" |
  "onOptionChanged" |
  "onResize" |
  "onResizeEnd" |
  "onResizeStart" |
  "orientation" |
  "rtlEnabled" |
  "separatorSize" |
  "visible" |
  "width"
>;

interface DxSplitter extends AccessibleOptions {
  readonly instance?: Splitter;
}

const componentConfig = {
  props: {
    allowKeyboardNavigation: Boolean,
    dataSource: [Array, Object, String] as PropType<Array<dxSplitterItem> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hoverStateEnabled: Boolean,
    items: Array as PropType<Array<dxSplitterItem>>,
    itemTemplate: {},
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemCollapsed: Function as PropType<((e: ItemCollapsedEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemExpanded: Function as PropType<((e: ItemExpandedEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onResize: Function as PropType<((e: ResizeEvent) => void)>,
    onResizeEnd: Function as PropType<((e: ResizeEndEvent) => void)>,
    onResizeStart: Function as PropType<((e: ResizeStartEvent) => void)>,
    orientation: String as PropType<Orientation>,
    rtlEnabled: Boolean,
    separatorSize: Number,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowKeyboardNavigation": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemCollapsed": null,
    "update:onItemContextMenu": null,
    "update:onItemExpanded": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onResize": null,
    "update:onResizeEnd": null,
    "update:onResizeStart": null,
    "update:orientation": null,
    "update:rtlEnabled": null,
    "update:separatorSize": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Splitter {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Splitter;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxSplitter = defineComponent(componentConfig);


const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:collapsed": null,
    "update:collapsedSize": null,
    "update:collapsible": null,
    "update:maxSize": null,
    "update:minSize": null,
    "update:resizable": null,
    "update:size": null,
    "update:splitter": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    collapsed: Boolean,
    collapsedSize: [Number, String],
    collapsible: Boolean,
    maxSize: [Number, String],
    minSize: [Number, String],
    resizable: Boolean,
    size: [Number, String],
    splitter: Object as PropType<dxSplitterOptions | Record<string, any>>,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxSplitter;
export {
  DxSplitter,
  DxItem
};
import type * as DxSplitterTypes from "devextreme/ui/splitter_types";
export { DxSplitterTypes };
