export { ExplicitTypes } from "devextreme/ui/card_view";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import CardView, { Properties } from "devextreme/ui/card_view";
import  DataSource from "devextreme/data/data_source";
import  DOMComponent from "devextreme/core/dom_component";
import {
 CardCover,
 CardHeader,
 ColumnProperties,
 dxCardViewEditing,
 HeaderPanel,
 CardClickEvent,
 CardDblClickEvent,
 CardHoverChangedEvent,
 CardInsertedEvent,
 CardInsertingEvent,
 CardPreparedEvent,
 CardRemovedEvent,
 CardRemovingEvent,
 CardSavedEvent,
 CardSavingEvent,
 CardUpdatedEvent,
 CardUpdatingEvent,
 ContextMenuPreparingEvent,
 EditCanceledEvent,
 EditCancelingEvent,
 EditingStartEvent,
 FieldCaptionClickEvent,
 FieldCaptionDblClickEvent,
 FieldCaptionPreparedEvent,
 FieldValueClickEvent,
 FieldValueDblClickEvent,
 FieldValuePreparedEvent,
 FocusedCardChanged,
 InitNewCardEvent,
 SelectionChangedEvent,
 Paging,
 RemoteOperations,
 SelectionConfiguration,
 dxCardViewToolbar,
 CardHeaderItem,
 CardHeaderPredefinedItem,
 EditingTexts,
 PredefinedToolbarItem,
 dxCardViewToolbarItem,
} from "devextreme/ui/card_view";
import {
 Mode,
 ValidationRuleType,
 HorizontalAlignment,
 VerticalAlignment,
 ButtonStyle,
 ButtonType,
 ToolbarItemLocation,
 ToolbarItemComponent,
 SearchMode,
 SingleMultipleOrNone,
 SelectAllMode,
 DataType,
 Format as CommonFormat,
 SortOrder,
 ComparisonOperator,
 DragHighlight,
 Direction,
 PositionAlignment,
 DisplayMode,
 ScrollbarMode,
 TabsIconPosition,
 TabsStyle,
 Position,
} from "devextreme/common";
import {
 ColumnChooser,
 FilterPanel,
 HeaderFilter,
 Pager,
 SearchPanel,
 Sorting,
 HeaderFilterSearchConfig,
 HeaderFilterTexts,
 SelectionColumnDisplayMode,
 DataChangeType,
 FilterType,
 ColumnHeaderFilter,
 ColumnChooserMode,
 ColumnChooserSearchConfig,
 ColumnChooserSelectionConfig,
 HeaderFilterGroupInterval,
 ColumnHeaderFilterSearchConfig,
 DataChange,
 FilterPanelTexts,
 PagerPageSize,
} from "devextreme/common/grids";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 dxFilterBuilderOptions,
 dxFilterBuilderField,
 FieldInfo,
 FilterBuilderOperation,
 dxFilterBuilderCustomOperation,
 GroupOperation,
 ContentReadyEvent as FilterBuilderContentReadyEvent,
 DisposingEvent as FilterBuilderDisposingEvent,
 EditorPreparedEvent,
 EditorPreparingEvent,
 InitializedEvent as FilterBuilderInitializedEvent,
 OptionChangedEvent as FilterBuilderOptionChangedEvent,
 ValueChangedEvent,
} from "devextreme/ui/filter_builder";
import {
 dxLoadPanelOptions,
 ContentReadyEvent as LoadPanelContentReadyEvent,
 DisposingEvent as LoadPanelDisposingEvent,
 HiddenEvent,
 HidingEvent,
 InitializedEvent as LoadPanelInitializedEvent,
 OptionChangedEvent as LoadPanelOptionChangedEvent,
 ShowingEvent,
 ShownEvent,
} from "devextreme/ui/load_panel";
import {
 EventInfo,
} from "devextreme/common/core/events";
import {
 Component,
} from "devextreme/core/component";
import {
 PagerBase,
} from "devextreme/ui/pagination";
import {
 AnimationConfig,
 CollisionResolution,
 PositionConfig,
 AnimationState,
 AnimationType,
 CollisionResolutionCombination,
} from "devextreme/common/core/animation";
import {
 dxButtonOptions,
 ClickEvent,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
} from "devextreme/ui/button";
import {
 FormItemType,
 dxFormSimpleItem,
 dxFormOptions,
 dxFormGroupItem,
 dxFormTabbedItem,
 dxFormEmptyItem,
 dxFormButtonItem,
 LabelLocation,
 FormLabelMode,
 ContentReadyEvent as FormContentReadyEvent,
 DisposingEvent as FormDisposingEvent,
 EditorEnterKeyEvent,
 FieldDataChangedEvent,
 InitializedEvent as FormInitializedEvent,
 OptionChangedEvent as FormOptionChangedEvent,
 SmartPastedEvent,
 SmartPastingEvent,
 FormItemComponent,
} from "devextreme/ui/form";
import {
 LocateInMenuMode,
 ShowTextMode,
} from "devextreme/ui/toolbar";
import {
 Format,
} from "devextreme/common/core/localization";
import {
 AIIntegration,
} from "devextreme/common/ai-integration";
import {
 dxTabPanelOptions,
 dxTabPanelItem,
 ContentReadyEvent as TabPanelContentReadyEvent,
 DisposingEvent as TabPanelDisposingEvent,
 InitializedEvent as TabPanelInitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 OptionChangedEvent as TabPanelOptionChangedEvent,
 SelectionChangedEvent as TabPanelSelectionChangedEvent,
 SelectionChangingEvent,
 TitleClickEvent,
 TitleHoldEvent,
 TitleRenderedEvent,
} from "devextreme/ui/tab_panel";
import {
 event,
} from "devextreme/events/events.types";
import  * as CommonTypes from "devextreme/common";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowColumnReordering" |
  "cardContentTemplate" |
  "cardCover" |
  "cardFooterTemplate" |
  "cardHeader" |
  "cardMaxWidth" |
  "cardMinWidth" |
  "cardsPerRow" |
  "cardTemplate" |
  "columnChooser" |
  "columns" |
  "dataSource" |
  "disabled" |
  "editing" |
  "elementAttr" |
  "errorRowEnabled" |
  "fieldHintEnabled" |
  "filterBuilder" |
  "filterBuilderPopup" |
  "filterPanel" |
  "filterValue" |
  "focusStateEnabled" |
  "headerFilter" |
  "headerPanel" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "keyExpr" |
  "loadPanel" |
  "noDataTemplate" |
  "noDataText" |
  "onCardClick" |
  "onCardDblClick" |
  "onCardHoverChanged" |
  "onCardInserted" |
  "onCardInserting" |
  "onCardPrepared" |
  "onCardRemoved" |
  "onCardRemoving" |
  "onCardSaved" |
  "onCardSaving" |
  "onCardUpdated" |
  "onCardUpdating" |
  "onContentReady" |
  "onContextMenuPreparing" |
  "onDataErrorOccurred" |
  "onDisposing" |
  "onEditCanceled" |
  "onEditCanceling" |
  "onEditingStart" |
  "onFieldCaptionClick" |
  "onFieldCaptionDblClick" |
  "onFieldCaptionPrepared" |
  "onFieldValueClick" |
  "onFieldValueDblClick" |
  "onFieldValuePrepared" |
  "onFocusedCardChanged" |
  "onInitialized" |
  "onInitNewCard" |
  "onOptionChanged" |
  "onSelectionChanged" |
  "pager" |
  "paging" |
  "remoteOperations" |
  "rtlEnabled" |
  "scrolling" |
  "searchPanel" |
  "selectedCardKeys" |
  "selection" |
  "sorting" |
  "tabIndex" |
  "toolbar" |
  "visible" |
  "width" |
  "wordWrapEnabled"
>;

