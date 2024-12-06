export { ExplicitTypes } from "devextreme/ui/action_sheet";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import ActionSheet, { Properties } from "devextreme/ui/action_sheet";
import  DataSource from "devextreme/data/data_source";
import {
 dxActionSheetItem,
 CancelClickEvent,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 OptionChangedEvent,
} from "devextreme/ui/action_sheet";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 NativeEventInfo,
} from "devextreme/common/core/events";
import {
 ButtonStyle,
 ButtonType,
} from "devextreme/common";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "cancelText" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "itemHoldTimeout" |
  "items" |
  "itemTemplate" |
  "onCancelClick" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemHold" |
  "onItemRendered" |
  "onOptionChanged" |
  "rtlEnabled" |
  "showCancelButton" |
  "showTitle" |
  "target" |
  "title" |
  "usePopover" |
  "visible" |
  "width"
>;

interface DxActionSheet extends AccessibleOptions {
  readonly instance?: ActionSheet;
}

const componentConfig = {
  props: {
    cancelText: String,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxActionSheetItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any | dxActionSheetItem | string>>,
    itemTemplate: {},
    onCancelClick: Function as PropType<((e: CancelClickEvent) => void)>,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    showCancelButton: Boolean,
    showTitle: Boolean,
    target: {},
    title: String,
    usePopover: Boolean,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cancelText": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:onCancelClick": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:showCancelButton": null,
    "update:showTitle": null,
    "update:target": null,
    "update:title": null,
    "update:usePopover": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): ActionSheet {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = ActionSheet;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxActionSheet = defineComponent(componentConfig);


const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:icon": null,
    "update:onClick": null,
    "update:stylingMode": null,
    "update:template": null,
    "update:text": null,
    "update:type": null,
  },
  props: {
    disabled: Boolean,
    icon: String,
    onClick: Function as PropType<((e: NativeEventInfo<any>) => void)>,
    stylingMode: String as PropType<ButtonStyle>,
    template: {},
    text: String,
    type: String as PropType<ButtonType>
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxActionSheet;
export {
  DxActionSheet,
  DxItem
};
import type * as DxActionSheetTypes from "devextreme/ui/action_sheet_types";
export { DxActionSheetTypes };
