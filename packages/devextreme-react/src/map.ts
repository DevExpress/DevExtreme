"use client"
import dxMap, {
    Properties
} from "devextreme/ui/map";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ClickEvent, DisposingEvent, InitializedEvent, MarkerAddedEvent, MarkerRemovedEvent, ReadyEvent, RouteAddedEvent, RouteRemovedEvent } from "devextreme/ui/map";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IMapOptionsNarrowedEvents = {
  onClick?: ((e: ClickEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onMarkerAdded?: ((e: MarkerAddedEvent) => void);
  onMarkerRemoved?: ((e: MarkerRemovedEvent) => void);
  onReady?: ((e: ReadyEvent) => void);
  onRouteAdded?: ((e: RouteAddedEvent) => void);
  onRouteRemoved?: ((e: RouteRemovedEvent) => void);
}

type IMapOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IMapOptionsNarrowedEvents> & IHtmlOptions & {
  defaultCenter?: Array<number> | Record<string, any> | string;
  defaultMarkers?: Array<Record<string, any>>;
  defaultRoutes?: Array<Record<string, any>>;
  defaultZoom?: number;
  onCenterChange?: (value: Array<number> | Record<string, any> | string) => void;
  onMarkersChange?: (value: Array<Record<string, any>>) => void;
  onRoutesChange?: (value: Array<Record<string, any>>) => void;
  onZoomChange?: (value: number) => void;
}>

class Map extends BaseComponent<React.PropsWithChildren<IMapOptions>> {

  public get instance(): dxMap {
    return this._instance;
  }

  protected _WidgetClass = dxMap;

  protected subscribableOptions = ["center","markers","routes","zoom"];

  protected independentEvents = ["onClick","onDisposing","onInitialized","onMarkerAdded","onMarkerRemoved","onReady","onRouteAdded","onRouteRemoved"];

  protected _defaults = {
    defaultCenter: "center",
    defaultMarkers: "markers",
    defaultRoutes: "routes",
    defaultZoom: "zoom"
  };

  protected _expectedChildren = {
    apiKey: { optionName: "apiKey", isCollectionItem: false },
    center: { optionName: "center", isCollectionItem: false },
    marker: { optionName: "markers", isCollectionItem: true },
    route: { optionName: "routes", isCollectionItem: true }
  };
}
(Map as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  apiKey: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  autoAdjust: PropTypes.bool,
  center: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  controls: PropTypes.bool,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  markerIconSrc: PropTypes.string,
  markers: PropTypes.array,
  onClick: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onMarkerAdded: PropTypes.func,
  onMarkerRemoved: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onReady: PropTypes.func,
  onRouteAdded: PropTypes.func,
  onRouteRemoved: PropTypes.func,
  provider: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bing",
      "google",
      "googleStatic"])
  ]),
  routes: PropTypes.array,
  rtlEnabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "hybrid",
      "roadmap",
      "satellite"])
  ]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  zoom: PropTypes.number
};


// owners:
// Map
type IApiKeyProps = React.PropsWithChildren<{
  bing?: string;
  google?: string;
  googleStatic?: string;
}>
class ApiKey extends NestedOption<IApiKeyProps> {
  public static OptionName = "apiKey";
}

// owners:
// Map
type ICenterProps = React.PropsWithChildren<{
  lat?: number;
  lng?: number;
}>
class Center extends NestedOption<ICenterProps> {
  public static OptionName = "center";
}

// owners:
// Marker
// Route
type ILocationProps = React.PropsWithChildren<{
  lat?: number;
  lng?: number;
}>
class Location extends NestedOption<ILocationProps> {
  public static OptionName = "location";
}

// owners:
// Map
type IMarkerProps = React.PropsWithChildren<{
  iconSrc?: string;
  location?: Array<number> | Record<string, any> | string | {
    lat?: number;
    lng?: number;
  }[];
  onClick?: (() => void);
  tooltip?: Record<string, any> | string | {
    isShown?: boolean;
    text?: string;
  };
}>
class Marker extends NestedOption<IMarkerProps> {
  public static OptionName = "markers";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    location: { optionName: "location", isCollectionItem: false },
    tooltip: { optionName: "tooltip", isCollectionItem: false }
  };
}

// owners:
// Map
type IRouteProps = React.PropsWithChildren<{
  color?: string;
  locations?: Array<Record<string, any>> | {
    lat?: number;
    lng?: number;
  }[];
  mode?: "driving" | "walking";
  opacity?: number;
  weight?: number;
}>
class Route extends NestedOption<IRouteProps> {
  public static OptionName = "routes";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    location: { optionName: "locations", isCollectionItem: true }
  };
}

// owners:
// Marker
type ITooltipProps = React.PropsWithChildren<{
  isShown?: boolean;
  text?: string;
}>
class Tooltip extends NestedOption<ITooltipProps> {
  public static OptionName = "tooltip";
}

export default Map;
export {
  Map,
  IMapOptions,
  ApiKey,
  IApiKeyProps,
  Center,
  ICenterProps,
  Location,
  ILocationProps,
  Marker,
  IMarkerProps,
  Route,
  IRouteProps,
  Tooltip,
  ITooltipProps
};
import type * as MapTypes from 'devextreme/ui/map_types';
export { MapTypes };