interface DxCardView extends AccessibleOptions {
  readonly instance?: CardView;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowColumnReordering: Boolean,
    cardContentTemplate: {},
    cardCover: Object as PropType<CardCover | Record<string, any>>,
    cardFooterTemplate: {},
    cardHeader: Object as PropType<CardHeader | Record<string, any>>,
    cardMaxWidth: Number,
    cardMinWidth: Number,
    cardsPerRow: [String, Number] as PropType<Mode | number>,
    cardTemplate: {},
    columnChooser: Object as PropType<ColumnChooser | Record<string, any>>,
    columns: Array as PropType<Array<ColumnProperties | string>>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | Store | string | Record<string, any>>,
    disabled: Boolean,
    editing: Object as PropType<dxCardViewEditing | Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    errorRowEnabled: Boolean,
    fieldHintEnabled: Boolean,
    filterBuilder: Object as PropType<dxFilterBuilderOptions | Record<string, any>>,
    filterBuilderPopup: Object as PropType<Record<string, any>>,
    filterPanel: Object as PropType<FilterPanel>,
    filterValue: [Array, Function, String] as PropType<Array<any> | ((() => any)) | string>,
    focusStateEnabled: Boolean,
    headerFilter: Object as PropType<HeaderFilter | Record<string, any>>,
    headerPanel: Object as PropType<HeaderPanel | Record<string, any>>,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    keyExpr: [Array, String] as PropType<Array<string> | string>,
    loadPanel: Object as PropType<dxLoadPanelOptions | Record<string, any>>,
    noDataTemplate: {},
    noDataText: String,
    onCardClick: Function as PropType<((e: CardClickEvent) => void)>,
    onCardDblClick: Function as PropType<((e: CardDblClickEvent) => void)>,
    onCardHoverChanged: Function as PropType<((e: CardHoverChangedEvent) => void)>,
    onCardInserted: Function as PropType<((e: CardInsertedEvent) => void)>,
    onCardInserting: Function as PropType<((e: CardInsertingEvent) => void)>,
    onCardPrepared: Function as PropType<((e: CardPreparedEvent) => void)>,
    onCardRemoved: Function as PropType<((e: CardRemovedEvent) => void)>,
    onCardRemoving: Function as PropType<((e: CardRemovingEvent) => void)>,
    onCardSaved: Function as PropType<((e: CardSavedEvent) => void)>,
    onCardSaving: Function as PropType<((e: CardSavingEvent) => void)>,
    onCardUpdated: Function as PropType<((e: CardUpdatedEvent) => void)>,
    onCardUpdating: Function as PropType<((e: CardUpdatingEvent) => void)>,
    onContentReady: Function as PropType<((e: EventInfo<any>) => void)>,
    onContextMenuPreparing: Function as PropType<((e: ContextMenuPreparingEvent) => void)>,
    onDataErrorOccurred: Function as PropType<((e: { component: Object, element: any, error: any, model: any }) => void)>,
    onDisposing: Function as PropType<((e: EventInfo<any>) => void)>,
    onEditCanceled: Function as PropType<((e: EditCanceledEvent) => void)>,
    onEditCanceling: Function as PropType<((e: EditCancelingEvent) => void)>,
    onEditingStart: Function as PropType<((e: EditingStartEvent) => void)>,
    onFieldCaptionClick: Function as PropType<((e: FieldCaptionClickEvent) => void)>,
    onFieldCaptionDblClick: Function as PropType<((e: FieldCaptionDblClickEvent) => void)>,
    onFieldCaptionPrepared: Function as PropType<((e: FieldCaptionPreparedEvent) => void)>,
    onFieldValueClick: Function as PropType<((e: FieldValueClickEvent) => void)>,
    onFieldValueDblClick: Function as PropType<((e: FieldValueDblClickEvent) => void)>,
    onFieldValuePrepared: Function as PropType<((e: FieldValuePreparedEvent) => void)>,
    onFocusedCardChanged: Function as PropType<((e: FocusedCardChanged) => void)>,
    onInitialized: Function as PropType<((e: { component: Component<any>, element: any }) => void)>,
    onInitNewCard: Function as PropType<((e: InitNewCardEvent) => void)>,
    onOptionChanged: Function as PropType<((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    pager: Object as PropType<Pager | Record<string, any> | PagerBase>,
    paging: Object as PropType<Paging | Record<string, any>>,
    remoteOperations: [Boolean, String, Object] as PropType<boolean | Mode | RemoteOperations | Record<string, any>>,
    rtlEnabled: Boolean,
    scrolling: Object as PropType<Record<string, any>>,
    searchPanel: Object as PropType<SearchPanel | Record<string, any>>,
    selectedCardKeys: Array as PropType<Array<any>>,
    selection: Object as PropType<SelectionConfiguration | Record<string, any>>,
    sorting: Object as PropType<Sorting | Record<string, any>>,
    tabIndex: Number,
    toolbar: Object as PropType<dxCardViewToolbar | Record<string, any>>,
    visible: Boolean,
    width: [Number, String],
    wordWrapEnabled: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowColumnReordering": null,
    "update:cardContentTemplate": null,
    "update:cardCover": null,
    "update:cardFooterTemplate": null,
    "update:cardHeader": null,
    "update:cardMaxWidth": null,
    "update:cardMinWidth": null,
    "update:cardsPerRow": null,
    "update:cardTemplate": null,
    "update:columnChooser": null,
    "update:columns": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:editing": null,
    "update:elementAttr": null,
    "update:errorRowEnabled": null,
    "update:fieldHintEnabled": null,
    "update:filterBuilder": null,
    "update:filterBuilderPopup": null,
    "update:filterPanel": null,
    "update:filterValue": null,
    "update:focusStateEnabled": null,
    "update:headerFilter": null,
    "update:headerPanel": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:keyExpr": null,
    "update:loadPanel": null,
    "update:noDataTemplate": null,
    "update:noDataText": null,
    "update:onCardClick": null,
    "update:onCardDblClick": null,
    "update:onCardHoverChanged": null,
    "update:onCardInserted": null,
    "update:onCardInserting": null,
    "update:onCardPrepared": null,
    "update:onCardRemoved": null,
    "update:onCardRemoving": null,
    "update:onCardSaved": null,
    "update:onCardSaving": null,
    "update:onCardUpdated": null,
    "update:onCardUpdating": null,
    "update:onContentReady": null,
    "update:onContextMenuPreparing": null,
    "update:onDataErrorOccurred": null,
    "update:onDisposing": null,
    "update:onEditCanceled": null,
    "update:onEditCanceling": null,
    "update:onEditingStart": null,
    "update:onFieldCaptionClick": null,
    "update:onFieldCaptionDblClick": null,
    "update:onFieldCaptionPrepared": null,
    "update:onFieldValueClick": null,
    "update:onFieldValueDblClick": null,
    "update:onFieldValuePrepared": null,
    "update:onFocusedCardChanged": null,
    "update:onInitialized": null,
    "update:onInitNewCard": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:pager": null,
    "update:paging": null,
    "update:remoteOperations": null,
    "update:rtlEnabled": null,
    "update:scrolling": null,
    "update:searchPanel": null,
    "update:selectedCardKeys": null,
    "update:selection": null,
    "update:sorting": null,
    "update:tabIndex": null,
    "update:toolbar": null,
    "update:visible": null,
    "update:width": null,
    "update:wordWrapEnabled": null,
  },
  computed: {
    instance(): CardView {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CardView;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      cardCover: { isCollectionItem: false, optionName: "cardCover" },
      cardHeader: { isCollectionItem: false, optionName: "cardHeader" },
      cardViewHeaderFilter: { isCollectionItem: false, optionName: "headerFilter" },
      cardViewSelection: { isCollectionItem: false, optionName: "selection" },
      column: { isCollectionItem: true, optionName: "columns" },
      columnChooser: { isCollectionItem: false, optionName: "columnChooser" },
      editing: { isCollectionItem: false, optionName: "editing" },
      filterBuilder: { isCollectionItem: false, optionName: "filterBuilder" },
      filterPanel: { isCollectionItem: false, optionName: "filterPanel" },
      headerFilter: { isCollectionItem: false, optionName: "headerFilter" },
      headerPanel: { isCollectionItem: false, optionName: "headerPanel" },
      loadPanel: { isCollectionItem: false, optionName: "loadPanel" },
      pager: { isCollectionItem: false, optionName: "pager" },
      paging: { isCollectionItem: false, optionName: "paging" },
      remoteOperations: { isCollectionItem: false, optionName: "remoteOperations" },
      scrolling: { isCollectionItem: false, optionName: "scrolling" },
      searchPanel: { isCollectionItem: false, optionName: "searchPanel" },
      selection: { isCollectionItem: false, optionName: "selection" },
      sorting: { isCollectionItem: false, optionName: "sorting" },
      toolbar: { isCollectionItem: false, optionName: "toolbar" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxCardView = defineComponent(componentConfig);


const DxAiProcessingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:instruction": null,
  },
  props: {
    disabled: Boolean,
    instruction: String
  }
};

prepareConfigurationComponentConfig(DxAiProcessingConfig);

const DxAiProcessing = defineComponent(DxAiProcessingConfig);

(DxAiProcessing as any).$_optionName = "aiProcessing";

const DxAnimationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:hide": null,
    "update:show": null,
  },
  props: {
    hide: [Object, Number, String] as PropType<AnimationConfig | number | Record<string, any> | string>,
    show: [Object, Number, String] as PropType<AnimationConfig | number | Record<string, any> | string>
  }
};

prepareConfigurationComponentConfig(DxAnimationConfig);

const DxAnimation = defineComponent(DxAnimationConfig);

(DxAnimation as any).$_optionName = "animation";
(DxAnimation as any).$_expectedChildren = {
  hide: { isCollectionItem: false, optionName: "hide" },
  show: { isCollectionItem: false, optionName: "show" }
};

const DxAsyncRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any)>
  }
};

prepareConfigurationComponentConfig(DxAsyncRuleConfig);

const DxAsyncRule = defineComponent(DxAsyncRuleConfig);

(DxAsyncRule as any).$_optionName = "validationRules";
(DxAsyncRule as any).$_isCollectionItem = true;
(DxAsyncRule as any).$_predefinedProps = {
  type: "async"
};

const DxAtConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String as PropType<HorizontalAlignment>,
    y: String as PropType<VerticalAlignment>
  }
};

prepareConfigurationComponentConfig(DxAtConfig);

const DxAt = defineComponent(DxAtConfig);

(DxAt as any).$_optionName = "at";

const DxBoundaryOffsetConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
};

prepareConfigurationComponentConfig(DxBoundaryOffsetConfig);

const DxBoundaryOffset = defineComponent(DxBoundaryOffsetConfig);

(DxBoundaryOffset as any).$_optionName = "boundaryOffset";

const DxButtonItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:buttonOptions": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:horizontalAlignment": null,
    "update:itemType": null,
    "update:name": null,
    "update:verticalAlignment": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    buttonOptions: Object as PropType<dxButtonOptions | Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    itemType: String as PropType<FormItemType>,
    name: String,
    verticalAlignment: String as PropType<VerticalAlignment>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxButtonItemConfig);

