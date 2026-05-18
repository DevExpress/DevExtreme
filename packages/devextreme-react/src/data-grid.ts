"use client"
export { ExplicitTypes } from "devextreme/ui/data_grid";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxDataGrid, {
    Properties
} from "devextreme/ui/data_grid";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxDataGridColumn, AdaptiveDetailRowPreparingEvent, AIAssistantRequestCreatingEvent, AIColumnRequestCreatingEvent, CellClickEvent, CellDblClickEvent, CellPreparedEvent, ContentReadyEvent, ContextMenuPreparingEvent, DataErrorOccurredEvent, DisposingEvent, EditCanceledEvent, EditCancelingEvent, EditingStartEvent, EditorPreparedEvent, EditorPreparingEvent, ExportingEvent, FocusedCellChangingEvent, FocusedRowChangingEvent, InitializedEvent, InitNewRowEvent, KeyDownEvent, RowClickEvent, RowCollapsedEvent, RowCollapsingEvent, RowDblClickEvent, RowExpandedEvent, RowExpandingEvent, RowInsertedEvent, RowInsertingEvent, RowPreparedEvent, RowRemovedEvent, RowRemovingEvent, RowUpdatedEvent, RowUpdatingEvent, RowValidatingEvent, SavedEvent, SavingEvent, ToolbarPreparingEvent, dxDataGridRowObject, DataGridPredefinedColumnButton, ColumnButtonClickEvent, dxDataGridColumnButton, DataGridCommandColumnType, SelectionSensitivity, DataGridPredefinedToolbarItem, DataGridExportFormat, DataGridScrollMode, dxDataGridToolbarItem } from "devextreme/ui/data_grid";
import type { DataChange, AIColumnMode, CommandInfo, ResponseStatusTexts, ResponseStatus, DataChangeType, ColumnAIOptions, FilterOperation, FilterType, FixedPosition, ColumnHeaderFilter as GridsColumnHeaderFilter, SelectedFilterOperation, ColumnChooserMode, ColumnChooserSearchConfig, ColumnChooserSelectionConfig, HeaderFilterGroupInterval, ColumnHeaderFilterSearchConfig, HeaderFilterSearchConfig, HeaderFilterTexts, SelectionColumnDisplayMode, GridsEditMode, NewRowPosition, GridsEditRefreshMode, StartEditAction, FilterPanel as GridsFilterPanel, FilterPanelTexts as GridsFilterPanelTexts, ApplyFilterMode, GroupExpandMode, SummaryType, EnterKeyAction, EnterKeyDirection, PagerPageSize, GridBase, DataRenderMode, StateStoreType } from "devextreme/common/grids";
import type { Mode, ValidationRuleType, HorizontalAlignment, VerticalAlignment, template, TextEditorButtonLocation, ButtonStyle, ButtonType, DataType, Format as CommonFormat, SortOrder, SearchMode, ComparisonOperator, SingleMultipleOrNone, SelectAllMode, ToolbarItemLocation, ToolbarItemComponent, TextBoxPredefinedButton, TextEditorButton, LabelMode, MaskMode, EditorStyle, ValidationMessageMode, Position as CommonPosition, ValidationStatus, PositionAlignment, Direction, DisplayMode, DragDirection, DragHighlight, ScrollbarMode, TabsIconPosition, TabsStyle } from "devextreme/common";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, ClickEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { ContentReadyEvent as TextBoxContentReadyEvent, DisposingEvent as TextBoxDisposingEvent, InitializedEvent as TextBoxInitializedEvent, KeyDownEvent as TextBoxKeyDownEvent, dxTextBoxOptions, OptionChangedEvent as TextBoxOptionChangedEvent, TextBoxType, ChangeEvent, CopyEvent, CutEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InputEvent, KeyUpEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import type { ContentReadyEvent as FilterBuilderContentReadyEvent, DisposingEvent as FilterBuilderDisposingEvent, EditorPreparedEvent as FilterBuilderEditorPreparedEvent, EditorPreparingEvent as FilterBuilderEditorPreparingEvent, InitializedEvent as FilterBuilderInitializedEvent, OptionChangedEvent as FilterBuilderOptionChangedEvent, dxFilterBuilderField, FieldInfo, ValueChangedEvent as FilterBuilderValueChangedEvent, FilterBuilderOperation, dxFilterBuilderCustomOperation, GroupOperation } from "devextreme/ui/filter_builder";
import type { ContentReadyEvent as FormContentReadyEvent, DisposingEvent as FormDisposingEvent, InitializedEvent as FormInitializedEvent, FormItemType, FormPredefinedButtonItem, OptionChangedEvent as FormOptionChangedEvent, dxFormSimpleItem, dxFormOptions, dxFormGroupItem, dxFormTabbedItem, dxFormEmptyItem, dxFormButtonItem, LabelLocation, FormLabelMode, EditorEnterKeyEvent, FieldDataChangedEvent, SmartPastedEvent, SmartPastingEvent, FormItemComponent } from "devextreme/ui/form";
import type { ContentReadyEvent as TabPanelContentReadyEvent, DisposingEvent as TabPanelDisposingEvent, InitializedEvent as TabPanelInitializedEvent, OptionChangedEvent as TabPanelOptionChangedEvent, dxTabPanelOptions, dxTabPanelItem, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, SelectionChangedEvent, SelectionChangingEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from "devextreme/ui/tab_panel";
import type { AIIntegration } from "devextreme/common/ai-integration";
import type { dxPopupOptions, dxPopupToolbarItem, ToolbarLocation } from "devextreme/ui/popup";
import type { AnimationConfig, CollisionResolution, PositionConfig, AnimationState, AnimationType, CollisionResolutionCombination } from "devextreme/common/core/animation";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { event } from "devextreme/events/events.types";
import type { EventInfo } from "devextreme/common/core/events";
import type { Component } from "devextreme/core/component";
import type { LoadingAnimationType } from "devextreme/ui/load_indicator";
import type { LoadPanelIndicatorProperties } from "devextreme/ui/load_panel";

import type dxOverlay from "devextreme/ui/overlay";
import type DOMComponent from "devextreme/core/dom_component";
import type dxPopup from "devextreme/ui/popup";
import type dxForm from "devextreme/ui/form";
import type dxSortable from "devextreme/ui/sortable";
import type dxDraggable from "devextreme/ui/draggable";
import type DataSource from "devextreme/data/data_source";

import type * as CommonTypes from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IDataGridOptionsNarrowedEvents<TRowData = any, TKey = any> = {
  onAdaptiveDetailRowPreparing?: ((e: AdaptiveDetailRowPreparingEvent<TRowData, TKey>) => void);
  onAIAssistantRequestCreating?: ((e: AIAssistantRequestCreatingEvent<TRowData, TKey>) => void);
  onAIColumnRequestCreating?: ((e: AIColumnRequestCreatingEvent<TRowData, TKey>) => void);
  onCellClick?: ((e: CellClickEvent<TRowData, TKey>) => void);
  onCellDblClick?: ((e: CellDblClickEvent<TRowData, TKey>) => void);
  onCellPrepared?: ((e: CellPreparedEvent<TRowData, TKey>) => void);
  onContentReady?: ((e: ContentReadyEvent<TRowData, TKey>) => void);
  onContextMenuPreparing?: ((e: ContextMenuPreparingEvent<TRowData, TKey>) => void);
  onDataErrorOccurred?: ((e: DataErrorOccurredEvent<TRowData, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TRowData, TKey>) => void);
  onEditCanceled?: ((e: EditCanceledEvent<TRowData, TKey>) => void);
  onEditCanceling?: ((e: EditCancelingEvent<TRowData, TKey>) => void);
  onEditingStart?: ((e: EditingStartEvent<TRowData, TKey>) => void);
  onEditorPrepared?: ((e: EditorPreparedEvent<TRowData, TKey>) => void);
  onEditorPreparing?: ((e: EditorPreparingEvent<TRowData, TKey>) => void);
  onExporting?: ((e: ExportingEvent<TRowData, TKey>) => void);
  onFocusedCellChanging?: ((e: FocusedCellChangingEvent<TRowData, TKey>) => void);
  onFocusedRowChanging?: ((e: FocusedRowChangingEvent<TRowData, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TRowData, TKey>) => void);
  onInitNewRow?: ((e: InitNewRowEvent<TRowData, TKey>) => void);
  onKeyDown?: ((e: KeyDownEvent<TRowData, TKey>) => void);
  onRowClick?: ((e: RowClickEvent<TRowData, TKey>) => void);
  onRowCollapsed?: ((e: RowCollapsedEvent<TRowData, TKey>) => void);
  onRowCollapsing?: ((e: RowCollapsingEvent<TRowData, TKey>) => void);
  onRowDblClick?: ((e: RowDblClickEvent<TRowData, TKey>) => void);
  onRowExpanded?: ((e: RowExpandedEvent<TRowData, TKey>) => void);
  onRowExpanding?: ((e: RowExpandingEvent<TRowData, TKey>) => void);
  onRowInserted?: ((e: RowInsertedEvent<TRowData, TKey>) => void);
  onRowInserting?: ((e: RowInsertingEvent<TRowData, TKey>) => void);
  onRowPrepared?: ((e: RowPreparedEvent<TRowData, TKey>) => void);
  onRowRemoved?: ((e: RowRemovedEvent<TRowData, TKey>) => void);
  onRowRemoving?: ((e: RowRemovingEvent<TRowData, TKey>) => void);
  onRowUpdated?: ((e: RowUpdatedEvent<TRowData, TKey>) => void);
  onRowUpdating?: ((e: RowUpdatingEvent<TRowData, TKey>) => void);
  onRowValidating?: ((e: RowValidatingEvent<TRowData, TKey>) => void);
  onSaved?: ((e: SavedEvent<TRowData, TKey>) => void);
  onSaving?: ((e: SavingEvent<TRowData, TKey>) => void);
  onToolbarPreparing?: ((e: ToolbarPreparingEvent<TRowData, TKey>) => void);
}

type IDataGridOptions<TRowData = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TRowData, TKey>, IDataGridOptionsNarrowedEvents<TRowData, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TRowData, TKey>["dataSource"];
  dataRowRender?: (...params: any) => React.ReactNode;
  dataRowComponent?: React.ComponentType<any>;
  rowRender?: (...params: any) => React.ReactNode;
  rowComponent?: React.ComponentType<any>;
  defaultColumns?: Array<dxDataGridColumn | string>;
  defaultEditing?: Record<string, any>;
  defaultFilterValue?: Array<any> | (() => any) | string;
  defaultFocusedColumnIndex?: number;
  defaultFocusedRowIndex?: number;
  defaultFocusedRowKey?: any | undefined;
  defaultGroupPanel?: Record<string, any>;
  defaultPaging?: Record<string, any>;
  defaultSelectedRowKeys?: Array<any>;
  defaultSelectionFilter?: Array<any> | (() => any) | string;
  onColumnsChange?: (value: Array<dxDataGridColumn | string>) => void;
  onEditingChange?: (value: Record<string, any>) => void;
  onFilterValueChange?: (value: Array<any> | (() => any) | string) => void;
  onFocusedColumnIndexChange?: (value: number) => void;
  onFocusedRowIndexChange?: (value: number) => void;
  onFocusedRowKeyChange?: (value: any | undefined) => void;
  onGroupPanelChange?: (value: Record<string, any>) => void;
  onPagingChange?: (value: Record<string, any>) => void;
  onSelectedRowKeysChange?: (value: Array<any>) => void;
  onSelectionFilterChange?: (value: Array<any> | (() => any) | string) => void;
}>

interface DataGridRef<TRowData = any, TKey = any> {
  instance: () => dxDataGrid<TRowData, TKey>;
}

const DataGrid = memo(
  forwardRef(
    <TRowData = any, TKey = any>(props: React.PropsWithChildren<IDataGridOptions<TRowData, TKey>>, ref: ForwardedRef<DataGridRef<TRowData, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), []);

      const subscribableOptions = useMemo(() => (["columns","editing","editing.changes","editing.editColumnName","editing.editRowKey","filterValue","focusedColumnIndex","focusedRowIndex","focusedRowKey","groupPanel","groupPanel.visible","paging","paging.pageIndex","paging.pageSize","selectedRowKeys","selectionFilter","filterBuilder.value","filterBuilderPopup.height","filterBuilderPopup.position","filterBuilderPopup.visible","filterBuilderPopup.width","filterPanel.filterEnabled","editing.form.formData","aIAssistant.popup.height","editing.popup.height","aIAssistant.popup.position","editing.popup.position","aIAssistant.popup.visible","editing.popup.visible","aIAssistant.popup.width","editing.popup.width","searchPanel.text"]), []);
      const independentEvents = useMemo(() => (["onAdaptiveDetailRowPreparing","onAIAssistantRequestCreating","onAIColumnRequestCreating","onCellClick","onCellDblClick","onCellPrepared","onContentReady","onContextMenuPreparing","onDataErrorOccurred","onDisposing","onEditCanceled","onEditCanceling","onEditingStart","onEditorPrepared","onEditorPreparing","onExporting","onFocusedCellChanging","onFocusedRowChanging","onInitialized","onInitNewRow","onKeyDown","onRowClick","onRowCollapsed","onRowCollapsing","onRowDblClick","onRowExpanded","onRowExpanding","onRowInserted","onRowInserting","onRowPrepared","onRowRemoved","onRowRemoving","onRowUpdated","onRowUpdating","onRowValidating","onSaved","onSaving","onToolbarPreparing"]), []);

      const defaults = useMemo(() => ({
        defaultColumns: "columns",
        defaultEditing: "editing",
        defaultFilterValue: "filterValue",
        defaultFocusedColumnIndex: "focusedColumnIndex",
        defaultFocusedRowIndex: "focusedRowIndex",
        defaultFocusedRowKey: "focusedRowKey",
        defaultGroupPanel: "groupPanel",
        defaultPaging: "paging",
        defaultSelectedRowKeys: "selectedRowKeys",
        defaultSelectionFilter: "selectionFilter",
      }), []);

      const expectedChildren = useMemo(() => ({
        aiAssistant: { optionName: "aiAssistant", isCollectionItem: false },
        column: { optionName: "columns", isCollectionItem: true },
        columnChooser: { optionName: "columnChooser", isCollectionItem: false },
        columnFixing: { optionName: "columnFixing", isCollectionItem: false },
        dataGridHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
        dataGridSelection: { optionName: "selection", isCollectionItem: false },
        editing: { optionName: "editing", isCollectionItem: false },
        export: { optionName: "export", isCollectionItem: false },
        filterBuilder: { optionName: "filterBuilder", isCollectionItem: false },
        filterBuilderPopup: { optionName: "filterBuilderPopup", isCollectionItem: false },
        filterPanel: { optionName: "filterPanel", isCollectionItem: false },
        filterRow: { optionName: "filterRow", isCollectionItem: false },
        grouping: { optionName: "grouping", isCollectionItem: false },
        groupPanel: { optionName: "groupPanel", isCollectionItem: false },
        headerFilter: { optionName: "headerFilter", isCollectionItem: false },
        keyboardNavigation: { optionName: "keyboardNavigation", isCollectionItem: false },
        loadPanel: { optionName: "loadPanel", isCollectionItem: false },
        masterDetail: { optionName: "masterDetail", isCollectionItem: false },
        pager: { optionName: "pager", isCollectionItem: false },
        paging: { optionName: "paging", isCollectionItem: false },
        remoteOperations: { optionName: "remoteOperations", isCollectionItem: false },
        rowDragging: { optionName: "rowDragging", isCollectionItem: false },
        scrolling: { optionName: "scrolling", isCollectionItem: false },
        searchPanel: { optionName: "searchPanel", isCollectionItem: false },
        selection: { optionName: "selection", isCollectionItem: false },
        sortByGroupSummaryInfo: { optionName: "sortByGroupSummaryInfo", isCollectionItem: true },
        sorting: { optionName: "sorting", isCollectionItem: false },
        stateStoring: { optionName: "stateStoring", isCollectionItem: false },
        summary: { optionName: "summary", isCollectionItem: false },
        toolbar: { optionName: "toolbar", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "dataRowTemplate",
          render: "dataRowRender",
          component: "dataRowComponent"
        },
        {
          tmplOption: "rowTemplate",
          render: "rowRender",
          component: "rowComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IDataGridOptions<TRowData, TKey>>>, {
          WidgetClass: dxDataGrid,
          ref: baseRef,
          useRequestAnimationFrameFlag: true,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as <TRowData = any, TKey = any>(props: React.PropsWithChildren<IDataGridOptions<TRowData, TKey>> & { ref?: Ref<DataGridRef<TRowData, TKey>> }) => ReactElement | null;


// owners:
// Column
type IAIProps = React.PropsWithChildren<{
  aiIntegration?: AIIntegration | undefined;
  editorOptions?: dxTextBoxOptions<any>;
  emptyText?: string;
  mode?: AIColumnMode;
  noDataText?: string;
  popup?: Record<string, any>;
  prompt?: string;
  showHeaderMenu?: boolean;
}>
const _componentAI = (props: IAIProps) => {
  return React.createElement(NestedOption<IAIProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "ai",
      ExpectedChildren: {
        editorOptions: { optionName: "editorOptions", isCollectionItem: false }
      },
    },
  });
};

const AI = Object.assign<typeof _componentAI, NestedComponentMeta>(_componentAI, {
  componentType: "option",
});

// owners:
// DataGrid
type IAIAssistantProps = React.PropsWithChildren<{
  aiIntegration?: AIIntegration;
  chat?: Record<string, any>;
  customizeResponseText?: ((command: CommandInfo) => ResponseStatusTexts);
  customizeResponseTitle?: ((status: ResponseStatus, commandNames: Array<string>) => string);
  enabled?: boolean;
  popup?: dxPopupOptions<any>;
  title?: string;
}>
const _componentAIAssistant = (props: IAIAssistantProps) => {
  return React.createElement(NestedOption<IAIAssistantProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "aiAssistant",
      ExpectedChildren: {
        popup: { optionName: "popup", isCollectionItem: false }
      },
    },
  });
};

const AIAssistant = Object.assign<typeof _componentAIAssistant, NestedComponentMeta>(_componentAIAssistant, {
  componentType: "option",
});

// owners:
// FormItem
// SimpleItem
type IAIOptionsProps = React.PropsWithChildren<{
  disabled?: boolean;
  instruction?: string | undefined;
}>
const _componentAIOptions = (props: IAIOptionsProps) => {
  return React.createElement(NestedOption<IAIOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "aiOptions",
    },
  });
};

