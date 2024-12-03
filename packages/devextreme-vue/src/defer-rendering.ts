import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import DeferRendering, { Properties } from "devextreme/ui/defer_rendering";
import {
 AnimationConfig,
 AnimationState,
 AnimationType,
 CollisionResolution,
 PositionConfig,
 CollisionResolutionCombination,
} from "devextreme/common/core/animation";
import {
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
 RenderedEvent,
 ShownEvent,
} from "devextreme/ui/defer_rendering";
import {
 Direction,
 HorizontalAlignment,
 VerticalAlignment,
 PositionAlignment,
} from "devextreme/common";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "animation" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onRendered" |
  "onShown" |
  "renderWhen" |
  "rtlEnabled" |
  "showLoadIndicator" |
  "staggerItemSelector" |
  "tabIndex" |
  "visible" |
  "width"
>;

interface DxDeferRendering extends AccessibleOptions {
  readonly instance?: DeferRendering;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animation: [Object, Number, String] as PropType<AnimationConfig | number | Record<string, any> | string>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onRendered: Function as PropType<((e: RenderedEvent) => void)>,
    onShown: Function as PropType<((e: ShownEvent) => void)>,
    renderWhen: {},
    rtlEnabled: Boolean,
    showLoadIndicator: Boolean,
    staggerItemSelector: String,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:animation": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onRendered": null,
    "update:onShown": null,
    "update:renderWhen": null,
    "update:rtlEnabled": null,
    "update:showLoadIndicator": null,
    "update:staggerItemSelector": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): DeferRendering {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = DeferRendering;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      animation: { isCollectionItem: false, optionName: "animation" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxDeferRendering = defineComponent(componentConfig);


const DxAnimationConfig = {
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

prepareConfigurationComponentConfig(DxAnimationConfig);

const DxAnimation = defineComponent(DxAnimationConfig);

(DxAnimation as any).$_optionName = "animation";
(DxAnimation as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
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
(DxPosition as any).$_expectedChildren = {
  at: { isCollectionItem: false, optionName: "at" },
  boundaryOffset: { isCollectionItem: false, optionName: "boundaryOffset" },
  collision: { isCollectionItem: false, optionName: "collision" },
  my: { isCollectionItem: false, optionName: "my" },
  offset: { isCollectionItem: false, optionName: "offset" }
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

export default DxDeferRendering;
export {
  DxDeferRendering,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxCollision,
  DxFrom,
  DxMy,
  DxOffset,
  DxPosition,
  DxTo
};
import type * as DxDeferRenderingTypes from "devextreme/ui/defer_rendering_types";
export { DxDeferRenderingTypes };
