import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface MapLocation {
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    lat?: number;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    lng?: number;
}

export interface dxMapOptions extends WidgetOptions<dxMap> {
    /**
     * @docid
     * @type string|object
     * @default { bing: '', google: '', googleStatic: '' }
     * @prevFileNamespace DevExpress.ui
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
     * @type boolean
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
     * @type boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    controls?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default 300
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type string|object
     * @default { bing: '', google: '', googleStatic: '' }
     * @prevFileNamespace DevExpress.ui
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
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    markerIconSrc?: string;
    /**
     * @docid
     * @type Array<Object>
     * @fires dxMapOptions.onMarkerAdded
     * @fires dxMapOptions.onMarkerRemoved
     * @prevFileNamespace DevExpress.ui
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
      * @type function
      */
      onClick?: Function,
      /**
      * @docid
      * @type string|object
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
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 location:object
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: { component?: dxMap, element?: dxElement, model?: any, location?: any, event?: event }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @type_function_param1_field5 originalMarker:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMarkerAdded?: ((e: { component?: dxMap, element?: dxElement, model?: any, options?: any, originalMarker?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMarkerRemoved?: ((e: { component?: dxMap, element?: dxElement, model?: any, options?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 originalMap:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onReady?: ((e: { component?: dxMap, element?: dxElement, model?: any, originalMap?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @type_function_param1_field5 originalRoute:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRouteAdded?: ((e: { component?: dxMap, element?: dxElement, model?: any, options?: any, originalRoute?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 options:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRouteRemoved?: ((e: { component?: dxMap, element?: dxElement, model?: any, options?: any }) => any);
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
     * @type Array<Object>
     * @fires dxMapOptions.onRouteAdded
     * @fires dxMapOptions.onRouteRemoved
     * @prevFileNamespace DevExpress.ui
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
      * @type Array<Object>
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'hybrid' | 'roadmap' | 'satellite';
    /**
     * @docid
     * @default 300
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
    /**
     * @docid
     * @type number
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
    constructor(element: Element, options?: dxMapOptions)
    constructor(element: JQuery, options?: dxMapOptions)
    /**
     * @docid
     * @publicName addMarker(markerOptions)
     * @param1 markerOptions:Object|Array<Object>
     * @return Promise<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addMarker(markerOptions: any | Array<any>): Promise<any> & JQueryPromise<any>;
    /**
     * @docid
     * @publicName addRoute(routeOptions)
     * @param1 options:object|Array<Object>
     * @return Promise<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRoute(options: any | Array<any>): Promise<any> & JQueryPromise<any>;
    /**
     * @docid
     * @publicName removeMarker(marker)
     * @param1 marker:Object|number|Array<Object>
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeMarker(marker: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
    /**
     * @docid
     * @publicName removeRoute(route)
     * @param1 route:object|number|Array<Object>
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeRoute(route: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
}

declare global {
interface JQuery {
    dxMap(): JQuery;
    dxMap(options: "instance"): dxMap;
    dxMap(options: string): any;
    dxMap(options: string, ...params: any[]): any;
    dxMap(options: dxMapOptions): JQuery;
}
}
export type Options = dxMapOptions;

/** @deprecated use Options instead */
export type IOptions = dxMapOptions;