const AIOptions = Object.assign<typeof _componentAIOptions, NestedComponentMeta>(_componentAIOptions, {
  componentType: "option",
});

// owners:
// Popup
// FilterBuilderPopup
type IAnimationProps = React.PropsWithChildren<{
  hide?: AnimationConfig;
  show?: AnimationConfig;
}>
const _componentAnimation = (props: IAnimationProps) => {
  return React.createElement(NestedOption<IAnimationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "animation",
      ExpectedChildren: {
        hide: { optionName: "hide", isCollectionItem: false },
        show: { optionName: "show", isCollectionItem: false }
      },
    },
  });
};

const Animation = Object.assign<typeof _componentAnimation, NestedComponentMeta>(_componentAnimation, {
  componentType: "option",
});

// owners:
// FormItem
// Column
// SimpleItem
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: any }) => any);
}>
const _componentAsyncRule = (props: IAsyncRuleProps) => {
  return React.createElement(NestedOption<IAsyncRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "async"
      },
    },
  });
};

const AsyncRule = Object.assign<typeof _componentAsyncRule, NestedComponentMeta>(_componentAsyncRule, {
  componentType: "option",
});

// owners:
// Position
type IAtProps = React.PropsWithChildren<{
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
}>
const _componentAt = (props: IAtProps) => {
  return React.createElement(NestedOption<IAtProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "at",
    },
  });
};

const At = Object.assign<typeof _componentAt, NestedComponentMeta>(_componentAt, {
  componentType: "option",
});

// owners:
// Position
type IBoundaryOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentBoundaryOffset = (props: IBoundaryOffsetProps) => {
  return React.createElement(NestedOption<IBoundaryOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "boundaryOffset",
    },
  });
};

const BoundaryOffset = Object.assign<typeof _componentBoundaryOffset, NestedComponentMeta>(_componentBoundaryOffset, {
  componentType: "option",
});

// owners:
// Column
// EditorOptions
type IButtonProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  hint?: string;
  icon?: string;
  name?: DataGridPredefinedColumnButton | string | undefined;
  onClick?: ((e: ColumnButtonClickEvent) => void);
  template?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, key: any, row: dxDataGridRowObject, rowIndex: number, rowType: string }) => string | any) | template;
  text?: string;
  visible?: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  location?: TextEditorButtonLocation;
  options?: dxButtonOptions | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentButton = (props: IButtonProps) => {
  return React.createElement(NestedOption<IButtonProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "buttons",
      IsCollectionItem: true,
      ExpectedChildren: {
        options: { optionName: "options", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Button = Object.assign<typeof _componentButton, NestedComponentMeta>(_componentButton, {
  componentType: "option",
});

// owners:
// Form
type IButtonItemProps = React.PropsWithChildren<{
  buttonOptions?: dxButtonOptions | undefined;
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  horizontalAlignment?: HorizontalAlignment;
  itemType?: FormItemType;
  name?: FormPredefinedButtonItem | string | undefined;
  verticalAlignment?: VerticalAlignment;
  visible?: boolean;
  visibleIndex?: number | undefined;
}>
const _componentButtonItem = (props: IButtonItemProps) => {
  return React.createElement(NestedOption<IButtonItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        buttonOptions: { optionName: "buttonOptions", isCollectionItem: false }
      },
      PredefinedProps: {
        itemType: "button"
      },
    },
  });
};

const ButtonItem = Object.assign<typeof _componentButtonItem, NestedComponentMeta>(_componentButtonItem, {
  componentType: "option",
});

// owners:
// ButtonItem
type IButtonOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ButtonContentReadyEvent) => void);
  onDisposing?: ((e: ButtonDisposingEvent) => void);
  onInitialized?: ((e: ButtonInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  rtlEnabled?: boolean;
  stylingMode?: ButtonStyle;
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string | any) | template;
  text?: string;
  type?: ButtonType | string;
  useSubmitBehavior?: boolean;
  validationGroup?: string | undefined;
  visible?: boolean;
  width?: number | string | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentButtonOptions = (props: IButtonOptionsProps) => {
  return React.createElement(NestedOption<IButtonOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "buttonOptions",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const ButtonOptions = Object.assign<typeof _componentButtonOptions, NestedComponentMeta>(_componentButtonOptions, {
  componentType: "option",
});

// owners:
// Editing
type IChangeProps = React.PropsWithChildren<{
  data?: any;
  insertAfterKey?: any;
  insertBeforeKey?: any;
  key?: any;
  type?: DataChangeType;
}>
const _componentChange = (props: IChangeProps) => {
  return React.createElement(NestedOption<IChangeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "changes",
      IsCollectionItem: true,
    },
  });
};

const Change = Object.assign<typeof _componentChange, NestedComponentMeta>(_componentChange, {
  componentType: "option",
});

// owners:
// Form
// FormGroupItem
// Tab
type IColCountByScreenProps = React.PropsWithChildren<{
  lg?: number | undefined;
  md?: number | undefined;
  sm?: number | undefined;
  xs?: number | undefined;
}>
const _componentColCountByScreen = (props: IColCountByScreenProps) => {
  return React.createElement(NestedOption<IColCountByScreenProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "colCountByScreen",
    },
  });
};

const ColCountByScreen = Object.assign<typeof _componentColCountByScreen, NestedComponentMeta>(_componentColCountByScreen, {
  componentType: "option",
});

// owners:
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: CollisionResolution;
  y?: CollisionResolution;
}>
const _componentCollision = (props: ICollisionProps) => {
  return React.createElement(NestedOption<ICollisionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "collision",
    },
  });
};

const Collision = Object.assign<typeof _componentCollision, NestedComponentMeta>(_componentCollision, {
  componentType: "option",
});

// owners:
// DataGrid
type IColumnProps = React.PropsWithChildren<{
  ai?: ColumnAIOptions;
  alignment?: HorizontalAlignment | undefined;
  allowEditing?: boolean;
  allowExporting?: boolean;
  allowFiltering?: boolean;
  allowFixing?: boolean;
  allowGrouping?: boolean;
  allowHeaderFiltering?: boolean;
  allowHiding?: boolean;
  allowReordering?: boolean;
  allowResizing?: boolean;
  allowSearch?: boolean;
  allowSorting?: boolean;
  autoExpandGroup?: boolean;
  buttons?: Array<DataGridPredefinedColumnButton | dxDataGridColumnButton>;
  calculateCellValue?: ((rowData: any) => any);
  calculateDisplayValue?: ((rowData: any) => any) | string;
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | (() => any) | Array<any>);
  calculateGroupValue?: ((rowData: any) => any) | string;
  calculateSortValue?: ((rowData: any) => any) | string;
  caption?: string | undefined;
  cellTemplate?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, displayValue: any, oldValue: any, row: dxDataGridRowObject, rowIndex: number, rowType: string, text: string, value: any, watch: (() => void) }) => any) | template;
  columns?: Array<dxDataGridColumn | string>;
  cssClass?: string | undefined;
  customizeText?: ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string);
  dataField?: string | undefined;
  dataType?: DataType | undefined;
  editCellTemplate?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, displayValue: any, row: dxDataGridRowObject, rowIndex: number, rowType: string, setValue(newValue, newText): any, text: string, value: any, watch: (() => void) }) => any) | template;
  editorOptions?: any;
  encodeHtml?: boolean;
  falseText?: string;
  filterOperations?: Array<FilterOperation | string>;
  filterType?: FilterType;
  filterValue?: any | undefined;
  filterValues?: Array<any>;
  fixed?: boolean;
  fixedPosition?: FixedPosition | undefined;
  format?: LocalizationFormat;
  formItem?: dxFormSimpleItem;
  groupCellTemplate?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, displayValue: any, groupContinuedMessage: string, groupContinuesMessage: string, row: dxDataGridRowObject, rowIndex: number, summaryItems: Array<any>, text: string, value: any }) => any) | template;
  groupIndex?: number | undefined;
  headerCellTemplate?: ((columnHeader: any, headerInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid }) => any) | template;
  headerFilter?: GridsColumnHeaderFilter | undefined;
  hidingPriority?: number | undefined;
  isBand?: boolean | undefined;
  lookup?: Record<string, any> | {
    allowClearing?: boolean;
    calculateCellValue?: ((rowData: any) => any);
    dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store | undefined;
    displayExpr?: ((data: any) => string) | string | undefined;
    valueExpr?: string | undefined;
  };
  minWidth?: number | undefined;
  name?: string | undefined;
  ownerBand?: number | undefined;
  renderAsync?: boolean;
  selectedFilterOperation?: SelectedFilterOperation | undefined;
  setCellValue?: ((newData: any, value: any, currentRowData: any) => any);
  showEditorAlways?: boolean;
  showInColumnChooser?: boolean;
  showWhenGrouped?: boolean;
  sortIndex?: number | undefined;
  sortingMethod?: ((value1: any, value2: any) => number) | undefined;
  sortOrder?: SortOrder | undefined;
  trueText?: string;
  type?: DataGridCommandColumnType;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number | undefined;
  width?: number | string | undefined;
  defaultFilterValue?: any | undefined;
  onFilterValueChange?: (value: any | undefined) => void;
  defaultFilterValues?: Array<any>;
  onFilterValuesChange?: (value: Array<any>) => void;
  defaultGroupIndex?: number | undefined;
  onGroupIndexChange?: (value: number | undefined) => void;
  defaultSelectedFilterOperation?: SelectedFilterOperation | undefined;
  onSelectedFilterOperationChange?: (value: SelectedFilterOperation | undefined) => void;
  defaultSortIndex?: number | undefined;
  onSortIndexChange?: (value: number | undefined) => void;
  defaultSortOrder?: SortOrder | undefined;
  onSortOrderChange?: (value: SortOrder | undefined) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultVisibleIndex?: number | undefined;
  onVisibleIndexChange?: (value: number | undefined) => void;
  cellRender?: (...params: any) => React.ReactNode;
  cellComponent?: React.ComponentType<any>;
  editCellRender?: (...params: any) => React.ReactNode;
  editCellComponent?: React.ComponentType<any>;
  groupCellRender?: (...params: any) => React.ReactNode;
  groupCellComponent?: React.ComponentType<any>;
  headerCellRender?: (...params: any) => React.ReactNode;
  headerCellComponent?: React.ComponentType<any>;
}>
const _componentColumn = (props: IColumnProps) => {
  return React.createElement(NestedOption<IColumnProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "columns",
      IsCollectionItem: true,
      DefaultsProps: {
        defaultFilterValue: "filterValue",
        defaultFilterValues: "filterValues",
        defaultGroupIndex: "groupIndex",
        defaultSelectedFilterOperation: "selectedFilterOperation",
        defaultSortIndex: "sortIndex",
        defaultSortOrder: "sortOrder",
        defaultVisible: "visible",
        defaultVisibleIndex: "visibleIndex"
      },
      ExpectedChildren: {
        ai: { optionName: "ai", isCollectionItem: false },
        AsyncRule: { optionName: "validationRules", isCollectionItem: true },
        button: { optionName: "buttons", isCollectionItem: true },
        columnButton: { optionName: "buttons", isCollectionItem: true },
        columnHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
        columnLookup: { optionName: "lookup", isCollectionItem: false },
        CompareRule: { optionName: "validationRules", isCollectionItem: true },
        CustomRule: { optionName: "validationRules", isCollectionItem: true },
        EmailRule: { optionName: "validationRules", isCollectionItem: true },
        format: { optionName: "format", isCollectionItem: false },
        formItem: { optionName: "formItem", isCollectionItem: false },
        headerFilter: { optionName: "headerFilter", isCollectionItem: false },
        lookup: { optionName: "lookup", isCollectionItem: false },
        NumericRule: { optionName: "validationRules", isCollectionItem: true },
        PatternRule: { optionName: "validationRules", isCollectionItem: true },
        RangeRule: { optionName: "validationRules", isCollectionItem: true },
        RequiredRule: { optionName: "validationRules", isCollectionItem: true },
        StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
        validationRule: { optionName: "validationRules", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "cellTemplate",
        render: "cellRender",
        component: "cellComponent"
      }, {
        tmplOption: "editCellTemplate",
        render: "editCellRender",
        component: "editCellComponent"
      }, {
        tmplOption: "groupCellTemplate",
        render: "groupCellRender",
        component: "groupCellComponent"
      }, {
        tmplOption: "headerCellTemplate",
        render: "headerCellRender",
        component: "headerCellComponent"
      }],
    },
  });
};

