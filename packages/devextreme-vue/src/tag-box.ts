import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import TagBox, { Properties } from "devextreme/ui/tag_box";
import  DataSource from "devextreme/data/data_source";
import  dxOverlay from "devextreme/ui/overlay";
import  DOMComponent from "devextreme/core/dom_component";
import  dxPopup from "devextreme/ui/popup";
import {
 ApplyValueMode,
 TextEditorButton,
 LabelMode,
 SimplifiedSearchMode,
 SelectAllMode,
 EditorStyle,
 ValidationMessageMode,
 Mode,
 Position,
 ValidationStatus,
 HorizontalAlignment,
 VerticalAlignment,
 TextEditorButtonLocation,
 PositionAlignment,
 Direction,
 ButtonStyle,
 ButtonType,
 ToolbarItemLocation,
 ToolbarItemComponent,
} from "devextreme/common";
import {
 DropDownPredefinedButton,
} from "devextreme/ui/drop_down_editor/ui.drop_down_editor";
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
 dxPopupOptions,
 dxPopupToolbarItem,
 ToolbarLocation,
} from "devextreme/ui/popup";
import {
 ChangeEvent,
 ClosedEvent,
 ContentReadyEvent,
 CustomItemCreatingEvent,
 DisposingEvent,
 EnterKeyEvent,
 FocusInEvent,
 FocusOutEvent,
 InitializedEvent,
 InputEvent,
 ItemClickEvent,
 KeyDownEvent,
 KeyUpEvent,
 MultiTagPreparingEvent,
 OpenedEvent,
 OptionChangedEvent,
 SelectAllValueChangedEvent,
 SelectionChangedEvent,
 ValueChangedEvent,
} from "devextreme/ui/tag_box";
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
 ContentReadyEvent as ButtonContentReadyEvent,
 DisposingEvent as ButtonDisposingEvent,
 InitializedEvent as ButtonInitializedEvent,
 OptionChangedEvent as ButtonOptionChangedEvent,
} from "devextreme/ui/button";
import {
 event,
} from "devextreme/events/events.types";
import {
 EventInfo,
} from "devextreme/common/core/events";
import {
 Component,
} from "devextreme/core/component";
import {
 LocateInMenuMode,
 ShowTextMode,
} from "devextreme/ui/toolbar";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "acceptCustomValue" |
  "accessKey" |
  "activeStateEnabled" |
  "applyValueMode" |
  "buttons" |
  "customItemCreateEvent" |
  "dataSource" |
  "deferRendering" |
  "disabled" |
  "displayExpr" |
  "dropDownButtonTemplate" |
  "dropDownOptions" |
  "elementAttr" |
  "fieldTemplate" |
  "focusStateEnabled" |
  "grouped" |
  "groupTemplate" |
  "height" |
  "hideSelectedItems" |
  "hint" |
  "hoverStateEnabled" |
  "inputAttr" |
  "isDirty" |
  "isValid" |
  "items" |
  "itemTemplate" |
  "label" |
  "labelMode" |
  "maxDisplayedTags" |
  "maxFilterQueryLength" |
  "maxLength" |
  "minSearchLength" |
  "multiline" |
  "name" |
  "noDataText" |
  "onChange" |
  "onClosed" |
  "onContentReady" |
  "onCustomItemCreating" |
  "onDisposing" |
  "onEnterKey" |
  "onFocusIn" |
  "onFocusOut" |
  "onInitialized" |
  "onInput" |
  "onItemClick" |
  "onKeyDown" |
  "onKeyUp" |
  "onMultiTagPreparing" |
  "onOpened" |
  "onOptionChanged" |
  "onSelectAllValueChanged" |
  "onSelectionChanged" |
  "onValueChanged" |
  "opened" |
  "openOnFieldClick" |
  "placeholder" |
  "readOnly" |
  "rtlEnabled" |
  "searchEnabled" |
  "searchExpr" |
  "searchMode" |
  "searchTimeout" |
  "selectAllMode" |
  "selectAllText" |
  "selectedItems" |
  "showClearButton" |
  "showDataBeforeSearch" |
  "showDropDownButton" |
  "showMultiTagOnly" |
  "showSelectionControls" |
  "stylingMode" |
  "tabIndex" |
  "tagTemplate" |
  "text" |
  "useItemTextAsTitle" |
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

interface DxTagBox extends AccessibleOptions {
  readonly instance?: TagBox;
}

