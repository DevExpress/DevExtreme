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

/** @public */
export type MapProvider = 'azure' | 'bing' | 'google' | 'googleStatic';
/** @public */
export type RouteMode = 'driving' | 'walking';
/** @public */
export type MapType = 'hybrid' | 'roadmap' | 'satellite';

/**
 * @docid _ui_map_ClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ClickEvent = NativeEventInfo<dxMap, MouseEvent | PointerEvent>;

/**
 * @docid _ui_map_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxMap>;

/**
 * @docid _ui_map_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxMap>;

/**
 * @docid _ui_map_MarkerAddedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type MarkerAddedEvent = EventInfo<dxMap> & {
  /**
   * @docid _ui_map_MarkerAddedEvent.options
   * @type object
   */
  readonly options: any;
  /**
   * @docid _ui_map_MarkerAddedEvent.originalMarker
   * @type object
   */
  originalMarker: any;
};

/**
 * @docid _ui_map_MarkerRemovedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type MarkerRemovedEvent = EventInfo<dxMap> & {
  /**
   * @docid _ui_map_MarkerRemovedEvent.options
   * @type object
   */
  readonly options?: any;
};

/**
 * @docid _ui_map_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxMap> & ChangedOptionInfo;

/**
 * @docid _ui_map_ReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ReadyEvent = EventInfo<dxMap> & {
  /**
   * @docid _ui_map_ReadyEvent.originalMap
   * @type object
   */
  originalMap: any;
};

/**
 * @docid _ui_map_RouteAddedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type RouteAddedEvent = EventInfo<dxMap> & {
  /**
   * @docid _ui_map_RouteAddedEvent.options
   * @type object
   */
  readonly options: any;
  /**
   * @docid _ui_map_RouteAddedEvent.originalRoute
   * @type object
   */
  originalRoute: any;
};

/**
 * @docid _ui_map_RouteRemovedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type RouteRemovedEvent = EventInfo<dxMap> & {
  /**
   * @docid _ui_map_RouteRemovedEvent.options
   * @type object
   */
  readonly options?: any;
};

/**
 * @public
 * @namespace DevExpress.ui
 */
export interface MapLocation {
    /**
     * @docid
     * @default 0
     * @public
     */
    lat: number;
    /**
     * @docid
     * @default 0
     * @public
     */
    lng: number;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxMapOptions extends WidgetOptions<dxMap> {
    /**
     * @docid
     * @default { azure: '', bing: '', google: '', googleStatic: '' }
     * @public
     */
    apiKey?: string | {
      /**
       * @docid
       * @default ""
       */
      azure?: string;
      /**
       * @docid
       * @deprecated
       * @default ""
       */
      bing?: string;
      /**
       * @docid
       * @default ""
       */
      google?: string;
      /**
       * @docid
       * @default ""
       */
      googleStatic?: string;
    };
    /**
     * @docid
     * @default true
     * @public
     */
    autoAdjust?: boolean;
    /**
     * @type Object|string|Array<number>
     * @docid
     * @fires dxMapOptions.onOptionChanged
     * @inherits MapLocation
     * @public
     */
    center?: any | string | Array<number>;
    /**
     * @docid
     * @default false
     * @public
     */
    controls?: boolean;
    /**
     * @docid
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default 300
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @public
     */
    markerIconSrc?: string;
    /**
     * @docid
     * @fires dxMapOptions.onMarkerAdded
     * @fires dxMapOptions.onMarkerRemoved
     * @public
     */
    markers?: Array<{
      /**
       * @docid
       */
      iconSrc?: string;
      /**
       * @type Object|string|Array<number>
       * @docid
       * @inherits MapLocation
       */
      location?: any | string | Array<number>;
      /**
       * @docid
       */
      onClick?: Function;
      /**
       * @docid
       */
      tooltip?: string | {
        /**
         * @docid
         * @default false
         */
        isShown?: boolean;
        /**
         * @docid
         */
        text?: string;
      };
    }>;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{ui/map:ClickEvent}
     * @action
     * @public
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/map:MarkerAddedEvent}
     * @action
     * @public
     */
    onMarkerAdded?: ((e: MarkerAddedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/map:MarkerRemovedEvent}
     * @action
     * @public
     */
    onMarkerRemoved?: ((e: MarkerRemovedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/map:ReadyEvent}
     * @action
     * @public
     */
    onReady?: ((e: ReadyEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/map:RouteAddedEvent}
     * @action
     * @public
     */
    onRouteAdded?: ((e: RouteAddedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/map:RouteRemovedEvent}
     * @action
     * @public
     */
    onRouteRemoved?: ((e: RouteRemovedEvent) => void);
    /**
     * @docid
     * @default "google"
     * @public
     */
    provider?: MapProvider;
        /**
     * @docid
     * @default { mapId: '', useAdvancedMarkers: true }
     * @public
     */
    providerConfig?: {
      /**
       * @docid
       * @public
       * @default ""
       */
      mapId?: string;
      /**
       * @docid
       * @public
       * @default true
       * @deprecated
       */
      useAdvancedMarkers?: boolean;
    };
    /**
     * @docid
     * @fires dxMapOptions.onRouteAdded
     * @fires dxMapOptions.onRouteRemoved
     * @public
     */
    routes?: Array<{
      /**
       * @docid
       * @default '#0000FF'
       */
      color?: string;
      /**
       * @docid
       * @inherits MapLocation
       * @type Array<object>
       */
      locations?: Array<any>;
      /**
       * @docid
       * @default 'driving'
       */
      mode?: RouteMode;
      /**
       * @docid
       * @default 0.5
       */
      opacity?: number;
      /**
       * @docid
       * @default 5
       */
      weight?: number;
    }>;
    /**
     * @docid
     * @default "roadmap"
     * @public
     */
    type?: MapType;
    /**
     * @docid
     * @default 300
     * @public
     */
    width?: number | string | (() => number | string);
    /**
     * @docid
     * @default 1
     * @fires dxMapOptions.onOptionChanged
     * @public
     */
    zoom?: number;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxMap extends Widget<dxMapOptions> {
    /**
     * @docid
     * @publicName addMarker(markerOptions)
     * @param1 markerOptions:Object|Array<Object>
     * @return Promise<Object>
     * @public
     */
    addMarker(markerOptions: any | Array<any>): DxPromise<any>;
    /**
     * @docid
     * @publicName addRoute(routeOptions)
     * @param1 options:object|Array<Object>
     * @return Promise<Object>
     * @public
     */
    addRoute(options: any | Array<any>): DxPromise<any>;
    /**
     * @docid
     * @publicName removeMarker(marker)
     * @param1 marker:Object|number|Array<Object>
     * @return Promise<void>
     * @public
     */
    removeMarker(marker: any | number | Array<any>): DxPromise<void>;
    /**
     * @docid
     * @publicName removeRoute(route)
     * @param1 route:object|number|Array<Object>
     * @return Promise<void>
     * @public
     */
    removeRoute(route: any | number | Array<any>): DxPromise<void>;
}

/** @public */
export type Properties = dxMapOptions;

/** @deprecated use Properties instead */
export type Options = dxMapOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onContentReady' | 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onClick' | 'onMarkerAdded' | 'onMarkerRemoved' | 'onReady' | 'onRouteAdded' | 'onRouteRemoved'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxMapOptions.onDisposing
 * @type_function_param1 e:{ui/map:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxMapOptions.onInitialized
 * @type_function_param1 e:{ui/map:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxMapOptions.onOptionChanged
 * @type_function_param1 e:{ui/map:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
