import {
    DxPromise,
} from '../core/utils/deferred';

import {
  EventInfo,
  NativeEventInfo,
  InitializedEventInfo,
  ChangedOptionInfo,
} from '../common/core/events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

export type MapProvider = 'azure' | 'bing' | 'google' | 'googleStatic';
export type RouteMode = 'driving' | 'walking';
export type MapType = 'hybrid' | 'roadmap' | 'satellite';

/**
 * The type of the click event handler&apos;s argument.
 */
export type ClickEvent = NativeEventInfo<dxMap, MouseEvent | PointerEvent>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxMap>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxMap>;

/**
 * The type of the markerAdded event handler&apos;s argument.
 */
export type MarkerAddedEvent = EventInfo<dxMap> & {
  /**
   * 
   */
  readonly options: any;
  /**
   * 
   */
  originalMarker: any;
};

/**
 * The type of the markerRemoved event handler&apos;s argument.
 */
export type MarkerRemovedEvent = EventInfo<dxMap> & {
  /**
   * 
   */
  readonly options?: any;
};

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxMap> & ChangedOptionInfo;

/**
 * The type of the ready event handler&apos;s argument.
 */
export type ReadyEvent = EventInfo<dxMap> & {
  /**
   * 
   */
  originalMap: any;
};

/**
 * The type of the routeAdded event handler&apos;s argument.
 */
export type RouteAddedEvent = EventInfo<dxMap> & {
  /**
   * 
   */
  readonly options: any;
  /**
   * 
   */
  originalRoute: any;
};

/**
 * The type of the routeRemoved event handler&apos;s argument.
 */
export type RouteRemovedEvent = EventInfo<dxMap> & {
  /**
   * 
   */
  readonly options?: any;
};

export interface MapLocation {
    /**
     * The latitude location of the UI component.
     */
    lat: number;
    /**
     * The longitude location of the UI component.
     */
    lng: number;
}

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxMapOptions extends WidgetOptions<dxMap> {
    /**
     * Keys to authenticate the component within map providers.
     */
    apiKey?: string | {
      /**
       * A key used to authenticate the component within Azure Maps.
       */
      azure?: string;
      /**
       * A key used to authenticate the component within Bing Maps.
       * @deprecated 
       */
      bing?: string;
      /**
       * A key used to authenticate the component within Google Maps.
       */
      google?: string;
      /**
       * A key used to authenticate the component within Google Maps Static.
       */
      googleStatic?: string;
    };
    /**
     * Specifies whether the UI component automatically adjusts center and zoom property values when adding a new marker or route, or if a new UI component contains markers or routes by default.
     */
    autoAdjust?: boolean;
    /**
     * An object, a string, or an array specifying which part of the map is displayed at the UI component&apos;s center using coordinates. The UI component can change this value if autoAdjust is enabled.
     */
    center?: any | string | Array<number>;
    /**
     * Specifies whether or not map UI component controls are available.
     */
    controls?: boolean;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * A URL pointing to the custom icon to be used for map markers.
     */
    markerIconSrc?: string;
    /**
     * An array of markers displayed on a map.
     */
    markers?: Array<{
      /**
       * A URL pointing to the custom icon to be used for the marker.
       */
      iconSrc?: string;
      /**
       * Specifies the marker location.
       */
      location?: any | string | Array<number>;
      /**
       * A callback function performed when the marker is clicked.
       */
      onClick?: Function;
      /**
       * A tooltip to be used for the marker.
       */
      tooltip?: string | {
        /**
         * Specifies whether a tooltip is visible by default or not.
         */
        isShown?: boolean;
        /**
         * Specifies the text or HTML markup displayed in the tooltip.
         */
        text?: string;
      };
    }>;
    /**
     * A function that is executed when any location on the map is clicked or tapped.
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * A function that is executed when a marker is created on the map.
     */
    onMarkerAdded?: ((e: MarkerAddedEvent) => void);
    /**
     * A function that is executed when a marker is removed from the map.
     */
    onMarkerRemoved?: ((e: MarkerRemovedEvent) => void);
    /**
     * A function that is executed when the map is ready.
     */
    onReady?: ((e: ReadyEvent) => void);
    /**
     * A function that is executed when a route is created on the map.
     */
    onRouteAdded?: ((e: RouteAddedEvent) => void);
    /**
     * A function that is executed when a route is removed from the map.
     */
    onRouteRemoved?: ((e: RouteRemovedEvent) => void);
    /**
     * The name of the current map data provider.
     */
    provider?: MapProvider;
        /**
     * A provider configuration object.
     */
    providerConfig?: {
      /**
       * Specifies a map ID for the `google` and `googleStatic` providers.
       */
      mapId?: string;
      /**
       * Specifies whether to use advanced markers with the `google` and `googleStatic` providers.
       * @deprecated 
       */
      useAdvancedMarkers?: boolean;
    };
    /**
     * An array of routes shown on the map.
     */
    routes?: Array<{
      /**
       * Specifies the color of the line displaying the route.
       */
      color?: string;
      /**
       * Contains an array of objects making up the route.
       */
      locations?: Array<any>;
      /**
       * Specifies a transportation mode to be used in the displayed route.
       */
      mode?: RouteMode;
      /**
       * Specifies the opacity of the line displaying the route.
       */
      opacity?: number;
      /**
       * Specifies the thickness of the line displaying the route in pixels.
       */
      weight?: number;
    }>;
    /**
     * The type of a map to display.
     */
    type?: MapType;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
    /**
     * The map&apos;s zoom level. The UI component can change this value if autoAdjust is enabled.
     */
    zoom?: number;
}
/**
 * The Map is an interactive UI component that displays a geographic map with markers and routes.
 */
export default class dxMap extends Widget<dxMapOptions> {
    /**
     * Adds a marker to the map.
     */
    addMarker(markerOptions: any | Array<any>): DxPromise<any>;
    /**
     * Adds a route to the map.
     */
    addRoute(options: any | Array<any>): DxPromise<any>;
    /**
     * Removes a marker from the map.
     */
    removeMarker(marker: any | number | Array<any>): DxPromise<void>;
    /**
     * Removes a route from the map.
     */
    removeRoute(route: any | number | Array<any>): DxPromise<void>;
}

export type Properties = dxMapOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxMapOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onContentReady' | 'onFocusIn' | 'onFocusOut'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onClick' | 'onMarkerAdded' | 'onMarkerRemoved' | 'onReady' | 'onRouteAdded' | 'onRouteRemoved'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
