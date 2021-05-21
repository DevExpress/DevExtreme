import {
    UserDefinedElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import {
  EventInfo,
  NativeEventInfo,
  InitializedEventInfo,
  ChangedOptionInfo
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type ClickEvent = NativeEventInfo<dxMap>;

/** @public */
export type DisposingEvent = EventInfo<dxMap>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxMap>;

/** @public */
export type MarkerAddedEvent = EventInfo<dxMap> & {
  readonly options: any;
  originalMarker: any;
}

/** @public */
export type MarkerRemovedEvent = EventInfo<dxMap> & {
  readonly options?: any;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxMap> & ChangedOptionInfo;

/** @public */
export type ReadyEvent = EventInfo<dxMap> & {
  originalMap: any;
}

/** @public */
export type RouteAddedEvent = EventInfo<dxMap> & {
  readonly options: any;
  originalRoute: any;
}

/** @public */
export type RouteRemovedEvent = EventInfo<dxMap> & {
  readonly options?: any;
}

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
 */
export interface dxMapOptions extends WidgetOptions<dxMap> {
    /**
     * @docid
     * @default { bing: '', google: '', googleStatic: '' }
     * @public
     */
    apiKey?: string | {
      /**
       * @docid
       * @default ""
       */
      bing?: string,
      /**
       * @docid
       * @default ""
       */
      google?: string,
      /**
       * @docid
       * @default ""
       */
      googleStatic?: string
    };
    /**
     * @docid
     * @default true
     * @public
     */
    autoAdjust?: boolean;
    /**
     * @docid
     * @extends MapLocationType
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
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default 300
     * @type_function_return number|string
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default { bing: '', google: '', googleStatic: '' }
     * @public
     * @deprecated dxMapOptions.apiKey
     */
    key?: string | {
      /**
       * @docid
       * @default ""
       */
      bing?: string,
      /**
       * @docid
       * @default ""
       */
      google?: string,
      /**
       * @docid
       * @default ""
       */
      googleStatic?: string
    };
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
      iconSrc?: string,
      /**
       * @docid
       * @extends MapLocationType
       * @inherits MapLocation
       */
      location?: any | string | Array<number>,
      /**
       * @docid
       */
      onClick?: Function,
      /**
       * @docid
       */
      tooltip?: string | {
        /**
         * @docid
         * @default false
         */
        isShown?: boolean,
        /**
         * @docid
         */
        text?: string
      }
    }>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 location:object
     * @type_function_param1_field5 event:event
     * @type_function_param1_field1 component:dxMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @type_function_param1_field5 originalMarker:object
     * @type_function_param1_field1 component:dxMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onMarkerAdded?: ((e: MarkerAddedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @type_function_param1_field1 component:dxMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onMarkerRemoved?: ((e: MarkerRemovedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 originalMap:object
     * @type_function_param1_field1 component:dxMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onReady?: ((e: ReadyEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @type_function_param1_field5 originalRoute:object
     * @type_function_param1_field1 component:dxMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onRouteAdded?: ((e: RouteAddedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @type_function_param1_field1 component:dxMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onRouteRemoved?: ((e: RouteRemovedEvent) => void);
    /**
     * @docid
     * @type Enums.GeoMapProvider
     * @default "google"
     * @public
     */
    provider?: 'bing' | 'google' | 'googleStatic';
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
      color?: string,
      /**
       * @docid
       * @extends MapLocationType
       * @inherits MapLocation
       * @type Array<object>
       */
      locations?: Array<any>,
      /**
       * @docid
       * @type Enums.GeoMapRouteMode
       * @default 'driving'
       */
      mode?: 'driving' | 'walking',
      /**
       * @docid
       * @default 0.5
       */
      opacity?: number,
      /**
       * @docid
       * @default 5
       */
      weight?: number
    }>;
    /**
     * @docid
     * @type Enums.GeoMapType
     * @default "roadmap"
     * @public
     */
    type?: 'hybrid' | 'roadmap' | 'satellite';
    /**
     * @docid
     * @default 300
     * @type_function_return number|string
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
 * @module ui/map
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxMap extends Widget {
    constructor(element: UserDefinedElement, options?: dxMapOptions)
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

/** @deprecated use Properties instead */
export type IOptions = dxMapOptions;