const DxButtonItem = defineComponent(DxButtonItemConfig);

(DxButtonItem as any).$_optionName = "items";
(DxButtonItem as any).$_isCollectionItem = true;
(DxButtonItem as any).$_predefinedProps = {
  itemType: "button"
};
(DxButtonItem as any).$_expectedChildren = {
  buttonOptions: { isCollectionItem: false, optionName: "buttonOptions" }
};

const DxButtonOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:icon": null,
    "update:onClick": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:template": null,
    "update:text": null,
    "update:type": null,
    "update:useSubmitBehavior": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<((e: ClickEvent) => void)>,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    template: {},
    text: String,
    type: String as PropType<ButtonType | string>,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxButtonOptionsConfig);

const DxButtonOptions = defineComponent(DxButtonOptionsConfig);

(DxButtonOptions as any).$_optionName = "buttonOptions";

const DxCardCoverConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:altExpr": null,
    "update:aspectRatio": null,
    "update:imageExpr": null,
    "update:maxHeight": null,
    "update:template": null,
  },
  props: {
    altExpr: [Function, String] as PropType<(((data: any) => string)) | string>,
    aspectRatio: String,
    imageExpr: [Function, String] as PropType<(((data: any) => string)) | string>,
    maxHeight: Number,
    template: {}
  }
};

prepareConfigurationComponentConfig(DxCardCoverConfig);

const DxCardCover = defineComponent(DxCardCoverConfig);

(DxCardCover as any).$_optionName = "cardCover";

const DxCardHeaderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:items": null,
    "update:template": null,
    "update:visible": null,
  },
  props: {
    items: Array as PropType<Array<CardHeaderItem | CardHeaderPredefinedItem>>,
    template: {},
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxCardHeaderConfig);

const DxCardHeader = defineComponent(DxCardHeaderConfig);

(DxCardHeader as any).$_optionName = "cardHeader";
(DxCardHeader as any).$_expectedChildren = {
  cardHeaderItem: { isCollectionItem: true, optionName: "items" },
  item: { isCollectionItem: true, optionName: "items" }
};

const DxCardHeaderItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:html": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    html: String,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<CardHeaderPredefinedItem | string>,
    options: {},
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxCardHeaderItemConfig);

const DxCardHeaderItem = defineComponent(DxCardHeaderItemConfig);

(DxCardHeaderItem as any).$_optionName = "items";
(DxCardHeaderItem as any).$_isCollectionItem = true;

const DxCardViewHeaderFilterConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:height": null,
    "update:search": null,
    "update:searchTimeout": null,
    "update:texts": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    height: [Number, String],
    search: Object as PropType<HeaderFilterSearchConfig | Record<string, any>>,
    searchTimeout: Number,
    texts: Object as PropType<HeaderFilterTexts | Record<string, any>>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxCardViewHeaderFilterConfig);

const DxCardViewHeaderFilter = defineComponent(DxCardViewHeaderFilterConfig);

(DxCardViewHeaderFilter as any).$_optionName = "headerFilter";
(DxCardViewHeaderFilter as any).$_expectedChildren = {
  cardViewHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  cardViewHeaderFilterTexts: { isCollectionItem: false, optionName: "texts" },
  search: { isCollectionItem: false, optionName: "search" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxCardViewHeaderFilterSearchConfig = {
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

prepareConfigurationComponentConfig(DxCardViewHeaderFilterSearchConfig);

const DxCardViewHeaderFilterSearch = defineComponent(DxCardViewHeaderFilterSearchConfig);

(DxCardViewHeaderFilterSearch as any).$_optionName = "search";

const DxCardViewHeaderFilterTextsConfig = {
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

prepareConfigurationComponentConfig(DxCardViewHeaderFilterTextsConfig);

const DxCardViewHeaderFilterTexts = defineComponent(DxCardViewHeaderFilterTextsConfig);

(DxCardViewHeaderFilterTexts as any).$_optionName = "texts";

const DxCardViewSelectionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSelectAll": null,
    "update:mode": null,
    "update:selectAllMode": null,
    "update:showCheckBoxesMode": null,
  },
  props: {
    allowSelectAll: Boolean,
    mode: String as PropType<SingleMultipleOrNone>,
    selectAllMode: String as PropType<SelectAllMode>,
    showCheckBoxesMode: String as PropType<SelectionColumnDisplayMode>
  }
};

prepareConfigurationComponentConfig(DxCardViewSelectionConfig);

const DxCardViewSelection = defineComponent(DxCardViewSelectionConfig);

(DxCardViewSelection as any).$_optionName = "selection";

const DxChangeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:data": null,
    "update:insertAfterKey": null,
    "update:insertBeforeKey": null,
    "update:type": null,
  },
  props: {
    data: {},
    insertAfterKey: {},
    insertBeforeKey: {},
    type: String as PropType<DataChangeType>
  }
};

prepareConfigurationComponentConfig(DxChangeConfig);

const DxChange = defineComponent(DxChangeConfig);

(DxChange as any).$_optionName = "changes";
(DxChange as any).$_isCollectionItem = true;

const DxColCountByScreenConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:lg": null,
    "update:md": null,
    "update:sm": null,
    "update:xs": null,
  },
  props: {
    lg: Number,
    md: Number,
    sm: Number,
    xs: Number
  }
};

prepareConfigurationComponentConfig(DxColCountByScreenConfig);

const DxColCountByScreen = defineComponent(DxColCountByScreenConfig);

(DxColCountByScreen as any).$_optionName = "colCountByScreen";

const DxCollisionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String as PropType<CollisionResolution>,
    y: String as PropType<CollisionResolution>
  }
};

prepareConfigurationComponentConfig(DxCollisionConfig);

const DxCollision = defineComponent(DxCollisionConfig);

(DxCollision as any).$_optionName = "collision";

const DxColumnConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:allowEditing": null,
    "update:allowFiltering": null,
    "update:allowHeaderFiltering": null,
    "update:allowHiding": null,
    "update:allowReordering": null,
    "update:allowSearch": null,
    "update:allowSorting": null,
    "update:calculateDisplayValue": null,
    "update:calculateFieldValue": null,
    "update:calculateFilterExpression": null,
    "update:calculateSortValue": null,
    "update:caption": null,
    "update:customizeText": null,
    "update:dataField": null,
    "update:dataType": null,
    "update:editorOptions": null,
    "update:falseText": null,
    "update:fieldCaptionTemplate": null,
    "update:fieldTemplate": null,
    "update:fieldValueTemplate": null,
    "update:filterType": null,
    "update:filterValue": null,
    "update:filterValues": null,
    "update:format": null,
    "update:formItem": null,
    "update:headerFilter": null,
    "update:headerItemCssClass": null,
    "update:headerItemTemplate": null,
    "update:name": null,
    "update:setFieldValue": null,
    "update:showInColumnChooser": null,
    "update:sortIndex": null,
    "update:sortingMethod": null,
    "update:sortOrder": null,
    "update:trueText": null,
    "update:validationRules": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    allowEditing: Boolean,
    allowFiltering: Boolean,
    allowHeaderFiltering: Boolean,
    allowHiding: Boolean,
    allowReordering: Boolean,
    allowSearch: Boolean,
    allowSorting: Boolean,
    calculateDisplayValue: Function as PropType<((cardData: any) => any)>,
    calculateFieldValue: Function as PropType<((cardData: any) => any)>,
    calculateFilterExpression: Function as PropType<((filterValue: any, selectedFilterOperation: string | null, target: string) => string | Array<any> | (() => void))>,
    calculateSortValue: [Function, String] as PropType<(((cardData: any) => any)) | string>,
    caption: String,
    customizeText: Function as PropType<((fieldInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string)>,
    dataField: String,
    dataType: String as PropType<DataType>,
    editorOptions: {},
    falseText: String,
    fieldCaptionTemplate: {},
    fieldTemplate: {},
    fieldValueTemplate: {},
    filterType: String as PropType<FilterType>,
    filterValue: {},
    filterValues: Array as PropType<Array<any>>,
    format: [Object, String, Function] as PropType<Format | CommonFormat | (((value: number | Date) => string)) | Record<string, any> | string>,
    formItem: Object as PropType<dxFormSimpleItem | Record<string, any>>,
    headerFilter: Object as PropType<ColumnHeaderFilter | Record<string, any>>,
    headerItemCssClass: String,
    headerItemTemplate: {},
    name: String,
    setFieldValue: Function as PropType<((newData: any, value: any, currentCardData: any) => any)>,
    showInColumnChooser: Boolean,
    sortIndex: Number,
    sortingMethod: Function as PropType<((value1: any, value2: any) => number)>,
    sortOrder: String as PropType<SortOrder>,
    trueText: String,
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxColumnConfig);

const DxColumn = defineComponent(DxColumnConfig);

