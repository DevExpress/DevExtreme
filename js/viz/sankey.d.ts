import {
    TElement
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
    TEvent
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: {
    /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 80
      */
      height?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      keepLabels?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
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
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      border?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default '#000000'
        */
        color?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default false
        */
        visible?: boolean,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default 2
        */
        width?: number
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type_function_param1 itemInfo: dxSankeyNode
      * @type_function_return string
      * @notUsedInTheme
      */
      customizeText?: ((itemInfo: dxSankeyNode) => string),
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default '#FFFFFF' [prop](color)
      */
      font?: Font,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 5
      */
      horizontalOffset?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type Enums.SankeyLabelOverlappingBehavior
      * @default 'ellipsis'
      */
      overlappingBehavior?: 'ellipsis' | 'hide' | 'none',
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      shadow?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default 1
        */
        blur?: number,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default '#000000'
        */
        color?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default 0
        */
        offsetX?: number,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default 1
        */
        offsetY?: number,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default 0
        */
        opacity?: number
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      useNodeColors?: boolean,
    /**
      * @docid
     * @prevFileNamespace DevExpress.viz
      * @default 0
      */
      verticalOffset?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      visible?: boolean
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    link?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      border?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default '#000000'
        */
        color?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default false
        */
        visible?: boolean,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default 2
        */
        width?: number
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default '#000000'
      */
      color?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type Enums.SankeyColorMode
      * @default 'none'
      */
      colorMode?: 'none' | 'source' | 'target' | 'gradient',
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      hoverStyle?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        */
        border?: {
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default undefined
          */
          color?: string,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default undefined
          */
          visible?: boolean,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default undefined
          */
          width?: number
        },
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        */
        color?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        */
        hatching?: {
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @type Enums.HatchingDirection
          * @default 'right'
          */
          direction?: HatchingDirectionType,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default 0.75
          */
          opacity?: number,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default 6
          */
          step?: number,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default 2
          */
          width?: number
        },
    /**
        * @docid
     * @prevFileNamespace DevExpress.viz
        * @default 0.5
        */
        opacity?: number
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 0.3
      */
      opacity?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    node?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      border?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default '#000000'
        */
        color?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default false
        */
        visible?: boolean,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default 1
        */
        width?: number
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      color?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      hoverStyle?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        */
        border?: {
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default undefined
          */
          color?: string,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default undefined
          */
          visible?: boolean,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default undefined
          */
          width?: number
        },
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        */
        color?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        */
        hatching?: {
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @type Enums.HatchingDirection
          * @default 'right'
          */
          direction?: HatchingDirectionType,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default 0.75
          */
          opacity?: number,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default 6
          */
          step?: number,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default 2
          */
          width?: number
        },
    /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        */
        opacity?: number
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 1
      */
      opacity?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 30
      */
      padding?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 15
      */
      width?: number
    };
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:dxSankeyLink
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLinkClick?: ((e: { component?: dxSankey, element?: TElement, model?: any, event?: TEvent, target?: dxSankeyLink }) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:dxSankeyLink
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLinkHoverChanged?: ((e: { component?: dxSankey, element?: TElement, model?: any, target?: dxSankeyLink }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:dxSankeyNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onNodeClick?: ((e: { component?: dxSankey, element?: TElement, model?: any, event?: TEvent, target?: dxSankeyNode }) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:dxSankeyNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onNodeHoverChanged?: ((e: { component?: dxSankey, element?: TElement, model?: any, target?: dxSankeyNode }) => void);
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sortData?: any;
    /**
     * @docid
     * @default 'source'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sourceField?: string;
    /**
     * @docid
     * @default 'target'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    targetField?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxSankeyTooltip;
    /**
     * @docid
     * @default 'weight'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    weightField?: string;
}
export interface dxSankeyTooltip extends BaseWidgetTooltip {
    /**
     * @docid  dxSankeyOptions.tooltip.customizeLinkTooltip
     * @default undefined
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
     * @docid  dxSankeyOptions.tooltip.customizeNodeTooltip
     * @default undefined
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
     * @docid dxSankeyOptions.tooltip.enabled
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid dxSankeyOptions.tooltip.linkTooltipTemplate
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
    linkTooltipTemplate?: template | ((info: { source?: string, target?: string, weight?: number }, element: TElement) => string | TElement);
    /**
     * @docid dxSankeyOptions.tooltip.nodeTooltipTemplate
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
    nodeTooltipTemplate?: template | ((info: { label?: string, weightIn?: number, weightOut?: number }, element: TElement) => string | TElement);
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
    constructor(element: TElement, options?: dxSankeyOptions)
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    source?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    target?: string;
    /**
     * @docid
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linksIn?: Array<any>;
    /**
     * @docid
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
     * @deprecated
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: string;
}

export type Options = dxSankeyOptions;

/** @deprecated use Options instead */
export type IOptions = dxSankeyOptions;
