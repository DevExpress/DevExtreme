import PivotGridFieldChooser, { Properties } from "devextreme/ui/pivot_grid_field_chooser";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowSearch" |
  "applyChangesMode" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "encodeHtml" |
  "focusStateEnabled" |
  "headerFilter" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "layout" |
  "onContentReady" |
  "onContextMenuPreparing" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "rtlEnabled" |
  "searchTimeout" |
  "state" |
  "tabIndex" |
  "texts" |
  "visible" |
  "width"
>;

interface DxPivotGridFieldChooser extends AccessibleOptions {
  readonly instance?: PivotGridFieldChooser;
}
const DxPivotGridFieldChooser = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowSearch: Boolean,
    applyChangesMode: String,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    encodeHtml: Boolean,
    focusStateEnabled: Boolean,
    headerFilter: Object,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    layout: {
      type: Number,
      validator: (v) => typeof(v) !== "number" || [
        0,
        1,
        2
      ].indexOf(v) !== -1
    },
    onContentReady: Function,
    onContextMenuPreparing: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    searchTimeout: Number,
    state: {},
    tabIndex: Number,
    texts: Object,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowSearch": null,
    "update:applyChangesMode": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:encodeHtml": null,
    "update:focusStateEnabled": null,
    "update:headerFilter": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:layout": null,
    "update:onContentReady": null,
    "update:onContextMenuPreparing": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:searchTimeout": null,
    "update:state": null,
    "update:tabIndex": null,
    "update:texts": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): PivotGridFieldChooser {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = PivotGridFieldChooser;
    (this as any).$_expectedChildren = {
      headerFilter: { isCollectionItem: false, optionName: "headerFilter" },
      pivotGridFieldChooserTexts: { isCollectionItem: false, optionName: "texts" },
      texts: { isCollectionItem: false, optionName: "texts" }
    };
  }
});

const DxHeaderFilter = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:height": null,
    "update:search": null,
    "update:searchTimeout": null,
    "update:showRelevantValues": null,
    "update:texts": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    height: Number,
    search: Object,
    searchTimeout: Number,
    showRelevantValues: Boolean,
    texts: Object,
    width: Number
  }
});
(DxHeaderFilter as any).$_optionName = "headerFilter";
(DxHeaderFilter as any).$_expectedChildren = {
  headerFilterTexts: { isCollectionItem: false, optionName: "texts" },
  search: { isCollectionItem: false, optionName: "search" },
  texts: { isCollectionItem: false, optionName: "texts" }
};
const DxHeaderFilterTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cancel": null,
    "update:emptyValue": null,
    "update:ok": null,
  },
  props: {
    cancel: String,
    emptyValue: String,
    ok: String
  }
});
(DxHeaderFilterTexts as any).$_optionName = "texts";
const DxPivotGridFieldChooserTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allFields": null,
    "update:columnFields": null,
    "update:dataFields": null,
    "update:filterFields": null,
    "update:rowFields": null,
  },
  props: {
    allFields: String,
    columnFields: String,
    dataFields: String,
    filterFields: String,
    rowFields: String
  }
});
(DxPivotGridFieldChooserTexts as any).$_optionName = "texts";
const DxSearch = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:mode": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    mode: String,
    timeout: Number
  }
});
(DxSearch as any).$_optionName = "search";
const DxTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allFields": null,
    "update:cancel": null,
    "update:columnFields": null,
    "update:dataFields": null,
    "update:emptyValue": null,
    "update:filterFields": null,
    "update:ok": null,
    "update:rowFields": null,
  },
  props: {
    allFields: String,
    cancel: String,
    columnFields: String,
    dataFields: String,
    emptyValue: String,
    filterFields: String,
    ok: String,
    rowFields: String
  }
});
(DxTexts as any).$_optionName = "texts";

export default DxPivotGridFieldChooser;
export {
  DxPivotGridFieldChooser,
  DxHeaderFilter,
  DxHeaderFilterTexts,
  DxPivotGridFieldChooserTexts,
  DxSearch,
  DxTexts
};
import type * as DxPivotGridFieldChooserTypes from "devextreme/ui/pivot_grid_field_chooser_types";
export { DxPivotGridFieldChooserTypes };
