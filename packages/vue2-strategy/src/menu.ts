export { ExplicitTypes } from "devextreme/ui/menu";
import Menu, { Properties } from "devextreme/ui/menu";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

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
const DxMenu = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    adaptivityEnabled: Boolean,
    animation: Object,
    cssClass: String,
    dataSource: {},
    disabled: Boolean,
    disabledExpr: [Function, String],
    displayExpr: [Function, String],
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hideSubmenuOnMouseLeave: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array,
    itemsExpr: [Function, String],
    itemTemplate: {},
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemRendered: Function,
    onOptionChanged: Function,
    onSelectionChanged: Function,
    onSubmenuHidden: Function,
    onSubmenuHiding: Function,
    onSubmenuShowing: Function,
    onSubmenuShown: Function,
    orientation: String,
    rtlEnabled: Boolean,
    selectByClick: Boolean,
    selectedExpr: [Function, String],
    selectedItem: {},
    selectionMode: String,
    showFirstSubmenuMode: [Object, String],
    showSubmenuMode: [Object, String],
    submenuDirection: String,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String]
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
    (this as any).$_expectedChildren = {
      animation: { isCollectionItem: false, optionName: "animation" },
      item: { isCollectionItem: true, optionName: "items" },
      showFirstSubmenuMode: { isCollectionItem: false, optionName: "showFirstSubmenuMode" },
      showSubmenuMode: { isCollectionItem: false, optionName: "showSubmenuMode" }
    };
  }
});

const DxAnimation = createConfigurationComponent({
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
});
(DxAnimation as any).$_optionName = "animation";
(DxAnimation as any).$_expectedChildren = {
  hide: { isCollectionItem: false, optionName: "hide" },
  show: { isCollectionItem: false, optionName: "show" }
};
const DxAt = createConfigurationComponent({
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
});
(DxAt as any).$_optionName = "at";
const DxBoundaryOffset = createConfigurationComponent({
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
});
(DxBoundaryOffset as any).$_optionName = "boundaryOffset";
const DxCollision = createConfigurationComponent({
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
});
(DxCollision as any).$_optionName = "collision";
const DxDelay = createConfigurationComponent({
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
});
(DxDelay as any).$_optionName = "delay";
const DxFrom = createConfigurationComponent({
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
});
(DxFrom as any).$_optionName = "from";
(DxFrom as any).$_expectedChildren = {
  position: { isCollectionItem: false, optionName: "position" }
};
const DxHide = createConfigurationComponent({
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
});
(DxHide as any).$_optionName = "hide";
(DxHide as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
};
const DxItem = createConfigurationComponent({
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
    items: Array,
    linkAttr: Object,
    selectable: Boolean,
    selected: Boolean,
    template: {},
    text: String,
    url: String,
    visible: Boolean
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
const DxMy = createConfigurationComponent({
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
});
(DxMy as any).$_optionName = "my";
const DxOffset = createConfigurationComponent({
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
});
(DxOffset as any).$_optionName = "offset";
const DxPosition = createConfigurationComponent({
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
});
(DxPosition as any).$_optionName = "position";
(DxPosition as any).$_expectedChildren = {
  at: { isCollectionItem: false, optionName: "at" },
  boundaryOffset: { isCollectionItem: false, optionName: "boundaryOffset" },
  collision: { isCollectionItem: false, optionName: "collision" },
  my: { isCollectionItem: false, optionName: "my" },
  offset: { isCollectionItem: false, optionName: "offset" }
};
const DxShow = createConfigurationComponent({
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
});
(DxShow as any).$_optionName = "show";
const DxShowFirstSubmenuMode = createConfigurationComponent({
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
});
(DxShowFirstSubmenuMode as any).$_optionName = "showFirstSubmenuMode";
(DxShowFirstSubmenuMode as any).$_expectedChildren = {
  delay: { isCollectionItem: false, optionName: "delay" }
};
const DxShowSubmenuMode = createConfigurationComponent({
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
});
(DxShowSubmenuMode as any).$_optionName = "showSubmenuMode";
(DxShowSubmenuMode as any).$_expectedChildren = {
  delay: { isCollectionItem: false, optionName: "delay" }
};
const DxTo = createConfigurationComponent({
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
});
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
