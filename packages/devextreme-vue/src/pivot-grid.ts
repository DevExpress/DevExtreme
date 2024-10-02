import { PropType } from "vue";
import PivotGrid, { Properties } from "devextreme/ui/pivot_grid";
import {  CellClickEvent , CellPreparedEvent , ContentReadyEvent , ContextMenuPreparingEvent , DisposingEvent , ExportingEvent , InitializedEvent , OptionChangedEvent ,} from "devextreme/ui/pivot_grid";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "allowExpandAll" |
  "allowFiltering" |
  "allowSorting" |
  "allowSortingBySummary" |
  "dataFieldArea" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "encodeHtml" |
  "export" |
  "fieldChooser" |
  "fieldPanel" |
  "headerFilter" |
  "height" |
  "hideEmptySummaryCells" |
  "hint" |
  "loadPanel" |
  "onCellClick" |
  "onCellPrepared" |
  "onContentReady" |
  "onContextMenuPreparing" |
  "onDisposing" |
  "onExporting" |
  "onInitialized" |
  "onOptionChanged" |
  "rowHeaderLayout" |
  "rtlEnabled" |
  "scrolling" |
  "showBorders" |
  "showColumnGrandTotals" |
  "showColumnTotals" |
  "showRowGrandTotals" |
  "showRowTotals" |
  "showTotalsPrior" |
  "stateStoring" |
  "tabIndex" |
  "texts" |
  "visible" |
  "width" |
  "wordWrapEnabled"
>;

interface DxPivotGrid extends AccessibleOptions {
  readonly instance?: PivotGrid;
}

