"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPivotGrid, {
    Properties
} from "devextreme/ui/pivot_grid";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
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
const _componentExport = (props: IExportProps) => {
  return React.createElement(NestedOption<IExportProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "export",
    },
  });
};

const Export = Object.assign<typeof _componentExport, NestedComponentMeta>(_componentExport, {
  componentType: "option",
});

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
const _componentFieldChooser = (props: IFieldChooserProps) => {
  return React.createElement(NestedOption<IFieldChooserProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "fieldChooser",
      ExpectedChildren: {
        fieldChooserTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const FieldChooser = Object.assign<typeof _componentFieldChooser, NestedComponentMeta>(_componentFieldChooser, {
  componentType: "option",
});

// owners:
// FieldChooser
type IFieldChooserTextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>
const _componentFieldChooserTexts = (props: IFieldChooserTextsProps) => {
  return React.createElement(NestedOption<IFieldChooserTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const FieldChooserTexts = Object.assign<typeof _componentFieldChooserTexts, NestedComponentMeta>(_componentFieldChooserTexts, {
  componentType: "option",
});

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
const _componentFieldPanel = (props: IFieldPanelProps) => {
  return React.createElement(NestedOption<IFieldPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "fieldPanel",
      ExpectedChildren: {
        fieldPanelTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const FieldPanel = Object.assign<typeof _componentFieldPanel, NestedComponentMeta>(_componentFieldPanel, {
  componentType: "option",
});

// owners:
// FieldPanel
type IFieldPanelTextsProps = React.PropsWithChildren<{
  columnFieldArea?: string;
  dataFieldArea?: string;
  filterFieldArea?: string;
  rowFieldArea?: string;
}>
const _componentFieldPanelTexts = (props: IFieldPanelTextsProps) => {
  return React.createElement(NestedOption<IFieldPanelTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const FieldPanelTexts = Object.assign<typeof _componentFieldPanelTexts, NestedComponentMeta>(_componentFieldPanelTexts, {
  componentType: "option",
});

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
const _componentHeaderFilter = (props: IHeaderFilterProps) => {
  return React.createElement(NestedOption<IHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        headerFilterTexts: { optionName: "texts", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const HeaderFilter = Object.assign<typeof _componentHeaderFilter, NestedComponentMeta>(_componentHeaderFilter, {
  componentType: "option",
});

// owners:
// HeaderFilter
type IHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
const _componentHeaderFilterTexts = (props: IHeaderFilterTextsProps) => {
  return React.createElement(NestedOption<IHeaderFilterTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const HeaderFilterTexts = Object.assign<typeof _componentHeaderFilterTexts, NestedComponentMeta>(_componentHeaderFilterTexts, {
  componentType: "option",
});

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
const _componentLoadPanel = (props: ILoadPanelProps) => {
  return React.createElement(NestedOption<ILoadPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "loadPanel",
    },
  });
};

const LoadPanel = Object.assign<typeof _componentLoadPanel, NestedComponentMeta>(_componentLoadPanel, {
  componentType: "option",
});

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
const _componentPivotGridTexts = (props: IPivotGridTextsProps) => {
  return React.createElement(NestedOption<IPivotGridTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const PivotGridTexts = Object.assign<typeof _componentPivotGridTexts, NestedComponentMeta>(_componentPivotGridTexts, {
  componentType: "option",
});

// owners:
// PivotGrid
type IScrollingProps = React.PropsWithChildren<{
  mode?: "standard" | "virtual";
  useNative?: boolean | "auto";
}>
const _componentScrolling = (props: IScrollingProps) => {
  return React.createElement(NestedOption<IScrollingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "scrolling",
    },
  });
};

const Scrolling = Object.assign<typeof _componentScrolling, NestedComponentMeta>(_componentScrolling, {
  componentType: "option",
});

// owners:
// HeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: "contains" | "startswith" | "equals";
  timeout?: number;
}>
const _componentSearch = (props: ISearchProps) => {
  return React.createElement(NestedOption<ISearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const Search = Object.assign<typeof _componentSearch, NestedComponentMeta>(_componentSearch, {
  componentType: "option",
});

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
const _componentStateStoring = (props: IStateStoringProps) => {
  return React.createElement(NestedOption<IStateStoringProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "stateStoring",
    },
  });
};

const StateStoring = Object.assign<typeof _componentStateStoring, NestedComponentMeta>(_componentStateStoring, {
  componentType: "option",
});

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
const _componentTexts = (props: ITextsProps) => {
  return React.createElement(NestedOption<ITextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const Texts = Object.assign<typeof _componentTexts, NestedComponentMeta>(_componentTexts, {
  componentType: "option",
});

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

