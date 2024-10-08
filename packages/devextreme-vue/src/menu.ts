export { ExplicitTypes } from "devextreme/ui/menu";
import { PropType } from "vue";
import Menu, { Properties } from "devextreme/ui/menu";
import {
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemRenderedEvent,
 OptionChangedEvent,
 SelectionChangedEvent,
 SubmenuHiddenEvent,
 SubmenuHidingEvent,
 SubmenuShowingEvent,
 SubmenuShownEvent,
} from "devextreme/ui/menu";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "adaptivityEnabled" |
  "animation" |
  "cssClass" |
  "dataSource" |
  "disabled" |
  "disabledExpr" |
  "displayExpr" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hideSubmenuOnMouseLeave" |
  "hint" |
  "hoverStateEnabled" |
  "items" |
  "itemsExpr" |
  "itemTemplate" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemRendered" |
  "onOptionChanged" |
  "onSelectionChanged" |
  "onSubmenuHidden" |
  "onSubmenuHiding" |
  "onSubmenuShowing" |
  "onSubmenuShown" |
  "orientation" |
  "rtlEnabled" |
  "selectByClick" |
  "selectedExpr" |
  "selectedItem" |
  "selectionMode" |
  "showFirstSubmenuMode" |
  "showSubmenuMode" |
  "submenuDirection" |
  "tabIndex" |
  "visible" |
  "width"
>;

interface DxMenu extends AccessibleOptions {
  readonly instance?: Menu;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    adaptivityEnabled: Boolean,
    animation: Object,
    cssClass: String,
    dataSource: {},
    disabled: Boolean,
    disabledExpr: [Function, String] as PropType<(() => void) | string>,
    displayExpr: [Function, String] as PropType<((item: Object) => string) | string>,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hideSubmenuOnMouseLeave: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array as PropType<Array<Object>>,
    itemsExpr: [Function, String] as PropType<(() => void) | string>,
    itemTemplate: {},
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onItemClick: Function as PropType<(e: ItemClickEvent) => void>,
    onItemContextMenu: Function as PropType<(e: ItemContextMenuEvent) => void>,
    onItemRendered: Function as PropType<(e: ItemRenderedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onSelectionChanged: Function as PropType<(e: SelectionChangedEvent) => void>,
    onSubmenuHidden: Function as PropType<(e: SubmenuHiddenEvent) => void>,
    onSubmenuHiding: Function as PropType<(e: SubmenuHidingEvent) => void>,
    onSubmenuShowing: Function as PropType<(e: SubmenuShowingEvent) => void>,
    onSubmenuShown: Function as PropType<(e: SubmenuShownEvent) => void>,
    orientation: String as PropType<"horizontal" | "vertical">,
    rtlEnabled: Boolean,
    selectByClick: Boolean,
    selectedExpr: [Function, String] as PropType<(() => void) | string>,
    selectedItem: {},
    selectionMode: String as PropType<"single" | "none">,
    showFirstSubmenuMode: [Object, String] as PropType<Object | ("onClick" | "onHover")>,
    showSubmenuMode: [Object, String] as PropType<Object | ("onClick" | "onHover")>,
    submenuDirection: String as PropType<"auto" | "leftOrTop" | "rightOrBottom">,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:adaptivityEnabled": null,
    "update:animation": null,
    "update:cssClass": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:disabledExpr": null,
    "update:displayExpr": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hideSubmenuOnMouseLeave": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:itemsExpr": null,
    "update:itemTemplate": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:onSubmenuHidden": null,
    "update:onSubmenuHiding": null,
    "update:onSubmenuShowing": null,
    "update:onSubmenuShown": null,
    "update:orientation": null,
    "update:rtlEnabled": null,
    "update:selectByClick": null,
    "update:selectedExpr": null,
    "update:selectedItem": null,
    "update:selectionMode": null,
    "update:showFirstSubmenuMode": null,
    "update:showSubmenuMode": null,
    "update:submenuDirection": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Menu {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Menu;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      animation: { isCollectionItem: false, optionName: "animation" },
      item: { isCollectionItem: true, optionName: "items" },
      showFirstSubmenuMode: { isCollectionItem: false, optionName: "showFirstSubmenuMode" },
      showSubmenuMode: { isCollectionItem: false, optionName: "showSubmenuMode" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxMenu = defineComponent(componentConfig);


const DxAnimationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:hide": null,
    "update:show": null,
  },
  props: {
    hide: [Object, Number, String],
    show: [Object, Number, String]
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
    x: String as PropType<"center" | "left" | "right">,
    y: String as PropType<"bottom" | "center" | "top">
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
    x: String as PropType<"fit" | "flip" | "flipfit" | "none">,
    y: String as PropType<"fit" | "flip" | "flipfit" | "none">
  }
};

prepareConfigurationComponentConfig(DxCollisionConfig);

const DxCollision = defineComponent(DxCollisionConfig);

(DxCollision as any).$_optionName = "collision";

const DxDelayConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:hide": null,
    "update:show": null,
  },
  props: {
    hide: Number,
    show: Number
  }
};

