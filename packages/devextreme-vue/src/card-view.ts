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
 HeaderPanel,
 Paging,
 RemoteOperations,
 PredefinedToolbarItem,
 ToolbarItem,
} from "devextreme/ui/card_view";
import {
 Mode,
 HorizontalAlignment,
 VerticalAlignment,
 Direction,
 ToolbarItemLocation,
 ToolbarItemComponent,
 PositionAlignment,
 DisplayMode,
} from "devextreme/common";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 dxLoadPanelOptions,
 ContentReadyEvent,
 DisposingEvent,
 HiddenEvent,
 HidingEvent,
 InitializedEvent,
 OptionChangedEvent,
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
 PagerPageSize,
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
 event,
} from "devextreme/events/events.types";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "cardCover" |
  "cardFooterTemplate" |
  "cardHeader" |
  "cardMaxWidth" |
  "cardMinWidth" |
  "cardsPerRow" |
  "cardTemplate" |
  "columns" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "errorRowEnabled" |
  "focusStateEnabled" |
  "headerPanel" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "keyExpr" |
  "loadPanel" |
  "noDataTemplate" |
  "noDataText" |
  "onContentReady" |
  "onDataErrorOccurred" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "pager" |
  "paging" |
  "remoteOperations" |
  "rtlEnabled" |
  "scrolling" |
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
    cardCover: Object as PropType<CardCover | Record<string, any>>,
    cardFooterTemplate: {},
    cardHeader: Object as PropType<CardHeader | Record<string, any>>,
    cardMaxWidth: Number,
    cardMinWidth: Number,
    cardsPerRow: [String, Number] as PropType<Mode | number>,
    cardTemplate: {},
    columns: Array as PropType<Array<ColumnProperties | string>>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | Store | string | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    errorRowEnabled: Boolean,
    focusStateEnabled: Boolean,
    headerPanel: Object as PropType<HeaderPanel | Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    keyExpr: [Array, String] as PropType<Array<string> | string>,
    loadPanel: Object as PropType<dxLoadPanelOptions | Record<string, any>>,
    noDataTemplate: {},
    noDataText: String,
    onContentReady: Function as PropType<((e: EventInfo<any>) => void)>,
    onDataErrorOccurred: Function as PropType<((e: { component: Object, element: any, error: any, model: any }) => void)>,
    onDisposing: Function as PropType<((e: EventInfo<any>) => void)>,
    onInitialized: Function as PropType<((e: { component: Component<any>, element: any }) => void)>,
    onOptionChanged: Function as PropType<((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)>,
    pager: Object as PropType<Pager | Record<string, any> | PagerBase>,
    paging: Object as PropType<Paging | Record<string, any>>,
    remoteOperations: [Boolean, String, Object] as PropType<boolean | Mode | RemoteOperations | Record<string, any>>,
    rtlEnabled: Boolean,
    scrolling: Object as PropType<Record<string, any>>,
    tabIndex: Number,
    toolbar: Object as PropType<Record<string, any>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    wordWrapEnabled: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:cardCover": null,
    "update:cardFooterTemplate": null,
    "update:cardHeader": null,
    "update:cardMaxWidth": null,
    "update:cardMinWidth": null,
    "update:cardsPerRow": null,
    "update:cardTemplate": null,
    "update:columns": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:errorRowEnabled": null,
    "update:focusStateEnabled": null,
    "update:headerPanel": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:keyExpr": null,
    "update:loadPanel": null,
    "update:noDataTemplate": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDataErrorOccurred": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:pager": null,
    "update:paging": null,
    "update:remoteOperations": null,
    "update:rtlEnabled": null,
    "update:scrolling": null,
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
      headerPanel: { isCollectionItem: false, optionName: "headerPanel" },
      loadPanel: { isCollectionItem: false, optionName: "loadPanel" },
      pager: { isCollectionItem: false, optionName: "pager" },
      paging: { isCollectionItem: false, optionName: "paging" },
      remoteOperations: { isCollectionItem: false, optionName: "remoteOperations" },
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
  },
  props: {
    altExpr: [Function, String] as PropType<(((data: any) => string)) | string>,
    aspectRatio: String,
    imageExpr: [Function, String] as PropType<(((data: any) => string)) | string>,
    maxHeight: Number
  }
};

prepareConfigurationComponentConfig(DxCardCoverConfig);

const DxCardCover = defineComponent(DxCardCoverConfig);

(DxCardCover as any).$_optionName = "cardCover";

const DxCardHeaderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:visible": null,
  },
  props: {
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxCardHeaderConfig);

const DxCardHeader = defineComponent(DxCardHeaderConfig);

(DxCardHeader as any).$_optionName = "cardHeader";

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
    "update:fieldCaptionTemplate": null,
    "update:fieldTemplate": null,
    "update:fieldValueTemplate": null,
    "update:headerItemCssClass": null,
    "update:headerItemTemplate": null,
  },
  props: {
    fieldCaptionTemplate: {},
    fieldTemplate: {},
    fieldValueTemplate: {},
    headerItemCssClass: String,
    headerItemTemplate: {}
  }
};

prepareConfigurationComponentConfig(DxColumnConfig);

const DxColumn = defineComponent(DxColumnConfig);

(DxColumn as any).$_optionName = "columns";
(DxColumn as any).$_isCollectionItem = true;

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
    name: String as PropType<PredefinedToolbarItem | string>,
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
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onHidden: Function as PropType<((e: HiddenEvent) => void)>,
    onHiding: Function as PropType<((e: HidingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
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

const DxRemoteOperationsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:filtering": null,
    "update:paging": null,
    "update:sorting": null,
    "update:summary": null,
  },
  props: {
    filtering: Boolean,
    paging: Boolean,
    sorting: Boolean,
    summary: Boolean
  }
};

prepareConfigurationComponentConfig(DxRemoteOperationsConfig);

const DxRemoteOperations = defineComponent(DxRemoteOperationsConfig);

(DxRemoteOperations as any).$_optionName = "remoteOperations";

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
    "update:items": null,
  },
  props: {
    items: Array as PropType<Array<PredefinedToolbarItem | ToolbarItem>>
  }
};

prepareConfigurationComponentConfig(DxToolbarConfig);

const DxToolbar = defineComponent(DxToolbarConfig);

(DxToolbar as any).$_optionName = "toolbar";
(DxToolbar as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" }
};

export default DxCardView;
export {
  DxCardView,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxCardCover,
  DxCardHeader,
  DxCollision,
  DxColumn,
  DxFrom,
  DxHeaderPanel,
  DxHide,
  DxItem,
  DxLoadPanel,
  DxMy,
  DxOffset,
  DxPager,
  DxPaging,
  DxPosition,
  DxRemoteOperations,
  DxShow,
  DxTo,
  DxToolbar
};
import type * as DxCardViewTypes from "devextreme/ui/card_view_types";
export { DxCardViewTypes };
