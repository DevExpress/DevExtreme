import {
    JQueryEventObject
} from '../common';

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

export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
    /**
     * @docid dxTreeMapOptions.childrenField
     * @type string
     * @default 'items'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    childrenField?: string;
    /**
     * @docid dxTreeMapOptions.colorField
     * @type string
     * @default 'color'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    colorField?: string;
    /**
     * @docid dxTreeMapOptions.colorizer
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    colorizer?: { colorCodeField?: string, colorizeGroups?: boolean, palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', range?: Array<number>, type?: 'discrete' | 'gradient' | 'none' | 'range' };
    /**
     * @docid dxTreeMapOptions.dataSource
     * @extends CommonVizDataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid dxTreeMapOptions.group
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    group?: { border?: { color?: string, width?: number }, color?: string, headerHeight?: number, hoverEnabled?: boolean, hoverStyle?: { border?: { color?: string, width?: number }, color?: string }, label?: { font?: Font, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean }, selectionStyle?: { border?: { color?: string, width?: number }, color?: string } };
    /**
     * @docid dxTreeMapOptions.hoverEnabled
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid dxTreeMapOptions.idField
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    idField?: string;
    /**
     * @docid dxTreeMapOptions.interactWithGroup
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    interactWithGroup?: boolean;
    /**
     * @docid dxTreeMapOptions.labelField
     * @type string
     * @default 'name'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    labelField?: string;
    /**
     * @docid dxTreeMapOptions.layoutAlgorithm
     * @type Enums.TreeMapLayoutAlgorithm | function
     * @type_function_param1 e:object
     * @type_function_param1_field1 rect:Array<number>
     * @type_function_param1_field2 sum:number
     * @type_function_param1_field3 items:Array<any>
     * @default 'squarified'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    layoutAlgorithm?: 'sliceanddice' | 'squarified' | 'strip' | ((e: { rect?: Array<number>, sum?: number, items?: Array<any> }) => any);
    /**
     * @docid dxTreeMapOptions.layoutDirection
     * @type Enums.TreeMapLayoutDirection
     * @default 'leftTopRightBottom'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    layoutDirection?: 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';
    /**
     * @docid dxTreeMapOptions.maxDepth
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxDepth?: number;
    /**
     * @docid dxTreeMapOptions.onClick
     * @extends Action
     * @type function|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onClick?: ((e: { component?: dxTreeMap, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, node?: dxTreeMapNode }) => any) | string;
    /**
     * @docid dxTreeMapOptions.onDrill
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onDrill?: ((e: { component?: dxTreeMap, element?: dxElement, model?: any, node?: dxTreeMapNode }) => any);
    /**
     * @docid dxTreeMapOptions.onHoverChanged
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onHoverChanged?: ((e: { component?: dxTreeMap, element?: dxElement, model?: any, node?: dxTreeMapNode }) => any);
    /**
     * @docid dxTreeMapOptions.onNodesInitialized
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 root:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onNodesInitialized?: ((e: { component?: dxTreeMap, element?: dxElement, model?: any, root?: dxTreeMapNode }) => any);
    /**
     * @docid dxTreeMapOptions.onNodesRendering
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onNodesRendering?: ((e: { component?: dxTreeMap, element?: dxElement, model?: any, node?: dxTreeMapNode }) => any);
    /**
     * @docid dxTreeMapOptions.onSelectionChanged
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxTreeMap, element?: dxElement, model?: any, node?: dxTreeMapNode }) => any);
    /**
     * @docid dxTreeMapOptions.parentField
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    parentField?: string;
    /**
     * @docid dxTreeMapOptions.resolveLabelOverflow
     * @type Enums.TreeMapResolveLabelOverflow
     * @default 'hide'
     * @deprecated dxTreeMapOptions.tile.label.textOverflow
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverflow?: 'ellipsis' | 'hide';
    /**
     * @docid dxTreeMapOptions.selectionMode
     * @type Enums.SelectionMode
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'multiple' | 'none' | 'single';
    /**
     * @docid dxTreeMapOptions.tile
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tile?: { border?: { color?: string, width?: number }, color?: string, hoverStyle?: { border?: { color?: string, width?: number }, color?: string }, label?: { font?: Font, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' }, selectionStyle?: { border?: { color?: string, width?: number }, color?: string } };
    /**
     * @docid dxTreeMapOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxTreeMapTooltip;
    /**
     * @docid dxTreeMapOptions.valueField
     * @type string
     * @default 'value'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
}
export interface dxTreeMapTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxTreeMapOptions.tooltip.contentTemplate
     * @type template|function(info, element)
     * @type_function_param1 info:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 node:dxTreeMapNode
     * @type_function_param2 element:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }, element: dxElement) => string | Element | JQuery);
    /**
     * @docid dxTreeMapOptions.tooltip.customizeTooltip
     * @default undefined
     * @type function(info)
     * @type_function_param1 info:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 node:dxTreeMapNode
     * @type_function_return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }) => any);
}
/**
 * @docid dxTreeMap
 * @inherits BaseWidget, DataHelperMixin
 * @module viz/tree_map
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxTreeMap extends BaseWidget {
    constructor(element: Element, options?: dxTreeMapOptions)
    constructor(element: JQuery, options?: dxTreeMapOptions)
    /**
     * @docid dxTreeMapMethods.clearSelection
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid dxTreeMapMethods.drillUp
     * @publicName drillUp()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    drillUp(): void;
    /**
     * @docid dxTreeMapMethods.getCurrentNode
     * @publicName getCurrentNode()
     * @return dxTreeMapNode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getCurrentNode(): dxTreeMapNode;
    getDataSource(): DataSource;
    /**
     * @docid dxTreeMapMethods.getRootNode
     * @publicName getRootNode()
     * @return dxTreeMapNode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getRootNode(): dxTreeMapNode;
    /**
     * @docid dxTreeMapMethods.hideTooltip
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid dxTreeMapMethods.resetDrillDown
     * @publicName resetDrillDown()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resetDrillDown(): void;
}

export interface dxTreeMapNode {
    /**
     * @docid dxTreeMapNodeMethods.customize
     * @publicName customize(options)
     * @param1 options:object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customize(options: any): void;
    /**
     * @docid dxTreeMapNodeFields.data
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid dxTreeMapNodeMethods.drillDown
     * @publicName drillDown()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    drillDown(): void;
    /**
     * @docid dxTreeMapNodeMethods.getAllChildren
     * @publicName getAllChildren()
     * @return Array<dxTreeMapNode>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllChildren(): Array<dxTreeMapNode>;
    /**
     * @docid dxTreeMapNodeMethods.getAllNodes
     * @publicName getAllNodes()
     * @return Array<dxTreeMapNode>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllNodes(): Array<dxTreeMapNode>;
    /**
     * @docid dxTreeMapNodeMethods.getChild
     * @publicName getChild(index)
     * @param1 index:number
     * @return dxTreeMapNode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getChild(index: number): dxTreeMapNode;
    /**
     * @docid dxTreeMapNodeMethods.getChildrenCount
     * @publicName getChildrenCount()
     * @return number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getChildrenCount(): number;
    /**
     * @docid dxTreeMapNodeMethods.getParent
     * @publicName getParent()
     * @return dxTreeMapNode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getParent(): dxTreeMapNode;
    /**
     * @docid dxTreeMapNodeFields.index
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    index?: number;
    /**
     * @docid dxTreeMapNodeMethods.isActive
     * @publicName isActive()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isActive(): boolean;
    /**
     * @docid dxTreeMapNodeMethods.isHovered
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid dxTreeMapNodeMethods.isleaf
     * @publicName isLeaf()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isLeaf(): boolean;
    /**
     * @docid dxTreeMapNodeMethods.isSelected
     * @publicName isSelected()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid dxTreeMapNodeMethods.label
     * @publicName label()
     * @return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label(): string;
    /**
     * @docid dxTreeMapNodeMethods.label
     * @publicName label(label)
     * @param1 label:string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label(label: string): void;
    /**
     * @docid dxTreeMapNodeFields.level
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    level?: number;
    /**
     * @docid dxTreeMapNodeMethods.resetCustomization
     * @publicName resetCustomization()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resetCustomization(): void;
    /**
     * @docid dxTreeMapNodeMethods.select
     * @publicName select(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    select(state: boolean): void;
    /**
     * @docid dxTreeMapNodeMethods.showTooltip
     * @publicName showTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTooltip(): void;
    /**
     * @docid dxTreeMapNodeMethods.value
     * @publicName value()
     * @return number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value(): number;
}

declare global {
interface JQuery {
    dxTreeMap(): JQuery;
    dxTreeMap(options: "instance"): dxTreeMap;
    dxTreeMap(options: string): any;
    dxTreeMap(options: string, ...params: any[]): any;
    dxTreeMap(options: dxTreeMapOptions): JQuery;
}
}
export type Options = dxTreeMapOptions;

/** @deprecated use Options instead */
export type IOptions = dxTreeMapOptions;