const componentConfig = {
  props: {
    allowExpandAll: Boolean,
    allowFiltering: Boolean,
    allowSorting: Boolean,
    allowSortingBySummary: Boolean,
    dataFieldArea: String as PropType<"column" | "row">,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    encodeHtml: Boolean,
    export: Object,
    fieldChooser: Object,
    fieldPanel: Object,
    headerFilter: Object,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hideEmptySummaryCells: Boolean,
    hint: String,
    loadPanel: Object,
    onCellClick: Function as PropType<(e: CellClickEvent) => void>,
    onCellPrepared: Function as PropType<(e: CellPreparedEvent) => void>,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onContextMenuPreparing: Function as PropType<(e: ContextMenuPreparingEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onExporting: Function as PropType<(e: ExportingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    rowHeaderLayout: String as PropType<"standard" | "tree">,
    rtlEnabled: Boolean,
    scrolling: Object,
    showBorders: Boolean,
    showColumnGrandTotals: Boolean,
    showColumnTotals: Boolean,
    showRowGrandTotals: Boolean,
    showRowTotals: Boolean,
    showTotalsPrior: String as PropType<"both" | "columns" | "none" | "rows">,
    stateStoring: Object,
    tabIndex: Number,
    texts: Object,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    wordWrapEnabled: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowExpandAll": null,
    "update:allowFiltering": null,
    "update:allowSorting": null,
    "update:allowSortingBySummary": null,
    "update:dataFieldArea": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:encodeHtml": null,
    "update:export": null,
    "update:fieldChooser": null,
    "update:fieldPanel": null,
    "update:headerFilter": null,
    "update:height": null,
    "update:hideEmptySummaryCells": null,
    "update:hint": null,
    "update:loadPanel": null,
    "update:onCellClick": null,
    "update:onCellPrepared": null,
    "update:onContentReady": null,
    "update:onContextMenuPreparing": null,
    "update:onDisposing": null,
    "update:onExporting": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rowHeaderLayout": null,
    "update:rtlEnabled": null,
    "update:scrolling": null,
    "update:showBorders": null,
    "update:showColumnGrandTotals": null,
    "update:showColumnTotals": null,
    "update:showRowGrandTotals": null,
    "update:showRowTotals": null,
    "update:showTotalsPrior": null,
    "update:stateStoring": null,
    "update:tabIndex": null,
    "update:texts": null,
    "update:visible": null,
    "update:width": null,
    "update:wordWrapEnabled": null,
  },
  computed: {
    instance(): PivotGrid {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = PivotGrid;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      export: { isCollectionItem: false, optionName: "export" },
      fieldChooser: { isCollectionItem: false, optionName: "fieldChooser" },
      fieldPanel: { isCollectionItem: false, optionName: "fieldPanel" },
      headerFilter: { isCollectionItem: false, optionName: "headerFilter" },
      loadPanel: { isCollectionItem: false, optionName: "loadPanel" },
      pivotGridTexts: { isCollectionItem: false, optionName: "texts" },
      scrolling: { isCollectionItem: false, optionName: "scrolling" },
      stateStoring: { isCollectionItem: false, optionName: "stateStoring" },
      texts: { isCollectionItem: false, optionName: "texts" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxPivotGrid = defineComponent(componentConfig);


const DxExportConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
  },
  props: {
    enabled: Boolean
  }
};

prepareConfigurationComponentConfig(DxExportConfig);

const DxExport = defineComponent(DxExportConfig);

(DxExport as any).$_optionName = "export";

const DxFieldChooserConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:applyChangesMode": null,
    "update:enabled": null,
    "update:height": null,
    "update:layout": null,
    "update:searchTimeout": null,
    "update:texts": null,
    "update:title": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    applyChangesMode: String as PropType<"instantly" | "onDemand">,
    enabled: Boolean,
    height: Number,
    layout: {
      type: Number,
      validator: (v) => typeof(v) !== "number" || [
        0,
        1,
        2
      ].indexOf(v) !== -1
    },
    searchTimeout: Number,
    texts: Object,
    title: String,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxFieldChooserConfig);

const DxFieldChooser = defineComponent(DxFieldChooserConfig);

(DxFieldChooser as any).$_optionName = "fieldChooser";
(DxFieldChooser as any).$_expectedChildren = {
  fieldChooserTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxFieldChooserTextsConfig = {
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

prepareConfigurationComponentConfig(DxFieldChooserTextsConfig);

const DxFieldChooserTexts = defineComponent(DxFieldChooserTextsConfig);

(DxFieldChooserTexts as any).$_optionName = "texts";

const DxFieldPanelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowFieldDragging": null,
    "update:showColumnFields": null,
    "update:showDataFields": null,
    "update:showFilterFields": null,
    "update:showRowFields": null,
    "update:texts": null,
    "update:visible": null,
  },
  props: {
    allowFieldDragging: Boolean,
    showColumnFields: Boolean,
    showDataFields: Boolean,
    showFilterFields: Boolean,
    showRowFields: Boolean,
    texts: Object,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxFieldPanelConfig);

const DxFieldPanel = defineComponent(DxFieldPanelConfig);

(DxFieldPanel as any).$_optionName = "fieldPanel";
(DxFieldPanel as any).$_expectedChildren = {
  fieldPanelTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxFieldPanelTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:columnFieldArea": null,
    "update:dataFieldArea": null,
    "update:filterFieldArea": null,
    "update:rowFieldArea": null,
  },
  props: {
    columnFieldArea: String,
    dataFieldArea: String,
    filterFieldArea: String,
    rowFieldArea: String
  }
};

prepareConfigurationComponentConfig(DxFieldPanelTextsConfig);

const DxFieldPanelTexts = defineComponent(DxFieldPanelTextsConfig);

(DxFieldPanelTexts as any).$_optionName = "texts";

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

const DxLoadPanelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:height": null,
    "update:indicatorSrc": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showIndicator": null,
    "update:showPane": null,
    "update:text": null,
    "update:width": null,
  },
  props: {
    enabled: Boolean,
    height: Number,
    indicatorSrc: String,
    shading: Boolean,
    shadingColor: String,
    showIndicator: Boolean,
    showPane: Boolean,
    text: String,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxLoadPanelConfig);

const DxLoadPanel = defineComponent(DxLoadPanelConfig);

(DxLoadPanel as any).$_optionName = "loadPanel";

const DxPivotGridTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:collapseAll": null,
    "update:dataNotAvailable": null,
    "update:expandAll": null,
    "update:exportToExcel": null,
    "update:grandTotal": null,
    "update:noData": null,
    "update:removeAllSorting": null,
    "update:showFieldChooser": null,
    "update:sortColumnBySummary": null,
    "update:sortRowBySummary": null,
    "update:total": null,
  },
  props: {
    collapseAll: String,
    dataNotAvailable: String,
    expandAll: String,
    exportToExcel: String,
    grandTotal: String,
    noData: String,
    removeAllSorting: String,
    showFieldChooser: String,
    sortColumnBySummary: String,
    sortRowBySummary: String,
    total: String
  }
};

