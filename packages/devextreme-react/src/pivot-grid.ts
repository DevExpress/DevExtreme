"use client"
import dxPivotGrid, {
    Properties
} from "devextreme/ui/pivot_grid";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { CellClickEvent, CellPreparedEvent, ContentReadyEvent, ContextMenuPreparingEvent, DisposingEvent, ExportingEvent, InitializedEvent } from "devextreme/ui/pivot_grid";
import type { HeaderFilterSearchConfig } from "devextreme/common/grids";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IPivotGridOptionsNarrowedEvents = {
  onCellClick?: ((e: CellClickEvent) => void);
  onCellPrepared?: ((e: CellPreparedEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onExporting?: ((e: ExportingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type IPivotGridOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IPivotGridOptionsNarrowedEvents> & IHtmlOptions>

class PivotGrid extends BaseComponent<React.PropsWithChildren<IPivotGridOptions>> {

  public get instance(): dxPivotGrid {
    return this._instance;
  }

  protected _WidgetClass = dxPivotGrid;

  protected independentEvents = ["onCellClick","onCellPrepared","onContentReady","onContextMenuPreparing","onDisposing","onExporting","onInitialized"];

  protected _expectedChildren = {
    export: { optionName: "export", isCollectionItem: false },
    fieldChooser: { optionName: "fieldChooser", isCollectionItem: false },
    fieldPanel: { optionName: "fieldPanel", isCollectionItem: false },
    headerFilter: { optionName: "headerFilter", isCollectionItem: false },
    loadPanel: { optionName: "loadPanel", isCollectionItem: false },
    pivotGridTexts: { optionName: "texts", isCollectionItem: false },
    scrolling: { optionName: "scrolling", isCollectionItem: false },
    stateStoring: { optionName: "stateStoring", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}
(PivotGrid as any).propTypes = {
  allowExpandAll: PropTypes.bool,
  allowFiltering: PropTypes.bool,
  allowSorting: PropTypes.bool,
  allowSortingBySummary: PropTypes.bool,
  dataFieldArea: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "column",
      "row"])
  ]),
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  encodeHtml: PropTypes.bool,
  export: PropTypes.object,
  fieldChooser: PropTypes.object,
  fieldPanel: PropTypes.object,
  headerFilter: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hideEmptySummaryCells: PropTypes.bool,
  hint: PropTypes.string,
  loadPanel: PropTypes.object,
  onCellClick: PropTypes.func,
  onCellPrepared: PropTypes.func,
  onContentReady: PropTypes.func,
  onContextMenuPreparing: PropTypes.func,
  onDisposing: PropTypes.func,
  onExporting: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rowHeaderLayout: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "standard",
      "tree"])
  ]),
  rtlEnabled: PropTypes.bool,
  scrolling: PropTypes.object,
  showBorders: PropTypes.bool,
  showColumnGrandTotals: PropTypes.bool,
  showColumnTotals: PropTypes.bool,
  showRowGrandTotals: PropTypes.bool,
  showRowTotals: PropTypes.bool,
  showTotalsPrior: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "both",
      "columns",
      "none",
      "rows"])
  ]),
  stateStoring: PropTypes.object,
  tabIndex: PropTypes.number,
  texts: PropTypes.object,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  wordWrapEnabled: PropTypes.bool
};


// owners:
// PivotGrid
type IExportProps = React.PropsWithChildren<{
  enabled?: boolean;
}>
class Export extends NestedOption<IExportProps> {
  public static OptionName = "export";
}

