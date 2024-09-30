export { ExplicitTypes } from "devextreme/ui/context_menu";
import ContextMenu, { Properties } from "devextreme/ui/context_menu";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "animation" |
  "closeOnOutsideClick" |
  "cssClass" |
  "dataSource" |
  "disabled" |
  "disabledExpr" |
  "displayExpr" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hideOnOutsideClick" |
  "hint" |
  "hoverStateEnabled" |
  "items" |
  "itemsExpr" |
  "itemTemplate" |
  "onContentReady" |
  "onDisposing" |
  "onHidden" |
  "onHiding" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemRendered" |
  "onOptionChanged" |
  "onPositioning" |
  "onSelectionChanged" |
  "onShowing" |
  "onShown" |
  "position" |
  "rtlEnabled" |
  "selectByClick" |
  "selectedExpr" |
  "selectedItem" |
  "selectionMode" |
  "showEvent" |
  "showSubmenuMode" |
  "submenuDirection" |
  "tabIndex" |
  "target" |
  "visible" |
  "width"
>;

interface DxContextMenu extends AccessibleOptions {
  readonly instance?: ContextMenu;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animation: Object,
    closeOnOutsideClick: [Boolean, Function],
    cssClass: String,
    dataSource: {},
    disabled: Boolean,
    disabledExpr: [Function, String],
    displayExpr: [Function, String],
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hideOnOutsideClick: [Boolean, Function],
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array,
    itemsExpr: [Function, String],
    itemTemplate: {},
    onContentReady: Function,
    onDisposing: Function,
    onHidden: Function,
    onHiding: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemRendered: Function,
    onOptionChanged: Function,
    onPositioning: Function,
    onSelectionChanged: Function,
    onShowing: Function,
    onShown: Function,
    position: Object,
    rtlEnabled: Boolean,
    selectByClick: Boolean,
    selectedExpr: [Function, String],
    selectedItem: {},
    selectionMode: String,
    showEvent: [Object, String],
    showSubmenuMode: [Object, String],
    submenuDirection: String,
    tabIndex: Number,
    target: {},
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:animation": null,
    "update:closeOnOutsideClick": null,
    "update:cssClass": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:disabledExpr": null,
    "update:displayExpr": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hideOnOutsideClick": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:itemsExpr": null,
    "update:itemTemplate": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onHidden": null,
    "update:onHiding": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onPositioning": null,
    "update:onSelectionChanged": null,
    "update:onShowing": null,
    "update:onShown": null,
    "update:position": null,
    "update:rtlEnabled": null,
    "update:selectByClick": null,
    "update:selectedExpr": null,
    "update:selectedItem": null,
    "update:selectionMode": null,
    "update:showEvent": null,
    "update:showSubmenuMode": null,
    "update:submenuDirection": null,
    "update:tabIndex": null,
    "update:target": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): ContextMenu {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = ContextMenu;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      animation: { isCollectionItem: false, optionName: "animation" },
      item: { isCollectionItem: true, optionName: "items" },
      position: { isCollectionItem: false, optionName: "position" },
      showEvent: { isCollectionItem: false, optionName: "showEvent" },
      showSubmenuMode: { isCollectionItem: false, optionName: "showSubmenuMode" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxContextMenu = defineComponent(componentConfig);


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
    x: String,
    y: String
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
    x: String,
    y: String
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
    complete: Function,
    delay: Number,
    direction: String,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function,
    to: Object,
    type: String
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
    "update:selectable": null,
    "update:selected": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    beginGroup: Boolean,
    closeMenuOnClick: Boolean,
    disabled: Boolean,
    icon: String,
    items: Array,
    selectable: Boolean,
    selected: Boolean,
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
    x: String,
    y: String
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
    at: [Object, String],
    boundary: {},
    boundaryOffset: [Object, String],
    collision: [Object, String],
    my: [Object, String],
    of: {},
    offset: [Object, String]
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
    complete: Function,
    delay: Number,
    direction: String,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function,
    to: Object,
    type: String
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

const DxShowSubmenuModeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:delay": null,
    "update:name": null,
  },
  props: {
    delay: [Number, Object],
    name: String
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

export default DxContextMenu;
export {
  DxContextMenu,
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
  DxShowEvent,
  DxShowSubmenuMode,
  DxTo
};
import type * as DxContextMenuTypes from "devextreme/ui/context_menu_types";
export { DxContextMenuTypes };
