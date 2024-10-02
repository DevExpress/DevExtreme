"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxMap, {
    Properties
} from "devextreme/ui/map";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
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

interface MapRef {
  instance: () => dxMap;
}

const Map = memo(
  forwardRef(
    (props: React.PropsWithChildren<IMapOptions>, ref: ForwardedRef<MapRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["center","markers","routes","zoom"]), []);
      const independentEvents = useMemo(() => (["onClick","onDisposing","onInitialized","onMarkerAdded","onMarkerRemoved","onReady","onRouteAdded","onRouteRemoved"]), []);

      const defaults = useMemo(() => ({
        defaultCenter: "center",
        defaultMarkers: "markers",
        defaultRoutes: "routes",
        defaultZoom: "zoom",
      }), []);

      const expectedChildren = useMemo(() => ({
        apiKey: { optionName: "apiKey", isCollectionItem: false },
        center: { optionName: "center", isCollectionItem: false },
        marker: { optionName: "markers", isCollectionItem: true },
        providerConfig: { optionName: "providerConfig", isCollectionItem: false },
        route: { optionName: "routes", isCollectionItem: true }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IMapOptions>>, {
          WidgetClass: dxMap,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IMapOptions> & { ref?: Ref<MapRef> }) => ReactElement | null;


// owners:
// Map
type IApiKeyProps = React.PropsWithChildren<{
  bing?: string;
  google?: string;
  googleStatic?: string;
}>
const _componentApiKey = (props: IApiKeyProps) => {
  return React.createElement(NestedOption<IApiKeyProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "apiKey",
    },
  });
};

const ApiKey = Object.assign<typeof _componentApiKey, NestedComponentMeta>(_componentApiKey, {
  componentType: "option",
});

// owners:
// Map
type ICenterProps = React.PropsWithChildren<{
  lat?: number;
  lng?: number;
}>
const _componentCenter = (props: ICenterProps) => {
  return React.createElement(NestedOption<ICenterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "center",
    },
  });
};

const Center = Object.assign<typeof _componentCenter, NestedComponentMeta>(_componentCenter, {
  componentType: "option",
});

// owners:
// Marker
// Route
type ILocationProps = React.PropsWithChildren<{
  lat?: number;
  lng?: number;
}>
const _componentLocation = (props: ILocationProps) => {
  return React.createElement(NestedOption<ILocationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "location",
    },
  });
};

const Location = Object.assign<typeof _componentLocation, NestedComponentMeta>(_componentLocation, {
  componentType: "option",
});

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
const _componentMarker = (props: IMarkerProps) => {
  return React.createElement(NestedOption<IMarkerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "markers",
      IsCollectionItem: true,
      ExpectedChildren: {
        location: { optionName: "location", isCollectionItem: false },
        tooltip: { optionName: "tooltip", isCollectionItem: false }
      },
    },
  });
};

const Marker = Object.assign<typeof _componentMarker, NestedComponentMeta>(_componentMarker, {
  componentType: "option",
});

// owners:
// Map
type IProviderConfigProps = React.PropsWithChildren<{
  mapId?: string;
  useAdvancedMarkers?: boolean;
}>
const _componentProviderConfig = (props: IProviderConfigProps) => {
  return React.createElement(NestedOption<IProviderConfigProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "providerConfig",
    },
  });
};

const ProviderConfig = Object.assign<typeof _componentProviderConfig, NestedComponentMeta>(_componentProviderConfig, {
  componentType: "option",
});

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
const _componentRoute = (props: IRouteProps) => {
  return React.createElement(NestedOption<IRouteProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "routes",
      IsCollectionItem: true,
      ExpectedChildren: {
        location: { optionName: "locations", isCollectionItem: true }
      },
    },
  });
};

const Route = Object.assign<typeof _componentRoute, NestedComponentMeta>(_componentRoute, {
  componentType: "option",
});

// owners:
// Marker
type ITooltipProps = React.PropsWithChildren<{
  isShown?: boolean;
  text?: string;
}>
const _componentTooltip = (props: ITooltipProps) => {
  return React.createElement(NestedOption<ITooltipProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tooltip",
    },
  });
};

const Tooltip = Object.assign<typeof _componentTooltip, NestedComponentMeta>(_componentTooltip, {
  componentType: "option",
});

export default Map;
export {
  Map,
  IMapOptions,
  MapRef,
  ApiKey,
  IApiKeyProps,
  Center,
  ICenterProps,
  Location,
  ILocationProps,
  Marker,
  IMarkerProps,
  ProviderConfig,
  IProviderConfigProps,
  Route,
  IRouteProps,
  Tooltip,
  ITooltipProps
};
import type * as MapTypes from 'devextreme/ui/map_types';
export { MapTypes };