(DxColumn as any).$_optionName = "columns";
(DxColumn as any).$_isCollectionItem = true;
(DxColumn as any).$_expectedChildren = {
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  columnHeaderFilter: { isCollectionItem: false, optionName: "headerFilter" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  format: { isCollectionItem: false, optionName: "format" },
  formItem: { isCollectionItem: false, optionName: "formItem" },
  headerFilter: { isCollectionItem: false, optionName: "headerFilter" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};

const DxColumnChooserConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:container": null,
    "update:emptyPanelText": null,
    "update:enabled": null,
    "update:height": null,
    "update:mode": null,
    "update:position": null,
    "update:search": null,
    "update:searchTimeout": null,
    "update:selection": null,
    "update:sortOrder": null,
    "update:title": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    container: {},
    emptyPanelText: String,
    enabled: Boolean,
    height: [Number, String],
    mode: String as PropType<ColumnChooserMode>,
    position: Object as PropType<PositionConfig | Record<string, any>>,
    search: Object as PropType<ColumnChooserSearchConfig | Record<string, any>>,
    searchTimeout: Number,
    selection: Object as PropType<ColumnChooserSelectionConfig | Record<string, any>>,
    sortOrder: String as PropType<SortOrder>,
    title: String,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxColumnChooserConfig);

const DxColumnChooser = defineComponent(DxColumnChooserConfig);

(DxColumnChooser as any).$_optionName = "columnChooser";
(DxColumnChooser as any).$_expectedChildren = {
  columnChooserSearch: { isCollectionItem: false, optionName: "search" },
  columnChooserSelection: { isCollectionItem: false, optionName: "selection" },
  position: { isCollectionItem: false, optionName: "position" },
  search: { isCollectionItem: false, optionName: "search" },
  selection: { isCollectionItem: false, optionName: "selection" }
};

const DxColumnChooserSearchConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxColumnChooserSearchConfig);

const DxColumnChooserSearch = defineComponent(DxColumnChooserSearchConfig);

(DxColumnChooserSearch as any).$_optionName = "search";

const DxColumnChooserSelectionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSelectAll": null,
    "update:recursive": null,
    "update:selectByClick": null,
  },
  props: {
    allowSelectAll: Boolean,
    recursive: Boolean,
    selectByClick: Boolean
  }
};

prepareConfigurationComponentConfig(DxColumnChooserSelectionConfig);

const DxColumnChooserSelection = defineComponent(DxColumnChooserSelectionConfig);

(DxColumnChooserSelection as any).$_optionName = "selection";

const DxColumnHeaderFilterConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:dataSource": null,
    "update:groupInterval": null,
    "update:height": null,
    "update:search": null,
    "update:searchMode": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    dataSource: [Array, Object, Function] as PropType<Array<any> | DataSourceOptions | (((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void)) | null | Store | Record<string, any>>,
    groupInterval: [String, Number] as PropType<HeaderFilterGroupInterval | number>,
    height: [Number, String],
    search: Object as PropType<ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig | Record<string, any>>,
    searchMode: String as PropType<SearchMode>,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxColumnHeaderFilterConfig);

const DxColumnHeaderFilter = defineComponent(DxColumnHeaderFilterConfig);

(DxColumnHeaderFilter as any).$_optionName = "headerFilter";
(DxColumnHeaderFilter as any).$_expectedChildren = {
  columnHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  search: { isCollectionItem: false, optionName: "search" }
};

const DxColumnHeaderFilterSearchConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:mode": null,
    "update:searchExpr": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    mode: String as PropType<SearchMode>,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxColumnHeaderFilterSearchConfig);

const DxColumnHeaderFilterSearch = defineComponent(DxColumnHeaderFilterSearchConfig);

(DxColumnHeaderFilterSearch as any).$_optionName = "search";

const DxCompareRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    comparisonTarget: Function as PropType<(() => any)>,
    comparisonType: String as PropType<ComparisonOperator>,
    ignoreEmptyValue: Boolean,
    message: String,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxCompareRuleConfig);

const DxCompareRule = defineComponent(DxCompareRuleConfig);

(DxCompareRule as any).$_optionName = "validationRules";
(DxCompareRule as any).$_isCollectionItem = true;
(DxCompareRule as any).$_predefinedProps = {
  type: "compare"
};

const DxCustomOperationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:calculateFilterExpression": null,
    "update:caption": null,
    "update:customizeText": null,
    "update:dataTypes": null,
    "update:editorTemplate": null,
    "update:hasValue": null,
    "update:icon": null,
    "update:name": null,
  },
  props: {
    calculateFilterExpression: Function as PropType<((filterValue: any, field: dxFilterBuilderField) => string | (() => any) | Array<any>)>,
    caption: String,
    customizeText: Function as PropType<((fieldInfo: FieldInfo) => string)>,
    dataTypes: Array as PropType<Array<DataType>>,
    editorTemplate: {},
    hasValue: Boolean,
    icon: String,
    name: String
  }
};

prepareConfigurationComponentConfig(DxCustomOperationConfig);

const DxCustomOperation = defineComponent(DxCustomOperationConfig);

(DxCustomOperation as any).$_optionName = "customOperations";
(DxCustomOperation as any).$_isCollectionItem = true;

const DxCustomRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean)>
  }
};

prepareConfigurationComponentConfig(DxCustomRuleConfig);

const DxCustomRule = defineComponent(DxCustomRuleConfig);

(DxCustomRule as any).$_optionName = "validationRules";
(DxCustomRule as any).$_isCollectionItem = true;
(DxCustomRule as any).$_predefinedProps = {
  type: "custom"
};

const DxDraggingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:dropFeedbackMode": null,
    "update:onDragChange": null,
    "update:onDragEnd": null,
    "update:onDragMove": null,
    "update:onDragStart": null,
    "update:onRemove": null,
    "update:onReorder": null,
    "update:scrollSensitivity": null,
    "update:scrollSpeed": null,
  },
  props: {
    dropFeedbackMode: String as PropType<DragHighlight>,
    onDragChange: Function as PropType<((e: any) => void)>,
    onDragEnd: Function as PropType<((e: any) => void)>,
    onDragMove: Function as PropType<((e: any) => void)>,
    onDragStart: Function as PropType<((e: any) => void)>,
    onRemove: Function as PropType<((e: any) => void)>,
    onReorder: Function as PropType<((e: any) => void)>,
    scrollSensitivity: Number,
    scrollSpeed: Number
  }
};

prepareConfigurationComponentConfig(DxDraggingConfig);

const DxDragging = defineComponent(DxDraggingConfig);

(DxDragging as any).$_optionName = "dragging";

const DxEditingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowAdding": null,
    "update:allowDeleting": null,
    "update:allowUpdating": null,
    "update:changes": null,
    "update:confirmDelete": null,
    "update:editCardKey": null,
    "update:form": null,
    "update:popup": null,
    "update:texts": null,
  },
  props: {
    allowAdding: Boolean,
    allowDeleting: Boolean,
    allowUpdating: Boolean,
    changes: Array as PropType<Array<DataChange>>,
    confirmDelete: Boolean,
    editCardKey: {},
    form: Object as PropType<dxFormOptions | Record<string, any>>,
    popup: Object as PropType<Record<string, any>>,
    texts: Object as PropType<EditingTexts | Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxEditingConfig);

const DxEditing = defineComponent(DxEditingConfig);

(DxEditing as any).$_optionName = "editing";
(DxEditing as any).$_expectedChildren = {
  change: { isCollectionItem: true, optionName: "changes" },
  editingTexts: { isCollectionItem: false, optionName: "texts" },
  form: { isCollectionItem: false, optionName: "form" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxEditingTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:addCard": null,
    "update:confirmDeleteMessage": null,
    "update:confirmDeleteTitle": null,
    "update:deleteCard": null,
    "update:editCard": null,
    "update:saveCard": null,
  },
  props: {
    addCard: String,
    confirmDeleteMessage: String,
    confirmDeleteTitle: String,
    deleteCard: String,
    editCard: String,
    saveCard: String
  }
};

prepareConfigurationComponentConfig(DxEditingTextsConfig);

const DxEditingTexts = defineComponent(DxEditingTextsConfig);

(DxEditingTexts as any).$_optionName = "texts";

const DxEmailRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxEmailRuleConfig);

const DxEmailRule = defineComponent(DxEmailRuleConfig);

(DxEmailRule as any).$_optionName = "validationRules";
(DxEmailRule as any).$_isCollectionItem = true;
(DxEmailRule as any).$_predefinedProps = {
  type: "email"
};

const DxEmptyItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:itemType": null,
    "update:name": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    itemType: String as PropType<FormItemType>,
    name: String,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxEmptyItemConfig);

const DxEmptyItem = defineComponent(DxEmptyItemConfig);

(DxEmptyItem as any).$_optionName = "items";
(DxEmptyItem as any).$_isCollectionItem = true;
(DxEmptyItem as any).$_predefinedProps = {
  itemType: "empty"
};

const DxFieldConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:calculateFilterExpression": null,
    "update:caption": null,
    "update:customizeText": null,
    "update:dataField": null,
    "update:dataType": null,
    "update:editorOptions": null,
    "update:editorTemplate": null,
    "update:falseText": null,
    "update:filterOperations": null,
    "update:format": null,
    "update:lookup": null,
    "update:name": null,
    "update:trueText": null,
  },
  props: {
    calculateFilterExpression: Function as PropType<((filterValue: any, selectedFilterOperation: string) => string | (() => any) | Array<any>)>,
    caption: String,
    customizeText: Function as PropType<((fieldInfo: FieldInfo) => string)>,
    dataField: String,
    dataType: String as PropType<DataType>,
    editorOptions: {},
    editorTemplate: {},
    falseText: String,
    filterOperations: Array as PropType<Array<FilterBuilderOperation | string>>,
    format: [Object, String, Function] as PropType<Format | CommonFormat | (((value: number | Date) => string)) | Record<string, any> | string>,
    lookup: Object as PropType<Record<string, any>>,
    name: String,
    trueText: String
  }
};

