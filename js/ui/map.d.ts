import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    TEvent
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface MapLocation {
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    lat?: number;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    lng?: number;
}

export interface dxMapOptions extends WidgetOptions<dxMap> {
    /**
     * @docid
     * @default { bing: '', google: '', googleStatic: '' }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    apiKey?: string | {
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default ""
      */
      bing?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default ""
      */
      google?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default ""
      */
      googleStatic?: string
    };
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoAdjust?: boolean;
    /**
     * @docid
     * @extends MapLocationType
     * @fires dxMapOptions.onOptionChanged
     * @inherits MapLocation
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    center?: any | string | Array<number>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    controls?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default 300
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default { bing: '', google: '', googleStatic: '' }
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxMapOptions.apiKey
     */
    key?: string | {
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default ""
      */
      bing?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default ""
      */
      google?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default ""
      */
      googleStatic?: string
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    markerIconSrc?: string;
    /**
     * @docid
     * @fires dxMapOptions.onMarkerAdded
     * @fires dxMapOptions.onMarkerRemoved
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    markers?: Array<{
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      */
      iconSrc?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @extends MapLocationType
      * @inherits MapLocation
      */
      location?: any | string | Array<number>,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      */
      onClick?: Function,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      */
      tooltip?: string | {
        /**
        * @docid
        * @prevFileNamespace DevExpress.ui
        * @default false
        */
        isShown?: boolean,
        /**
        * @docid
        * @prevFileNamespace DevExpress.ui
        */
        text?: string
      }
    }>;
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 location:object
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: { component?: dxMap, element?: TElement, model?: any, location?: any, event?: TEvent }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @type_function_param1_field5 originalMarker:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMarkerAdded?: ((e: { component?: dxMap, element?: TElement, model?: any, options?: any, originalMarker?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMarkerRemoved?: ((e: { component?: dxMap, element?: TElement, model?: any, options?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 originalMap:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onReady?: ((e: { component?: dxMap, element?: TElement, model?: any, originalMap?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @type_function_param1_field5 originalRoute:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRouteAdded?: ((e: { component?: dxMap, element?: TElement, model?: any, options?: any, originalRoute?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRouteRemoved?: ((e: { component?: dxMap, element?: TElement, model?: any, options?: any }) => any);
    /**
     * @docid
     * @type Enums.GeoMapProvider
     * @default "google"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    provider?: 'bing' | 'google' | 'googleStatic';
    /**
     * @docid
     * @fires dxMapOptions.onRouteAdded
     * @fires dxMapOptions.onRouteRemoved
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    routes?: Array<{
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default '#0000FF'
      */
      color?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @extends MapLocationType
      * @inherits MapLocation
      * @type Array<object>
      */
      locations?: Array<any>,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @type Enums.GeoMapRouteMode
      * @default 'driving'
      */
      mode?: 'driving' | 'walking',
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default 0.5
      */
      opacity?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default 5
      */
      weight?: number
    }>;
    /**
     * @docid
     * @type Enums.GeoMapType
     * @default "roadmap"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'hybrid' | 'roadmap' | 'satellite';
    /**
     * @docid
     * @default 300
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
    /**
     * @docid
     * @default 1
     * @fires dxMapOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    zoom?: number;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/map
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxMap extends Widget {
    constructor(element: TElement, options?: dxMapOptions)
    /**
     * @docid
     * @publicName addMarker(markerOptions)
     * @param1 markerOptions:Object|Array<Object>
     * @return Promise<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addMarker(markerOptions: any | Array<any>): TPromise<any>;
    /**
     * @docid
     * @publicName addRoute(routeOptions)
     * @param1 options:object|Array<Object>
     * @return Promise<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRoute(options: any | Array<any>): TPromise<any>;
    /**
     * @docid
     * @publicName removeMarker(marker)
     * @param1 marker:Object|number|Array<Object>
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeMarker(marker: any | number | Array<any>): TPromise<void>;
    /**
     * @docid
     * @publicName removeRoute(route)
     * @param1 route:object|number|Array<Object>
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeRoute(route: any | number | Array<any>): TPromise<void>;
}

export type Options = dxMapOptions;

/** @deprecated use Options instead */
export type IOptions = dxMapOptions;