prepareConfigurationComponentConfig(DxDelayConfig);

const DxDelay = defineComponent(DxDelayConfig);

(DxDelay as any).$_optionName = "delay";

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
    position: Object,
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
    complete: Function as PropType<($element: any, config: Object) => void>,
    delay: Number,
    direction: String as PropType<"bottom" | "left" | "right" | "top">,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function as PropType<($element: any, config: Object) => void>,
    to: Object,
    type: String as PropType<"css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut">
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
    "update:beginGroup": null,
    "update:closeMenuOnClick": null,
    "update:disabled": null,
    "update:icon": null,
    "update:items": null,
    "update:linkAttr": null,
    "update:selectable": null,
    "update:selected": null,
    "update:template": null,
    "update:text": null,
    "update:url": null,
    "update:visible": null,
  },
  props: {
    beginGroup: Boolean,
    closeMenuOnClick: Boolean,
    disabled: Boolean,
    icon: String,
    items: Array as PropType<Array<Object>>,
    linkAttr: Object,
    selectable: Boolean,
    selected: Boolean,
    template: {},
    text: String,
    url: String,
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
    x: String as PropType<"center" | "left" | "right">,
    y: String as PropType<"bottom" | "center" | "top">
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
    at: [Object, String] as PropType<Object | ("bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top")>,
    boundary: {},
    boundaryOffset: [Object, String],
    collision: [Object, String] as PropType<Object | ("fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit")>,
    my: [Object, String] as PropType<Object | ("bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top")>,
    of: {},
    offset: [Object, String]
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
    complete: Function as PropType<($element: any, config: Object) => void>,
    delay: Number,
    direction: String as PropType<"bottom" | "left" | "right" | "top">,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function as PropType<($element: any, config: Object) => void>,
    to: Object,
    type: String as PropType<"css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut">
  }
};

prepareConfigurationComponentConfig(DxShowConfig);

const DxShow = defineComponent(DxShowConfig);

(DxShow as any).$_optionName = "show";

const DxShowFirstSubmenuModeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:delay": null,
    "update:name": null,
  },
  props: {
    delay: [Number, Object],
    name: String as PropType<"onClick" | "onHover">
  }
};

prepareConfigurationComponentConfig(DxShowFirstSubmenuModeConfig);

const DxShowFirstSubmenuMode = defineComponent(DxShowFirstSubmenuModeConfig);

(DxShowFirstSubmenuMode as any).$_optionName = "showFirstSubmenuMode";
(DxShowFirstSubmenuMode as any).$_expectedChildren = {
  delay: { isCollectionItem: false, optionName: "delay" }
};

const DxShowSubmenuModeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:delay": null,
    "update:name": null,
  },
  props: {
    delay: [Number, Object],
    name: String as PropType<"onClick" | "onHover">
  }
};

prepareConfigurationComponentConfig(DxShowSubmenuModeConfig);

const DxShowSubmenuMode = defineComponent(DxShowSubmenuModeConfig);

(DxShowSubmenuMode as any).$_optionName = "showSubmenuMode";
(DxShowSubmenuMode as any).$_expectedChildren = {
  delay: { isCollectionItem: false, optionName: "delay" }
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
    position: Object,
    scale: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxToConfig);

const DxTo = defineComponent(DxToConfig);

(DxTo as any).$_optionName = "to";

export default DxMenu;
export {
  DxMenu,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxCollision,
  DxDelay,
  DxFrom,
  DxHide,
  DxItem,
  DxMy,
  DxOffset,
  DxPosition,
  DxShow,
  DxShowFirstSubmenuMode,
  DxShowSubmenuMode,
  DxTo
};
import type * as DxMenuTypes from "devextreme/ui/menu_types";
export { DxMenuTypes };