prepareConfigurationComponentConfig(DxFieldConfig);

const DxField = defineComponent(DxFieldConfig);

(DxField as any).$_optionName = "fields";
(DxField as any).$_isCollectionItem = true;
(DxField as any).$_expectedChildren = {
  format: { isCollectionItem: false, optionName: "format" },
  lookup: { isCollectionItem: false, optionName: "lookup" }
};

const DxFilterBuilderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowHierarchicalFields": null,
    "update:customOperations": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:fields": null,
    "update:filterOperationDescriptions": null,
    "update:focusStateEnabled": null,
    "update:groupOperationDescriptions": null,
    "update:groupOperations": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:maxGroupLevel": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onEditorPrepared": null,
    "update:onEditorPreparing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:value": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowHierarchicalFields: Boolean,
    customOperations: Array as PropType<Array<dxFilterBuilderCustomOperation>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    fields: Array as PropType<Array<dxFilterBuilderField>>,
    filterOperationDescriptions: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    groupOperationDescriptions: Object as PropType<Record<string, any>>,
    groupOperations: Array as PropType<Array<GroupOperation>>,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    maxGroupLevel: Number,
    onContentReady: Function as PropType<((e: FilterBuilderContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: FilterBuilderDisposingEvent) => void)>,
    onEditorPrepared: Function as PropType<((e: EditorPreparedEvent) => void)>,
    onEditorPreparing: Function as PropType<((e: EditorPreparingEvent) => void)>,
    onInitialized: Function as PropType<((e: FilterBuilderInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: FilterBuilderOptionChangedEvent) => void)>,
    onValueChanged: Function as PropType<((e: ValueChangedEvent) => void)>,
    rtlEnabled: Boolean,
    tabIndex: Number,
    value: [Array, Function, String] as PropType<Array<any> | ((() => any)) | string>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxFilterBuilderConfig);

const DxFilterBuilder = defineComponent(DxFilterBuilderConfig);

(DxFilterBuilder as any).$_optionName = "filterBuilder";
(DxFilterBuilder as any).$_expectedChildren = {
  customOperation: { isCollectionItem: true, optionName: "customOperations" },
  field: { isCollectionItem: true, optionName: "fields" },
  filterOperationDescriptions: { isCollectionItem: false, optionName: "filterOperationDescriptions" },
  groupOperationDescriptions: { isCollectionItem: false, optionName: "groupOperationDescriptions" }
};

const DxFilterOperationDescriptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:between": null,
    "update:contains": null,
    "update:endsWith": null,
    "update:equal": null,
    "update:greaterThan": null,
    "update:greaterThanOrEqual": null,
    "update:isBlank": null,
    "update:isNotBlank": null,
    "update:lessThan": null,
    "update:lessThanOrEqual": null,
    "update:notContains": null,
    "update:notEqual": null,
    "update:startsWith": null,
  },
  props: {
    between: String,
    contains: String,
    endsWith: String,
    equal: String,
    greaterThan: String,
    greaterThanOrEqual: String,
    isBlank: String,
    isNotBlank: String,
    lessThan: String,
    lessThanOrEqual: String,
    notContains: String,
    notEqual: String,
    startsWith: String
  }
};

prepareConfigurationComponentConfig(DxFilterOperationDescriptionsConfig);

const DxFilterOperationDescriptions = defineComponent(DxFilterOperationDescriptionsConfig);

(DxFilterOperationDescriptions as any).$_optionName = "filterOperationDescriptions";

const DxFilterPanelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:filterEnabled": null,
    "update:texts": null,
    "update:visible": null,
  },
  props: {
    customizeText: Function as PropType<((e: { component: FilterPanel, filterValue: Record<string, any>, text: string }) => string)>,
    filterEnabled: Boolean,
    texts: Object as PropType<FilterPanelTexts | Record<string, any>>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxFilterPanelConfig);

const DxFilterPanel = defineComponent(DxFilterPanelConfig);

(DxFilterPanel as any).$_optionName = "filterPanel";
(DxFilterPanel as any).$_expectedChildren = {
  filterPanelTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxFilterPanelTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:clearFilter": null,
    "update:createFilter": null,
    "update:filterEnabledHint": null,
  },
  props: {
    clearFilter: String,
    createFilter: String,
    filterEnabledHint: String
  }
};

prepareConfigurationComponentConfig(DxFilterPanelTextsConfig);

const DxFilterPanelTexts = defineComponent(DxFilterPanelTextsConfig);

(DxFilterPanelTexts as any).$_optionName = "texts";

const DxFormConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:aiIntegration": null,
    "update:alignItemLabels": null,
    "update:alignItemLabelsInAllGroups": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:customizeItem": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:formData": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:isDirty": null,
    "update:items": null,
    "update:labelLocation": null,
    "update:labelMode": null,
    "update:minColWidth": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onEditorEnterKey": null,
    "update:onFieldDataChanged": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onSmartPasted": null,
    "update:onSmartPasting": null,
    "update:optionalMark": null,
    "update:readOnly": null,
    "update:requiredMark": null,
    "update:requiredMessage": null,
    "update:rtlEnabled": null,
    "update:screenByWidth": null,
    "update:scrollingEnabled": null,
    "update:showColonAfterLabel": null,
    "update:showOptionalMark": null,
    "update:showRequiredMark": null,
    "update:showValidationSummary": null,
    "update:smartPaste": null,
    "update:tabIndex": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    aiIntegration: Object as PropType<AIIntegration>,
    alignItemLabels: Boolean,
    alignItemLabelsInAllGroups: Boolean,
    colCount: [String, Number] as PropType<Mode | number>,
    colCountByScreen: Object as PropType<Record<string, any>>,
    customizeItem: Function as PropType<((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => void)>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    formData: {},
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    labelLocation: String as PropType<LabelLocation>,
    labelMode: String as PropType<FormLabelMode>,
    minColWidth: Number,
    onContentReady: Function as PropType<((e: FormContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: FormDisposingEvent) => void)>,
    onEditorEnterKey: Function as PropType<((e: EditorEnterKeyEvent) => void)>,
    onFieldDataChanged: Function as PropType<((e: FieldDataChangedEvent) => void)>,
    onInitialized: Function as PropType<((e: FormInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: FormOptionChangedEvent) => void)>,
    onSmartPasted: Function as PropType<((e: SmartPastedEvent) => void)>,
    onSmartPasting: Function as PropType<((e: SmartPastingEvent) => void)>,
    optionalMark: String,
    readOnly: Boolean,
    requiredMark: String,
    requiredMessage: String,
    rtlEnabled: Boolean,
    screenByWidth: Function as PropType<(() => void)>,
    scrollingEnabled: Boolean,
    showColonAfterLabel: Boolean,
    showOptionalMark: Boolean,
    showRequiredMark: Boolean,
    showValidationSummary: Boolean,
    smartPaste: Function as PropType<((text: string) => void)>,
    tabIndex: Number,
    validationGroup: String,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxFormConfig);

const DxForm = defineComponent(DxFormConfig);

(DxForm as any).$_optionName = "form";
(DxForm as any).$_expectedChildren = {
  ButtonItem: { isCollectionItem: true, optionName: "items" },
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" },
  EmptyItem: { isCollectionItem: true, optionName: "items" },
  GroupItem: { isCollectionItem: true, optionName: "items" },
  item: { isCollectionItem: true, optionName: "items" },
  SimpleItem: { isCollectionItem: true, optionName: "items" },
  TabbedItem: { isCollectionItem: true, optionName: "items" }
};

const DxFormatConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function as PropType<((value: number | Date) => string)>,
    parser: Function as PropType<((value: string) => number | Date)>,
    precision: Number,
    type: String as PropType<CommonFormat | string>,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxFormatConfig);

const DxFormat = defineComponent(DxFormatConfig);

(DxFormat as any).$_optionName = "format";

const DxFormItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiProcessing": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:editorOptions": null,
    "update:editorType": null,
    "update:helpText": null,
    "update:isRequired": null,
    "update:itemType": null,
    "update:label": null,
    "update:name": null,
    "update:template": null,
    "update:validationRules": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    aiProcessing: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    dataField: String,
    editorOptions: {},
    editorType: String as PropType<FormItemComponent>,
    helpText: String,
    isRequired: Boolean,
    itemType: String as PropType<FormItemType>,
    label: Object as PropType<Record<string, any>>,
    name: String,
    template: {},
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxFormItemConfig);

const DxFormItem = defineComponent(DxFormItemConfig);

(DxFormItem as any).$_optionName = "formItem";
(DxFormItem as any).$_expectedChildren = {
  aiProcessing: { isCollectionItem: false, optionName: "aiProcessing" },
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  label: { isCollectionItem: false, optionName: "label" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};

const DxFromConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:left": null,
    "update:opacity": null,
    "update:position": null,
    "update:scale": null,
    "update:top": null,
  },
  props: {
    left: Number,
    opacity: Number,
    position: Object as PropType<PositionConfig | Record<string, any>>,
    scale: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxFromConfig);

const DxFrom = defineComponent(DxFromConfig);

(DxFrom as any).$_optionName = "from";
(DxFrom as any).$_expectedChildren = {
  position: { isCollectionItem: false, optionName: "position" }
};

const DxGroupItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignItemLabels": null,
    "update:caption": null,
    "update:captionTemplate": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:items": null,
    "update:itemType": null,
    "update:name": null,
    "update:template": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    alignItemLabels: Boolean,
    caption: String,
    captionTemplate: {},
    colCount: Number,
    colCountByScreen: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    itemType: String as PropType<FormItemType>,
    name: String,
    template: {},
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxGroupItemConfig);

const DxGroupItem = defineComponent(DxGroupItemConfig);

(DxGroupItem as any).$_optionName = "items";
(DxGroupItem as any).$_isCollectionItem = true;
(DxGroupItem as any).$_predefinedProps = {
  itemType: "group"
};
(DxGroupItem as any).$_expectedChildren = {
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" }
};

const DxGroupOperationDescriptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:and": null,
    "update:notAnd": null,
    "update:notOr": null,
    "update:or": null,
  },
  props: {
    and: String,
    notAnd: String,
    notOr: String,
    or: String
  }
};

prepareConfigurationComponentConfig(DxGroupOperationDescriptionsConfig);

const DxGroupOperationDescriptions = defineComponent(DxGroupOperationDescriptionsConfig);

(DxGroupOperationDescriptions as any).$_optionName = "groupOperationDescriptions";

const DxHeaderFilterConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:dataSource": null,
    "update:groupInterval": null,
    "update:height": null,
    "update:search": null,
    "update:searchMode": null,
    "update:searchTimeout": null,
    "update:texts": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    dataSource: [Array, Object, Function] as PropType<Array<any> | DataSourceOptions | (((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void)) | null | Store | Record<string, any>>,
    groupInterval: [String, Number] as PropType<HeaderFilterGroupInterval | number>,
    height: [Number, String],
    search: Object as PropType<ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig | Record<string, any>>,
    searchMode: String as PropType<SearchMode>,
    searchTimeout: Number,
    texts: Object as PropType<HeaderFilterTexts | Record<string, any>>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxHeaderFilterConfig);

const DxHeaderFilter = defineComponent(DxHeaderFilterConfig);

(DxHeaderFilter as any).$_optionName = "headerFilter";
(DxHeaderFilter as any).$_expectedChildren = {
  cardViewHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  cardViewHeaderFilterTexts: { isCollectionItem: false, optionName: "texts" },
  columnHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  search: { isCollectionItem: false, optionName: "search" }
};

const DxHeaderPanelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:dragging": null,
    "update:itemCssClass": null,
    "update:itemTemplate": null,
    "update:visible": null,
  },
  props: {
    dragging: Object as PropType<Record<string, any>>,
    itemCssClass: String,
    itemTemplate: {},
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxHeaderPanelConfig);

const DxHeaderPanel = defineComponent(DxHeaderPanelConfig);

(DxHeaderPanel as any).$_optionName = "headerPanel";
(DxHeaderPanel as any).$_expectedChildren = {
  dragging: { isCollectionItem: false, optionName: "dragging" }
};

const DxHideConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:complete": null,
    "update:delay": null,
    "update:direction": null,
    "update:duration": null,
    "update:easing": null,
    "update:from": null,
    "update:staggerDelay": null,
    "update:start": null,
    "update:to": null,
    "update:type": null,
  },
  props: {
    complete: Function as PropType<(($element: any, config: AnimationConfig) => void)>,
    delay: Number,
    direction: String as PropType<Direction>,
    duration: Number,
    easing: String,
    from: Object as PropType<AnimationState | Record<string, any>>,
    staggerDelay: Number,
    start: Function as PropType<(($element: any, config: AnimationConfig) => void)>,
    to: Object as PropType<AnimationState | Record<string, any>>,
    type: String as PropType<AnimationType>
  }
};

prepareConfigurationComponentConfig(DxHideConfig);

const DxHide = defineComponent(DxHideConfig);

(DxHide as any).$_optionName = "hide";
(DxHide as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
};

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiProcessing": null,
    "update:alignItemLabels": null,
    "update:badge": null,
    "update:buttonOptions": null,
    "update:caption": null,
    "update:captionTemplate": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:disabled": null,
    "update:editorOptions": null,
    "update:editorType": null,
    "update:helpText": null,
    "update:horizontalAlignment": null,
    "update:html": null,
    "update:icon": null,
    "update:isRequired": null,
    "update:items": null,
    "update:itemType": null,
    "update:label": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:tabPanelOptions": null,
    "update:tabs": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
    "update:validationRules": null,
    "update:verticalAlignment": null,
    "update:visible": null,
    "update:visibleIndex": null,
    "update:widget": null,
  },
  props: {
    aiProcessing: Object as PropType<Record<string, any>>,
    alignItemLabels: Boolean,
    badge: String,
    buttonOptions: Object as PropType<dxButtonOptions | Record<string, any>>,
    caption: String,
    captionTemplate: {},
    colCount: Number,
    colCountByScreen: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    dataField: String,
    disabled: Boolean,
    editorOptions: {},
    editorType: String as PropType<FormItemComponent>,
    helpText: String,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    html: String,
    icon: String,
    isRequired: Boolean,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    itemType: String as PropType<FormItemType>,
    label: Object as PropType<Record<string, any>>,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<CardHeaderPredefinedItem | string | PredefinedToolbarItem>,
    options: {},
    showText: String as PropType<ShowTextMode>,
    tabPanelOptions: Object as PropType<dxTabPanelOptions | Record<string, any>>,
    tabs: Array as PropType<Array<Record<string, any>>>,
    tabTemplate: {},
    template: {},
    text: String,
    title: String,
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    verticalAlignment: String as PropType<VerticalAlignment>,
    visible: Boolean,
    visibleIndex: Number,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
(DxItem as any).$_expectedChildren = {
  aiProcessing: { isCollectionItem: false, optionName: "aiProcessing" },
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  buttonOptions: { isCollectionItem: false, optionName: "buttonOptions" },
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  label: { isCollectionItem: false, optionName: "label" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  tab: { isCollectionItem: true, optionName: "tabs" },
  tabPanelOptions: { isCollectionItem: false, optionName: "tabPanelOptions" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};

const DxLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:location": null,
    "update:showColon": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    location: String as PropType<LabelLocation>,
    showColon: Boolean,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";

const DxLoadPanelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:animation": null,
    "update:container": null,
    "update:deferRendering": null,
    "update:delay": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hideOnOutsideClick": null,
    "update:hideOnParentScroll": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:indicatorSrc": null,
    "update:maxHeight": null,
    "update:maxWidth": null,
    "update:message": null,
    "update:minHeight": null,
    "update:minWidth": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onHidden": null,
    "update:onHiding": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onShowing": null,
    "update:onShown": null,
    "update:position": null,
    "update:rtlEnabled": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showIndicator": null,
    "update:showPane": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapperAttr": null,
  },
  props: {
    animation: Object as PropType<Record<string, any>>,
    container: {},
    deferRendering: Boolean,
    delay: Number,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hideOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    indicatorSrc: String,
    maxHeight: [Number, String],
    maxWidth: [Number, String],
    message: String,
    minHeight: [Number, String],
    minWidth: [Number, String],
    onContentReady: Function as PropType<((e: LoadPanelContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: LoadPanelDisposingEvent) => void)>,
    onHidden: Function as PropType<((e: HiddenEvent) => void)>,
    onHiding: Function as PropType<((e: HidingEvent) => void)>,
    onInitialized: Function as PropType<((e: LoadPanelInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: LoadPanelOptionChangedEvent) => void)>,
    onShowing: Function as PropType<((e: ShowingEvent) => void)>,
    onShown: Function as PropType<((e: ShownEvent) => void)>,
    position: [Function, String, Object] as PropType<((() => void)) | PositionAlignment | PositionConfig | Record<string, any>>,
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showIndicator: Boolean,
    showPane: Boolean,
    visible: Boolean,
    width: [Number, String],
    wrapperAttr: {}
  }
};

prepareConfigurationComponentConfig(DxLoadPanelConfig);

const DxLoadPanel = defineComponent(DxLoadPanelConfig);

(DxLoadPanel as any).$_optionName = "loadPanel";
(DxLoadPanel as any).$_expectedChildren = {
  animation: { isCollectionItem: false, optionName: "animation" },
  position: { isCollectionItem: false, optionName: "position" }
};

const DxLookupConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowClearing": null,
    "update:dataSource": null,
    "update:displayExpr": null,
    "update:valueExpr": null,
  },
  props: {
    allowClearing: Boolean,
    dataSource: [Array, Object] as PropType<Array<any> | DataSourceOptions | Store | Record<string, any>>,
    displayExpr: [Function, String] as PropType<(((data: any) => string)) | string>,
    valueExpr: [Function, String] as PropType<(((data: any) => string | number | boolean)) | string>
  }
};

prepareConfigurationComponentConfig(DxLookupConfig);

const DxLookup = defineComponent(DxLookupConfig);

(DxLookup as any).$_optionName = "lookup";

const DxMyConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String as PropType<HorizontalAlignment>,
    y: String as PropType<VerticalAlignment>
  }
};

prepareConfigurationComponentConfig(DxMyConfig);

const DxMy = defineComponent(DxMyConfig);

(DxMy as any).$_optionName = "my";

const DxNumericRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxNumericRuleConfig);

const DxNumericRule = defineComponent(DxNumericRuleConfig);

