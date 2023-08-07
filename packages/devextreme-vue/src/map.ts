import Map, { Properties } from "devextreme/ui/map";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "apiKey" |
  "autoAdjust" |
  "center" |
  "controls" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "markerIconSrc" |
  "markers" |
  "onClick" |
  "onDisposing" |
  "onInitialized" |
  "onMarkerAdded" |
  "onMarkerRemoved" |
  "onOptionChanged" |
  "onReady" |
  "onRouteAdded" |
  "onRouteRemoved" |
  "provider" |
  "routes" |
  "rtlEnabled" |
  "tabIndex" |
  "type" |
  "visible" |
  "width" |
  "zoom"
>;

interface DxMap extends AccessibleOptions {
  readonly instance?: Map;
}
const DxMap = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    apiKey: [Object, String],
    autoAdjust: Boolean,
    center: [Array, Object, String],
    controls: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    markerIconSrc: String,
    markers: Array,
    onClick: Function,
    onDisposing: Function,
    onInitialized: Function,
    onMarkerAdded: Function,
    onMarkerRemoved: Function,
    onOptionChanged: Function,
    onReady: Function,
    onRouteAdded: Function,
    onRouteRemoved: Function,
    provider: String,
    routes: Array,
    rtlEnabled: Boolean,
    tabIndex: Number,
    type: String,
    visible: Boolean,
    width: [Function, Number, String],
    zoom: Number
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:apiKey": null,
    "update:autoAdjust": null,
    "update:center": null,
    "update:controls": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:markerIconSrc": null,
    "update:markers": null,
    "update:onClick": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onMarkerAdded": null,
    "update:onMarkerRemoved": null,
    "update:onOptionChanged": null,
    "update:onReady": null,
    "update:onRouteAdded": null,
    "update:onRouteRemoved": null,
    "update:provider": null,
    "update:routes": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:type": null,
    "update:visible": null,
    "update:width": null,
    "update:zoom": null,
  },
  computed: {
    instance(): Map {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Map;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      apiKey: { isCollectionItem: false, optionName: "apiKey" },
      center: { isCollectionItem: false, optionName: "center" },
      marker: { isCollectionItem: true, optionName: "markers" },
      route: { isCollectionItem: true, optionName: "routes" }
    };
  }
});

const DxApiKey = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:bing": null,
    "update:google": null,
    "update:googleStatic": null,
  },
  props: {
    bing: String,
    google: String,
    googleStatic: String
  }
});
(DxApiKey as any).$_optionName = "apiKey";
const DxCenter = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:lat": null,
    "update:lng": null,
  },
  props: {
    lat: Number,
    lng: Number
  }
});
(DxCenter as any).$_optionName = "center";
const DxLocation = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:lat": null,
    "update:lng": null,
  },
  props: {
    lat: Number,
    lng: Number
  }
});
(DxLocation as any).$_optionName = "location";
const DxMarker = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:iconSrc": null,
    "update:location": null,
    "update:onClick": null,
    "update:tooltip": null,
  },
  props: {
    iconSrc: String,
    location: [Array, Object, String],
    onClick: Function,
    tooltip: [Object, String]
  }
});
(DxMarker as any).$_optionName = "markers";
(DxMarker as any).$_isCollectionItem = true;
(DxMarker as any).$_expectedChildren = {
  location: { isCollectionItem: false, optionName: "location" },
  tooltip: { isCollectionItem: false, optionName: "tooltip" }
};
const DxRoute = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:locations": null,
    "update:mode": null,
    "update:opacity": null,
    "update:weight": null,
  },
  props: {
    color: String,
    locations: Array,
    mode: String,
    opacity: Number,
    weight: Number
  }
});
(DxRoute as any).$_optionName = "routes";
(DxRoute as any).$_isCollectionItem = true;
(DxRoute as any).$_expectedChildren = {
  location: { isCollectionItem: true, optionName: "locations" }
};
const DxTooltip = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:isShown": null,
    "update:text": null,
  },
  props: {
    isShown: Boolean,
    text: String
  }
});
(DxTooltip as any).$_optionName = "tooltip";

export default DxMap;
export {
  DxMap,
  DxApiKey,
  DxCenter,
  DxLocation,
  DxMarker,
  DxRoute,
  DxTooltip
};
import type * as DxMapTypes from "devextreme/ui/map_types";
export { DxMapTypes };
