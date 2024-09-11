import Toast, { Properties } from "devextreme/ui/toast";
import { defineComponent } from "vue";
import { prepareComponentConfig, prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "animation" |
  "closeOnClick" |
  "closeOnOutsideClick" |
  "closeOnSwipe" |
  "contentTemplate" |
  "deferRendering" |
  "displayTime" |
  "focusStateEnabled" |
  "height" |
  "hideOnOutsideClick" |
  "hideOnParentScroll" |
  "hint" |
  "hoverStateEnabled" |
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
  "tabIndex" |
  "type" |
  "visible" |
  "width" |
  "wrapperAttr"
>;

interface DxToast extends AccessibleOptions {
  readonly instance?: Toast;
}

const componentConfig = {
  props: {
    accessKey: String,
    animation: Object,
    closeOnClick: Boolean,
    closeOnOutsideClick: [Boolean, Function],
    closeOnSwipe: Boolean,
    contentTemplate: {},
    deferRendering: Boolean,
    displayTime: Number,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hideOnOutsideClick: [Boolean, Function],
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
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
    position: [Object, String],
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    tabIndex: Number,
    type: String,
    visible: Boolean,
    width: [Function, Number, String],
    wrapperAttr: {}
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:animation": null,
    "update:closeOnClick": null,
    "update:closeOnOutsideClick": null,
    "update:closeOnSwipe": null,
    "update:contentTemplate": null,
    "update:deferRendering": null,
    "update:displayTime": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hideOnOutsideClick": null,
    "update:hideOnParentScroll": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
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
    "update:tabIndex": null,
    "update:type": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapperAttr": null,
  },
  computed: {
    instance(): Toast {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Toast;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      animation: { isCollectionItem: false, optionName: "animation" },
      position: { isCollectionItem: false, optionName: "position" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxToast = defineComponent(componentConfig);


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


export default DxToast;
export {
  DxToast,
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
import type * as DxToastTypes from "devextreme/ui/toast_types";
export { DxToastTypes };
