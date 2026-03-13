import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Skeleton, { Properties } from "devextreme/ui/skeleton";
import  DOMComponent from "devextreme/core/dom_component";
import {
 ContentReadyEvent,
 SkeletonComplexType,
} from "devextreme/ui/skeleton";
import {
 EventInfo,
} from "devextreme/common/core/events";
import {
 Component,
} from "devextreme/core/component";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
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
  "rootComplexOption" |
  "rootPrimitiveOption" |
  "rtlEnabled" |
  "tabIndex" |
  "visible" |
  "width"
>;

interface DxSkeleton extends AccessibleOptions {
  readonly instance?: Skeleton;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: EventInfo<any>) => void)>,
    onInitialized: Function as PropType<((e: { component: Component<any>, element: any }) => void)>,
    onOptionChanged: Function as PropType<((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)>,
    rootComplexOption: Object as PropType<SkeletonComplexType | Record<string, any>>,
    rootPrimitiveOption: Number,
    rtlEnabled: Boolean,
    tabIndex: Number,
    visible: Boolean,
    width: [Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
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
    "update:rootComplexOption": null,
    "update:rootPrimitiveOption": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Skeleton {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Skeleton;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      rootComplexOption: { isCollectionItem: false, optionName: "rootComplexOption" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxSkeleton = defineComponent(componentConfig);


const DxRootComplexOptionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:prop1": null,
    "update:prop2": null,
  },
  props: {
    prop1: String,
    prop2: Boolean
  }
};

prepareConfigurationComponentConfig(DxRootComplexOptionConfig);

const DxRootComplexOption = defineComponent(DxRootComplexOptionConfig);

(DxRootComplexOption as any).$_optionName = "rootComplexOption";

export default DxSkeleton;
export {
  DxSkeleton,
  DxRootComplexOption
};
import type * as DxSkeletonTypes from "devextreme/ui/skeleton_types";
export { DxSkeletonTypes };