prepareConfigurationComponentConfig(DxPivotGridTextsConfig);

const DxPivotGridTexts = defineComponent(DxPivotGridTextsConfig);

(DxPivotGridTexts as any).$_optionName = "texts";

const DxScrollingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:mode": null,
    "update:useNative": null,
  },
  props: {
    mode: String as PropType<"standard" | "virtual">,
    useNative: [Boolean, String] as PropType<Boolean | "auto">
  }
};

prepareConfigurationComponentConfig(DxScrollingConfig);

const DxScrolling = defineComponent(DxScrollingConfig);

(DxScrolling as any).$_optionName = "scrolling";

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
    mode: String as PropType<"contains" | "startswith" | "equals">,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxSearchConfig);

const DxSearch = defineComponent(DxSearchConfig);

(DxSearch as any).$_optionName = "search";

const DxStateStoringConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customLoad": null,
    "update:customSave": null,
    "update:enabled": null,
    "update:savingTimeout": null,
    "update:storageKey": null,
    "update:type": null,
  },
  props: {
    customLoad: Function as PropType<() => any>,
    customSave: Function as PropType<(state: Object) => void>,
    enabled: Boolean,
    savingTimeout: Number,
    storageKey: String,
    type: String as PropType<"custom" | "localStorage" | "sessionStorage">
  }
};

prepareConfigurationComponentConfig(DxStateStoringConfig);

const DxStateStoring = defineComponent(DxStateStoringConfig);

(DxStateStoring as any).$_optionName = "stateStoring";

const DxTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allFields": null,
    "update:cancel": null,
    "update:collapseAll": null,
    "update:columnFieldArea": null,
    "update:columnFields": null,
    "update:dataFieldArea": null,
    "update:dataFields": null,
    "update:dataNotAvailable": null,
    "update:emptyValue": null,
    "update:expandAll": null,
    "update:exportToExcel": null,
    "update:filterFieldArea": null,
    "update:filterFields": null,
    "update:grandTotal": null,
    "update:noData": null,
    "update:ok": null,
    "update:removeAllSorting": null,
    "update:rowFieldArea": null,
    "update:rowFields": null,
    "update:showFieldChooser": null,
    "update:sortColumnBySummary": null,
    "update:sortRowBySummary": null,
    "update:total": null,
  },
  props: {
    allFields: String,
    cancel: String,
    collapseAll: String,
    columnFieldArea: String,
    columnFields: String,
    dataFieldArea: String,
    dataFields: String,
    dataNotAvailable: String,
    emptyValue: String,
    expandAll: String,
    exportToExcel: String,
    filterFieldArea: String,
    filterFields: String,
    grandTotal: String,
    noData: String,
    ok: String,
    removeAllSorting: String,
    rowFieldArea: String,
    rowFields: String,
    showFieldChooser: String,
    sortColumnBySummary: String,
    sortRowBySummary: String,
    total: String
  }
};

prepareConfigurationComponentConfig(DxTextsConfig);

const DxTexts = defineComponent(DxTextsConfig);

(DxTexts as any).$_optionName = "texts";

export default DxPivotGrid;
export {
  DxPivotGrid,
  DxExport,
  DxFieldChooser,
  DxFieldChooserTexts,
  DxFieldPanel,
  DxFieldPanelTexts,
  DxHeaderFilter,
  DxHeaderFilterTexts,
  DxLoadPanel,
  DxPivotGridTexts,
  DxScrolling,
  DxSearch,
  DxStateStoring,
  DxTexts
};
import type * as DxPivotGridTypes from "devextreme/ui/pivot_grid_types";
export { DxPivotGridTypes };
