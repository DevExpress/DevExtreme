import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font
} from './core/base_widget';

export interface dxSankeyOptions extends BaseWidgetOptions<dxSankey> {
    /**
     * @docid dxSankeyOptions.adaptiveLayout
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: { height?: number, keepLabels?: boolean, width?: number };
    /**
     * @docid dxSankeyOptions.alignment
     * @type Enums.VerticalAlignment|Array<Enums.VerticalAlignment>
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    alignment?: 'bottom' | 'center' | 'top' | Array<'bottom' | 'center' | 'top'>;
    /**
     * @docid dxSankeyOptions.dataSource
     * @extends CommonVizDataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid dxSankeyOptions.hoverEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid dxSankeyOptions.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: { border?: { color?: string, visible?: boolean, width?: number }, customizeText?: ((itemInfo: dxSankeyNode) => string), font?: Font, horizontalOffset?: number, overlappingBehavior?: 'ellipsis' | 'hide' | 'none', shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, useNodeColors?: boolean, verticalOffset?: number, visible?: boolean };
    /**
     * @docid dxSankeyOptions.link
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    link?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, colorMode?: 'none' | 'source' | 'target' | 'gradient', hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number };
    /**
     * @docid dxSankeyOptions.node
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    node?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number, padding?: number, width?: number };
    /**
     * @docid dxSankeyOptions.onLinkClick
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
     * @docid dxSankeyOptions.onLinkHoverChanged
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
     * @docid dxSankeyOptions.onNodeClick
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
     * @docid dxSankeyOptions.onNodeHoverChanged
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
     * @docid dxSankeyOptions.palette
     * @extends CommonVizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
    /**
     * @docid dxSankeyOptions.paletteExtensionMode
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
    /**
     * @docid dxSankeyOptions.sortData
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sortData?: any;
    /**
     * @docid dxSankeyOptions.sourceField
     * @type string
     * @default 'source'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sourceField?: string;
    /**
     * @docid dxSankeyOptions.targetField
     * @type string
     * @default 'target'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    targetField?: string;
    /**
     * @docid dxSankeyOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxSankeyTooltip;
    /**
     * @docid dxSankeyOptions.weightField
     * @type string
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
     * @docid  dxSankeyOptions.tooltip.customizeNodeTooltip
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
     * @docid dxSankeyOptions.tooltip.enabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid dxSankeyOptions.tooltip.linkTooltipTemplate
     * @type template|function(info, element)
     * @type_function_param1 info:object
     * @type_function_param1_field1 source:string
     * @type_function_param1_field2 target:string
     * @type_function_param1_field3 weight:Number
     * @type_function_param2 element:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linkTooltipTemplate?: template | ((info: { source?: string, target?: string, weight?: number }, element: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSankeyOptions.tooltip.nodeTooltipTemplate
     * @type template|function(info, element)
     * @type_function_param1 info:object
     * @type_function_param1_field1 label:string
     * @type_function_param1_field2 weightIn:Number
     * @type_function_param1_field3 weightOut:Number
     * @type_function_param2 element:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    nodeTooltipTemplate?: template | ((info: { label?: string, weightIn?: number, weightOut?: number }, element: dxElement) => string | Element | JQuery);
}
/**
 * @docid dxSankey
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
     * @docid dxSankeyMethods.getAllLinks
     * @publicName getAllLinks()
     * @return Array<dxSankeyLink>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllLinks(): Array<dxSankeyLink>;
    /**
     * @docid dxSankeyMethods.getAllNodes
     * @publicName getAllNodes()
     * @return Array<dxSankeyNode>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllNodes(): Array<dxSankeyNode>;
    getDataSource(): DataSource;
    /**
     * @docid dxSankeyMethods.hideTooltip
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
}

export interface dxSankeyConnectionInfoObject {
    /**
     * @docid dxSankeyConnectionInfoObject.source
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    source?: string;
    /**
     * @docid dxSankeyConnectionInfoObject.target
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    target?: string;
    /**
     * @docid dxSankeyConnectionInfoObject.weight
     * @type Number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    weight?: number;
}

export interface dxSankeyLink {
    /**
     * @docid dxSankeyLinkfields.connection
     * @type dxSankeyConnectionInfoObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    connection?: dxSankeyConnectionInfoObject;
    /**
     * @docid dxSankeyLinkmethods.hideTooltip
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid dxSankeyLinkmethods.hover
     * @publicName hover(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid dxSankeyLinkmethods.isHovered
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid dxSankeyLinkmethods.showTooltip
     * @publicName showTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTooltip(): void;
}

export interface dxSankeyNode {
    /**
     * @docid dxSankeyNodemethods.hideTooltip
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid dxSankeyNodemethods.hover
     * @publicName hover(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid dxSankeyNodemethods.isHovered
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid dxSankeyNodefields.label
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: string;
    /**
     * @docid dxSankeyNodefields.linksIn
     * @type Array<Object>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linksIn?: Array<any>;
    /**
     * @docid dxSankeyNodefields.linksOut
     * @type Array<Object>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linksOut?: Array<any>;
    /**
     * @docid dxSankeyNodemethods.showTooltip
     * @publicName showTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTooltip(): void;
    /**
     * @docid dxSankeyNodefields.title
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