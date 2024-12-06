import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Lookup, { Properties } from "devextreme/ui/lookup";
import  DataSource from "devextreme/data/data_source";
import {
 ApplyValueMode,
 LabelMode,
 PageLoadMode,
 SimplifiedSearchMode,
 EditorStyle,
 ValidationMessageMode,
 Mode,
 Position,
 ValidationStatus,
 HorizontalAlignment,
 VerticalAlignment,
 Direction,
 PositionAlignment,
 ToolbarItemLocation,
 ToolbarItemComponent,
} from "devextreme/common";
import {
 CollectionWidgetItem,
} from "devextreme/ui/collection/ui.collection_widget.base";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 dxPopoverOptions,
 ContentReadyEvent as PopoverContentReadyEvent,
 DisposingEvent as PopoverDisposingEvent,
 HiddenEvent,
 HidingEvent,
 InitializedEvent as PopoverInitializedEvent,
 OptionChangedEvent as PopoverOptionChangedEvent,
 ShowingEvent,
 ShownEvent,
 TitleRenderedEvent,
} from "devextreme/ui/popover";
import {
 ClosedEvent,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 OpenedEvent,
 OptionChangedEvent,
 PageLoadingEvent,
 PullRefreshEvent,
 ScrollEvent,
 SelectionChangedEvent,
 ValueChangedEvent,
} from "devextreme/ui/lookup";
import {
 AnimationConfig,
 CollisionResolution,
 PositionConfig,
 AnimationState,
 AnimationType,
 CollisionResolutionCombination,
} from "devextreme/common/core/animation";
import {
 event,
} from "devextreme/events/events.types";
import {
 dxPopupToolbarItem,
 ToolbarLocation,
} from "devextreme/ui/popup";
import {
 LocateInMenuMode,
 ShowTextMode,
} from "devextreme/ui/toolbar";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "applyButtonText" |
  "applyValueMode" |
  "cancelButtonText" |
  "cleanSearchOnOpening" |
  "clearButtonText" |
  "dataSource" |
  "deferRendering" |
  "disabled" |
  "displayExpr" |
  "displayValue" |
  "dropDownCentered" |
  "dropDownOptions" |
  "elementAttr" |
  "fieldTemplate" |
  "focusStateEnabled" |
  "fullScreen" |
  "grouped" |
  "groupTemplate" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "inputAttr" |
  "isDirty" |
  "isValid" |
  "items" |
  "itemTemplate" |
  "label" |
  "labelMode" |
  "minSearchLength" |
  "name" |
  "nextButtonText" |
  "noDataText" |
  "onClosed" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onOpened" |
  "onOptionChanged" |
  "onPageLoading" |
  "onPullRefresh" |
  "onScroll" |
  "onSelectionChanged" |
  "onValueChanged" |
  "opened" |
  "pageLoadingText" |
  "pageLoadMode" |
  "placeholder" |
  "pulledDownText" |
  "pullingDownText" |
  "pullRefreshEnabled" |
  "refreshingText" |
  "rtlEnabled" |
  "searchEnabled" |
  "searchExpr" |
  "searchMode" |
  "searchPlaceholder" |
  "searchStartEvent" |
  "searchTimeout" |
  "selectedItem" |
  "showCancelButton" |
  "showClearButton" |
  "showDataBeforeSearch" |
  "stylingMode" |
  "tabIndex" |
  "text" |
  "useItemTextAsTitle" |
  "useNativeScrolling" |
  "usePopover" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "valueChangeEvent" |
  "valueExpr" |
  "visible" |
  "width" |
  "wrapItemText"
>;

