import {
    dxElement
} from '../core/element';

import {
    PaletteType,
    PaletteExtensionModeType
} from './palette';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events/index';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font
} from './core/base_widget';

import { HatchingDirectionType } from './common';

export interface dxSankeyOptions extends BaseWidgetOptions<dxSankey> {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: {
      /**
      * @docid
      * @default 80
      */
      height?: number,
      /**
      * @docid
      * @default true
      */
      keepLabels?: boolean,
      /**
      * @docid
      * @default 80
      */
      width?: number
    };
    /**
     * @docid
     * @type Enums.VerticalAlignment|Array<Enums.VerticalAlignment>
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    alignment?: 'bottom' | 'center' | 'top' | Array<'bottom' | 'center' | 'top'>;
    /**
     * @docid
     * @extends CommonVizDataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: {
      /**
      * @docid
      */
      border?: {
        /**
        * @docid
        * @default '#000000'
        */
        color?: string,
        /**
        * @docid
        * @default false
        */
        visible?: boolean,
        /**
        * @docid
        * @default 2
        */
        width?: number
      },
      /**
      * @docid
      * @type function(itemInfo)
      * @type_function_param1 itemInfo: dxSankeyNode
      * @type_function_return string
      * @notUsedInTheme
      */
      customizeText?: ((itemInfo: dxSankeyNode) => string),
      /**
      * @docid
      * @type Font
      * @default '#FFFFFF' [prop](color)
      */
      font?: Font,
      /**
      * @docid
      * @default 5
      */
      horizontalOffset?: number,
      /**
      * @docid
      * @type Enums.SankeyLabelOverlappingBehavior
      * @default 'ellipsis'
      */
      overlappingBehavior?: 'ellipsis' | 'hide' | 'none',
      /**
      * @docid
      */
      shadow?: {
        /**
        * @docid
        * @default 1
        */
        blur?: number,
        /**
        * @docid
        * @default '#000000'
        */
        color?: string,
        /**
        * @docid
        * @default 0
        */
        offsetX?: number,
        /**
        * @docid
        * @default 1
        */
        offsetY?: number,
        /**
        * @docid
        * @default 0
        */
        opacity?: number
      },
      /**
      * @docid
      * @default false
      */
      useNodeColors?: boolean,
      /**
      * @docid
      * @default 0
      */
      verticalOffset?: number,
      /**
      * @docid
      * @default true
      */
      visible?: boolean
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    link?: {
      /**
      * @docid
      */
      border?: {
        /**
        * @docid
        * @default '#000000'
        */
        color?: string,
        /**
        * @docid
        * @default false
        */
        visible?: boolean,
        /**
        * @docid
        * @default 2
        */
        width?: number
      },
      /**
      * @docid
      * @default '#000000'
      */
      color?: string,
      /**
      * @docid
      * @type Enums.SankeyColorMode
      * @default 'none'
      */
      colorMode?: 'none' | 'source' | 'target' | 'gradient',
      /**
      * @docid
      */
      hoverStyle?: {
        /**
        * @docid
        */
        border?: {
          /**
          * @docid
          * @default undefined
          */
          color?: string,
          /**
          * @docid
          * @default undefined
          */
          visible?: boolean,
          /**
          * @docid
          * @default undefined
          */
          width?: number
        },
        /**
        * @docid
        * @default undefined
        */
        color?: string,
        /**
        * @docid
        */
        hatching?: {
          /**
          * @docid
          * @type Enums.HatchingDirection
          * @default 'right'
          */
          direction?: HatchingDirectionType,
          /**
          * @docid
          * @default 0.75
          */
          opacity?: number,
          /**
          * @docid
          * @default 6
          */
          step?: number,
          /**
          * @docid
          * @default 2
          */
          width?: number
        },
        /**
        * @docid
        * @default 0.5
        */
        opacity?: number
      },
      /**
      * @docid
      * @default 0.3
      */
      opacity?: number
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    node?: {
      /**
      * @docid
      */
      border?: {
        /**
        * @docid
        * @default '#000000'
        */
        color?: string,
        /**
        * @docid
        * @default false
        */
        visible?: boolean,
        /**
        * @docid
        * @default 1
        */
        width?: number
      },
      /**
      * @docid
      * @default undefined
      */
      color?: string,
      /**
      * @docid
      */
      hoverStyle?: {
        /**
        * @docid
        */
        border?: {
          /**
          * @docid
          * @default undefined
          */
          color?: string,
          /**
          * @docid
          * @default undefined
          */
          visible?: boolean,
          /**
          * @docid
          * @default undefined
          */
          width?: number
        },
        /**
        * @docid
        * @default undefined
        */
        color?: string,
        /**
        * @docid
        */
        hatching?: {
          /**
          * @docid
          * @type Enums.HatchingDirection
          * @default 'right'
          */
          direction?: HatchingDirectionType,
          /**
          * @docid
          * @default 0.75
          */
          opacity?: number,
          /**
          * @docid
          * @default 6
          */
          step?: number,
          /**
          * @docid
          * @default 2
          */
          width?: number
        },
        /**
        * @docid
        * @default undefined
        */
        opacity?: number
      },
      /**
      * @docid
      * @default 1
      */
      opacity?: number,
      /**
      * @docid
      * @default 30
      */
      padding?: number,
      /**
      * @docid
      * @default 15
      */
      width?: number
    };
    /**
     * @docid
     * @extends Action
     * @type function|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:dxSankeyLink
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLinkClick?: ((e: { component?: dxSankey, element?: dxElement, model?: any, event?: event, target?: dxSankeyLink }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:dxSankeyLink
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLinkHoverChanged?: ((e: { component?: dxSankey, element?: dxElement, model?: any, target?: dxSankeyLink }) => any);
    /**
     * @docid
     * @extends Action
     * @type function|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:dxSankeyNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onNodeClick?: ((e: { component?: dxSankey, element?: dxElement, model?: any, event?: event, target?: dxSankeyNode }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:dxSankeyNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onNodeHoverChanged?: ((e: { component?: dxSankey, element?: dxElement, model?: any, target?: dxSankeyNode }) => any);
    /**
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sortData?: any;
    /**
     * @docid
     * @type string
     * @default 'source'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sourceField?: string;
    /**
     * @docid
     * @type string
     * @default 'target'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    targetField?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxSankeyTooltip;
    /**
     * @docid
     * @type string
     * @default 'weight'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    weightField?: string;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidgetTooltip
 * @type object
 */
export interface dxSankeyTooltip extends BaseWidgetTooltip {
    /**
     * @docid
     * @default undefined
     * @type function(info)
     * @type_function_param1 info:object
     * @type_function_param1_field1 source:string
     * @type_function_param1_field2 target:string
     * @type_function_param1_field3 weight:Number
     * @type_function_return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeLinkTooltip?: ((info: { source?: string, target?: string, weight?: number }) => any);
    /**
     * @docid
     * @default undefined
     * @type function(info)
     * @type_function_param1 info:object
     * @type_function_param1_field1 title:string:deprecated(label)
     * @type_function_param1_field2 label:string
     * @type_function_param1_field3 weightIn:Number
     * @type_function_param1_field4 weightOut:Number
     * @type_function_return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeNodeTooltip?: ((info: { title?: string, label?: string, weightIn?: number, weightOut?: number }) => any);
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @type template|function(info, element)
     * @type_function_param1 info:object
     * @type_function_param1_field1 source:string
     * @type_function_param1_field2 target:string
     * @type_function_param1_field3 weight:Number
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linkTooltipTemplate?: template | ((info: { source?: string, target?: string, weight?: number }, element: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type template|function(info, element)
     * @type_function_param1 info:object
     * @type_function_param1_field1 label:string
     * @type_function_param1_field2 weightIn:Number
     * @type_function_param1_field3 weightOut:Number
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    nodeTooltipTemplate?: template | ((info: { label?: string, weightIn?: number, weightOut?: number }, element: dxElement) => string | Element | JQuery);
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @module viz/sankey
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxSankey extends BaseWidget {
    constructor(element: Element, options?: dxSankeyOptions)
    constructor(element: JQuery, options?: dxSankeyOptions)
    /**
     * @docid
     * @publicName getAllLinks()
     * @return Array<dxSankeyLink>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllLinks(): Array<dxSankeyLink>;
    /**
     * @docid
     * @publicName getAllNodes()
     * @return Array<dxSankeyNode>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllNodes(): Array<dxSankeyNode>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
}

/**
* @docid
* @publicName connection
* @type object
*/
export interface dxSankeyConnectionInfoObject {
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    source?: string;
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    target?: string;
    /**
     * @docid
     * @type Number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    weight?: number;
}

/**
* @docid
* @publicName Link
*/
export interface dxSankeyLink {
    /**
     * @docid
     * @type dxSankeyConnectionInfoObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    connection?: dxSankeyConnectionInfoObject;
    /**
     * @docid
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName hover(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName showTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTooltip(): void;
}

/**
* @docid
* @publicName Node
*/
export interface dxSankeyNode {
    /**
     * @docid
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName hover(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: string;
    /**
     * @docid
     * @type Array<Object>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linksIn?: Array<any>;
    /**
     * @docid
     * @type Array<Object>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linksOut?: Array<any>;
    /**
     * @docid
     * @publicName showTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTooltip(): void;
    /**
     * @docid
     * @type string
     * @deprecated
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: string;
}

declare global {
interface JQuery {
    dxSankey(): JQuery;
    dxSankey(options: "instance"): dxSankey;
    dxSankey(options: string): any;
    dxSankey(options: string, ...params: any[]): any;
    dxSankey(options: dxSankeyOptions): JQuery;
}
}
export type Options = dxSankeyOptions;

/** @deprecated use Options instead */
export type IOptions = dxSankeyOptions;