const Column = Object.assign<typeof _componentColumn, NestedComponentMeta>(_componentColumn, {
  componentType: "option",
});

// owners:
// Column
type IColumnButtonProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  hint?: string;
  icon?: string;
  name?: DataGridPredefinedColumnButton | string;
  onClick?: ((e: ColumnButtonClickEvent) => void);
  template?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, key: any, row: dxDataGridRowObject, rowIndex: number, rowType: string }) => string | any) | template;
  text?: string;
  visible?: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentColumnButton = (props: IColumnButtonProps) => {
  return React.createElement(NestedOption<IColumnButtonProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "buttons",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const ColumnButton = Object.assign<typeof _componentColumnButton, NestedComponentMeta>(_componentColumnButton, {
  componentType: "option",
});

// owners:
// DataGrid
type IColumnChooserProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  container?: any | string | undefined;
  emptyPanelText?: string;
  enabled?: boolean;
  height?: number | string;
  mode?: ColumnChooserMode;
  position?: PositionConfig | undefined;
  search?: ColumnChooserSearchConfig;
  searchTimeout?: number;
  selection?: ColumnChooserSelectionConfig;
  sortOrder?: SortOrder | undefined;
  title?: string;
  width?: number | string;
}>
const _componentColumnChooser = (props: IColumnChooserProps) => {
  return React.createElement(NestedOption<IColumnChooserProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "columnChooser",
      ExpectedChildren: {
        columnChooserSearch: { optionName: "search", isCollectionItem: false },
        columnChooserSelection: { optionName: "selection", isCollectionItem: false },
        position: { optionName: "position", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false },
        selection: { optionName: "selection", isCollectionItem: false }
      },
    },
  });
};

const ColumnChooser = Object.assign<typeof _componentColumnChooser, NestedComponentMeta>(_componentColumnChooser, {
  componentType: "option",
});

// owners:
// ColumnChooser
type IColumnChooserSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  timeout?: number;
}>
const _componentColumnChooserSearch = (props: IColumnChooserSearchProps) => {
  return React.createElement(NestedOption<IColumnChooserSearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const ColumnChooserSearch = Object.assign<typeof _componentColumnChooserSearch, NestedComponentMeta>(_componentColumnChooserSearch, {
  componentType: "option",
});

// owners:
// ColumnChooser
type IColumnChooserSelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  recursive?: boolean;
  selectByClick?: boolean;
}>
const _componentColumnChooserSelection = (props: IColumnChooserSelectionProps) => {
  return React.createElement(NestedOption<IColumnChooserSelectionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selection",
    },
  });
};

const ColumnChooserSelection = Object.assign<typeof _componentColumnChooserSelection, NestedComponentMeta>(_componentColumnChooserSelection, {
  componentType: "option",
});

// owners:
// DataGrid
type IColumnFixingProps = React.PropsWithChildren<{
  enabled?: boolean;
  icons?: Record<string, any> | {
    fix?: string;
    leftPosition?: string;
    rightPosition?: string;
    stickyPosition?: string;
    unfix?: string;
  };
  texts?: Record<string, any> | {
    fix?: string;
    leftPosition?: string;
    rightPosition?: string;
    stickyPosition?: string;
    unfix?: string;
  };
}>
const _componentColumnFixing = (props: IColumnFixingProps) => {
  return React.createElement(NestedOption<IColumnFixingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "columnFixing",
      ExpectedChildren: {
        columnFixingTexts: { optionName: "texts", isCollectionItem: false },
        icons: { optionName: "icons", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const ColumnFixing = Object.assign<typeof _componentColumnFixing, NestedComponentMeta>(_componentColumnFixing, {
  componentType: "option",
});

// owners:
// ColumnFixing
type IColumnFixingTextsProps = React.PropsWithChildren<{
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  stickyPosition?: string;
  unfix?: string;
}>
const _componentColumnFixingTexts = (props: IColumnFixingTextsProps) => {
  return React.createElement(NestedOption<IColumnFixingTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const ColumnFixingTexts = Object.assign<typeof _componentColumnFixingTexts, NestedComponentMeta>(_componentColumnFixingTexts, {
  componentType: "option",
});

// owners:
// Column
type IColumnHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store | undefined;
  groupInterval?: HeaderFilterGroupInterval | number | undefined;
  height?: number | string | undefined;
  search?: ColumnHeaderFilterSearchConfig;
  searchMode?: SearchMode;
  width?: number | string | undefined;
}>
const _componentColumnHeaderFilter = (props: IColumnHeaderFilterProps) => {
  return React.createElement(NestedOption<IColumnHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        columnHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false }
      },
    },
  });
};

const ColumnHeaderFilter = Object.assign<typeof _componentColumnHeaderFilter, NestedComponentMeta>(_componentColumnHeaderFilter, {
  componentType: "option",
});

// owners:
// ColumnHeaderFilter
type IColumnHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  searchExpr?: Array<(() => any) | string> | (() => any) | string | undefined;
  timeout?: number;
}>
const _componentColumnHeaderFilterSearch = (props: IColumnHeaderFilterSearchProps) => {
  return React.createElement(NestedOption<IColumnHeaderFilterSearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const ColumnHeaderFilterSearch = Object.assign<typeof _componentColumnHeaderFilterSearch, NestedComponentMeta>(_componentColumnHeaderFilterSearch, {
  componentType: "option",
});

// owners:
// Column
type IColumnLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  calculateCellValue?: ((rowData: any) => any);
  dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store | undefined;
  displayExpr?: ((data: any) => string) | string | undefined;
  valueExpr?: string | undefined;
}>
const _componentColumnLookup = (props: IColumnLookupProps) => {
  return React.createElement(NestedOption<IColumnLookupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "lookup",
    },
  });
};

const ColumnLookup = Object.assign<typeof _componentColumnLookup, NestedComponentMeta>(_componentColumnLookup, {
  componentType: "option",
});

// owners:
// FormItem
// Column
// SimpleItem
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => any);
  comparisonType?: ComparisonOperator;
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentCompareRule = (props: ICompareRuleProps) => {
  return React.createElement(NestedOption<ICompareRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "compare"
      },
    },
  });
};

const CompareRule = Object.assign<typeof _componentCompareRule, NestedComponentMeta>(_componentCompareRule, {
  componentType: "option",
});

// owners:
// RowDragging
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentCursorOffset = (props: ICursorOffsetProps) => {
  return React.createElement(NestedOption<ICursorOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "cursorOffset",
    },
  });
};

const CursorOffset = Object.assign<typeof _componentCursorOffset, NestedComponentMeta>(_componentCursorOffset, {
  componentType: "option",
});

// owners:
// FilterBuilder
type ICustomOperationProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | (() => any) | Array<any>);
  caption?: string | undefined;
  customizeText?: ((fieldInfo: FieldInfo) => string);
  dataTypes?: Array<DataType> | undefined;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template;
  hasValue?: boolean;
  icon?: string | undefined;
  name?: string | undefined;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
}>
const _componentCustomOperation = (props: ICustomOperationProps) => {
  return React.createElement(NestedOption<ICustomOperationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "customOperations",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "editorTemplate",
        render: "editorRender",
        component: "editorComponent"
      }],
    },
  });
};

const CustomOperation = Object.assign<typeof _componentCustomOperation, NestedComponentMeta>(_componentCustomOperation, {
  componentType: "option",
});

// owners:
// FormItem
// Column
// SimpleItem
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: any }) => boolean);
}>
const _componentCustomRule = (props: ICustomRuleProps) => {
  return React.createElement(NestedOption<ICustomRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "custom"
      },
    },
  });
};

const CustomRule = Object.assign<typeof _componentCustomRule, NestedComponentMeta>(_componentCustomRule, {
  componentType: "option",
});

