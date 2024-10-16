import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import PivotGridFieldChooser, { Properties } from "devextreme/ui/pivot_grid_field_chooser";
import {
 ApplyChangesMode,
} from "devextreme/common/grids";
import {
 FieldChooserLayout,
 SearchMode,
} from "devextreme/common";
import {
 ContentReadyEvent,
 ContextMenuPreparingEvent,
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
} from "devextreme/ui/pivot_grid_field_chooser";
import { prepareConfigurationComponentConfig } from "./core/index";

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

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowSearch: Boolean,
    applyChangesMode: String as PropType<ApplyChangesMode>,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    encodeHtml: Boolean,
    focusStateEnabled: Boolean,
    headerFilter: Object,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    layout: Number as PropType<FieldChooserLayout>,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onContextMenuPreparing: Function as PropType<(e: ContextMenuPreparingEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    rtlEnabled: Boolean,
    searchTimeout: Number,
    state: {},
    tabIndex: Number,
    texts: Object,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      headerFilter: { isCollectionItem: false, optionName: "headerFilter" },
      pivotGridFieldChooserTexts: { isCollectionItem: false, optionName: "texts" },
      texts: { isCollectionItem: false, optionName: "texts" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxPivotGridFieldChooser = defineComponent(componentConfig);


const DxHeaderFilterConfig = {
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
};

prepareConfigurationComponentConfig(DxHeaderFilterConfig);

const DxHeaderFilter = defineComponent(DxHeaderFilterConfig);

(DxHeaderFilter as any).$_optionName = "headerFilter";
(DxHeaderFilter as any).$_expectedChildren = {
  headerFilterTexts: { isCollectionItem: false, optionName: "texts" },
  search: { isCollectionItem: false, optionName: "search" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxHeaderFilterTextsConfig = {
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
};

prepareConfigurationComponentConfig(DxHeaderFilterTextsConfig);

const DxHeaderFilterTexts = defineComponent(DxHeaderFilterTextsConfig);

(DxHeaderFilterTexts as any).$_optionName = "texts";

const DxPivotGridFieldChooserTextsConfig = {
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
};

prepareConfigurationComponentConfig(DxPivotGridFieldChooserTextsConfig);

const DxPivotGridFieldChooserTexts = defineComponent(DxPivotGridFieldChooserTextsConfig);

(DxPivotGridFieldChooserTexts as any).$_optionName = "texts";

const DxSearchConfig = {
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
    mode: String as PropType<SearchMode>,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxSearchConfig);

const DxSearch = defineComponent(DxSearchConfig);

(DxSearch as any).$_optionName = "search";

const DxTextsConfig = {
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
};

prepareConfigurationComponentConfig(DxTextsConfig);

const DxTexts = defineComponent(DxTextsConfig);

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
