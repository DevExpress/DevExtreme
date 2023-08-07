import LoadPanel, { Properties } from "devextreme/ui/load_panel";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "animation" |
  "closeOnOutsideClick" |
  "container" |
  "copyRootClassesToWrapper" |
  "deferRendering" |
  "delay" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hideOnOutsideClick" |
  "hideOnParentScroll" |
  "hint" |
  "hoverStateEnabled" |
  "indicatorSrc" |
  "maxHeight" |
  "maxWidth" |
  "message" |
  "minHeight" |
  "minWidth" |
  "onContentReady" |
  "onDisposing" |
  "onHidden" |
  "onHiding" |
  "onInitialized" |
  "onOptionChanged" |
  "onShowing" |
  "onShown" |
  "position" |
  "rtlEnabled" |
  "shading" |
  "shadingColor" |
  "showIndicator" |
  "showPane" |
  "visible" |
  "width" |
  "wrapperAttr"
>;

interface DxLoadPanel extends AccessibleOptions {
  readonly instance?: LoadPanel;
}
const DxLoadPanel = createComponent({
  props: {
    animation: Object,
    closeOnOutsideClick: [Boolean, Function],
    container: {},
    copyRootClassesToWrapper: Boolean,
    deferRendering: Boolean,
    delay: Number,
    elementAttr: {},
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hideOnOutsideClick: [Boolean, Function],
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    indicatorSrc: String,
    maxHeight: [Function, Number, String],
    maxWidth: [Function, Number, String],
    message: String,
    minHeight: [Function, Number, String],
    minWidth: [Function, Number, String],
    onContentReady: Function,
    onDisposing: Function,
    onHidden: Function,
    onHiding: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onShowing: Function,
    onShown: Function,
    position: [Function, Object, String],
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showIndicator: Boolean,
    showPane: Boolean,
    visible: Boolean,
    width: [Function, Number, String],
    wrapperAttr: {}
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:animation": null,
    "update:closeOnOutsideClick": null,
    "update:container": null,
    "update:copyRootClassesToWrapper": null,
    "update:deferRendering": null,
    "update:delay": null,
    "update:elementAttr": null,
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
  computed: {
    instance(): LoadPanel {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = LoadPanel;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      animation: { isCollectionItem: false, optionName: "animation" },
      position: { isCollectionItem: false, optionName: "position" }
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

export default DxLoadPanel;
export {
  DxLoadPanel,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxCollision,
  DxFrom,
  DxHide,
  DxMy,
  DxOffset,
  DxPosition,
  DxShow,
  DxTo
};
import type * as DxLoadPanelTypes from "devextreme/ui/load_panel_types";
export { DxLoadPanelTypes };