// owners:
// DataGrid
type IDataGridHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  height?: number | string;
  search?: HeaderFilterSearchConfig;
  searchTimeout?: number;
  texts?: HeaderFilterTexts;
  visible?: boolean;
  width?: number | string;
}>
const _componentDataGridHeaderFilter = (props: IDataGridHeaderFilterProps) => {
  return React.createElement(NestedOption<IDataGridHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        dataGridHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        dataGridHeaderFilterTexts: { optionName: "texts", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const DataGridHeaderFilter = Object.assign<typeof _componentDataGridHeaderFilter, NestedComponentMeta>(_componentDataGridHeaderFilter, {
  componentType: "option",
});

// owners:
// DataGridHeaderFilter
type IDataGridHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  timeout?: number;
}>
const _componentDataGridHeaderFilterSearch = (props: IDataGridHeaderFilterSearchProps) => {
  return React.createElement(NestedOption<IDataGridHeaderFilterSearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const DataGridHeaderFilterSearch = Object.assign<typeof _componentDataGridHeaderFilterSearch, NestedComponentMeta>(_componentDataGridHeaderFilterSearch, {
  componentType: "option",
});

// owners:
// DataGridHeaderFilter
type IDataGridHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
const _componentDataGridHeaderFilterTexts = (props: IDataGridHeaderFilterTextsProps) => {
  return React.createElement(NestedOption<IDataGridHeaderFilterTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const DataGridHeaderFilterTexts = Object.assign<typeof _componentDataGridHeaderFilterTexts, NestedComponentMeta>(_componentDataGridHeaderFilterTexts, {
  componentType: "option",
});

// owners:
// DataGrid
type IDataGridSelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  deferred?: boolean;
  mode?: SingleMultipleOrNone;
  selectAllMode?: SelectAllMode;
  sensitivity?: SelectionSensitivity;
  showCheckBoxesMode?: SelectionColumnDisplayMode;
}>
const _componentDataGridSelection = (props: IDataGridSelectionProps) => {
  return React.createElement(NestedOption<IDataGridSelectionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selection",
    },
  });
};

const DataGridSelection = Object.assign<typeof _componentDataGridSelection, NestedComponentMeta>(_componentDataGridSelection, {
  componentType: "option",
});

// owners:
// Toolbar
type IDataGridToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: DataGridPredefinedToolbarItem | string;
  options?: any;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentDataGridToolbarItem = (props: IDataGridToolbarItemProps) => {
  return React.createElement(NestedOption<IDataGridToolbarItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "menuItemTemplate",
        render: "menuItemRender",
        component: "menuItemComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const DataGridToolbarItem = Object.assign<typeof _componentDataGridToolbarItem, NestedComponentMeta>(_componentDataGridToolbarItem, {
  componentType: "option",
});

// owners:
// DataGrid
type IEditingProps = React.PropsWithChildren<{
  allowAdding?: boolean;
  allowDeleting?: boolean | ((options: { component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  allowUpdating?: boolean | ((options: { component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  changes?: Array<DataChange>;
  confirmDelete?: boolean;
  editColumnName?: string;
  editRowKey?: any;
  form?: dxFormOptions;
  mode?: GridsEditMode;
  newRowPosition?: NewRowPosition;
  popup?: dxPopupOptions<any>;
  refreshMode?: GridsEditRefreshMode;
  selectTextOnEditStart?: boolean;
  startEditAction?: StartEditAction;
  texts?: any | {
    addRow?: string;
    cancelAllChanges?: string;
    cancelRowChanges?: string;
    confirmDeleteMessage?: string;
    confirmDeleteTitle?: string;
    deleteRow?: string;
    editRow?: string;
    saveAllChanges?: string;
    saveRowChanges?: string;
    undeleteRow?: string;
    validationCancelChanges?: string;
  };
  useIcons?: boolean;
  defaultChanges?: Array<DataChange>;
  onChangesChange?: (value: Array<DataChange>) => void;
  defaultEditColumnName?: string;
  onEditColumnNameChange?: (value: string) => void;
  defaultEditRowKey?: any;
  onEditRowKeyChange?: (value: any) => void;
}>
const _componentEditing = (props: IEditingProps) => {
  return React.createElement(NestedOption<IEditingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "editing",
      DefaultsProps: {
        defaultChanges: "changes",
        defaultEditColumnName: "editColumnName",
        defaultEditRowKey: "editRowKey"
      },
      ExpectedChildren: {
        change: { optionName: "changes", isCollectionItem: true },
        editingTexts: { optionName: "texts", isCollectionItem: false },
        form: { optionName: "form", isCollectionItem: false },
        popup: { optionName: "popup", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const Editing = Object.assign<typeof _componentEditing, NestedComponentMeta>(_componentEditing, {
  componentType: "option",
});

// owners:
// Editing
type IEditingTextsProps = React.PropsWithChildren<{
  addRow?: string;
  cancelAllChanges?: string;
  cancelRowChanges?: string;
  confirmDeleteMessage?: string;
  confirmDeleteTitle?: string;
  deleteRow?: string;
  editRow?: string;
  saveAllChanges?: string;
  saveRowChanges?: string;
  undeleteRow?: string;
  validationCancelChanges?: string;
}>
const _componentEditingTexts = (props: IEditingTextsProps) => {
  return React.createElement(NestedOption<IEditingTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const EditingTexts = Object.assign<typeof _componentEditingTexts, NestedComponentMeta>(_componentEditingTexts, {
  componentType: "option",
});

// owners:
// AI
type IEditorOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  buttons?: Array<string | TextBoxPredefinedButton | TextEditorButton>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  inputAttr?: any;
  isDirty?: boolean;
  isValid?: boolean;
  label?: string;
  labelMode?: LabelMode;
  mask?: string;
  maskChar?: string;
  maskInvalidMessage?: string;
  maskRules?: any;
  maxLength?: number | string;
  mode?: TextBoxType;
  name?: string;
  onChange?: ((e: ChangeEvent) => void);
  onContentReady?: ((e: TextBoxContentReadyEvent) => void);
  onCopy?: ((e: CopyEvent) => void);
  onCut?: ((e: CutEvent) => void);
  onDisposing?: ((e: TextBoxDisposingEvent) => void);
  onEnterKey?: ((e: EnterKeyEvent) => void);
  onFocusIn?: ((e: FocusInEvent) => void);
  onFocusOut?: ((e: FocusOutEvent) => void);
  onInitialized?: ((e: TextBoxInitializedEvent) => void);
  onInput?: ((e: InputEvent) => void);
  onKeyDown?: ((e: TextBoxKeyDownEvent) => void);
  onKeyUp?: ((e: KeyUpEvent) => void);
  onOptionChanged?: ((e: TextBoxOptionChangedEvent) => void);
  onPaste?: ((e: PasteEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
  placeholder?: string;
  readOnly?: boolean;
  rtlEnabled?: boolean;
  showClearButton?: boolean;
  showMaskMode?: MaskMode;
  spellcheck?: boolean;
  stylingMode?: EditorStyle;
  tabIndex?: number;
  text?: string;
  useMaskedValue?: boolean;
  validationError?: any;
  validationErrors?: Array<any>;
  validationMessageMode?: ValidationMessageMode;
  validationMessagePosition?: CommonPosition;
  validationStatus?: ValidationStatus;
  value?: string;
  valueChangeEvent?: string;
  visible?: boolean;
  width?: number | string | undefined;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>
const _componentEditorOptions = (props: IEditorOptionsProps) => {
  return React.createElement(NestedOption<IEditorOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "editorOptions",
      DefaultsProps: {
        defaultValue: "value"
      },
      ExpectedChildren: {
        button: { optionName: "buttons", isCollectionItem: true },
        editorOptionsButton: { optionName: "buttons", isCollectionItem: true }
      },
    },
  });
};

const EditorOptions = Object.assign<typeof _componentEditorOptions, NestedComponentMeta>(_componentEditorOptions, {
  componentType: "option",
});

// owners:
// EditorOptions
type IEditorOptionsButtonProps = React.PropsWithChildren<{
  location?: TextEditorButtonLocation;
  name?: string | undefined;
  options?: dxButtonOptions | undefined;
}>
const _componentEditorOptionsButton = (props: IEditorOptionsButtonProps) => {
  return React.createElement(NestedOption<IEditorOptionsButtonProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "buttons",
      IsCollectionItem: true,
      ExpectedChildren: {
        options: { optionName: "options", isCollectionItem: false }
      },
    },
  });
};

const EditorOptionsButton = Object.assign<typeof _componentEditorOptionsButton, NestedComponentMeta>(_componentEditorOptionsButton, {
  componentType: "option",
});

// owners:
// FormItem
// Column
// SimpleItem
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentEmailRule = (props: IEmailRuleProps) => {
  return React.createElement(NestedOption<IEmailRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "email"
      },
    },
  });
};

const EmailRule = Object.assign<typeof _componentEmailRule, NestedComponentMeta>(_componentEmailRule, {
  componentType: "option",
});

// owners:
// Form
type IEmptyItemProps = React.PropsWithChildren<{
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  itemType?: FormItemType;
  name?: string | undefined;
  visible?: boolean;
  visibleIndex?: number | undefined;
}>
const _componentEmptyItem = (props: IEmptyItemProps) => {
  return React.createElement(NestedOption<IEmptyItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      PredefinedProps: {
        itemType: "empty"
      },
    },
  });
};

const EmptyItem = Object.assign<typeof _componentEmptyItem, NestedComponentMeta>(_componentEmptyItem, {
  componentType: "option",
});

// owners:
// DataGrid
type IExportProps = React.PropsWithChildren<{
  allowExportSelectedData?: boolean;
  enabled?: boolean;
  formats?: Array<DataGridExportFormat | string>;
  texts?: Record<string, any> | {
    exportAll?: string;
    exportSelectedRows?: string;
    exportTo?: string;
  };
}>
const _componentExport = (props: IExportProps) => {
  return React.createElement(NestedOption<IExportProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "export",
      ExpectedChildren: {
        exportTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const Export = Object.assign<typeof _componentExport, NestedComponentMeta>(_componentExport, {
  componentType: "option",
});

// owners:
// Export
type IExportTextsProps = React.PropsWithChildren<{
  exportAll?: string;
  exportSelectedRows?: string;
  exportTo?: string;
}>
const _componentExportTexts = (props: IExportTextsProps) => {
  return React.createElement(NestedOption<IExportTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const ExportTexts = Object.assign<typeof _componentExportTexts, NestedComponentMeta>(_componentExportTexts, {
  componentType: "option",
});

// owners:
// FilterBuilder
type IFieldProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | (() => any) | Array<any>);
  caption?: string | undefined;
  customizeText?: ((fieldInfo: FieldInfo) => string);
  dataField?: string | undefined;
  dataType?: DataType;
  editorOptions?: any;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, filterOperation: string, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template;
  falseText?: string;
  filterOperations?: Array<FilterBuilderOperation | string>;
  format?: LocalizationFormat;
  lookup?: Record<string, any> | {
    allowClearing?: boolean;
    dataSource?: Array<any> | DataSourceOptions | Store | undefined;
    displayExpr?: ((data: any) => string) | string | undefined;
    valueExpr?: ((data: any) => string | number | boolean) | string | undefined;
  };
  name?: string | undefined;
  trueText?: string;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
}>
const _componentField = (props: IFieldProps) => {
  return React.createElement(NestedOption<IFieldProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "fields",
      IsCollectionItem: true,
      ExpectedChildren: {
        fieldLookup: { optionName: "lookup", isCollectionItem: false },
        format: { optionName: "format", isCollectionItem: false },
        lookup: { optionName: "lookup", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "editorTemplate",
        render: "editorRender",
        component: "editorComponent"
      }],
    },
  });
};

const Field = Object.assign<typeof _componentField, NestedComponentMeta>(_componentField, {
  componentType: "option",
});

// owners:
// Field
type IFieldLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  dataSource?: Array<any> | DataSourceOptions | Store | undefined;
  displayExpr?: ((data: any) => string) | string | undefined;
  valueExpr?: ((data: any) => string | number | boolean) | string | undefined;
}>
const _componentFieldLookup = (props: IFieldLookupProps) => {
  return React.createElement(NestedOption<IFieldLookupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "lookup",
    },
  });
};

const FieldLookup = Object.assign<typeof _componentFieldLookup, NestedComponentMeta>(_componentFieldLookup, {
  componentType: "option",
});

// owners:
// DataGrid
type IFilterBuilderProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  allowHierarchicalFields?: boolean;
  customOperations?: Array<dxFilterBuilderCustomOperation>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  fields?: Array<dxFilterBuilderField>;
  filterOperationDescriptions?: Record<string, any> | {
    between?: string;
    contains?: string;
    endsWith?: string;
    equal?: string;
    greaterThan?: string;
    greaterThanOrEqual?: string;
    isBlank?: string;
    isNotBlank?: string;
    lessThan?: string;
    lessThanOrEqual?: string;
    notContains?: string;
    notEqual?: string;
    startsWith?: string;
  };
  focusStateEnabled?: boolean;
  groupOperationDescriptions?: Record<string, any> | {
    and?: string;
    notAnd?: string;
    notOr?: string;
    or?: string;
  };
  groupOperations?: Array<GroupOperation>;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  maxGroupLevel?: number | undefined;
  onContentReady?: ((e: FilterBuilderContentReadyEvent) => void);
  onDisposing?: ((e: FilterBuilderDisposingEvent) => void);
  onEditorPrepared?: ((e: FilterBuilderEditorPreparedEvent) => void);
  onEditorPreparing?: ((e: FilterBuilderEditorPreparingEvent) => void);
  onInitialized?: ((e: FilterBuilderInitializedEvent) => void);
  onOptionChanged?: ((e: FilterBuilderOptionChangedEvent) => void);
  onValueChanged?: ((e: FilterBuilderValueChangedEvent) => void);
  rtlEnabled?: boolean;
  tabIndex?: number;
  value?: Array<any> | (() => any) | string;
  visible?: boolean;
  width?: number | string | undefined;
  defaultValue?: Array<any> | (() => any) | string;
  onValueChange?: (value: Array<any> | (() => any) | string) => void;
}>
const _componentFilterBuilder = (props: IFilterBuilderProps) => {
  return React.createElement(NestedOption<IFilterBuilderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "filterBuilder",
      DefaultsProps: {
        defaultValue: "value"
      },
      ExpectedChildren: {
        customOperation: { optionName: "customOperations", isCollectionItem: true },
        field: { optionName: "fields", isCollectionItem: true },
        filterOperationDescriptions: { optionName: "filterOperationDescriptions", isCollectionItem: false },
        groupOperationDescriptions: { optionName: "groupOperationDescriptions", isCollectionItem: false }
      },
    },
  });
};

const FilterBuilder = Object.assign<typeof _componentFilterBuilder, NestedComponentMeta>(_componentFilterBuilder, {
  componentType: "option",
});

// owners:
// DataGrid
type IFilterBuilderPopupProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  container?: any | string | undefined;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string | undefined;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onHidden?: ((e: EventInfo<any>) => void);
  onHiding?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onResize?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeEnd?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeStart?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onShowing?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onShown?: ((e: EventInfo<any>) => void);
  onTitleRendered?: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void);
  position?: (() => void) | PositionAlignment | PositionConfig;
  resizeEnabled?: boolean;
  restorePosition?: boolean;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  tabFocusLoopEnabled?: boolean;
  tabIndex?: number;
  title?: string;
  titleTemplate?: ((titleElement: any) => string | any) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: number | string;
  wrapperAttr?: any;
  defaultHeight?: number | string;
  onHeightChange?: (value: number | string) => void;
  defaultPosition?: (() => void) | PositionAlignment | PositionConfig;
  onPositionChange?: (value: (() => void) | PositionAlignment | PositionConfig) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: number | string;
  onWidthChange?: (value: number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
}>
const _componentFilterBuilderPopup = (props: IFilterBuilderPopupProps) => {
  return React.createElement(NestedOption<IFilterBuilderPopupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "filterBuilderPopup",
      DefaultsProps: {
        defaultHeight: "height",
        defaultPosition: "position",
        defaultVisible: "visible",
        defaultWidth: "width"
      },
      ExpectedChildren: {
        animation: { optionName: "animation", isCollectionItem: false },
        position: { optionName: "position", isCollectionItem: false },
        toolbarItem: { optionName: "toolbarItems", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "contentTemplate",
        render: "contentRender",
        component: "contentComponent"
      }, {
        tmplOption: "titleTemplate",
        render: "titleRender",
        component: "titleComponent"
      }],
    },
  });
};

