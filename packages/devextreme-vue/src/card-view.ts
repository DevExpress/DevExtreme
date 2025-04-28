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
 Editing,
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
 SelectionChangingEvent,
 Paging,
 RemoteOperations,
 SelectionConfiguration,
 Toolbar,
 CardHeaderPredefinedToolbarItem,
 CardHeaderToolbarItem,
 PredefinedToolbarItem,
 ToolbarItem,
} from "devextreme/ui/card_view";
import {
 Mode,
 ValidationRuleType,
 HorizontalAlignment,
 VerticalAlignment,
 ToolbarItemLocation,
 ToolbarItemComponent,
 DataType,
 Format as CommonFormat,
 SortOrder,
 ComparisonOperator,
 Direction,
 PositionAlignment,
 DisplayMode,
 SingleMultipleOrNone,
 SelectAllMode,
} from "devextreme/common";
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
 ContentReadyEvent,
 DisposingEvent,
 EditorPreparedEvent,
 EditorPreparingEvent,
 InitializedEvent,
 OptionChangedEvent,
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
 Pager,
 DataChangeType,
 FilterType,
 DataChange,
 PagerPageSize,
 SelectionColumnDisplayMode,
} from "devextreme/common/grids";
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
 LocateInMenuMode,
 ShowTextMode,
} from "devextreme/ui/toolbar";
import {
 Format,
} from "devextreme/common/core/localization";
import {
 dxFormSimpleItem,
 FormItemComponent,
 FormItemType,
 LabelLocation,
} from "devextreme/ui/form";
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
  "onSelectionChanging" |
  "pager" |
  "paging" |
  "remoteOperations" |
  "rtlEnabled" |
  "scrolling" |
  "searchPanel" |
  "selectedCardKeys" |
  "selection" |
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
    columnChooser: Object as PropType<Record<string, any>>,
    columns: Array as PropType<Array<ColumnProperties | string>>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | Store | string | Record<string, any>>,
    disabled: Boolean,
    editing: Object as PropType<Editing | Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    errorRowEnabled: Boolean,
    fieldHintEnabled: Boolean,
    filterBuilder: Object as PropType<dxFilterBuilderOptions | Record<string, any>>,
    filterBuilderPopup: Object as PropType<Record<string, any>>,
    filterPanel: Object as PropType<Record<string, any>>,
    filterValue: [Array, Function, String] as PropType<Array<any> | ((() => any)) | string>,
    focusStateEnabled: Boolean,
    headerFilter: Object as PropType<Record<string, any>>,
    headerPanel: Object as PropType<HeaderPanel | Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
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
    onSelectionChanging: Function as PropType<((e: SelectionChangingEvent) => void)>,
    pager: Object as PropType<Pager | Record<string, any> | PagerBase>,
    paging: Object as PropType<Paging | Record<string, any>>,
    remoteOperations: [Boolean, String, Object] as PropType<boolean | Mode | RemoteOperations | Record<string, any>>,
    rtlEnabled: Boolean,
    scrolling: Object as PropType<Record<string, any>>,
    searchPanel: Object as PropType<Record<string, any>>,
    selectedCardKeys: Array as PropType<Array<any>>,
    selection: Object as PropType<SelectionConfiguration | Record<string, any>>,
    tabIndex: Number,
    toolbar: Object as PropType<Toolbar | Record<string, any>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
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
    "update:onSelectionChanging": null,
    "update:pager": null,
    "update:paging": null,
    "update:remoteOperations": null,
    "update:rtlEnabled": null,
    "update:scrolling": null,
    "update:searchPanel": null,
    "update:selectedCardKeys": null,
    "update:selection": null,
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
      column: { isCollectionItem: true, optionName: "columns" },
      editing: { isCollectionItem: false, optionName: "editing" },
      filterBuilder: { isCollectionItem: false, optionName: "filterBuilder" },
      headerPanel: { isCollectionItem: false, optionName: "headerPanel" },
      loadPanel: { isCollectionItem: false, optionName: "loadPanel" },
      pager: { isCollectionItem: false, optionName: "pager" },
      paging: { isCollectionItem: false, optionName: "paging" },
      remoteOperations: { isCollectionItem: false, optionName: "remoteOperations" },
      selection: { isCollectionItem: false, optionName: "selection" },
      toolbar: { isCollectionItem: false, optionName: "toolbar" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxCardView = defineComponent(componentConfig);


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
    items: Array as PropType<Array<CardHeaderPredefinedToolbarItem | CardHeaderToolbarItem>>,
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
    name: String as PropType<CardHeaderPredefinedToolbarItem | string>,
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
    customizeText: Function as PropType<((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string)>,
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
    headerFilter: Object as PropType<Record<string, any>>,
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
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  format: { isCollectionItem: false, optionName: "format" },
  formItem: { isCollectionItem: false, optionName: "formItem" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};

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
  },
  props: {
    allowAdding: Boolean,
    allowDeleting: Boolean,
    allowUpdating: Boolean,
    changes: Array as PropType<Array<DataChange>>,
    confirmDelete: Boolean,
    editCardKey: {},
    form: Object as PropType<Record<string, any>>,
    popup: Object as PropType<Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxEditingConfig);

const DxEditing = defineComponent(DxEditingConfig);

(DxEditing as any).$_optionName = "editing";
(DxEditing as any).$_expectedChildren = {
  change: { isCollectionItem: true, optionName: "changes" }
};

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
    "update:bindingOptions": null,
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
    bindingOptions: Object as PropType<Record<string, any>>,
    customOperations: Array as PropType<Array<dxFilterBuilderCustomOperation>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    fields: Array as PropType<Array<dxFilterBuilderField>>,
    filterOperationDescriptions: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    groupOperationDescriptions: Object as PropType<Record<string, any>>,
    groupOperations: Array as PropType<Array<GroupOperation>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    maxGroupLevel: Number,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onEditorPrepared: Function as PropType<((e: EditorPreparedEvent) => void)>,
    onEditorPreparing: Function as PropType<((e: EditorPreparingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onValueChanged: Function as PropType<((e: ValueChangedEvent) => void)>,
    rtlEnabled: Boolean,
    tabIndex: Number,
    value: [Array, Function, String] as PropType<Array<any> | ((() => any)) | string>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
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
    name: String as PropType<CardHeaderPredefinedToolbarItem | string | PredefinedToolbarItem>,
    options: {},
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

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
    "update:bindingOptions": null,
    "update:closeOnOutsideClick": null,
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
    bindingOptions: Object as PropType<Record<string, any>>,
    closeOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    container: {},
    deferRendering: Boolean,
    delay: Number,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hideOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    indicatorSrc: String,
    maxHeight: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    maxWidth: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    message: String,
    minHeight: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    minWidth: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
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
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
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

const DxSelectionConfig = {
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
    items: Array as PropType<Array<PredefinedToolbarItem | ToolbarItem>>,
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
  DxAnimation,
  DxAsyncRule,
  DxAt,
  DxBoundaryOffset,
  DxCardCover,
  DxCardHeader,
  DxCardHeaderItem,
  DxChange,
  DxCollision,
  DxColumn,
  DxCompareRule,
  DxCustomOperation,
  DxCustomRule,
  DxEditing,
  DxEmailRule,
  DxField,
  DxFilterBuilder,
  DxFilterOperationDescriptions,
  DxFormat,
  DxFormItem,
  DxFrom,
  DxGroupOperationDescriptions,
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
  DxSelection,
  DxShow,
  DxStringLengthRule,
  DxTo,
  DxToolbar,
  DxToolbarItem,
  DxValidationRule
};
import type * as DxCardViewTypes from "devextreme/ui/card_view_types";
export { DxCardViewTypes };
