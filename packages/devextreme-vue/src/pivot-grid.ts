import PivotGrid, { Properties } from "devextreme/ui/pivot_grid";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

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
const DxPivotGrid = createComponent({
  props: {
    allowExpandAll: Boolean,
    allowFiltering: Boolean,
    allowSorting: Boolean,
    allowSortingBySummary: Boolean,
    dataFieldArea: String,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    encodeHtml: Boolean,
    export: Object,
    fieldChooser: Object,
    fieldPanel: Object,
    headerFilter: Object,
    height: [Function, Number, String],
    hideEmptySummaryCells: Boolean,
    hint: String,
    loadPanel: Object,
    onCellClick: Function,
    onCellPrepared: Function,
    onContentReady: Function,
    onContextMenuPreparing: Function,
    onDisposing: Function,
    onExporting: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    rowHeaderLayout: String,
    rtlEnabled: Boolean,
    scrolling: Object,
    showBorders: Boolean,
    showColumnGrandTotals: Boolean,
    showColumnTotals: Boolean,
    showRowGrandTotals: Boolean,
    showRowTotals: Boolean,
    showTotalsPrior: String,
    stateStoring: Object,
    tabIndex: Number,
    texts: Object,
    visible: Boolean,
    width: [Function, Number, String],
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
});

const DxExport = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
  },
  props: {
    enabled: Boolean
  }
});
(DxExport as any).$_optionName = "export";
const DxFieldChooser = createConfigurationComponent({
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
    applyChangesMode: String,
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
});
(DxFieldChooser as any).$_optionName = "fieldChooser";
(DxFieldChooser as any).$_expectedChildren = {
  fieldChooserTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};
const DxFieldChooserTexts = createConfigurationComponent({
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
(DxFieldChooserTexts as any).$_optionName = "texts";
const DxFieldPanel = createConfigurationComponent({
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
});
(DxFieldPanel as any).$_optionName = "fieldPanel";
(DxFieldPanel as any).$_expectedChildren = {
  fieldPanelTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};
const DxFieldPanelTexts = createConfigurationComponent({
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
});
(DxFieldPanelTexts as any).$_optionName = "texts";
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
const DxLoadPanel = createConfigurationComponent({
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
});
(DxLoadPanel as any).$_optionName = "loadPanel";
const DxPivotGridTexts = createConfigurationComponent({
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
});
(DxPivotGridTexts as any).$_optionName = "texts";
const DxScrolling = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:mode": null,
    "update:useNative": null,
  },
  props: {
    mode: String,
    useNative: [Boolean, String]
  }
});
(DxScrolling as any).$_optionName = "scrolling";
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
const DxStateStoring = createConfigurationComponent({
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
    customLoad: Function,
    customSave: Function,
    enabled: Boolean,
    savingTimeout: Number,
    storageKey: String,
    type: String
  }
});
(DxStateStoring as any).$_optionName = "stateStoring";
const DxTexts = createConfigurationComponent({
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
});
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