const FilterBuilderPopup = Object.assign<typeof _componentFilterBuilderPopup, NestedComponentMeta>(_componentFilterBuilderPopup, {
  componentType: "option",
});

// owners:
// FilterBuilder
type IFilterOperationDescriptionsProps = React.PropsWithChildren<{
  between?: string;
  contains?: string;
  endsWith?: string;
  equal?: string;
  greaterThan?: string;
  greaterThanOrEqual?: string;
  isBlank?: string;
  isNotBlank?: string;
  lessThan?: string;
  lessThanOrEqual?: string;
  notContains?: string;
  notEqual?: string;
  startsWith?: string;
}>
const _componentFilterOperationDescriptions = (props: IFilterOperationDescriptionsProps) => {
  return React.createElement(NestedOption<IFilterOperationDescriptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "filterOperationDescriptions",
    },
  });
};

const FilterOperationDescriptions = Object.assign<typeof _componentFilterOperationDescriptions, NestedComponentMeta>(_componentFilterOperationDescriptions, {
  componentType: "option",
});

// owners:
// DataGrid
type IFilterPanelProps = React.PropsWithChildren<{
  customizeText?: ((e: { component: GridsFilterPanel, filterValue: Record<string, any>, text: string }) => string);
  filterEnabled?: boolean;
  texts?: GridsFilterPanelTexts;
  visible?: boolean;
  defaultFilterEnabled?: boolean;
  onFilterEnabledChange?: (value: boolean) => void;
}>
const _componentFilterPanel = (props: IFilterPanelProps) => {
  return React.createElement(NestedOption<IFilterPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "filterPanel",
      DefaultsProps: {
        defaultFilterEnabled: "filterEnabled"
      },
      ExpectedChildren: {
        filterPanelTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const FilterPanel = Object.assign<typeof _componentFilterPanel, NestedComponentMeta>(_componentFilterPanel, {
  componentType: "option",
});

// owners:
// FilterPanel
type IFilterPanelTextsProps = React.PropsWithChildren<{
  clearFilter?: string;
  createFilter?: string;
  filterEnabledHint?: string;
}>
const _componentFilterPanelTexts = (props: IFilterPanelTextsProps) => {
  return React.createElement(NestedOption<IFilterPanelTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const FilterPanelTexts = Object.assign<typeof _componentFilterPanelTexts, NestedComponentMeta>(_componentFilterPanelTexts, {
  componentType: "option",
});

// owners:
// DataGrid
type IFilterRowProps = React.PropsWithChildren<{
  applyFilter?: ApplyFilterMode;
  applyFilterText?: string;
  betweenEndText?: string;
  betweenStartText?: string;
  operationDescriptions?: Record<string, any> | {
    between?: string;
    contains?: string;
    endsWith?: string;
    equal?: string;
    greaterThan?: string;
    greaterThanOrEqual?: string;
    lessThan?: string;
    lessThanOrEqual?: string;
    notContains?: string;
    notEqual?: string;
    startsWith?: string;
  };
  resetOperationText?: string;
  showAllText?: string;
  showOperationChooser?: boolean;
  visible?: boolean;
}>
const _componentFilterRow = (props: IFilterRowProps) => {
  return React.createElement(NestedOption<IFilterRowProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "filterRow",
      ExpectedChildren: {
        operationDescriptions: { optionName: "operationDescriptions", isCollectionItem: false }
      },
    },
  });
};

const FilterRow = Object.assign<typeof _componentFilterRow, NestedComponentMeta>(_componentFilterRow, {
  componentType: "option",
});

// owners:
// Editing
type IFormProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  aiIntegration?: AIIntegration | undefined;
  alignItemLabels?: boolean;
  alignItemLabelsInAllGroups?: boolean;
  colCount?: Mode | number;
  colCountByScreen?: Record<string, any> | {
    lg?: number | undefined;
    md?: number | undefined;
    sm?: number | undefined;
    xs?: number | undefined;
  };
  customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => void);
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  formData?: any;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  isDirty?: boolean;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  labelLocation?: LabelLocation;
  labelMode?: FormLabelMode;
  minColWidth?: number;
  onContentReady?: ((e: FormContentReadyEvent) => void);
  onDisposing?: ((e: FormDisposingEvent) => void);
  onEditorEnterKey?: ((e: EditorEnterKeyEvent) => void);
  onFieldDataChanged?: ((e: FieldDataChangedEvent) => void);
  onInitialized?: ((e: FormInitializedEvent) => void);
  onOptionChanged?: ((e: FormOptionChangedEvent) => void);
  onSmartPasted?: ((e: SmartPastedEvent) => void);
  onSmartPasting?: ((e: SmartPastingEvent) => void);
  optionalMark?: string;
  readOnly?: boolean;
  requiredMark?: string;
  requiredMessage?: string;
  rtlEnabled?: boolean;
  screenByWidth?: (() => void);
  scrollingEnabled?: boolean;
  showColonAfterLabel?: boolean;
  showOptionalMark?: boolean;
  showRequiredMark?: boolean;
  showValidationSummary?: boolean;
  tabIndex?: number;
  validationGroup?: string | undefined;
  visible?: boolean;
  width?: number | string | undefined;
  defaultFormData?: any;
  onFormDataChange?: (value: any) => void;
}>
const _componentForm = (props: IFormProps) => {
  return React.createElement(NestedOption<IFormProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "form",
      DefaultsProps: {
        defaultFormData: "formData"
      },
      ExpectedChildren: {
        ButtonItem: { optionName: "items", isCollectionItem: true },
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false },
        EmptyItem: { optionName: "items", isCollectionItem: true },
        FormGroupItem: { optionName: "items", isCollectionItem: true },
        item: { optionName: "items", isCollectionItem: true },
        SimpleItem: { optionName: "items", isCollectionItem: true },
        TabbedItem: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Form = Object.assign<typeof _componentForm, NestedComponentMeta>(_componentForm, {
  componentType: "option",
});

// owners:
// Column
// Field
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: CommonFormat | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentFormat = (props: IFormatProps) => {
  return React.createElement(NestedOption<IFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "format",
    },
  });
};

const Format = Object.assign<typeof _componentFormat, NestedComponentMeta>(_componentFormat, {
  componentType: "option",
});

// owners:
// Form
type IFormGroupItemProps = React.PropsWithChildren<{
  alignItemLabels?: boolean;
  caption?: string | undefined;
  captionTemplate?: ((data: { caption: string, component: dxForm, name: string }, itemElement: any) => string | any) | template;
  colCount?: number;
  colCountByScreen?: Record<string, any> | {
    lg?: number | undefined;
    md?: number | undefined;
    sm?: number | undefined;
    xs?: number | undefined;
  };
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  itemType?: FormItemType;
  name?: string | undefined;
  template?: ((data: { component: dxForm, formData: Record<string, any> }, itemElement: any) => string | any) | template;
  visible?: boolean;
  visibleIndex?: number | undefined;
  captionRender?: (...params: any) => React.ReactNode;
  captionComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentFormGroupItem = (props: IFormGroupItemProps) => {
  return React.createElement(NestedOption<IFormGroupItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "captionTemplate",
        render: "captionRender",
        component: "captionComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
      PredefinedProps: {
        itemType: "group"
      },
    },
  });
};

const FormGroupItem = Object.assign<typeof _componentFormGroupItem, NestedComponentMeta>(_componentFormGroupItem, {
  componentType: "option",
});

// owners:
// Column
type IFormItemProps = React.PropsWithChildren<{
  aiOptions?: Record<string, any> | {
    disabled?: boolean;
    instruction?: string | undefined;
  };
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  dataField?: string | undefined;
  editorOptions?: any | undefined;
  editorType?: FormItemComponent;
  helpText?: string | undefined;
  isRequired?: boolean | undefined;
  itemType?: FormItemType;
  label?: Record<string, any> | {
    alignment?: HorizontalAlignment;
    location?: LabelLocation;
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
    text?: string | undefined;
    visible?: boolean;
  };
  name?: string | undefined;
  template?: ((data: { component: dxForm, dataField: string, editorOptions: Record<string, any>, editorType: string, name: string }, itemElement: any) => string | any) | template;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentFormItem = (props: IFormItemProps) => {
  return React.createElement(NestedOption<IFormItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "formItem",
      ExpectedChildren: {
        aiOptions: { optionName: "aiOptions", isCollectionItem: false },
        AsyncRule: { optionName: "validationRules", isCollectionItem: true },
        CompareRule: { optionName: "validationRules", isCollectionItem: true },
        CustomRule: { optionName: "validationRules", isCollectionItem: true },
        EmailRule: { optionName: "validationRules", isCollectionItem: true },
        label: { optionName: "label", isCollectionItem: false },
        NumericRule: { optionName: "validationRules", isCollectionItem: true },
        PatternRule: { optionName: "validationRules", isCollectionItem: true },
        RangeRule: { optionName: "validationRules", isCollectionItem: true },
        RequiredRule: { optionName: "validationRules", isCollectionItem: true },
        StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
        validationRule: { optionName: "validationRules", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const FormItem = Object.assign<typeof _componentFormItem, NestedComponentMeta>(_componentFormItem, {
  componentType: "option",
});

// owners:
// Hide
// Show
type IFromProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentFrom = (props: IFromProps) => {
  return React.createElement(NestedOption<IFromProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "from",
      ExpectedChildren: {
        position: { optionName: "position", isCollectionItem: false }
      },
    },
  });
};

const From = Object.assign<typeof _componentFrom, NestedComponentMeta>(_componentFrom, {
  componentType: "option",
});

// owners:
// DataGrid
type IGroupingProps = React.PropsWithChildren<{
  allowCollapsing?: boolean;
  autoExpandAll?: boolean;
  contextMenuEnabled?: boolean;
  expandMode?: GroupExpandMode;
  texts?: Record<string, any> | {
    groupByThisColumn?: string;
    groupContinuedMessage?: string;
    groupContinuesMessage?: string;
    ungroup?: string;
    ungroupAll?: string;
  };
}>
const _componentGrouping = (props: IGroupingProps) => {
  return React.createElement(NestedOption<IGroupingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "grouping",
      ExpectedChildren: {
        groupingTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const Grouping = Object.assign<typeof _componentGrouping, NestedComponentMeta>(_componentGrouping, {
  componentType: "option",
});

// owners:
// Grouping
type IGroupingTextsProps = React.PropsWithChildren<{
  groupByThisColumn?: string;
  groupContinuedMessage?: string;
  groupContinuesMessage?: string;
  ungroup?: string;
  ungroupAll?: string;
}>
const _componentGroupingTexts = (props: IGroupingTextsProps) => {
  return React.createElement(NestedOption<IGroupingTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const GroupingTexts = Object.assign<typeof _componentGroupingTexts, NestedComponentMeta>(_componentGroupingTexts, {
  componentType: "option",
});

// owners:
// Summary
type IGroupItemProps = React.PropsWithChildren<{
  alignByColumn?: boolean;
  column?: string | undefined;
  customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
  displayFormat?: string | undefined;
  name?: string | undefined;
  showInColumn?: string | undefined;
  showInGroupFooter?: boolean;
  skipEmptyValues?: boolean;
  summaryType?: string | SummaryType | undefined;
  valueFormat?: LocalizationFormat | undefined;
}>
const _componentGroupItem = (props: IGroupItemProps) => {
  return React.createElement(NestedOption<IGroupItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "groupItems",
      IsCollectionItem: true,
      ExpectedChildren: {
        valueFormat: { optionName: "valueFormat", isCollectionItem: false }
      },
    },
  });
};

const GroupItem = Object.assign<typeof _componentGroupItem, NestedComponentMeta>(_componentGroupItem, {
  componentType: "option",
});

// owners:
// FilterBuilder
type IGroupOperationDescriptionsProps = React.PropsWithChildren<{
  and?: string;
  notAnd?: string;
  notOr?: string;
  or?: string;
}>
const _componentGroupOperationDescriptions = (props: IGroupOperationDescriptionsProps) => {
  return React.createElement(NestedOption<IGroupOperationDescriptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "groupOperationDescriptions",
    },
  });
};

const GroupOperationDescriptions = Object.assign<typeof _componentGroupOperationDescriptions, NestedComponentMeta>(_componentGroupOperationDescriptions, {
  componentType: "option",
});

// owners:
// DataGrid
type IGroupPanelProps = React.PropsWithChildren<{
  allowColumnDragging?: boolean;
  emptyPanelText?: string;
  visible?: boolean | Mode;
  defaultVisible?: boolean | Mode;
  onVisibleChange?: (value: boolean | Mode) => void;
}>
const _componentGroupPanel = (props: IGroupPanelProps) => {
  return React.createElement(NestedOption<IGroupPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "groupPanel",
      DefaultsProps: {
        defaultVisible: "visible"
      },
    },
  });
};

const GroupPanel = Object.assign<typeof _componentGroupPanel, NestedComponentMeta>(_componentGroupPanel, {
  componentType: "option",
});

// owners:
// Column
// DataGrid
type IHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store | undefined;
  groupInterval?: HeaderFilterGroupInterval | number | undefined;
  height?: number | string | undefined;
  search?: ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig;
  searchMode?: SearchMode;
  width?: number | string | undefined;
  searchTimeout?: number;
  texts?: HeaderFilterTexts;
  visible?: boolean;
}>
const _componentHeaderFilter = (props: IHeaderFilterProps) => {
  return React.createElement(NestedOption<IHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        columnHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        dataGridHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        dataGridHeaderFilterTexts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const HeaderFilter = Object.assign<typeof _componentHeaderFilter, NestedComponentMeta>(_componentHeaderFilter, {
  componentType: "option",
});

// owners:
// Animation
type IHideProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: Direction | undefined;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number | undefined;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
}>
const _componentHide = (props: IHideProps) => {
  return React.createElement(NestedOption<IHideProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hide",
      ExpectedChildren: {
        from: { optionName: "from", isCollectionItem: false },
        to: { optionName: "to", isCollectionItem: false }
      },
    },
  });
};

