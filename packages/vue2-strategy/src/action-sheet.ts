export { ExplicitTypes } from "devextreme/ui/action_sheet";
import ActionSheet, { Properties } from "devextreme/ui/action_sheet";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

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
const DxActionSheet = createComponent({
  props: {
    cancelText: String,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array,
    itemTemplate: {},
    onCancelClick: Function,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemHold: Function,
    onItemRendered: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    showCancelButton: Boolean,
    showTitle: Boolean,
    target: {},
    title: String,
    usePopover: Boolean,
    visible: Boolean,
    width: [Function, Number, String]
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
    onClick: Function,
    stylingMode: String,
    template: {},
    text: String,
    type: String
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxActionSheet;
export {
  DxActionSheet,
  DxItem
};
import type * as DxActionSheetTypes from "devextreme/ui/action_sheet_types";
export { DxActionSheetTypes };