(DxNumericRule as any).$_optionName = "validationRules";
(DxNumericRule as any).$_isCollectionItem = true;
(DxNumericRule as any).$_predefinedProps = {
  type: "numeric"
};

const DxOffsetConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
};

prepareConfigurationComponentConfig(DxOffsetConfig);

const DxOffset = defineComponent(DxOffsetConfig);

(DxOffset as any).$_optionName = "offset";

const DxPagerConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowedPageSizes": null,
    "update:displayMode": null,
    "update:infoText": null,
    "update:label": null,
    "update:showInfo": null,
    "update:showNavigationButtons": null,
    "update:showPageSizeSelector": null,
    "update:visible": null,
  },
  props: {
    allowedPageSizes: [Array, String] as PropType<(Array<number | PagerPageSize>) | Mode>,
    displayMode: String as PropType<DisplayMode>,
    infoText: String,
    label: String,
    showInfo: Boolean,
    showNavigationButtons: Boolean,
    showPageSizeSelector: Boolean,
    visible: [Boolean, String] as PropType<boolean | Mode>
  }
};

prepareConfigurationComponentConfig(DxPagerConfig);

const DxPager = defineComponent(DxPagerConfig);

(DxPager as any).$_optionName = "pager";

const DxPagingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:pageIndex": null,
    "update:pageSize": null,
  },
  props: {
    enabled: Boolean,
    pageIndex: Number,
    pageSize: Number
  }
};

prepareConfigurationComponentConfig(DxPagingConfig);

const DxPaging = defineComponent(DxPagingConfig);

(DxPaging as any).$_optionName = "paging";

const DxPatternRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:pattern": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    pattern: [RegExp, String],
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxPatternRuleConfig);

const DxPatternRule = defineComponent(DxPatternRuleConfig);

(DxPatternRule as any).$_optionName = "validationRules";
(DxPatternRule as any).$_isCollectionItem = true;
(DxPatternRule as any).$_predefinedProps = {
  type: "pattern"
};

const DxPositionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:at": null,
    "update:boundary": null,
    "update:boundaryOffset": null,
    "update:collision": null,
    "update:my": null,
    "update:of": null,
    "update:offset": null,
  },
  props: {
    at: [Object, String] as PropType<Record<string, any> | PositionAlignment>,
    boundary: {},
    boundaryOffset: [Object, String] as PropType<Record<string, any> | string>,
    collision: [String, Object] as PropType<CollisionResolutionCombination | Record<string, any>>,
    my: [Object, String] as PropType<Record<string, any> | PositionAlignment>,
    of: {},
    offset: [Object, String] as PropType<Record<string, any> | string>
  }
};

prepareConfigurationComponentConfig(DxPositionConfig);

const DxPosition = defineComponent(DxPositionConfig);

(DxPosition as any).$_optionName = "position";
(DxPosition as any).$_expectedChildren = {
  at: { isCollectionItem: false, optionName: "at" },
  boundaryOffset: { isCollectionItem: false, optionName: "boundaryOffset" },
  collision: { isCollectionItem: false, optionName: "collision" },
  my: { isCollectionItem: false, optionName: "my" },
  offset: { isCollectionItem: false, optionName: "offset" }
};

const DxRangeRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:reevaluate": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: [Date, Number, String],
    message: String,
    min: [Date, Number, String],
    reevaluate: Boolean,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxRangeRuleConfig);

const DxRangeRule = defineComponent(DxRangeRuleConfig);

(DxRangeRule as any).$_optionName = "validationRules";
(DxRangeRule as any).$_isCollectionItem = true;
(DxRangeRule as any).$_predefinedProps = {
  type: "range"
};

const DxRemoteOperationsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:filtering": null,
    "update:grouping": null,
    "update:paging": null,
    "update:sorting": null,
  },
  props: {
    filtering: Boolean,
    grouping: Boolean,
    paging: Boolean,
    sorting: Boolean
  }
};

prepareConfigurationComponentConfig(DxRemoteOperationsConfig);

const DxRemoteOperations = defineComponent(DxRemoteOperationsConfig);

(DxRemoteOperations as any).$_optionName = "remoteOperations";

const DxRequiredRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:message": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    message: String,
    trim: Boolean,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxRequiredRuleConfig);

const DxRequiredRule = defineComponent(DxRequiredRuleConfig);

(DxRequiredRule as any).$_optionName = "validationRules";
(DxRequiredRule as any).$_isCollectionItem = true;
(DxRequiredRule as any).$_predefinedProps = {
  type: "required"
};

const DxScrollingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:scrollByContent": null,
    "update:scrollByThumb": null,
    "update:showScrollbar": null,
    "update:useNative": null,
  },
  props: {
    scrollByContent: Boolean,
    scrollByThumb: Boolean,
    showScrollbar: String as PropType<ScrollbarMode>,
    useNative: [Boolean, String] as PropType<boolean | Mode>
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
    "update:searchExpr": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    mode: String as PropType<SearchMode>,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxSearchConfig);

const DxSearch = defineComponent(DxSearchConfig);

(DxSearch as any).$_optionName = "search";

const DxSearchPanelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:highlightCaseSensitive": null,
    "update:highlightSearchText": null,
    "update:placeholder": null,
    "update:searchVisibleColumnsOnly": null,
    "update:text": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    highlightCaseSensitive: Boolean,
    highlightSearchText: Boolean,
    placeholder: String,
    searchVisibleColumnsOnly: Boolean,
    text: String,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxSearchPanelConfig);

const DxSearchPanel = defineComponent(DxSearchPanelConfig);

(DxSearchPanel as any).$_optionName = "searchPanel";

const DxSelectionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSelectAll": null,
    "update:mode": null,
    "update:recursive": null,
    "update:selectAllMode": null,
    "update:selectByClick": null,
    "update:showCheckBoxesMode": null,
  },
  props: {
    allowSelectAll: Boolean,
    mode: String as PropType<SingleMultipleOrNone>,
    recursive: Boolean,
    selectAllMode: String as PropType<SelectAllMode>,
    selectByClick: Boolean,
    showCheckBoxesMode: String as PropType<SelectionColumnDisplayMode>
  }
};

prepareConfigurationComponentConfig(DxSelectionConfig);

const DxSelection = defineComponent(DxSelectionConfig);

(DxSelection as any).$_optionName = "selection";

const DxShowConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:complete": null,
    "update:delay": null,
    "update:direction": null,
    "update:duration": null,
    "update:easing": null,
    "update:from": null,
    "update:staggerDelay": null,
    "update:start": null,
    "update:to": null,
    "update:type": null,
  },
  props: {
    complete: Function as PropType<(($element: any, config: AnimationConfig) => void)>,
    delay: Number,
    direction: String as PropType<Direction>,
    duration: Number,
    easing: String,
    from: Object as PropType<AnimationState | Record<string, any>>,
    staggerDelay: Number,
    start: Function as PropType<(($element: any, config: AnimationConfig) => void)>,
    to: Object as PropType<AnimationState | Record<string, any>>,
    type: String as PropType<AnimationType>
  }
};

prepareConfigurationComponentConfig(DxShowConfig);

const DxShow = defineComponent(DxShowConfig);

(DxShow as any).$_optionName = "show";
(DxShow as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
};

const DxSimpleItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiProcessing": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:editorOptions": null,
    "update:editorType": null,
    "update:helpText": null,
    "update:isRequired": null,
    "update:itemType": null,
    "update:label": null,
    "update:name": null,
    "update:template": null,
    "update:validationRules": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    aiProcessing: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    dataField: String,
    editorOptions: {},
    editorType: String as PropType<FormItemComponent>,
    helpText: String,
    isRequired: Boolean,
    itemType: String as PropType<FormItemType>,
    label: Object as PropType<Record<string, any>>,
    name: String,
    template: {},
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxSimpleItemConfig);

const DxSimpleItem = defineComponent(DxSimpleItemConfig);

(DxSimpleItem as any).$_optionName = "items";
(DxSimpleItem as any).$_isCollectionItem = true;
(DxSimpleItem as any).$_predefinedProps = {
  itemType: "simple"
};
(DxSimpleItem as any).$_expectedChildren = {
  aiProcessing: { isCollectionItem: false, optionName: "aiProcessing" },
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  label: { isCollectionItem: false, optionName: "label" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};

const DxSortingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ascendingText": null,
    "update:clearText": null,
    "update:descendingText": null,
    "update:mode": null,
    "update:showSortIndexes": null,
  },
  props: {
    ascendingText: String,
    clearText: String,
    descendingText: String,
    mode: String as PropType<SingleMultipleOrNone>,
    showSortIndexes: Boolean
  }
};

prepareConfigurationComponentConfig(DxSortingConfig);

const DxSorting = defineComponent(DxSortingConfig);

(DxSorting as any).$_optionName = "sorting";

const DxStringLengthRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: Number,
    message: String,
    min: Number,
    trim: Boolean,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxStringLengthRuleConfig);

const DxStringLengthRule = defineComponent(DxStringLengthRuleConfig);

(DxStringLengthRule as any).$_optionName = "validationRules";
(DxStringLengthRule as any).$_isCollectionItem = true;
(DxStringLengthRule as any).$_predefinedProps = {
  type: "stringLength"
};

const DxTabConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignItemLabels": null,
    "update:badge": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:disabled": null,
    "update:icon": null,
    "update:items": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:title": null,
  },
  props: {
    alignItemLabels: Boolean,
    badge: String,
    colCount: Number,
    colCountByScreen: Object as PropType<Record<string, any>>,
    disabled: Boolean,
    icon: String,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    tabTemplate: {},
    template: {},
    title: String
  }
};

prepareConfigurationComponentConfig(DxTabConfig);

const DxTab = defineComponent(DxTabConfig);

(DxTab as any).$_optionName = "tabs";
(DxTab as any).$_isCollectionItem = true;
(DxTab as any).$_expectedChildren = {
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" }
};

const DxTabbedItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:itemType": null,
    "update:name": null,
    "update:tabPanelOptions": null,
    "update:tabs": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    itemType: String as PropType<FormItemType>,
    name: String,
    tabPanelOptions: Object as PropType<dxTabPanelOptions | Record<string, any>>,
    tabs: Array as PropType<Array<Record<string, any>>>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxTabbedItemConfig);

const DxTabbedItem = defineComponent(DxTabbedItemConfig);

(DxTabbedItem as any).$_optionName = "items";
(DxTabbedItem as any).$_isCollectionItem = true;
(DxTabbedItem as any).$_predefinedProps = {
  itemType: "tabbed"
};
(DxTabbedItem as any).$_expectedChildren = {
  tab: { isCollectionItem: true, optionName: "tabs" },
  tabPanelOptions: { isCollectionItem: false, optionName: "tabPanelOptions" }
};

const DxTabPanelOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:animationEnabled": null,
    "update:dataSource": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:iconPosition": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:itemTitleTemplate": null,
    "update:keyExpr": null,
    "update:loop": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:onSelectionChanging": null,
    "update:onTitleClick": null,
    "update:onTitleHold": null,
    "update:onTitleRendered": null,
    "update:repaintChangesOnly": null,
    "update:rtlEnabled": null,
    "update:scrollByContent": null,
    "update:scrollingEnabled": null,
    "update:selectedIndex": null,
    "update:selectedItem": null,
    "update:showNavButtons": null,
    "update:stylingMode": null,
    "update:swipeEnabled": null,
    "update:tabIndex": null,
    "update:tabsPosition": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animationEnabled: Boolean,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxTabPanelItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    deferRendering: Boolean,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    iconPosition: String as PropType<TabsIconPosition>,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any | dxTabPanelItem | string>>,
    itemTemplate: {},
    itemTitleTemplate: {},
    keyExpr: [Function, String] as PropType<((() => void)) | string>,
    loop: Boolean,
    noDataText: String,
    onContentReady: Function as PropType<((e: TabPanelContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: TabPanelDisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: TabPanelInitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: TabPanelOptionChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: TabPanelSelectionChangedEvent) => void)>,
    onSelectionChanging: Function as PropType<((e: SelectionChangingEvent) => void)>,
    onTitleClick: Function as PropType<((e: TitleClickEvent) => void)>,
    onTitleHold: Function as PropType<((e: TitleHoldEvent) => void)>,
    onTitleRendered: Function as PropType<((e: TitleRenderedEvent) => void)>,
    repaintChangesOnly: Boolean,
    rtlEnabled: Boolean,
    scrollByContent: Boolean,
    scrollingEnabled: Boolean,
    selectedIndex: Number,
    selectedItem: {},
    showNavButtons: Boolean,
    stylingMode: String as PropType<TabsStyle>,
    swipeEnabled: Boolean,
    tabIndex: Number,
    tabsPosition: String as PropType<Position>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxTabPanelOptionsConfig);

const DxTabPanelOptions = defineComponent(DxTabPanelOptionsConfig);

(DxTabPanelOptions as any).$_optionName = "tabPanelOptions";
(DxTabPanelOptions as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  tabPanelOptionsItem: { isCollectionItem: true, optionName: "items" }
};

const DxTabPanelOptionsItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:badge": null,
    "update:disabled": null,
    "update:html": null,
    "update:icon": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
    "update:visible": null,
  },
  props: {
    badge: String,
    disabled: Boolean,
    html: String,
    icon: String,
    tabTemplate: {},
    template: {},
    text: String,
    title: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxTabPanelOptionsItemConfig);

const DxTabPanelOptionsItem = defineComponent(DxTabPanelOptionsItemConfig);

(DxTabPanelOptionsItem as any).$_optionName = "items";
(DxTabPanelOptionsItem as any).$_isCollectionItem = true;

const DxTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:addCard": null,
    "update:cancel": null,
    "update:clearFilter": null,
    "update:confirmDeleteMessage": null,
    "update:confirmDeleteTitle": null,
    "update:createFilter": null,
    "update:deleteCard": null,
    "update:editCard": null,
    "update:emptyValue": null,
    "update:filterEnabledHint": null,
    "update:ok": null,
    "update:saveCard": null,
  },
  props: {
    addCard: String,
    cancel: String,
    clearFilter: String,
    confirmDeleteMessage: String,
    confirmDeleteTitle: String,
    createFilter: String,
    deleteCard: String,
    editCard: String,
    emptyValue: String,
    filterEnabledHint: String,
    ok: String,
    saveCard: String
  }
};

prepareConfigurationComponentConfig(DxTextsConfig);

const DxTexts = defineComponent(DxTextsConfig);

(DxTexts as any).$_optionName = "texts";

const DxToConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:left": null,
    "update:opacity": null,
    "update:position": null,
    "update:scale": null,
    "update:top": null,
  },
  props: {
    left: Number,
    opacity: Number,
    position: Object as PropType<PositionConfig | Record<string, any>>,
    scale: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxToConfig);

const DxTo = defineComponent(DxToConfig);

(DxTo as any).$_optionName = "to";
(DxTo as any).$_expectedChildren = {
  position: { isCollectionItem: false, optionName: "position" }
};

const DxToolbarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:items": null,
    "update:multiline": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    items: Array as PropType<Array<dxCardViewToolbarItem | PredefinedToolbarItem>>,
    multiline: Boolean,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxToolbarConfig);

const DxToolbar = defineComponent(DxToolbarConfig);

(DxToolbar as any).$_optionName = "toolbar";
(DxToolbar as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  toolbarItem: { isCollectionItem: true, optionName: "items" }
};

const DxToolbarItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:html": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    html: String,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<PredefinedToolbarItem | string>,
    options: {},
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxToolbarItemConfig);

const DxToolbarItem = defineComponent(DxToolbarItemConfig);

(DxToolbarItem as any).$_optionName = "items";
(DxToolbarItem as any).$_isCollectionItem = true;

const DxValidationRuleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:pattern": null,
    "update:reevaluate": null,
    "update:trim": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    comparisonTarget: Function as PropType<(() => any)>,
    comparisonType: String as PropType<ComparisonOperator>,
    ignoreEmptyValue: Boolean,
    max: [Date, Number, String],
    message: String,
    min: [Date, Number, String],
    pattern: [RegExp, String],
    reevaluate: Boolean,
    trim: Boolean,
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean)>
  }
};

prepareConfigurationComponentConfig(DxValidationRuleConfig);

const DxValidationRule = defineComponent(DxValidationRuleConfig);

(DxValidationRule as any).$_optionName = "validationRules";
(DxValidationRule as any).$_isCollectionItem = true;
(DxValidationRule as any).$_predefinedProps = {
  type: "required"
};

export default DxCardView;
export {
  DxCardView,
  DxAiProcessing,
  DxAnimation,
  DxAsyncRule,
  DxAt,
  DxBoundaryOffset,
  DxButtonItem,
  DxButtonOptions,
  DxCardCover,
  DxCardHeader,
  DxCardHeaderItem,
  DxCardViewHeaderFilter,
  DxCardViewHeaderFilterSearch,
  DxCardViewHeaderFilterTexts,
  DxCardViewSelection,
  DxChange,
  DxColCountByScreen,
  DxCollision,
  DxColumn,
  DxColumnChooser,
  DxColumnChooserSearch,
  DxColumnChooserSelection,
  DxColumnHeaderFilter,
  DxColumnHeaderFilterSearch,
  DxCompareRule,
  DxCustomOperation,
  DxCustomRule,
  DxDragging,
  DxEditing,
  DxEditingTexts,
  DxEmailRule,
  DxEmptyItem,
  DxField,
  DxFilterBuilder,
  DxFilterOperationDescriptions,
  DxFilterPanel,
  DxFilterPanelTexts,
  DxForm,
  DxFormat,
  DxFormItem,
  DxFrom,
  DxGroupItem,
  DxGroupOperationDescriptions,
  DxHeaderFilter,
  DxHeaderPanel,
  DxHide,
  DxItem,
  DxLabel,
  DxLoadPanel,
  DxLookup,
  DxMy,
  DxNumericRule,
  DxOffset,
  DxPager,
  DxPaging,
  DxPatternRule,
  DxPosition,
  DxRangeRule,
  DxRemoteOperations,
  DxRequiredRule,
  DxScrolling,
  DxSearch,
  DxSearchPanel,
  DxSelection,
  DxShow,
  DxSimpleItem,
  DxSorting,
  DxStringLengthRule,
  DxTab,
  DxTabbedItem,
  DxTabPanelOptions,
  DxTabPanelOptionsItem,
  DxTexts,
  DxTo,
  DxToolbar,
  DxToolbarItem,
  DxValidationRule
};
import type * as DxCardViewTypes from "devextreme/ui/card_view_types";
export { DxCardViewTypes };