const componentConfig = {
  props: {
    acceptCustomValue: Boolean,
    accessKey: String,
    activeStateEnabled: Boolean,
    applyValueMode: String as PropType<ApplyValueMode>,
    buttons: Array as PropType<Array<DropDownPredefinedButton | TextEditorButton>>,
    customItemCreateEvent: String,
    dataSource: [Array, Object, String] as PropType<(Array<any | CollectionWidgetItem>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    deferRendering: Boolean,
    disabled: Boolean,
    displayExpr: [Function, String] as PropType<(((item: any) => string)) | string>,
    dropDownButtonTemplate: {},
    dropDownOptions: Object as PropType<dxPopupOptions<any> | Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    fieldTemplate: {},
    focusStateEnabled: Boolean,
    grouped: Boolean,
    groupTemplate: {},
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hideSelectedItems: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    isDirty: Boolean,
    isValid: Boolean,
    items: Array as PropType<Array<any | CollectionWidgetItem>>,
    itemTemplate: {},
    label: String,
    labelMode: String as PropType<LabelMode>,
    maxDisplayedTags: Number,
    maxFilterQueryLength: Number,
    maxLength: [Number, String],
    minSearchLength: Number,
    multiline: Boolean,
    name: String,
    noDataText: String,
    onChange: Function as PropType<((e: ChangeEvent) => void)>,
    onClosed: Function as PropType<((e: ClosedEvent) => void)>,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onCustomItemCreating: Function as PropType<((e: CustomItemCreatingEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onEnterKey: Function as PropType<((e: EnterKeyEvent) => void)>,
    onFocusIn: Function as PropType<((e: FocusInEvent) => void)>,
    onFocusOut: Function as PropType<((e: FocusOutEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onInput: Function as PropType<((e: InputEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onKeyDown: Function as PropType<((e: KeyDownEvent) => void)>,
    onKeyUp: Function as PropType<((e: KeyUpEvent) => void)>,
    onMultiTagPreparing: Function as PropType<((e: MultiTagPreparingEvent) => void)>,
    onOpened: Function as PropType<((e: OpenedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onSelectAllValueChanged: Function as PropType<((e: SelectAllValueChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    onValueChanged: Function as PropType<((e: ValueChangedEvent) => void)>,
    opened: Boolean,
    openOnFieldClick: Boolean,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    searchEnabled: Boolean,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    searchMode: String as PropType<SimplifiedSearchMode>,
    searchTimeout: Number,
    selectAllMode: String as PropType<SelectAllMode>,
    selectAllText: String,
    selectedItems: Array as PropType<Array<any | number | string>>,
    showClearButton: Boolean,
    showDataBeforeSearch: Boolean,
    showDropDownButton: Boolean,
    showMultiTagOnly: Boolean,
    showSelectionControls: Boolean,
    stylingMode: String as PropType<EditorStyle>,
    tabIndex: Number,
    tagTemplate: {},
    text: String,
    useItemTextAsTitle: Boolean,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<ValidationMessageMode>,
    validationMessagePosition: String as PropType<Mode | Position>,
    validationStatus: String as PropType<ValidationStatus>,
    value: Array as PropType<Array<any | number | string>>,
    valueChangeEvent: String,
    valueExpr: [Function, String] as PropType<(((item: any) => string | number | boolean)) | string>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    wrapItemText: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:acceptCustomValue": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:applyValueMode": null,
    "update:buttons": null,
    "update:customItemCreateEvent": null,
    "update:dataSource": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:displayExpr": null,
    "update:dropDownButtonTemplate": null,
    "update:dropDownOptions": null,
    "update:elementAttr": null,
    "update:fieldTemplate": null,
    "update:focusStateEnabled": null,
    "update:grouped": null,
    "update:groupTemplate": null,
    "update:height": null,
    "update:hideSelectedItems": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:label": null,
    "update:labelMode": null,
    "update:maxDisplayedTags": null,
    "update:maxFilterQueryLength": null,
    "update:maxLength": null,
    "update:minSearchLength": null,
    "update:multiline": null,
    "update:name": null,
    "update:noDataText": null,
    "update:onChange": null,
    "update:onClosed": null,
    "update:onContentReady": null,
    "update:onCustomItemCreating": null,
    "update:onDisposing": null,
    "update:onEnterKey": null,
    "update:onFocusIn": null,
    "update:onFocusOut": null,
    "update:onInitialized": null,
    "update:onInput": null,
    "update:onItemClick": null,
    "update:onKeyDown": null,
    "update:onKeyUp": null,
    "update:onMultiTagPreparing": null,
    "update:onOpened": null,
    "update:onOptionChanged": null,
    "update:onSelectAllValueChanged": null,
    "update:onSelectionChanged": null,
    "update:onValueChanged": null,
    "update:opened": null,
    "update:openOnFieldClick": null,
    "update:placeholder": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:searchEnabled": null,
    "update:searchExpr": null,
    "update:searchMode": null,
    "update:searchTimeout": null,
    "update:selectAllMode": null,
    "update:selectAllText": null,
    "update:selectedItems": null,
    "update:showClearButton": null,
    "update:showDataBeforeSearch": null,
    "update:showDropDownButton": null,
    "update:showMultiTagOnly": null,
    "update:showSelectionControls": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:tagTemplate": null,
    "update:text": null,
    "update:useItemTextAsTitle": null,
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
    instance(): TagBox {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = TagBox;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      button: { isCollectionItem: true, optionName: "buttons" },
      dropDownOptions: { isCollectionItem: false, optionName: "dropDownOptions" },
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxTagBox = defineComponent(componentConfig);


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

const DxButtonConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
  },
  props: {
    location: String as PropType<TextEditorButtonLocation>,
    name: String,
    options: Object as PropType<dxButtonOptions | Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxButtonConfig);

const DxButton = defineComponent(DxButtonConfig);

(DxButton as any).$_optionName = "buttons";
(DxButton as any).$_isCollectionItem = true;
(DxButton as any).$_expectedChildren = {
  options: { isCollectionItem: false, optionName: "options" }
};

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
    "update:accessKey": null,
    "update:animation": null,
    "update:bindingOptions": null,
    "update:closeOnOutsideClick": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:dragAndResizeArea": null,
    "update:dragEnabled": null,
    "update:dragOutsideBoundary": null,
    "update:enableBodyScroll": null,
    "update:focusStateEnabled": null,
    "update:fullScreen": null,
    "update:height": null,
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
    "update:onResize": null,
    "update:onResizeEnd": null,
    "update:onResizeStart": null,
    "update:onShowing": null,
    "update:onShown": null,
    "update:onTitleRendered": null,
    "update:position": null,
    "update:resizeEnabled": null,
    "update:restorePosition": null,
    "update:rtlEnabled": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showCloseButton": null,
    "update:showTitle": null,
    "update:tabIndex": null,
    "update:title": null,
    "update:titleTemplate": null,
    "update:toolbarItems": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapperAttr": null,
  },
  props: {
    accessKey: String,
    animation: Object as PropType<Record<string, any>>,
    bindingOptions: Object as PropType<Record<string, any>>,
    closeOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    container: {},
    contentTemplate: {},
    deferRendering: Boolean,
    disabled: Boolean,
    dragAndResizeArea: {},
    dragEnabled: Boolean,
    dragOutsideBoundary: Boolean,
    enableBodyScroll: Boolean,
    focusStateEnabled: Boolean,
    fullScreen: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hideOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    maxHeight: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    maxWidth: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    minHeight: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    minWidth: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    onContentReady: Function as PropType<((e: EventInfo<any>) => void)>,
    onDisposing: Function as PropType<((e: EventInfo<any>) => void)>,
    onHidden: Function as PropType<((e: EventInfo<any>) => void)>,
    onHiding: Function as PropType<((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void)>,
    onInitialized: Function as PropType<((e: { component: Component<any>, element: any }) => void)>,
    onOptionChanged: Function as PropType<((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)>,
    onResize: Function as PropType<((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)>,
    onResizeEnd: Function as PropType<((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)>,
    onResizeStart: Function as PropType<((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)>,
    onShowing: Function as PropType<((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void)>,
    onShown: Function as PropType<((e: EventInfo<any>) => void)>,
    onTitleRendered: Function as PropType<((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void)>,
    position: [Function, String, Object] as PropType<((() => void)) | PositionAlignment | PositionConfig | Record<string, any>>,
    resizeEnabled: Boolean,
    restorePosition: Boolean,
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showTitle: Boolean,
    tabIndex: Number,
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
  position: { isCollectionItem: false, optionName: "position" },
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

const DxOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:bindingOptions": null,
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
    bindingOptions: Object as PropType<Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<((e: ClickEvent) => void)>,
    onContentReady: Function as PropType<((e: ButtonContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: ButtonDisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: ButtonInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: ButtonOptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    template: {},
    text: String,
    type: String as PropType<ButtonType | string>,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  }
};

prepareConfigurationComponentConfig(DxOptionsConfig);

const DxOptions = defineComponent(DxOptionsConfig);

(DxOptions as any).$_optionName = "options";

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

export default DxTagBox;
export {
  DxTagBox,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxButton,
  DxCollision,
  DxDropDownOptions,
  DxFrom,
  DxHide,
  DxItem,
  DxMy,
  DxOffset,
  DxOptions,
  DxPosition,
  DxShow,
  DxTo,
  DxToolbarItem
};
import type * as DxTagBoxTypes from "devextreme/ui/tag_box_types";
export { DxTagBoxTypes };