const Hide = Object.assign<typeof _componentHide, NestedComponentMeta>(_componentHide, {
  componentType: "option",
});

// owners:
// ColumnFixing
type IIconsProps = React.PropsWithChildren<{
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  stickyPosition?: string;
  unfix?: string;
}>
const _componentIcons = (props: IIconsProps) => {
  return React.createElement(NestedOption<IIconsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "icons",
    },
  });
};

const Icons = Object.assign<typeof _componentIcons, NestedComponentMeta>(_componentIcons, {
  componentType: "option",
});

// owners:
// LoadPanel
type IIndicatorOptionsProps = React.PropsWithChildren<{
  animationType?: LoadingAnimationType;
  height?: number | string | undefined;
  src?: string;
  width?: number | string | undefined;
}>
const _componentIndicatorOptions = (props: IIndicatorOptionsProps) => {
  return React.createElement(NestedOption<IIndicatorOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "indicatorOptions",
    },
  });
};

const IndicatorOptions = Object.assign<typeof _componentIndicatorOptions, NestedComponentMeta>(_componentIndicatorOptions, {
  componentType: "option",
});

// owners:
// TabPanelOptions
// Form
// Toolbar
type IItemProps = React.PropsWithChildren<{
  badge?: string;
  disabled?: boolean;
  html?: string;
  icon?: string;
  tabTemplate?: (() => string | any) | template;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  title?: string;
  visible?: boolean;
  aiOptions?: Record<string, any> | {
    disabled?: boolean;
    instruction?: string | undefined;
  };
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  dataField?: string | undefined;
  editorOptions?: any | undefined;
  editorType?: FormItemComponent;
  helpText?: string | undefined;
  isRequired?: boolean | undefined;
  itemType?: FormItemType;
  label?: Record<string, any> | {
    alignment?: HorizontalAlignment;
    location?: LabelLocation;
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
    text?: string | undefined;
    visible?: boolean;
  };
  name?: string | undefined | FormPredefinedButtonItem | DataGridPredefinedToolbarItem;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visibleIndex?: number | undefined;
  alignItemLabels?: boolean;
  caption?: string | undefined;
  captionTemplate?: ((data: { caption: string, component: dxForm, name: string }, itemElement: any) => string | any) | template;
  colCount?: number;
  colCountByScreen?: Record<string, any> | {
    lg?: number | undefined;
    md?: number | undefined;
    sm?: number | undefined;
    xs?: number | undefined;
  };
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  tabPanelOptions?: dxTabPanelOptions | undefined;
  tabs?: Array<Record<string, any>> | {
    alignItemLabels?: boolean;
    badge?: string | undefined;
    colCount?: number;
    colCountByScreen?: Record<string, any> | {
      lg?: number | undefined;
      md?: number | undefined;
      sm?: number | undefined;
      xs?: number | undefined;
    };
    disabled?: boolean;
    icon?: string | undefined;
    items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
    tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
    template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
    title?: string | undefined;
  }[];
  buttonOptions?: dxButtonOptions | undefined;
  horizontalAlignment?: HorizontalAlignment;
  verticalAlignment?: VerticalAlignment;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: ShowTextMode;
  widget?: ToolbarItemComponent;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  captionRender?: (...params: any) => React.ReactNode;
  captionComponent?: React.ComponentType<any>;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        aiOptions: { optionName: "aiOptions", isCollectionItem: false },
        AsyncRule: { optionName: "validationRules", isCollectionItem: true },
        buttonOptions: { optionName: "buttonOptions", isCollectionItem: false },
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false },
        CompareRule: { optionName: "validationRules", isCollectionItem: true },
        CustomRule: { optionName: "validationRules", isCollectionItem: true },
        EmailRule: { optionName: "validationRules", isCollectionItem: true },
        label: { optionName: "label", isCollectionItem: false },
        NumericRule: { optionName: "validationRules", isCollectionItem: true },
        PatternRule: { optionName: "validationRules", isCollectionItem: true },
        RangeRule: { optionName: "validationRules", isCollectionItem: true },
        RequiredRule: { optionName: "validationRules", isCollectionItem: true },
        StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
        tab: { optionName: "tabs", isCollectionItem: true },
        tabPanelOptions: { optionName: "tabPanelOptions", isCollectionItem: false },
        validationRule: { optionName: "validationRules", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "tabTemplate",
        render: "tabRender",
        component: "tabComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }, {
        tmplOption: "captionTemplate",
        render: "captionRender",
        component: "captionComponent"
      }, {
        tmplOption: "menuItemTemplate",
        render: "menuItemRender",
        component: "menuItemComponent"
      }],
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// DataGrid
type IKeyboardNavigationProps = React.PropsWithChildren<{
  editOnKeyPress?: boolean;
  enabled?: boolean;
  enterKeyAction?: EnterKeyAction;
  enterKeyDirection?: EnterKeyDirection;
}>
const _componentKeyboardNavigation = (props: IKeyboardNavigationProps) => {
  return React.createElement(NestedOption<IKeyboardNavigationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "keyboardNavigation",
    },
  });
};

const KeyboardNavigation = Object.assign<typeof _componentKeyboardNavigation, NestedComponentMeta>(_componentKeyboardNavigation, {
  componentType: "option",
});

// owners:
// FormItem
// SimpleItem
type ILabelProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  location?: LabelLocation;
  showColon?: boolean;
  template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
  text?: string | undefined;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// DataGrid
type ILoadPanelProps = React.PropsWithChildren<{
  enabled?: boolean | Mode;
  height?: number | string;
  indicatorOptions?: LoadPanelIndicatorProperties;
  indicatorSrc?: string;
  shading?: boolean;
  shadingColor?: string;
  showIndicator?: boolean;
  showPane?: boolean;
  text?: string;
  width?: number | string;
}>
const _componentLoadPanel = (props: ILoadPanelProps) => {
  return React.createElement(NestedOption<ILoadPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "loadPanel",
      ExpectedChildren: {
        indicatorOptions: { optionName: "indicatorOptions", isCollectionItem: false }
      },
    },
  });
};

const LoadPanel = Object.assign<typeof _componentLoadPanel, NestedComponentMeta>(_componentLoadPanel, {
  componentType: "option",
});

// owners:
// Column
// Field
type ILookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  calculateCellValue?: ((rowData: any) => any);
  dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store | undefined;
  displayExpr?: ((data: any) => string) | string | undefined;
  valueExpr?: string | undefined | ((data: any) => string | number | boolean);
}>
const _componentLookup = (props: ILookupProps) => {
  return React.createElement(NestedOption<ILookupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "lookup",
    },
  });
};

const Lookup = Object.assign<typeof _componentLookup, NestedComponentMeta>(_componentLookup, {
  componentType: "option",
});

// owners:
// DataGrid
type IMasterDetailProps = React.PropsWithChildren<{
  autoExpandAll?: boolean;
  enabled?: boolean;
  template?: ((detailElement: any, detailInfo: { data: Record<string, any>, key: any, watch: (() => void) }) => any) | template;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentMasterDetail = (props: IMasterDetailProps) => {
  return React.createElement(NestedOption<IMasterDetailProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "masterDetail",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const MasterDetail = Object.assign<typeof _componentMasterDetail, NestedComponentMeta>(_componentMasterDetail, {
  componentType: "option",
});

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
}>
const _componentMy = (props: IMyProps) => {
  return React.createElement(NestedOption<IMyProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "my",
    },
  });
};

const My = Object.assign<typeof _componentMy, NestedComponentMeta>(_componentMy, {
  componentType: "option",
});

// owners:
// FormItem
// Column
// SimpleItem
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentNumericRule = (props: INumericRuleProps) => {
  return React.createElement(NestedOption<INumericRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "numeric"
      },
    },
  });
};

const NumericRule = Object.assign<typeof _componentNumericRule, NestedComponentMeta>(_componentNumericRule, {
  componentType: "option",
});

// owners:
// Position
type IOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentOffset = (props: IOffsetProps) => {
  return React.createElement(NestedOption<IOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "offset",
    },
  });
};

const Offset = Object.assign<typeof _componentOffset, NestedComponentMeta>(_componentOffset, {
  componentType: "option",
});

// owners:
// FilterRow
type IOperationDescriptionsProps = React.PropsWithChildren<{
  between?: string;
  contains?: string;
  endsWith?: string;
  equal?: string;
  greaterThan?: string;
  greaterThanOrEqual?: string;
  lessThan?: string;
  lessThanOrEqual?: string;
  notContains?: string;
  notEqual?: string;
  startsWith?: string;
}>
const _componentOperationDescriptions = (props: IOperationDescriptionsProps) => {
  return React.createElement(NestedOption<IOperationDescriptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "operationDescriptions",
    },
  });
};

const OperationDescriptions = Object.assign<typeof _componentOperationDescriptions, NestedComponentMeta>(_componentOperationDescriptions, {
  componentType: "option",
});

// owners:
// EditorOptionsButton
type IOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  rtlEnabled?: boolean;
  stylingMode?: ButtonStyle;
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string | any) | template;
  text?: string;
  type?: ButtonType | string;
  useSubmitBehavior?: boolean;
  validationGroup?: string | undefined;
  visible?: boolean;
  width?: number | string | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentOptions = (props: IOptionsProps) => {
  return React.createElement(NestedOption<IOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "options",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Options = Object.assign<typeof _componentOptions, NestedComponentMeta>(_componentOptions, {
  componentType: "option",
});

// owners:
// DataGrid
type IPagerProps = React.PropsWithChildren<{
  allowedPageSizes?: Array<number | PagerPageSize> | Mode;
  displayMode?: DisplayMode;
  infoText?: string;
  label?: string;
  showInfo?: boolean;
  showNavigationButtons?: boolean;
  showPageSizeSelector?: boolean | Mode;
  visible?: boolean | Mode;
}>
const _componentPager = (props: IPagerProps) => {
  return React.createElement(NestedOption<IPagerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "pager",
    },
  });
};

const Pager = Object.assign<typeof _componentPager, NestedComponentMeta>(_componentPager, {
  componentType: "option",
});

// owners:
// DataGrid
type IPagingProps = React.PropsWithChildren<{
  enabled?: boolean;
  pageIndex?: number;
  pageSize?: number;
  defaultPageIndex?: number;
  onPageIndexChange?: (value: number) => void;
  defaultPageSize?: number;
  onPageSizeChange?: (value: number) => void;
}>
const _componentPaging = (props: IPagingProps) => {
  return React.createElement(NestedOption<IPagingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "paging",
      DefaultsProps: {
        defaultPageIndex: "pageIndex",
        defaultPageSize: "pageSize"
      },
    },
  });
};

const Paging = Object.assign<typeof _componentPaging, NestedComponentMeta>(_componentPaging, {
  componentType: "option",
});

// owners:
// FormItem
// Column
// SimpleItem
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: RegExp | string;
  type?: ValidationRuleType;
}>
const _componentPatternRule = (props: IPatternRuleProps) => {
  return React.createElement(NestedOption<IPatternRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "pattern"
      },
    },
  });
};

const PatternRule = Object.assign<typeof _componentPatternRule, NestedComponentMeta>(_componentPatternRule, {
  componentType: "option",
});

// owners:
// AIAssistant
// Editing
type IPopupProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  container?: any | string | undefined;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string | undefined;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onHidden?: ((e: EventInfo<any>) => void);
  onHiding?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onResize?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeEnd?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeStart?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onShowing?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onShown?: ((e: EventInfo<any>) => void);
  onTitleRendered?: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void);
  position?: (() => void) | PositionAlignment | PositionConfig;
  resizeEnabled?: boolean;
  restorePosition?: boolean;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  tabFocusLoopEnabled?: boolean;
  tabIndex?: number;
  title?: string;
  titleTemplate?: ((titleElement: any) => string | any) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: number | string;
  wrapperAttr?: any;
  defaultHeight?: number | string;
  onHeightChange?: (value: number | string) => void;
  defaultPosition?: (() => void) | PositionAlignment | PositionConfig;
  onPositionChange?: (value: (() => void) | PositionAlignment | PositionConfig) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: number | string;
  onWidthChange?: (value: number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
}>
const _componentPopup = (props: IPopupProps) => {
  return React.createElement(NestedOption<IPopupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "popup",
      DefaultsProps: {
        defaultHeight: "height",
        defaultPosition: "position",
        defaultVisible: "visible",
        defaultWidth: "width"
      },
      ExpectedChildren: {
        animation: { optionName: "animation", isCollectionItem: false },
        position: { optionName: "position", isCollectionItem: false },
        toolbarItem: { optionName: "toolbarItems", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "contentTemplate",
        render: "contentRender",
        component: "contentComponent"
      }, {
        tmplOption: "titleTemplate",
        render: "titleRender",
        component: "titleComponent"
      }],
    },
  });
};

const Popup = Object.assign<typeof _componentPopup, NestedComponentMeta>(_componentPopup, {
  componentType: "option",
});

// owners:
// From
// To
// Popup
// ColumnChooser
// FilterBuilderPopup
type IPositionProps = React.PropsWithChildren<{
  at?: Record<string, any> | PositionAlignment | {
    x?: HorizontalAlignment;
    y?: VerticalAlignment;
  };
  boundary?: any | string;
  boundaryOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  collision?: CollisionResolutionCombination | Record<string, any> | {
    x?: CollisionResolution;
    y?: CollisionResolution;
  };
  my?: Record<string, any> | PositionAlignment | {
    x?: HorizontalAlignment;
    y?: VerticalAlignment;
  };
  of?: any | string;
  offset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
}>
const _componentPosition = (props: IPositionProps) => {
  return React.createElement(NestedOption<IPositionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "position",
      ExpectedChildren: {
        at: { optionName: "at", isCollectionItem: false },
        boundaryOffset: { optionName: "boundaryOffset", isCollectionItem: false },
        collision: { optionName: "collision", isCollectionItem: false },
        my: { optionName: "my", isCollectionItem: false },
        offset: { optionName: "offset", isCollectionItem: false }
      },
    },
  });
};

