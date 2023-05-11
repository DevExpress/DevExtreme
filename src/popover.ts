import Popover, { Properties } from "devextreme/ui/popover";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "animation" |
  "closeOnOutsideClick" |
  "container" |
  "contentTemplate" |
  "copyRootClassesToWrapper" |
  "deferRendering" |
  "disabled" |
  "elementAttr" |
  "enableBodyScroll" |
  "height" |
  "hideEvent" |
  "hideOnOutsideClick" |
  "hideOnParentScroll" |
  "hint" |
  "hoverStateEnabled" |
  "maxHeight" |
  "maxWidth" |
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
  "onTitleRendered" |
  "position" |
  "rtlEnabled" |
  "shading" |
  "shadingColor" |
  "showCloseButton" |
  "showEvent" |
  "showTitle" |
  "target" |
  "title" |
  "titleTemplate" |
  "toolbarItems" |
  "visible" |
  "width" |
  "wrapperAttr"
>;

interface DxPopover extends AccessibleOptions {
  readonly instance?: Popover;
}
const DxPopover = createComponent({
  props: {
    animation: Object,
    closeOnOutsideClick: [Boolean, Function],
    container: {},
    contentTemplate: {},
    copyRootClassesToWrapper: Boolean,
    deferRendering: Boolean,
    disabled: Boolean,
    elementAttr: {},
    enableBodyScroll: Boolean,
    height: [Function, Number, String],
    hideEvent: [Object, String],
    hideOnOutsideClick: [Boolean, Function],
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    maxHeight: [Function, Number, String],
    maxWidth: [Function, Number, String],
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
    onTitleRendered: Function,
    position: [Object, String],
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showEvent: [Object, String],
    showTitle: Boolean,
    target: {},
    title: String,
    titleTemplate: {},
    toolbarItems: Array,
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
    "update:contentTemplate": null,
    "update:copyRootClassesToWrapper": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:elementAttr": null,
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
  computed: {
    instance(): Popover {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Popover;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      animation: { isCollectionItem: false, optionName: "animation" },
      hideEvent: { isCollectionItem: false, optionName: "hideEvent" },
      position: { isCollectionItem: false, optionName: "position" },
      showEvent: { isCollectionItem: false, optionName: "showEvent" },
      toolbarItem: { isCollectionItem: true, optionName: "toolbarItems" }
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
const DxHideEvent = createConfigurationComponent({
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
});
(DxHideEvent as any).$_optionName = "hideEvent";
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
const DxShowEvent = createConfigurationComponent({
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
});
(DxShowEvent as any).$_optionName = "showEvent";
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
const DxToolbarItem = createConfigurationComponent({
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
    locateInMenu: String,
    location: String,
    menuItemTemplate: {},
    options: {},
    showText: String,
    template: {},
    text: String,
    toolbar: String,
    visible: Boolean,
    widget: String
  }
});
(DxToolbarItem as any).$_optionName = "toolbarItems";
(DxToolbarItem as any).$_isCollectionItem = true;

export default DxPopover;
export {
  DxPopover,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxCollision,
  DxFrom,
  DxHide,
  DxHideEvent,
  DxMy,
  DxOffset,
  DxPosition,
  DxShow,
  DxShowEvent,
  DxTo,
  DxToolbarItem
};
import type * as DxPopoverTypes from "devextreme/ui/popover_types";
export { DxPopoverTypes };