interface DxLookup extends AccessibleOptions {
  readonly instance?: Lookup;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    applyButtonText: String,
    applyValueMode: String as PropType<ApplyValueMode>,
    cancelButtonText: String,
    cleanSearchOnOpening: Boolean,
    clearButtonText: String,
    dataSource: [Array, Object, String] as PropType<(Array<any | CollectionWidgetItem>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    deferRendering: Boolean,
    disabled: Boolean,
    displayExpr: [Function, String] as PropType<(((item: any) => string)) | string>,
    displayValue: String,
    dropDownCentered: Boolean,
    dropDownOptions: Object as PropType<dxPopoverOptions<any> | Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    fieldTemplate: {},
    focusStateEnabled: Boolean,
    fullScreen: Boolean,
    grouped: Boolean,
    groupTemplate: {},
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    isDirty: Boolean,
    isValid: Boolean,
    items: Array as PropType<Array<any | CollectionWidgetItem>>,
    itemTemplate: {},
    label: String,
    labelMode: String as PropType<LabelMode>,
    minSearchLength: Number,
    name: String,
    nextButtonText: String,
    noDataText: String,
    onClosed: Function as PropType<((e: ClosedEvent) => void)>,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onOpened: Function as PropType<((e: OpenedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onPageLoading: Function as PropType<((e: PageLoadingEvent) => void)>,
    onPullRefresh: Function as PropType<((e: PullRefreshEvent) => void)>,
    onScroll: Function as PropType<((e: ScrollEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    onValueChanged: Function as PropType<((e: ValueChangedEvent) => void)>,
    opened: Boolean,
    pageLoadingText: String,
    pageLoadMode: String as PropType<PageLoadMode>,
    placeholder: String,
    pulledDownText: String,
    pullingDownText: String,
    pullRefreshEnabled: Boolean,
    refreshingText: String,
    rtlEnabled: Boolean,
    searchEnabled: Boolean,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    searchMode: String as PropType<SimplifiedSearchMode>,
    searchPlaceholder: String,
    searchStartEvent: String,
    searchTimeout: Number,
    selectedItem: {},
    showCancelButton: Boolean,
    showClearButton: Boolean,
    showDataBeforeSearch: Boolean,
    stylingMode: String as PropType<EditorStyle>,
    tabIndex: Number,
    text: String,
    useItemTextAsTitle: Boolean,
    useNativeScrolling: Boolean,
    usePopover: Boolean,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<ValidationMessageMode>,
    validationMessagePosition: String as PropType<Mode | Position>,
    validationStatus: String as PropType<ValidationStatus>,
    value: {},
    valueChangeEvent: String,
    valueExpr: [Function, String] as PropType<(((item: any) => string | number | boolean)) | string>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    wrapItemText: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:applyButtonText": null,
    "update:applyValueMode": null,
    "update:cancelButtonText": null,
    "update:cleanSearchOnOpening": null,
    "update:clearButtonText": null,
    "update:dataSource": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:displayExpr": null,
    "update:displayValue": null,
    "update:dropDownCentered": null,
    "update:dropDownOptions": null,
    "update:elementAttr": null,
    "update:fieldTemplate": null,
    "update:focusStateEnabled": null,
    "update:fullScreen": null,
    "update:grouped": null,
    "update:groupTemplate": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:label": null,
    "update:labelMode": null,
    "update:minSearchLength": null,
    "update:name": null,
    "update:nextButtonText": null,
    "update:noDataText": null,
    "update:onClosed": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onOpened": null,
    "update:onOptionChanged": null,
    "update:onPageLoading": null,
    "update:onPullRefresh": null,
    "update:onScroll": null,
    "update:onSelectionChanged": null,
    "update:onValueChanged": null,
    "update:opened": null,
    "update:pageLoadingText": null,
    "update:pageLoadMode": null,
    "update:placeholder": null,
    "update:pulledDownText": null,
    "update:pullingDownText": null,
    "update:pullRefreshEnabled": null,
    "update:refreshingText": null,
    "update:rtlEnabled": null,
    "update:searchEnabled": null,
    "update:searchExpr": null,
    "update:searchMode": null,
    "update:searchPlaceholder": null,
    "update:searchStartEvent": null,
    "update:searchTimeout": null,
    "update:selectedItem": null,
    "update:showCancelButton": null,
    "update:showClearButton": null,
    "update:showDataBeforeSearch": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:text": null,
    "update:useItemTextAsTitle": null,
    "update:useNativeScrolling": null,
    "update:usePopover": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:valueChangeEvent": null,
    "update:valueExpr": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapItemText": null,
  },
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): Lookup {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Lookup;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      dropDownOptions: { isCollectionItem: false, optionName: "dropDownOptions" },
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxLookup = defineComponent(componentConfig);


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

const DxDropDownOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:animation": null,
    "update:bindingOptions": null,
    "update:closeOnOutsideClick": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:enableBodyScroll": null,
    "update:height": null,
    "update:hideEvent": null,
    "update:hideOnOutsideClick": null,
    "update:hideOnParentScroll": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:maxHeight": null,
    "update:maxWidth": null,
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
    "update:onTitleRendered": null,
    "update:position": null,
    "update:rtlEnabled": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showCloseButton": null,
    "update:showEvent": null,
    "update:showTitle": null,
    "update:target": null,
    "update:title": null,
    "update:titleTemplate": null,
    "update:toolbarItems": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapperAttr": null,
  },
  props: {
    animation: Object as PropType<Record<string, any>>,
    bindingOptions: Object as PropType<Record<string, any>>,
    closeOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    container: {},
    contentTemplate: {},
    deferRendering: Boolean,
    disabled: Boolean,
    enableBodyScroll: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hideEvent: [Object, String] as PropType<Record<string, any> | string>,
    hideOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    maxHeight: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    maxWidth: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    minHeight: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    minWidth: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    onContentReady: Function as PropType<((e: PopoverContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: PopoverDisposingEvent) => void)>,
    onHidden: Function as PropType<((e: HiddenEvent) => void)>,
    onHiding: Function as PropType<((e: HidingEvent) => void)>,
    onInitialized: Function as PropType<((e: PopoverInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: PopoverOptionChangedEvent) => void)>,
    onShowing: Function as PropType<((e: ShowingEvent) => void)>,
    onShown: Function as PropType<((e: ShownEvent) => void)>,
    onTitleRendered: Function as PropType<((e: TitleRenderedEvent) => void)>,
    position: [String, Object] as PropType<Position | PositionConfig | Record<string, any>>,
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showEvent: [Object, String] as PropType<Record<string, any> | string>,
    showTitle: Boolean,
    target: {},
    title: String,
    titleTemplate: {},
    toolbarItems: Array as PropType<Array<dxPopupToolbarItem>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    wrapperAttr: {}
  }
};

prepareConfigurationComponentConfig(DxDropDownOptionsConfig);

const DxDropDownOptions = defineComponent(DxDropDownOptionsConfig);

(DxDropDownOptions as any).$_optionName = "dropDownOptions";
(DxDropDownOptions as any).$_expectedChildren = {
  animation: { isCollectionItem: false, optionName: "animation" },
  hideEvent: { isCollectionItem: false, optionName: "hideEvent" },
  position: { isCollectionItem: false, optionName: "position" },
  showEvent: { isCollectionItem: false, optionName: "showEvent" },
  toolbarItem: { isCollectionItem: true, optionName: "toolbarItems" }
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

const DxHideEventConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:delay": null,
    "update:name": null,
  },
  props: {
    delay: Number,
    name: String
  }
};

prepareConfigurationComponentConfig(DxHideEventConfig);

const DxHideEvent = defineComponent(DxHideEventConfig);

(DxHideEvent as any).$_optionName = "hideEvent";

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:html": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    html: String,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

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

const DxShowEventConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:delay": null,
    "update:name": null,
  },
  props: {
    delay: Number,
    name: String
  }
};

prepareConfigurationComponentConfig(DxShowEventConfig);

const DxShowEvent = defineComponent(DxShowEventConfig);

(DxShowEvent as any).$_optionName = "showEvent";

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
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:toolbar": null,
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
    options: {},
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    toolbar: String as PropType<ToolbarLocation>,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxToolbarItemConfig);

const DxToolbarItem = defineComponent(DxToolbarItemConfig);

(DxToolbarItem as any).$_optionName = "toolbarItems";
(DxToolbarItem as any).$_isCollectionItem = true;

export default DxLookup;
export {
  DxLookup,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxCollision,
  DxDropDownOptions,
  DxFrom,
  DxHide,
  DxHideEvent,
  DxItem,
  DxMy,
  DxOffset,
  DxPosition,
  DxShow,
  DxShowEvent,
  DxTo,
  DxToolbarItem
};
import type * as DxLookupTypes from "devextreme/ui/lookup_types";
export { DxLookupTypes };