const Position = Object.assign<typeof _componentPosition, NestedComponentMeta>(_componentPosition, {
  componentType: "option",
});

// owners:
// FormItem
// Column
// SimpleItem
type IRangeRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  message?: string;
  min?: Date | number | string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
}>
const _componentRangeRule = (props: IRangeRuleProps) => {
  return React.createElement(NestedOption<IRangeRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "range"
      },
    },
  });
};

const RangeRule = Object.assign<typeof _componentRangeRule, NestedComponentMeta>(_componentRangeRule, {
  componentType: "option",
});

// owners:
// DataGrid
type IRemoteOperationsProps = React.PropsWithChildren<{
  filtering?: boolean;
  grouping?: boolean;
  groupPaging?: boolean;
  paging?: boolean;
  sorting?: boolean;
  summary?: boolean;
}>
const _componentRemoteOperations = (props: IRemoteOperationsProps) => {
  return React.createElement(NestedOption<IRemoteOperationsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "remoteOperations",
    },
  });
};

const RemoteOperations = Object.assign<typeof _componentRemoteOperations, NestedComponentMeta>(_componentRemoteOperations, {
  componentType: "option",
});

// owners:
// FormItem
// Column
// SimpleItem
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: ValidationRuleType;
}>
const _componentRequiredRule = (props: IRequiredRuleProps) => {
  return React.createElement(NestedOption<IRequiredRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "required"
      },
    },
  });
};

const RequiredRule = Object.assign<typeof _componentRequiredRule, NestedComponentMeta>(_componentRequiredRule, {
  componentType: "option",
});

// owners:
// DataGrid
type IRowDraggingProps = React.PropsWithChildren<{
  allowDropInsideItem?: boolean;
  allowReordering?: boolean;
  autoScroll?: boolean;
  boundary?: any | string | undefined;
  container?: any | string | undefined;
  cursorOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  data?: any | undefined;
  dragDirection?: DragDirection;
  dragTemplate?: ((dragInfo: { itemData: any, itemElement: any }, containerElement: any) => string | any) | template | undefined;
  dropFeedbackMode?: DragHighlight;
  filter?: string;
  group?: string | undefined;
  handle?: string;
  onAdd?: ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragChange?: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragEnd?: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragMove?: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragStart?: ((e: { cancel: boolean, component: GridBase, event: event, fromData: any, fromIndex: number, itemData: any, itemElement: any }) => void);
  onRemove?: ((e: { component: GridBase, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onReorder?: ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, promise: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  scrollSensitivity?: number;
  scrollSpeed?: number;
  showDragIcons?: boolean;
  dragRender?: (...params: any) => React.ReactNode;
  dragComponent?: React.ComponentType<any>;
}>
const _componentRowDragging = (props: IRowDraggingProps) => {
  return React.createElement(NestedOption<IRowDraggingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "rowDragging",
      ExpectedChildren: {
        cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "dragTemplate",
        render: "dragRender",
        component: "dragComponent"
      }],
    },
  });
};

const RowDragging = Object.assign<typeof _componentRowDragging, NestedComponentMeta>(_componentRowDragging, {
  componentType: "option",
});

// owners:
// DataGrid
type IScrollingProps = React.PropsWithChildren<{
  columnRenderingMode?: DataRenderMode;
  mode?: DataGridScrollMode;
  preloadEnabled?: boolean;
  renderAsync?: boolean | undefined;
  rowRenderingMode?: DataRenderMode;
  scrollByContent?: boolean;
  scrollByThumb?: boolean;
  showScrollbar?: ScrollbarMode;
  useNative?: boolean | Mode;
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
// ColumnHeaderFilter
// ColumnChooser
// DataGridHeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  searchExpr?: Array<(() => any) | string> | (() => any) | string | undefined;
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
// DataGrid
type ISearchPanelProps = React.PropsWithChildren<{
  highlightCaseSensitive?: boolean;
  highlightSearchText?: boolean;
  placeholder?: string;
  searchVisibleColumnsOnly?: boolean;
  text?: string;
  visible?: boolean;
  width?: number | string;
  defaultText?: string;
  onTextChange?: (value: string) => void;
}>
const _componentSearchPanel = (props: ISearchPanelProps) => {
  return React.createElement(NestedOption<ISearchPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "searchPanel",
      DefaultsProps: {
        defaultText: "text"
      },
    },
  });
};

const SearchPanel = Object.assign<typeof _componentSearchPanel, NestedComponentMeta>(_componentSearchPanel, {
  componentType: "option",
});

// owners:
// DataGrid
// ColumnChooser
type ISelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  deferred?: boolean;
  mode?: SingleMultipleOrNone;
  selectAllMode?: SelectAllMode;
  sensitivity?: SelectionSensitivity;
  showCheckBoxesMode?: SelectionColumnDisplayMode;
  recursive?: boolean;
  selectByClick?: boolean;
}>
const _componentSelection = (props: ISelectionProps) => {
  return React.createElement(NestedOption<ISelectionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selection",
    },
  });
};

const Selection = Object.assign<typeof _componentSelection, NestedComponentMeta>(_componentSelection, {
  componentType: "option",
});

// owners:
// Animation
type IShowProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: Direction | undefined;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number | undefined;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
}>
const _componentShow = (props: IShowProps) => {
  return React.createElement(NestedOption<IShowProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "show",
      ExpectedChildren: {
        from: { optionName: "from", isCollectionItem: false },
        to: { optionName: "to", isCollectionItem: false }
      },
    },
  });
};

const Show = Object.assign<typeof _componentShow, NestedComponentMeta>(_componentShow, {
  componentType: "option",
});

// owners:
// Form
type ISimpleItemProps = React.PropsWithChildren<{
  aiOptions?: Record<string, any> | {
    disabled?: boolean;
    instruction?: string | undefined;
  };
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  dataField?: string | undefined;
  editorOptions?: any | undefined;
  editorType?: FormItemComponent;
  helpText?: string | undefined;
  isRequired?: boolean | undefined;
  itemType?: FormItemType;
  label?: Record<string, any> | {
    alignment?: HorizontalAlignment;
    location?: LabelLocation;
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
    text?: string | undefined;
    visible?: boolean;
  };
  name?: string | undefined;
  template?: ((data: { component: dxForm, dataField: string, editorOptions: Record<string, any>, editorType: string, name: string }, itemElement: any) => string | any) | template;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentSimpleItem = (props: ISimpleItemProps) => {
  return React.createElement(NestedOption<ISimpleItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        aiOptions: { optionName: "aiOptions", isCollectionItem: false },
        AsyncRule: { optionName: "validationRules", isCollectionItem: true },
        CompareRule: { optionName: "validationRules", isCollectionItem: true },
        CustomRule: { optionName: "validationRules", isCollectionItem: true },
        EmailRule: { optionName: "validationRules", isCollectionItem: true },
        label: { optionName: "label", isCollectionItem: false },
        NumericRule: { optionName: "validationRules", isCollectionItem: true },
        PatternRule: { optionName: "validationRules", isCollectionItem: true },
        RangeRule: { optionName: "validationRules", isCollectionItem: true },
        RequiredRule: { optionName: "validationRules", isCollectionItem: true },
        StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
        validationRule: { optionName: "validationRules", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
      PredefinedProps: {
        itemType: "simple"
      },
    },
  });
};

const SimpleItem = Object.assign<typeof _componentSimpleItem, NestedComponentMeta>(_componentSimpleItem, {
  componentType: "option",
});

// owners:
// DataGrid
type ISortByGroupSummaryInfoProps = React.PropsWithChildren<{
  groupColumn?: string | undefined;
  sortOrder?: SortOrder | undefined;
  summaryItem?: number | string | undefined;
}>
const _componentSortByGroupSummaryInfo = (props: ISortByGroupSummaryInfoProps) => {
  return React.createElement(NestedOption<ISortByGroupSummaryInfoProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "sortByGroupSummaryInfo",
      IsCollectionItem: true,
    },
  });
};

const SortByGroupSummaryInfo = Object.assign<typeof _componentSortByGroupSummaryInfo, NestedComponentMeta>(_componentSortByGroupSummaryInfo, {
  componentType: "option",
});

// owners:
// DataGrid
type ISortingProps = React.PropsWithChildren<{
  ascendingText?: string;
  clearText?: string;
  descendingText?: string;
  mode?: SingleMultipleOrNone;
  showSortIndexes?: boolean;
}>
const _componentSorting = (props: ISortingProps) => {
  return React.createElement(NestedOption<ISortingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "sorting",
    },
  });
};

const Sorting = Object.assign<typeof _componentSorting, NestedComponentMeta>(_componentSorting, {
  componentType: "option",
});

// owners:
// DataGrid
type IStateStoringProps = React.PropsWithChildren<{
  customLoad?: (() => any);
  customSave?: ((gridState: any) => void);
  enabled?: boolean;
  savingTimeout?: number;
  storageKey?: string;
  type?: StateStoreType;
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
// FormItem
// Column
// SimpleItem
type IStringLengthRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: number;
  message?: string;
  min?: number;
  trim?: boolean;
  type?: ValidationRuleType;
}>
const _componentStringLengthRule = (props: IStringLengthRuleProps) => {
  return React.createElement(NestedOption<IStringLengthRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "stringLength"
      },
    },
  });
};

const StringLengthRule = Object.assign<typeof _componentStringLengthRule, NestedComponentMeta>(_componentStringLengthRule, {
  componentType: "option",
});

// owners:
// DataGrid
type ISummaryProps = React.PropsWithChildren<{
  calculateCustomSummary?: ((options: { component: dxDataGrid, groupIndex: number, name: string, summaryProcess: string, totalValue: any, value: any }) => void);
  groupItems?: Array<Record<string, any>> | {
    alignByColumn?: boolean;
    column?: string | undefined;
    customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
    displayFormat?: string | undefined;
    name?: string | undefined;
    showInColumn?: string | undefined;
    showInGroupFooter?: boolean;
    skipEmptyValues?: boolean;
    summaryType?: string | SummaryType | undefined;
    valueFormat?: LocalizationFormat | undefined;
  }[];
  recalculateWhileEditing?: boolean;
  skipEmptyValues?: boolean;
  texts?: Record<string, any> | {
    avg?: string;
    avgOtherColumn?: string;
    count?: string;
    max?: string;
    maxOtherColumn?: string;
    min?: string;
    minOtherColumn?: string;
    sum?: string;
    sumOtherColumn?: string;
  };
  totalItems?: Array<Record<string, any>> | {
    alignment?: HorizontalAlignment | undefined;
    column?: string | undefined;
    cssClass?: string | undefined;
    customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
    displayFormat?: string | undefined;
    name?: string | undefined;
    showInColumn?: string | undefined;
    skipEmptyValues?: boolean;
    summaryType?: string | SummaryType | undefined;
    valueFormat?: LocalizationFormat | undefined;
  }[];
}>
const _componentSummary = (props: ISummaryProps) => {
  return React.createElement(NestedOption<ISummaryProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "summary",
      ExpectedChildren: {
        groupItem: { optionName: "groupItems", isCollectionItem: true },
        summaryTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false },
        totalItem: { optionName: "totalItems", isCollectionItem: true }
      },
    },
  });
};

const Summary = Object.assign<typeof _componentSummary, NestedComponentMeta>(_componentSummary, {
  componentType: "option",
});

