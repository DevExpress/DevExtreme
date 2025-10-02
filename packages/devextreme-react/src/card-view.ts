"use client"
export { ExplicitTypes } from "devextreme/ui/card_view";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxCardView, {
    Properties
} from "devextreme/ui/card_view";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { CardClickEvent, CardDblClickEvent, CardInsertedEvent, CardInsertingEvent, CardPreparedEvent, CardRemovedEvent, CardRemovingEvent, CardSavedEvent, CardSavingEvent, CardUpdatedEvent, CardUpdatingEvent, ContextMenuPreparingEvent, EditCanceledEvent, EditCancelingEvent, EditingStartEvent, FieldCaptionClickEvent, FieldCaptionDblClickEvent, FieldCaptionPreparedEvent, FieldValueClickEvent, FieldValueDblClickEvent, FieldValuePreparedEvent, InitNewCardEvent, CardTemplateData, CardHeaderItem as CardViewCardHeaderItem, CardHeaderPredefinedItem, FieldTemplateData, ColumnTemplateData, EditingTexts as CardViewEditingTexts, PredefinedToolbarItem, dxCardViewToolbarItem } from "devextreme/ui/card_view";
import type { AnimationConfig, CollisionResolution, PositionConfig, AnimationState, AnimationType, CollisionResolutionCombination } from "devextreme/common/core/animation";
import type { ValidationRuleType, HorizontalAlignment, VerticalAlignment, ButtonStyle, template, ButtonType, ToolbarItemLocation, ToolbarItemComponent, SearchMode, SingleMultipleOrNone, SelectAllMode, DataType, Format as CommonFormat, SortOrder, ComparisonOperator, DragHighlight, Mode, Direction, PositionAlignment, DisplayMode, ScrollbarMode, TabsIconPosition, TabsStyle, Position as CommonPosition } from "devextreme/common";
import type { dxButtonOptions, ClickEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { FormItemType, FormPredefinedButtonItem, ContentReadyEvent as FormContentReadyEvent, DisposingEvent as FormDisposingEvent, InitializedEvent as FormInitializedEvent, OptionChangedEvent as FormOptionChangedEvent, dxFormSimpleItem, dxFormOptions, dxFormGroupItem, dxFormTabbedItem, dxFormEmptyItem, dxFormButtonItem, LabelLocation, FormLabelMode, EditorEnterKeyEvent, FieldDataChangedEvent, SmartPastedEvent, SmartPastingEvent, FormItemComponent } from "devextreme/ui/form";
import type { ContentReadyEvent as FilterBuilderContentReadyEvent, DisposingEvent as FilterBuilderDisposingEvent, InitializedEvent as FilterBuilderInitializedEvent, OptionChangedEvent as FilterBuilderOptionChangedEvent, dxFilterBuilderField, FieldInfo, FilterBuilderOperation, dxFilterBuilderCustomOperation, GroupOperation, EditorPreparedEvent, EditorPreparingEvent, ValueChangedEvent } from "devextreme/ui/filter_builder";
import type { ContentReadyEvent as LoadPanelContentReadyEvent, DisposingEvent as LoadPanelDisposingEvent, InitializedEvent as LoadPanelInitializedEvent, OptionChangedEvent as LoadPanelOptionChangedEvent, HiddenEvent, HidingEvent, ShowingEvent, ShownEvent } from "devextreme/ui/load_panel";
import type { ContentReadyEvent as TabPanelContentReadyEvent, DisposingEvent as TabPanelDisposingEvent, InitializedEvent as TabPanelInitializedEvent, OptionChangedEvent as TabPanelOptionChangedEvent, dxTabPanelOptions, dxTabPanelItem, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, SelectionChangedEvent, SelectionChangingEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from "devextreme/ui/tab_panel";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { HeaderFilterSearchConfig, HeaderFilterTexts, SelectionColumnDisplayMode, DataChangeType, FilterType, ColumnHeaderFilter as GridsColumnHeaderFilter, ColumnChooserMode, ColumnChooserSearchConfig, ColumnChooserSelectionConfig, HeaderFilterGroupInterval, ColumnHeaderFilterSearchConfig, DataChange, FilterPanel as GridsFilterPanel, FilterPanelTexts as GridsFilterPanelTexts, PagerPageSize } from "devextreme/common/grids";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";
import type { AIIntegration } from "devextreme/common/ai-integration";
import type { LoadingAnimationType } from "devextreme/ui/load_indicator";
import type { event } from "devextreme/events/events.types";
import type { LoadIndicatorOptions } from "UNKNOWN_MODULE";

import type dxForm from "devextreme/ui/form";
import type DataSource from "devextreme/data/data_source";

import type * as CommonTypes from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ICardViewOptionsNarrowedEvents<TCardData = any, TKey = any> = {
  onCardClick?: ((e: CardClickEvent) => void);
  onCardDblClick?: ((e: CardDblClickEvent) => void);
  onCardInserted?: ((e: CardInsertedEvent<TCardData>) => void);
  onCardInserting?: ((e: CardInsertingEvent<TCardData>) => void);
  onCardPrepared?: ((e: CardPreparedEvent) => void);
  onCardRemoved?: ((e: CardRemovedEvent<TCardData, TKey>) => void);
  onCardRemoving?: ((e: CardRemovingEvent<TCardData, TKey>) => void);
  onCardSaved?: ((e: CardSavedEvent) => void);
  onCardSaving?: ((e: CardSavingEvent) => void);
  onCardUpdated?: ((e: CardUpdatedEvent<TCardData, TKey>) => void);
  onCardUpdating?: ((e: CardUpdatingEvent<TCardData, TKey>) => void);
  onContextMenuPreparing?: ((e: ContextMenuPreparingEvent<TCardData>) => void);
  onEditCanceled?: ((e: EditCanceledEvent) => void);
  onEditCanceling?: ((e: EditCancelingEvent) => void);
  onEditingStart?: ((e: EditingStartEvent<TCardData, TKey>) => void);
  onFieldCaptionClick?: ((e: FieldCaptionClickEvent) => void);
  onFieldCaptionDblClick?: ((e: FieldCaptionDblClickEvent) => void);
  onFieldCaptionPrepared?: ((e: FieldCaptionPreparedEvent) => void);
  onFieldValueClick?: ((e: FieldValueClickEvent) => void);
  onFieldValueDblClick?: ((e: FieldValueDblClickEvent) => void);
  onFieldValuePrepared?: ((e: FieldValuePreparedEvent) => void);
  onInitNewCard?: ((e: InitNewCardEvent<TCardData>) => void);
}

type ICardViewOptions<TCardData = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TCardData, TKey>, ICardViewOptionsNarrowedEvents<TCardData, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TCardData, TKey>["dataSource"];
  cardContentRender?: (...params: any) => React.ReactNode;
  cardContentComponent?: React.ComponentType<any>;
  cardFooterRender?: (...params: any) => React.ReactNode;
  cardFooterComponent?: React.ComponentType<any>;
  cardRender?: (...params: any) => React.ReactNode;
  cardComponent?: React.ComponentType<any>;
  noDataRender?: (...params: any) => React.ReactNode;
  noDataComponent?: React.ComponentType<any>;
  defaultFilterValue?: Array<any> | (() => any) | string;
  defaultSelectedCardKeys?: Array<any>;
  onFilterValueChange?: (value: Array<any> | (() => any) | string) => void;
  onSelectedCardKeysChange?: (value: Array<any>) => void;
}>

interface CardViewRef<TCardData = any, TKey = any> {
  instance: () => dxCardView<TCardData, TKey>;
}

const CardView = memo(
  forwardRef(
    <TCardData = any, TKey = any>(props: React.PropsWithChildren<ICardViewOptions<TCardData, TKey>>, ref: ForwardedRef<CardViewRef<TCardData, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), []);

      const subscribableOptions = useMemo(() => (["filterValue","selectedCardKeys","filterBuilder.value","filterPanel.filterEnabled","editing.form.formData","loadPanel.position","loadPanel.visible","paging.pageIndex","paging.pageSize","searchPanel.text"]), []);
      const independentEvents = useMemo(() => (["onCardClick","onCardDblClick","onCardInserted","onCardInserting","onCardPrepared","onCardRemoved","onCardRemoving","onCardSaved","onCardSaving","onCardUpdated","onCardUpdating","onContentReady","onContextMenuPreparing","onDataErrorOccurred","onDisposing","onEditCanceled","onEditCanceling","onEditingStart","onFieldCaptionClick","onFieldCaptionDblClick","onFieldCaptionPrepared","onFieldValueClick","onFieldValueDblClick","onFieldValuePrepared","onInitialized","onInitNewCard"]), []);

      const defaults = useMemo(() => ({
        defaultFilterValue: "filterValue",
        defaultSelectedCardKeys: "selectedCardKeys",
      }), []);

      const expectedChildren = useMemo(() => ({
        cardCover: { optionName: "cardCover", isCollectionItem: false },
        cardHeader: { optionName: "cardHeader", isCollectionItem: false },
        cardViewHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
        cardViewSelection: { optionName: "selection", isCollectionItem: false },
        column: { optionName: "columns", isCollectionItem: true },
        columnChooser: { optionName: "columnChooser", isCollectionItem: false },
        editing: { optionName: "editing", isCollectionItem: false },
        filterBuilder: { optionName: "filterBuilder", isCollectionItem: false },
        filterPanel: { optionName: "filterPanel", isCollectionItem: false },
        headerFilter: { optionName: "headerFilter", isCollectionItem: false },
        headerPanel: { optionName: "headerPanel", isCollectionItem: false },
        loadPanel: { optionName: "loadPanel", isCollectionItem: false },
        pager: { optionName: "pager", isCollectionItem: false },
        paging: { optionName: "paging", isCollectionItem: false },
        remoteOperations: { optionName: "remoteOperations", isCollectionItem: false },
        scrolling: { optionName: "scrolling", isCollectionItem: false },
        searchPanel: { optionName: "searchPanel", isCollectionItem: false },
        selection: { optionName: "selection", isCollectionItem: false },
        sorting: { optionName: "sorting", isCollectionItem: false },
        toolbar: { optionName: "toolbar", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "cardContentTemplate",
          render: "cardContentRender",
          component: "cardContentComponent"
        },
        {
          tmplOption: "cardFooterTemplate",
          render: "cardFooterRender",
          component: "cardFooterComponent"
        },
        {
          tmplOption: "cardTemplate",
          render: "cardRender",
          component: "cardComponent"
        },
        {
          tmplOption: "noDataTemplate",
          render: "noDataRender",
          component: "noDataComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ICardViewOptions<TCardData, TKey>>>, {
          WidgetClass: dxCardView,
          ref: baseRef,
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
) as <TCardData = any, TKey = any>(props: React.PropsWithChildren<ICardViewOptions<TCardData, TKey>> & { ref?: Ref<CardViewRef<TCardData, TKey>> }) => ReactElement | null;


// owners:
// FormItem
// SimpleItem
type IAiOptionsProps = React.PropsWithChildren<{
  disabled?: boolean;
  instruction?: string | undefined;
}>
const _componentAiOptions = (props: IAiOptionsProps) => {
  return React.createElement(NestedOption<IAiOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "aiOptions",
    },
  });
};

const AiOptions = Object.assign<typeof _componentAiOptions, NestedComponentMeta>(_componentAiOptions, {
  componentType: "option",
});

// owners:
// LoadPanel
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
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any);
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
// CardView
type ICardCoverProps = React.PropsWithChildren<{
  altExpr?: ((data: any) => string) | string;
  aspectRatio?: string;
  imageExpr?: ((data: any) => string) | string;
  maxHeight?: number;
  template?: ((data: CardTemplateData, container: any) => string | any) | template;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentCardCover = (props: ICardCoverProps) => {
  return React.createElement(NestedOption<ICardCoverProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "cardCover",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const CardCover = Object.assign<typeof _componentCardCover, NestedComponentMeta>(_componentCardCover, {
  componentType: "option",
});

// owners:
// CardView
type ICardHeaderProps = React.PropsWithChildren<{
  items?: Array<CardViewCardHeaderItem | CardHeaderPredefinedItem>;
  template?: ((data: CardTemplateData) => string | any) | template;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentCardHeader = (props: ICardHeaderProps) => {
  return React.createElement(NestedOption<ICardHeaderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "cardHeader",
      ExpectedChildren: {
        cardHeaderItem: { optionName: "items", isCollectionItem: true },
        item: { optionName: "items", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const CardHeader = Object.assign<typeof _componentCardHeader, NestedComponentMeta>(_componentCardHeader, {
  componentType: "option",
});

// owners:
// CardHeader
type ICardHeaderItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: CardHeaderPredefinedItem | string;
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
const _componentCardHeaderItem = (props: ICardHeaderItemProps) => {
  return React.createElement(NestedOption<ICardHeaderItemProps>, {
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

const CardHeaderItem = Object.assign<typeof _componentCardHeaderItem, NestedComponentMeta>(_componentCardHeaderItem, {
  componentType: "option",
});

// owners:
// CardView
type ICardViewHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  height?: number | string;
  search?: HeaderFilterSearchConfig;
  searchTimeout?: number;
  texts?: HeaderFilterTexts;
  visible?: boolean;
  width?: number | string;
}>
const _componentCardViewHeaderFilter = (props: ICardViewHeaderFilterProps) => {
  return React.createElement(NestedOption<ICardViewHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        cardViewHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        cardViewHeaderFilterTexts: { optionName: "texts", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const CardViewHeaderFilter = Object.assign<typeof _componentCardViewHeaderFilter, NestedComponentMeta>(_componentCardViewHeaderFilter, {
  componentType: "option",
});

// owners:
// CardViewHeaderFilter
type ICardViewHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  timeout?: number;
}>
const _componentCardViewHeaderFilterSearch = (props: ICardViewHeaderFilterSearchProps) => {
  return React.createElement(NestedOption<ICardViewHeaderFilterSearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const CardViewHeaderFilterSearch = Object.assign<typeof _componentCardViewHeaderFilterSearch, NestedComponentMeta>(_componentCardViewHeaderFilterSearch, {
  componentType: "option",
});

// owners:
// CardViewHeaderFilter
type ICardViewHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
const _componentCardViewHeaderFilterTexts = (props: ICardViewHeaderFilterTextsProps) => {
  return React.createElement(NestedOption<ICardViewHeaderFilterTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const CardViewHeaderFilterTexts = Object.assign<typeof _componentCardViewHeaderFilterTexts, NestedComponentMeta>(_componentCardViewHeaderFilterTexts, {
  componentType: "option",
});

// owners:
// CardView
type ICardViewSelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  mode?: SingleMultipleOrNone;
  selectAllMode?: SelectAllMode;
  showCheckBoxesMode?: SelectionColumnDisplayMode;
}>
const _componentCardViewSelection = (props: ICardViewSelectionProps) => {
  return React.createElement(NestedOption<ICardViewSelectionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selection",
    },
  });
};

const CardViewSelection = Object.assign<typeof _componentCardViewSelection, NestedComponentMeta>(_componentCardViewSelection, {
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
// GroupItem
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
// CardView
type IColumnProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment | undefined;
  allowEditing?: boolean;
  allowFiltering?: boolean;
  allowHeaderFiltering?: boolean;
  allowHiding?: boolean;
  allowReordering?: boolean;
  allowSearch?: boolean;
  allowSorting?: boolean;
  calculateDisplayValue?: ((cardData: any) => any);
  calculateFieldValue?: ((cardData: any) => any);
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | Array<any> | (() => void));
  calculateSortValue?: ((cardData: any) => any) | string;
  caption?: string | undefined;
  customizeText?: ((fieldInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string);
  dataField?: string | undefined;
  dataType?: DataType | undefined;
  editorOptions?: any;
  falseText?: string;
  fieldCaptionTemplate?: ((data: FieldTemplateData, container: any) => string | any) | template;
  fieldTemplate?: ((data: FieldTemplateData, container: any) => string | any) | template;
  fieldValueTemplate?: ((data: FieldTemplateData, container: any) => string | any) | template;
  filterType?: FilterType;
  filterValue?: any | undefined;
  filterValues?: Array<any>;
  format?: LocalizationFormat;
  formItem?: dxFormSimpleItem;
  headerFilter?: GridsColumnHeaderFilter | undefined;
  headerItemCssClass?: string;
  headerItemTemplate?: ((data: ColumnTemplateData, container: any) => string | any) | template;
  name?: string | undefined;
  setFieldValue?: ((newData: any, value: any, currentCardData: any) => any);
  showInColumnChooser?: boolean;
  sortIndex?: number | undefined;
  sortingMethod?: ((value1: any, value2: any) => number) | undefined;
  sortOrder?: SortOrder | undefined;
  trueText?: string;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number | undefined;
  defaultFilterValue?: any | undefined;
  onFilterValueChange?: (value: any | undefined) => void;
  defaultFilterValues?: Array<any>;
  onFilterValuesChange?: (value: Array<any>) => void;
  defaultSortIndex?: number | undefined;
  onSortIndexChange?: (value: number | undefined) => void;
  defaultSortOrder?: SortOrder | undefined;
  onSortOrderChange?: (value: SortOrder | undefined) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultVisibleIndex?: number | undefined;
  onVisibleIndexChange?: (value: number | undefined) => void;
  fieldCaptionRender?: (...params: any) => React.ReactNode;
  fieldCaptionComponent?: React.ComponentType<any>;
  fieldRender?: (...params: any) => React.ReactNode;
  fieldComponent?: React.ComponentType<any>;
  fieldValueRender?: (...params: any) => React.ReactNode;
  fieldValueComponent?: React.ComponentType<any>;
  headerItemRender?: (...params: any) => React.ReactNode;
  headerItemComponent?: React.ComponentType<any>;
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
        defaultSortIndex: "sortIndex",
        defaultSortOrder: "sortOrder",
        defaultVisible: "visible",
        defaultVisibleIndex: "visibleIndex"
      },
      ExpectedChildren: {
        AsyncRule: { optionName: "validationRules", isCollectionItem: true },
        columnHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
        CompareRule: { optionName: "validationRules", isCollectionItem: true },
        CustomRule: { optionName: "validationRules", isCollectionItem: true },
        EmailRule: { optionName: "validationRules", isCollectionItem: true },
        format: { optionName: "format", isCollectionItem: false },
        formItem: { optionName: "formItem", isCollectionItem: false },
        headerFilter: { optionName: "headerFilter", isCollectionItem: false },
        NumericRule: { optionName: "validationRules", isCollectionItem: true },
        PatternRule: { optionName: "validationRules", isCollectionItem: true },
        RangeRule: { optionName: "validationRules", isCollectionItem: true },
        RequiredRule: { optionName: "validationRules", isCollectionItem: true },
        StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
        validationRule: { optionName: "validationRules", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "fieldCaptionTemplate",
        render: "fieldCaptionRender",
        component: "fieldCaptionComponent"
      }, {
        tmplOption: "fieldTemplate",
        render: "fieldRender",
        component: "fieldComponent"
      }, {
        tmplOption: "fieldValueTemplate",
        render: "fieldValueRender",
        component: "fieldValueComponent"
      }, {
        tmplOption: "headerItemTemplate",
        render: "headerItemRender",
        component: "headerItemComponent"
      }],
    },
  });
};

const Column = Object.assign<typeof _componentColumn, NestedComponentMeta>(_componentColumn, {
  componentType: "option",
});

// owners:
// CardView
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
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
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
// HeaderPanel
type IDraggingProps = React.PropsWithChildren<{
  dropFeedbackMode?: DragHighlight;
  onDragChange?: ((e: any) => void);
  onDragEnd?: ((e: any) => void);
  onDragMove?: ((e: any) => void);
  onDragStart?: ((e: any) => void);
  onRemove?: ((e: any) => void);
  onReorder?: ((e: any) => void);
  scrollSensitivity?: number;
  scrollSpeed?: number;
}>
const _componentDragging = (props: IDraggingProps) => {
  return React.createElement(NestedOption<IDraggingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "dragging",
    },
  });
};

const Dragging = Object.assign<typeof _componentDragging, NestedComponentMeta>(_componentDragging, {
  componentType: "option",
});

// owners:
// CardView
type IEditingProps = React.PropsWithChildren<{
  allowAdding?: boolean;
  allowDeleting?: boolean;
  allowUpdating?: boolean;
  changes?: Array<DataChange>;
  confirmDelete?: boolean;
  editCardKey?: any;
  form?: dxFormOptions;
  popup?: Record<string, any>;
  texts?: CardViewEditingTexts;
}>
const _componentEditing = (props: IEditingProps) => {
  return React.createElement(NestedOption<IEditingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "editing",
      ExpectedChildren: {
        change: { optionName: "changes", isCollectionItem: true },
        editingTexts: { optionName: "texts", isCollectionItem: false },
        form: { optionName: "form", isCollectionItem: false },
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
  addCard?: string;
  confirmDeleteMessage?: string;
  confirmDeleteTitle?: string;
  deleteCard?: string;
  editCard?: string;
  saveCard?: string;
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
// CardView
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
  onEditorPrepared?: ((e: EditorPreparedEvent) => void);
  onEditorPreparing?: ((e: EditorPreparingEvent) => void);
  onInitialized?: ((e: FilterBuilderInitializedEvent) => void);
  onOptionChanged?: ((e: FilterBuilderOptionChangedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
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
// CardView
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
        GroupItem: { optionName: "items", isCollectionItem: true },
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
// Form
type IGroupItemProps = React.PropsWithChildren<{
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
const _componentGroupItem = (props: IGroupItemProps) => {
  return React.createElement(NestedOption<IGroupItemProps>, {
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
// Column
// CardView
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
        cardViewHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        cardViewHeaderFilterTexts: { optionName: "texts", isCollectionItem: false },
        columnHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false }
      },
    },
  });
};

const HeaderFilter = Object.assign<typeof _componentHeaderFilter, NestedComponentMeta>(_componentHeaderFilter, {
  componentType: "option",
});

// owners:
// CardView
type IHeaderPanelProps = React.PropsWithChildren<{
  dragging?: Record<string, any> | {
    dropFeedbackMode?: DragHighlight;
    onDragChange?: ((e: any) => void);
    onDragEnd?: ((e: any) => void);
    onDragMove?: ((e: any) => void);
    onDragStart?: ((e: any) => void);
    onRemove?: ((e: any) => void);
    onReorder?: ((e: any) => void);
    scrollSensitivity?: number;
    scrollSpeed?: number;
  };
  itemCssClass?: string;
  itemTemplate?: ((data: ColumnTemplateData, container: any) => string | any) | template;
  visible?: boolean;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
}>
const _componentHeaderPanel = (props: IHeaderPanelProps) => {
  return React.createElement(NestedOption<IHeaderPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerPanel",
      ExpectedChildren: {
        dragging: { optionName: "dragging", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "itemTemplate",
        render: "itemRender",
        component: "itemComponent"
      }],
    },
  });
};

const HeaderPanel = Object.assign<typeof _componentHeaderPanel, NestedComponentMeta>(_componentHeaderPanel, {
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
// LoadPanel
type IIndicatorOptionsProps = React.PropsWithChildren<{
  animationType?: LoadingAnimationType;
  height?: number | string | undefined;
  indicatorSrc?: string;
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
// CardHeader
// TabPanelOptions
// Form
// Toolbar
type IItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: CardHeaderPredefinedItem | string | undefined | FormPredefinedButtonItem | PredefinedToolbarItem;
  options?: any;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  badge?: string;
  icon?: string;
  tabTemplate?: (() => string | any) | template;
  title?: string;
  aiOptions?: Record<string, any> | {
    disabled?: boolean;
    instruction?: string | undefined;
  };
  colSpan?: number | undefined;
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
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  captionRender?: (...params: any) => React.ReactNode;
  captionComponent?: React.ComponentType<any>;
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
        tmplOption: "menuItemTemplate",
        render: "menuItemRender",
        component: "menuItemComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }, {
        tmplOption: "tabTemplate",
        render: "tabRender",
        component: "tabComponent"
      }, {
        tmplOption: "captionTemplate",
        render: "captionRender",
        component: "captionComponent"
      }],
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
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
// CardView
type ILoadPanelProps = React.PropsWithChildren<{
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  container?: any | string | undefined;
  deferRendering?: boolean;
  delay?: number;
  focusStateEnabled?: boolean;
  height?: number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  indicatorOptions?: LoadIndicatorOptions;
  indicatorSrc?: string;
  maxHeight?: number | string;
  maxWidth?: number | string;
  message?: string;
  minHeight?: number | string;
  minWidth?: number | string;
  onContentReady?: ((e: LoadPanelContentReadyEvent) => void);
  onDisposing?: ((e: LoadPanelDisposingEvent) => void);
  onHidden?: ((e: HiddenEvent) => void);
  onHiding?: ((e: HidingEvent) => void);
  onInitialized?: ((e: LoadPanelInitializedEvent) => void);
  onOptionChanged?: ((e: LoadPanelOptionChangedEvent) => void);
  onShowing?: ((e: ShowingEvent) => void);
  onShown?: ((e: ShownEvent) => void);
  position?: (() => void) | PositionAlignment | PositionConfig;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showIndicator?: boolean;
  showPane?: boolean;
  visible?: boolean;
  width?: number | string;
  wrapperAttr?: any;
  defaultPosition?: (() => void) | PositionAlignment | PositionConfig;
  onPositionChange?: (value: (() => void) | PositionAlignment | PositionConfig) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
}>
const _componentLoadPanel = (props: ILoadPanelProps) => {
  return React.createElement(NestedOption<ILoadPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "loadPanel",
      DefaultsProps: {
        defaultPosition: "position",
        defaultVisible: "visible"
      },
      ExpectedChildren: {
        animation: { optionName: "animation", isCollectionItem: false },
        indicatorOptions: { optionName: "indicatorOptions", isCollectionItem: false },
        position: { optionName: "position", isCollectionItem: false }
      },
    },
  });
};

const LoadPanel = Object.assign<typeof _componentLoadPanel, NestedComponentMeta>(_componentLoadPanel, {
  componentType: "option",
});

// owners:
// Field
type ILookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  dataSource?: Array<any> | DataSourceOptions | Store | undefined;
  displayExpr?: ((data: any) => string) | string | undefined;
  valueExpr?: ((data: any) => string | number | boolean) | string | undefined;
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
// CardView
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
// CardView
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
// ColumnChooser
// From
// To
// LoadPanel
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
// CardView
type IRemoteOperationsProps = React.PropsWithChildren<{
  filtering?: boolean;
  grouping?: boolean;
  paging?: boolean;
  sorting?: boolean;
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
// CardView
type IScrollingProps = React.PropsWithChildren<{
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
// ColumnChooser
// ColumnHeaderFilter
// CardViewHeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  timeout?: number;
  mode?: SearchMode;
  searchExpr?: Array<(() => any) | string> | (() => any) | string | undefined;
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
// CardView
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
// ColumnChooser
// CardView
type ISelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  recursive?: boolean;
  selectByClick?: boolean;
  mode?: SingleMultipleOrNone;
  selectAllMode?: SelectAllMode;
  showCheckBoxesMode?: SelectionColumnDisplayMode;
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
// CardView
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
  keyExpr?: (() => void) | string;
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
// FilterPanel
// CardViewHeaderFilter
type ITextsProps = React.PropsWithChildren<{
  addCard?: string;
  confirmDeleteMessage?: string;
  confirmDeleteTitle?: string;
  deleteCard?: string;
  editCard?: string;
  saveCard?: string;
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
// CardView
type IToolbarProps = React.PropsWithChildren<{
  disabled?: boolean;
  items?: Array<dxCardViewToolbarItem | PredefinedToolbarItem>;
  multiline?: boolean;
  visible?: boolean | undefined;
}>
const _componentToolbar = (props: IToolbarProps) => {
  return React.createElement(NestedOption<IToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbar",
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true },
        toolbarItem: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Toolbar = Object.assign<typeof _componentToolbar, NestedComponentMeta>(_componentToolbar, {
  componentType: "option",
});

// owners:
// Toolbar
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: PredefinedToolbarItem | string;
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
const _componentToolbarItem = (props: IToolbarItemProps) => {
  return React.createElement(NestedOption<IToolbarItemProps>, {
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

const ToolbarItem = Object.assign<typeof _componentToolbarItem, NestedComponentMeta>(_componentToolbarItem, {
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
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
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

export default CardView;
export {
  CardView,
  ICardViewOptions,
  CardViewRef,
  AiOptions,
  IAiOptionsProps,
  Animation,
  IAnimationProps,
  AsyncRule,
  IAsyncRuleProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  ButtonItem,
  IButtonItemProps,
  ButtonOptions,
  IButtonOptionsProps,
  CardCover,
  ICardCoverProps,
  CardHeader,
  ICardHeaderProps,
  CardHeaderItem,
  ICardHeaderItemProps,
  CardViewHeaderFilter,
  ICardViewHeaderFilterProps,
  CardViewHeaderFilterSearch,
  ICardViewHeaderFilterSearchProps,
  CardViewHeaderFilterTexts,
  ICardViewHeaderFilterTextsProps,
  CardViewSelection,
  ICardViewSelectionProps,
  Change,
  IChangeProps,
  ColCountByScreen,
  IColCountByScreenProps,
  Collision,
  ICollisionProps,
  Column,
  IColumnProps,
  ColumnChooser,
  IColumnChooserProps,
  ColumnChooserSearch,
  IColumnChooserSearchProps,
  ColumnChooserSelection,
  IColumnChooserSelectionProps,
  ColumnHeaderFilter,
  IColumnHeaderFilterProps,
  ColumnHeaderFilterSearch,
  IColumnHeaderFilterSearchProps,
  CompareRule,
  ICompareRuleProps,
  CustomOperation,
  ICustomOperationProps,
  CustomRule,
  ICustomRuleProps,
  Dragging,
  IDraggingProps,
  Editing,
  IEditingProps,
  EditingTexts,
  IEditingTextsProps,
  EmailRule,
  IEmailRuleProps,
  EmptyItem,
  IEmptyItemProps,
  Field,
  IFieldProps,
  FilterBuilder,
  IFilterBuilderProps,
  FilterOperationDescriptions,
  IFilterOperationDescriptionsProps,
  FilterPanel,
  IFilterPanelProps,
  FilterPanelTexts,
  IFilterPanelTextsProps,
  Form,
  IFormProps,
  Format,
  IFormatProps,
  FormItem,
  IFormItemProps,
  From,
  IFromProps,
  GroupItem,
  IGroupItemProps,
  GroupOperationDescriptions,
  IGroupOperationDescriptionsProps,
  HeaderFilter,
  IHeaderFilterProps,
  HeaderPanel,
  IHeaderPanelProps,
  Hide,
  IHideProps,
  IndicatorOptions,
  IIndicatorOptionsProps,
  Item,
  IItemProps,
  Label,
  ILabelProps,
  LoadPanel,
  ILoadPanelProps,
  Lookup,
  ILookupProps,
  My,
  IMyProps,
  NumericRule,
  INumericRuleProps,
  Offset,
  IOffsetProps,
  Pager,
  IPagerProps,
  Paging,
  IPagingProps,
  PatternRule,
  IPatternRuleProps,
  Position,
  IPositionProps,
  RangeRule,
  IRangeRuleProps,
  RemoteOperations,
  IRemoteOperationsProps,
  RequiredRule,
  IRequiredRuleProps,
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
  Sorting,
  ISortingProps,
  StringLengthRule,
  IStringLengthRuleProps,
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
  ValidationRule,
  IValidationRuleProps
};
import type * as CardViewTypes from 'devextreme/ui/card_view_types';
export { CardViewTypes };