// owners:
// PivotGrid
type IFieldChooserProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  applyChangesMode?: "instantly" | "onDemand";
  enabled?: boolean;
  height?: number;
  layout?: 0 | 1 | 2;
  searchTimeout?: number;
  texts?: Record<string, any> | {
    allFields?: string;
    columnFields?: string;
    dataFields?: string;
    filterFields?: string;
    rowFields?: string;
  };
  title?: string;
  width?: number;
}>
class FieldChooser extends NestedOption<IFieldChooserProps> {
  public static OptionName = "fieldChooser";
  public static ExpectedChildren = {
    fieldChooserTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// FieldChooser
type IFieldChooserTextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>
class FieldChooserTexts extends NestedOption<IFieldChooserTextsProps> {
  public static OptionName = "texts";
}

// owners:
// PivotGrid
type IFieldPanelProps = React.PropsWithChildren<{
  allowFieldDragging?: boolean;
  showColumnFields?: boolean;
  showDataFields?: boolean;
  showFilterFields?: boolean;
  showRowFields?: boolean;
  texts?: Record<string, any> | {
    columnFieldArea?: string;
    dataFieldArea?: string;
    filterFieldArea?: string;
    rowFieldArea?: string;
  };
  visible?: boolean;
}>
class FieldPanel extends NestedOption<IFieldPanelProps> {
  public static OptionName = "fieldPanel";
  public static ExpectedChildren = {
    fieldPanelTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// FieldPanel
type IFieldPanelTextsProps = React.PropsWithChildren<{
  columnFieldArea?: string;
  dataFieldArea?: string;
  filterFieldArea?: string;
  rowFieldArea?: string;
}>
class FieldPanelTexts extends NestedOption<IFieldPanelTextsProps> {
  public static OptionName = "texts";
}

// owners:
// PivotGrid
type IHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  height?: number;
  search?: HeaderFilterSearchConfig;
  searchTimeout?: number;
  showRelevantValues?: boolean;
  texts?: Record<string, any> | {
    cancel?: string;
    emptyValue?: string;
    ok?: string;
  };
  width?: number;
}>
class HeaderFilter extends NestedOption<IHeaderFilterProps> {
  public static OptionName = "headerFilter";
  public static ExpectedChildren = {
    headerFilterTexts: { optionName: "texts", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// HeaderFilter
type IHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
class HeaderFilterTexts extends NestedOption<IHeaderFilterTextsProps> {
  public static OptionName = "texts";
}

// owners:
// PivotGrid
type ILoadPanelProps = React.PropsWithChildren<{
  enabled?: boolean;
  height?: number;
  indicatorSrc?: string;
  shading?: boolean;
  shadingColor?: string;
  showIndicator?: boolean;
  showPane?: boolean;
  text?: string;
  width?: number;
}>
class LoadPanel extends NestedOption<ILoadPanelProps> {
  public static OptionName = "loadPanel";
}

// owners:
// PivotGrid
type IPivotGridTextsProps = React.PropsWithChildren<{
  collapseAll?: string;
  dataNotAvailable?: string;
  expandAll?: string;
  exportToExcel?: string;
  grandTotal?: string;
  noData?: string;
  removeAllSorting?: string;
  showFieldChooser?: string;
  sortColumnBySummary?: string;
  sortRowBySummary?: string;
  total?: string;
}>
class PivotGridTexts extends NestedOption<IPivotGridTextsProps> {
  public static OptionName = "texts";
}

// owners:
// PivotGrid
type IScrollingProps = React.PropsWithChildren<{
  mode?: "standard" | "virtual";
  useNative?: boolean | "auto";
}>
class Scrolling extends NestedOption<IScrollingProps> {
  public static OptionName = "scrolling";
}

// owners:
// HeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: "contains" | "startswith" | "equals";
  timeout?: number;
}>
class Search extends NestedOption<ISearchProps> {
  public static OptionName = "search";
}

// owners:
// PivotGrid
type IStateStoringProps = React.PropsWithChildren<{
  customLoad?: (() => any);
  customSave?: ((state: any) => void);
  enabled?: boolean;
  savingTimeout?: number;
  storageKey?: string;
  type?: "custom" | "localStorage" | "sessionStorage";
}>
class StateStoring extends NestedOption<IStateStoringProps> {
  public static OptionName = "stateStoring";
}

// owners:
// FieldChooser
// FieldPanel
// HeaderFilter
// PivotGrid
type ITextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
  columnFieldArea?: string;
  dataFieldArea?: string;
  filterFieldArea?: string;
  rowFieldArea?: string;
  cancel?: string;
  emptyValue?: string;
  ok?: string;
  collapseAll?: string;
  dataNotAvailable?: string;
  expandAll?: string;
  exportToExcel?: string;
  grandTotal?: string;
  noData?: string;
  removeAllSorting?: string;
  showFieldChooser?: string;
  sortColumnBySummary?: string;
  sortRowBySummary?: string;
  total?: string;
}>
class Texts extends NestedOption<ITextsProps> {
  public static OptionName = "texts";
}

export default PivotGrid;
export {
  PivotGrid,
  IPivotGridOptions,
  Export,
  IExportProps,
  FieldChooser,
  IFieldChooserProps,
  FieldChooserTexts,
  IFieldChooserTextsProps,
  FieldPanel,
  IFieldPanelProps,
  FieldPanelTexts,
  IFieldPanelTextsProps,
  HeaderFilter,
  IHeaderFilterProps,
  HeaderFilterTexts,
  IHeaderFilterTextsProps,
  LoadPanel,
  ILoadPanelProps,
  PivotGridTexts,
  IPivotGridTextsProps,
  Scrolling,
  IScrollingProps,
  Search,
  ISearchProps,
  StateStoring,
  IStateStoringProps,
  Texts,
  ITextsProps
};
import type * as PivotGridTypes from 'devextreme/ui/pivot_grid_types';
export { PivotGridTypes };