// owners:
// Summary
type ISummaryTextsProps = React.PropsWithChildren<{
  avg?: string;
  avgOtherColumn?: string;
  count?: string;
  max?: string;
  maxOtherColumn?: string;
  min?: string;
  minOtherColumn?: string;
  sum?: string;
  sumOtherColumn?: string;
}>
const _componentSummaryTexts = (props: ISummaryTextsProps) => {
  return React.createElement(NestedOption<ISummaryTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const SummaryTexts = Object.assign<typeof _componentSummaryTexts, NestedComponentMeta>(_componentSummaryTexts, {
  componentType: "option",
});

// owners:
// TabbedItem
type ITabProps = React.PropsWithChildren<{
  alignItemLabels?: boolean;
  badge?: string | undefined;
  colCount?: number;
  colCountByScreen?: Record<string, any> | {
    lg?: number | undefined;
    md?: number | undefined;
    sm?: number | undefined;
    xs?: number | undefined;
  };
  disabled?: boolean;
  icon?: string | undefined;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
  template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
  title?: string | undefined;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentTab = (props: ITabProps) => {
  return React.createElement(NestedOption<ITabProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tabs",
      IsCollectionItem: true,
      ExpectedChildren: {
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "tabTemplate",
        render: "tabRender",
        component: "tabComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Tab = Object.assign<typeof _componentTab, NestedComponentMeta>(_componentTab, {
  componentType: "option",
});

// owners:
// Form
type ITabbedItemProps = React.PropsWithChildren<{
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  itemType?: FormItemType;
  name?: string | undefined;
  tabPanelOptions?: dxTabPanelOptions | undefined;
  tabs?: Array<Record<string, any>> | {
    alignItemLabels?: boolean;
    badge?: string | undefined;
    colCount?: number;
    colCountByScreen?: Record<string, any> | {
      lg?: number | undefined;
      md?: number | undefined;
      sm?: number | undefined;
      xs?: number | undefined;
    };
    disabled?: boolean;
    icon?: string | undefined;
    items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
    tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
    template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
    title?: string | undefined;
  }[];
  visible?: boolean;
  visibleIndex?: number | undefined;
}>
const _componentTabbedItem = (props: ITabbedItemProps) => {
  return React.createElement(NestedOption<ITabbedItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        tab: { optionName: "tabs", isCollectionItem: true },
        tabPanelOptions: { optionName: "tabPanelOptions", isCollectionItem: false }
      },
      PredefinedProps: {
        itemType: "tabbed"
      },
    },
  });
};

const TabbedItem = Object.assign<typeof _componentTabbedItem, NestedComponentMeta>(_componentTabbedItem, {
  componentType: "option",
});

// owners:
// TabbedItem
type ITabPanelOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  animationEnabled?: boolean;
  dataSource?: Array<any | dxTabPanelItem | string> | DataSource | DataSourceOptions | null | Store | string;
  deferRendering?: boolean;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  iconPosition?: TabsIconPosition;
  itemHoldTimeout?: number;
  items?: Array<any | dxTabPanelItem | string>;
  itemTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  itemTitleTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  keyExpr?: ((item: any) => any) | string;
  loop?: boolean;
  noDataText?: string;
  onContentReady?: ((e: TabPanelContentReadyEvent) => void);
  onDisposing?: ((e: TabPanelDisposingEvent) => void);
  onInitialized?: ((e: TabPanelInitializedEvent) => void);
  onItemClick?: ((e: ItemClickEvent) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
  onItemHold?: ((e: ItemHoldEvent) => void);
  onItemRendered?: ((e: ItemRenderedEvent) => void);
  onOptionChanged?: ((e: TabPanelOptionChangedEvent) => void);
  onSelectionChanged?: ((e: SelectionChangedEvent) => void);
  onSelectionChanging?: ((e: SelectionChangingEvent) => void);
  onTitleClick?: ((e: TitleClickEvent) => void);
  onTitleHold?: ((e: TitleHoldEvent) => void);
  onTitleRendered?: ((e: TitleRenderedEvent) => void);
  repaintChangesOnly?: boolean;
  rtlEnabled?: boolean;
  scrollByContent?: boolean;
  scrollingEnabled?: boolean;
  selectedIndex?: number;
  selectedItem?: any;
  showNavButtons?: boolean;
  stylingMode?: TabsStyle;
  swipeEnabled?: boolean;
  tabIndex?: number;
  tabsPosition?: CommonPosition;
  visible?: boolean;
  width?: number | string | undefined;
  defaultItems?: Array<any | dxTabPanelItem | string>;
  onItemsChange?: (value: Array<any | dxTabPanelItem | string>) => void;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (value: number) => void;
  defaultSelectedItem?: any;
  onSelectedItemChange?: (value: any) => void;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemTitleRender?: (...params: any) => React.ReactNode;
  itemTitleComponent?: React.ComponentType<any>;
}>
const _componentTabPanelOptions = (props: ITabPanelOptionsProps) => {
  return React.createElement(NestedOption<ITabPanelOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tabPanelOptions",
      DefaultsProps: {
        defaultItems: "items",
        defaultSelectedIndex: "selectedIndex",
        defaultSelectedItem: "selectedItem"
      },
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true },
        tabPanelOptionsItem: { optionName: "items", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "itemTemplate",
        render: "itemRender",
        component: "itemComponent"
      }, {
        tmplOption: "itemTitleTemplate",
        render: "itemTitleRender",
        component: "itemTitleComponent"
      }],
    },
  });
};

const TabPanelOptions = Object.assign<typeof _componentTabPanelOptions, NestedComponentMeta>(_componentTabPanelOptions, {
  componentType: "option",
});

// owners:
// TabPanelOptions
type ITabPanelOptionsItemProps = React.PropsWithChildren<{
  badge?: string;
  disabled?: boolean;
  html?: string;
  icon?: string;
  tabTemplate?: (() => string | any) | template;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  title?: string;
  visible?: boolean;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentTabPanelOptionsItem = (props: ITabPanelOptionsItemProps) => {
  return React.createElement(NestedOption<ITabPanelOptionsItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "tabTemplate",
        render: "tabRender",
        component: "tabComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const TabPanelOptionsItem = Object.assign<typeof _componentTabPanelOptionsItem, NestedComponentMeta>(_componentTabPanelOptionsItem, {
  componentType: "option",
});

// owners:
// Editing
// Export
// Grouping
// Summary
// ColumnFixing
// FilterPanel
// DataGridHeaderFilter
type ITextsProps = React.PropsWithChildren<{
  addRow?: string;
  cancelAllChanges?: string;
  cancelRowChanges?: string;
  confirmDeleteMessage?: string;
  confirmDeleteTitle?: string;
  deleteRow?: string;
  editRow?: string;
  saveAllChanges?: string;
  saveRowChanges?: string;
  undeleteRow?: string;
  validationCancelChanges?: string;
  exportAll?: string;
  exportSelectedRows?: string;
  exportTo?: string;
  groupByThisColumn?: string;
  groupContinuedMessage?: string;
  groupContinuesMessage?: string;
  ungroup?: string;
  ungroupAll?: string;
  avg?: string;
  avgOtherColumn?: string;
  count?: string;
  max?: string;
  maxOtherColumn?: string;
  min?: string;
  minOtherColumn?: string;
  sum?: string;
  sumOtherColumn?: string;
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  stickyPosition?: string;
  unfix?: string;
  clearFilter?: string;
  createFilter?: string;
  filterEnabledHint?: string;
  cancel?: string;
  emptyValue?: string;
  ok?: string;
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

// owners:
// Hide
// Show
type IToProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentTo = (props: IToProps) => {
  return React.createElement(NestedOption<IToProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "to",
      ExpectedChildren: {
        position: { optionName: "position", isCollectionItem: false }
      },
    },
  });
};

const To = Object.assign<typeof _componentTo, NestedComponentMeta>(_componentTo, {
  componentType: "option",
});

// owners:
// DataGrid
type IToolbarProps = React.PropsWithChildren<{
  disabled?: boolean;
  items?: Array<DataGridPredefinedToolbarItem | dxDataGridToolbarItem>;
  visible?: boolean | undefined;
}>
const _componentToolbar = (props: IToolbarProps) => {
  return React.createElement(NestedOption<IToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbar",
      ExpectedChildren: {
        dataGridToolbarItem: { optionName: "items", isCollectionItem: true },
        item: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Toolbar = Object.assign<typeof _componentToolbar, NestedComponentMeta>(_componentToolbar, {
  componentType: "option",
});

// owners:
// Popup
// FilterBuilderPopup
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  toolbar?: ToolbarLocation;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentToolbarItem = (props: IToolbarItemProps) => {
  return React.createElement(NestedOption<IToolbarItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbarItems",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "menuItemTemplate",
        render: "menuItemRender",
        component: "menuItemComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const ToolbarItem = Object.assign<typeof _componentToolbarItem, NestedComponentMeta>(_componentToolbarItem, {
  componentType: "option",
});

// owners:
// Summary
type ITotalItemProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment | undefined;
  column?: string | undefined;
  cssClass?: string | undefined;
  customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
  displayFormat?: string | undefined;
  name?: string | undefined;
  showInColumn?: string | undefined;
  skipEmptyValues?: boolean;
  summaryType?: string | SummaryType | undefined;
  valueFormat?: LocalizationFormat | undefined;
}>
const _componentTotalItem = (props: ITotalItemProps) => {
  return React.createElement(NestedOption<ITotalItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "totalItems",
      IsCollectionItem: true,
      ExpectedChildren: {
        valueFormat: { optionName: "valueFormat", isCollectionItem: false }
      },
    },
  });
};

const TotalItem = Object.assign<typeof _componentTotalItem, NestedComponentMeta>(_componentTotalItem, {
  componentType: "option",
});

// owners:
// FormItem
// Column
// SimpleItem
type IValidationRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: ValidationRuleType;
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  min?: Date | number | string;
  reevaluate?: boolean;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: any }) => boolean);
  comparisonTarget?: (() => any);
  comparisonType?: ComparisonOperator;
  pattern?: RegExp | string;
}>
const _componentValidationRule = (props: IValidationRuleProps) => {
  return React.createElement(NestedOption<IValidationRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "required"
      },
    },
  });
};

const ValidationRule = Object.assign<typeof _componentValidationRule, NestedComponentMeta>(_componentValidationRule, {
  componentType: "option",
});

// owners:
// GroupItem
// TotalItem
type IValueFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: CommonFormat | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentValueFormat = (props: IValueFormatProps) => {
  return React.createElement(NestedOption<IValueFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "valueFormat",
    },
  });
};

const ValueFormat = Object.assign<typeof _componentValueFormat, NestedComponentMeta>(_componentValueFormat, {
  componentType: "option",
});

export default DataGrid;
export {
  DataGrid,
  IDataGridOptions,
  DataGridRef,
  AI,
  IAIProps,
  AIAssistant,
  IAIAssistantProps,
  AIOptions,
  IAIOptionsProps,
  Animation,
  IAnimationProps,
  AsyncRule,
  IAsyncRuleProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Button,
  IButtonProps,
  ButtonItem,
  IButtonItemProps,
  ButtonOptions,
  IButtonOptionsProps,
  Change,
  IChangeProps,
  ColCountByScreen,
  IColCountByScreenProps,
  Collision,
  ICollisionProps,
  Column,
  IColumnProps,
  ColumnButton,
  IColumnButtonProps,
  ColumnChooser,
  IColumnChooserProps,
  ColumnChooserSearch,
  IColumnChooserSearchProps,
  ColumnChooserSelection,
  IColumnChooserSelectionProps,
  ColumnFixing,
  IColumnFixingProps,
  ColumnFixingTexts,
  IColumnFixingTextsProps,
  ColumnHeaderFilter,
  IColumnHeaderFilterProps,
  ColumnHeaderFilterSearch,
  IColumnHeaderFilterSearchProps,
  ColumnLookup,
  IColumnLookupProps,
  CompareRule,
  ICompareRuleProps,
  CursorOffset,
  ICursorOffsetProps,
  CustomOperation,
  ICustomOperationProps,
  CustomRule,
  ICustomRuleProps,
  DataGridHeaderFilter,
  IDataGridHeaderFilterProps,
  DataGridHeaderFilterSearch,
  IDataGridHeaderFilterSearchProps,
  DataGridHeaderFilterTexts,
  IDataGridHeaderFilterTextsProps,
  DataGridSelection,
  IDataGridSelectionProps,
  DataGridToolbarItem,
  IDataGridToolbarItemProps,
  Editing,
  IEditingProps,
  EditingTexts,
  IEditingTextsProps,
  EditorOptions,
  IEditorOptionsProps,
  EditorOptionsButton,
  IEditorOptionsButtonProps,
  EmailRule,
  IEmailRuleProps,
  EmptyItem,
  IEmptyItemProps,
  Export,
  IExportProps,
  ExportTexts,
  IExportTextsProps,
  Field,
  IFieldProps,
  FieldLookup,
  IFieldLookupProps,
  FilterBuilder,
  IFilterBuilderProps,
  FilterBuilderPopup,
  IFilterBuilderPopupProps,
  FilterOperationDescriptions,
  IFilterOperationDescriptionsProps,
  FilterPanel,
  IFilterPanelProps,
  FilterPanelTexts,
  IFilterPanelTextsProps,
  FilterRow,
  IFilterRowProps,
  Form,
  IFormProps,
  Format,
  IFormatProps,
  FormGroupItem,
  IFormGroupItemProps,
  FormItem,
  IFormItemProps,
  From,
  IFromProps,
  Grouping,
  IGroupingProps,
  GroupingTexts,
  IGroupingTextsProps,
  GroupItem,
  IGroupItemProps,
  GroupOperationDescriptions,
  IGroupOperationDescriptionsProps,
  GroupPanel,
  IGroupPanelProps,
  HeaderFilter,
  IHeaderFilterProps,
  Hide,
  IHideProps,
  Icons,
  IIconsProps,
  IndicatorOptions,
  IIndicatorOptionsProps,
  Item,
  IItemProps,
  KeyboardNavigation,
  IKeyboardNavigationProps,
  Label,
  ILabelProps,
  LoadPanel,
  ILoadPanelProps,
  Lookup,
  ILookupProps,
  MasterDetail,
  IMasterDetailProps,
  My,
  IMyProps,
  NumericRule,
  INumericRuleProps,
  Offset,
  IOffsetProps,
  OperationDescriptions,
  IOperationDescriptionsProps,
  Options,
  IOptionsProps,
  Pager,
  IPagerProps,
  Paging,
  IPagingProps,
  PatternRule,
  IPatternRuleProps,
  Popup,
  IPopupProps,
  Position,
  IPositionProps,
  RangeRule,
  IRangeRuleProps,
  RemoteOperations,
  IRemoteOperationsProps,
  RequiredRule,
  IRequiredRuleProps,
  RowDragging,
  IRowDraggingProps,
  Scrolling,
  IScrollingProps,
  Search,
  ISearchProps,
  SearchPanel,
  ISearchPanelProps,
  Selection,
  ISelectionProps,
  Show,
  IShowProps,
  SimpleItem,
  ISimpleItemProps,
  SortByGroupSummaryInfo,
  ISortByGroupSummaryInfoProps,
  Sorting,
  ISortingProps,
  StateStoring,
  IStateStoringProps,
  StringLengthRule,
  IStringLengthRuleProps,
  Summary,
  ISummaryProps,
  SummaryTexts,
  ISummaryTextsProps,
  Tab,
  ITabProps,
  TabbedItem,
  ITabbedItemProps,
  TabPanelOptions,
  ITabPanelOptionsProps,
  TabPanelOptionsItem,
  ITabPanelOptionsItemProps,
  Texts,
  ITextsProps,
  To,
  IToProps,
  Toolbar,
  IToolbarProps,
  ToolbarItem,
  IToolbarItemProps,
  TotalItem,
  ITotalItemProps,
  ValidationRule,
  IValidationRuleProps,
  ValueFormat,
  IValueFormatProps
};
import type * as DataGridTypes from 'devextreme/ui/data_grid_types';
export { DataGridTypes };

