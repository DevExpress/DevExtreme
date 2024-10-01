"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPivotGrid, {
    Properties
} from "devextreme/ui/pivot_grid";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { CellClickEvent, CellPreparedEvent, ContentReadyEvent, ContextMenuPreparingEvent, DisposingEvent, ExportingEvent, InitializedEvent } from "devextreme/ui/pivot_grid";
import type { ApplyChangesMode, HeaderFilterSearchConfig, StateStoreType } from "devextreme/common/grids";
import type { FieldChooserLayout, ScrollMode, Mode, SearchMode } from "devextreme/common";

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

interface PivotGridRef {
  instance: () => dxPivotGrid;
}

const PivotGrid = memo(
  forwardRef(
    (props: React.PropsWithChildren<IPivotGridOptions>, ref: ForwardedRef<PivotGridRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onCellClick","onCellPrepared","onContentReady","onContextMenuPreparing","onDisposing","onExporting","onInitialized"]), []);

      const expectedChildren = useMemo(() => ({
        export: { optionName: "export", isCollectionItem: false },
        fieldChooser: { optionName: "fieldChooser", isCollectionItem: false },
        fieldPanel: { optionName: "fieldPanel", isCollectionItem: false },
        headerFilter: { optionName: "headerFilter", isCollectionItem: false },
        loadPanel: { optionName: "loadPanel", isCollectionItem: false },
        pivotGridTexts: { optionName: "texts", isCollectionItem: false },
        scrolling: { optionName: "scrolling", isCollectionItem: false },
        stateStoring: { optionName: "stateStoring", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IPivotGridOptions>>, {
          WidgetClass: dxPivotGrid,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IPivotGridOptions> & { ref?: Ref<PivotGridRef> }) => ReactElement | null;


// owners:
// PivotGrid
type IExportProps = React.PropsWithChildren<{
  enabled?: boolean;
}>
const _componentExport = memo(
  (props: IExportProps) => {
    return React.createElement(NestedOption<IExportProps>, { ...props });
  }
);

const Export: typeof _componentExport & IElementDescriptor = Object.assign(_componentExport, {
  OptionName: "export",
})

// owners:
// PivotGrid
type IFieldChooserProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  applyChangesMode?: ApplyChangesMode;
  enabled?: boolean;
  height?: number;
  layout?: FieldChooserLayout;
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
const _componentFieldChooser = memo(
  (props: IFieldChooserProps) => {
    return React.createElement(NestedOption<IFieldChooserProps>, { ...props });
  }
);

const FieldChooser: typeof _componentFieldChooser & IElementDescriptor = Object.assign(_componentFieldChooser, {
  OptionName: "fieldChooser",
  ExpectedChildren: {
    fieldChooserTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// FieldChooser
type IFieldChooserTextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>
const _componentFieldChooserTexts = memo(
  (props: IFieldChooserTextsProps) => {
    return React.createElement(NestedOption<IFieldChooserTextsProps>, { ...props });
  }
);

const FieldChooserTexts: typeof _componentFieldChooserTexts & IElementDescriptor = Object.assign(_componentFieldChooserTexts, {
  OptionName: "texts",
})

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
const _componentFieldPanel = memo(
  (props: IFieldPanelProps) => {
    return React.createElement(NestedOption<IFieldPanelProps>, { ...props });
  }
);

const FieldPanel: typeof _componentFieldPanel & IElementDescriptor = Object.assign(_componentFieldPanel, {
  OptionName: "fieldPanel",
  ExpectedChildren: {
    fieldPanelTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// FieldPanel
type IFieldPanelTextsProps = React.PropsWithChildren<{
  columnFieldArea?: string;
  dataFieldArea?: string;
  filterFieldArea?: string;
  rowFieldArea?: string;
}>
const _componentFieldPanelTexts = memo(
  (props: IFieldPanelTextsProps) => {
    return React.createElement(NestedOption<IFieldPanelTextsProps>, { ...props });
  }
);

const FieldPanelTexts: typeof _componentFieldPanelTexts & IElementDescriptor = Object.assign(_componentFieldPanelTexts, {
  OptionName: "texts",
})

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
const _componentHeaderFilter = memo(
  (props: IHeaderFilterProps) => {
    return React.createElement(NestedOption<IHeaderFilterProps>, { ...props });
  }
);

const HeaderFilter: typeof _componentHeaderFilter & IElementDescriptor = Object.assign(_componentHeaderFilter, {
  OptionName: "headerFilter",
  ExpectedChildren: {
    headerFilterTexts: { optionName: "texts", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// HeaderFilter
type IHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
const _componentHeaderFilterTexts = memo(
  (props: IHeaderFilterTextsProps) => {
    return React.createElement(NestedOption<IHeaderFilterTextsProps>, { ...props });
  }
);

const HeaderFilterTexts: typeof _componentHeaderFilterTexts & IElementDescriptor = Object.assign(_componentHeaderFilterTexts, {
  OptionName: "texts",
})

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
const _componentLoadPanel = memo(
  (props: ILoadPanelProps) => {
    return React.createElement(NestedOption<ILoadPanelProps>, { ...props });
  }
);

const LoadPanel: typeof _componentLoadPanel & IElementDescriptor = Object.assign(_componentLoadPanel, {
  OptionName: "loadPanel",
})

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
const _componentPivotGridTexts = memo(
  (props: IPivotGridTextsProps) => {
    return React.createElement(NestedOption<IPivotGridTextsProps>, { ...props });
  }
);

const PivotGridTexts: typeof _componentPivotGridTexts & IElementDescriptor = Object.assign(_componentPivotGridTexts, {
  OptionName: "texts",
})

// owners:
// PivotGrid
type IScrollingProps = React.PropsWithChildren<{
  mode?: ScrollMode;
  useNative?: boolean | Mode;
}>
const _componentScrolling = memo(
  (props: IScrollingProps) => {
    return React.createElement(NestedOption<IScrollingProps>, { ...props });
  }
);

const Scrolling: typeof _componentScrolling & IElementDescriptor = Object.assign(_componentScrolling, {
  OptionName: "scrolling",
})

// owners:
// HeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  timeout?: number;
}>
const _componentSearch = memo(
  (props: ISearchProps) => {
    return React.createElement(NestedOption<ISearchProps>, { ...props });
  }
);

const Search: typeof _componentSearch & IElementDescriptor = Object.assign(_componentSearch, {
  OptionName: "search",
})

// owners:
// PivotGrid
type IStateStoringProps = React.PropsWithChildren<{
  customLoad?: (() => any);
  customSave?: ((state: any) => void);
  enabled?: boolean;
  savingTimeout?: number;
  storageKey?: string;
  type?: StateStoreType;
}>
const _componentStateStoring = memo(
  (props: IStateStoringProps) => {
    return React.createElement(NestedOption<IStateStoringProps>, { ...props });
  }
);

const StateStoring: typeof _componentStateStoring & IElementDescriptor = Object.assign(_componentStateStoring, {
  OptionName: "stateStoring",
})

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
const _componentTexts = memo(
  (props: ITextsProps) => {
    return React.createElement(NestedOption<ITextsProps>, { ...props });
  }
);

const Texts: typeof _componentTexts & IElementDescriptor = Object.assign(_componentTexts, {
  OptionName: "texts",
})

export default PivotGrid;
export {
  PivotGrid,
  IPivotGridOptions,
  PivotGridRef,
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

