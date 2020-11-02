import '../jquery_augmentation';

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
    Font,
    WordWrapType,
    VizTextOverflowType,
} from './core/base_widget';

export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
    /**
     * @docid
     * @type string
     * @default 'items'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    childrenField?: string;
    /**
     * @docid
     * @type string
     * @default 'color'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    colorField?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    colorizer?: {
      /**
      * @docid
      * @default undefined
      */
      colorCodeField?: string,
      /**
      * @docid
      * @default false
      */
      colorizeGroups?: boolean,
      /**
      * @docid
      * @extends CommonVizPalette
      * @type Array<string>|Enums.VizPalette
      */
      palette?: Array<string> | PaletteType,
      /**
     * @docid
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     */
      paletteExtensionMode?: PaletteExtensionModeType,
      /**
      * @docid
      * @default undefined
      */
      range?: Array<number>,
      /**
      * @docid
      * @type Enums.TreeMapColorizerType
      * @default undefined
      */
      type?: 'discrete' | 'gradient' | 'none' | 'range'
    };
    /**
     * @docid
     * @extends CommonVizDataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    group?: {
      /**
      * @docid
      */
      border?: {
        /**
        * @docid
        * @default "#d3d3d3"
        */
        color?: string,
        /**
        * @docid
        * @default 1
        */
        width?: number
      },
      /**
      * @docid
      * @default "#eeeeee"
      */
      color?: string,
      /**
      * @docid
      * @default undefined
      */
      headerHeight?: number,
      /**
      * @docid
      * @default undefined
      */
      hoverEnabled?: boolean,
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
          width?: number
        },
        /**
        * @docid
        * @default undefined
        */
        color?: string
      },
      /**
      * @docid
      */
      label?: {
        /**
        * @docid
        * @type Font
        * @default '#767676' [prop](color)
        * @default 600 [prop](weight)
        */
        font?: Font,
        /**
        * @docid
        * @type Enums.VizTextOverflow
        * @default "ellipsis"
        */
        textOverflow?: VizTextOverflowType,
        /**
        * @docid
        * @default true
        */
        visible?: boolean
      },
      /**
      * @docid
      */
      selectionStyle?: {
        /**
        * @docid
        */
        border?: {
          /**
          * @docid
          * @default "#232323"
          */
          color?: string,
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
        color?: string
      }
    };
    /**
     * @docid
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    idField?: string;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    interactWithGroup?: boolean;
    /**
     * @docid
     * @type string
     * @default 'name'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    labelField?: string;
    /**
     * @docid
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
     * @docid
     * @type Enums.TreeMapLayoutDirection
     * @default 'leftTopRightBottom'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    layoutDirection?: 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxDepth?: number;
    /**
     * @docid
     * @extends Action
     * @type function|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onClick?: ((e: { component?: dxTreeMap, element?: dxElement, model?: any, event?: event, node?: dxTreeMapNode }) => any) | string;
    /**
     * @docid
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
     * @docid
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
     * @docid
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
     * @docid
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
     * @docid
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
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    parentField?: string;
    /**
     * @docid
     * @type Enums.SelectionMode
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'multiple' | 'none' | 'single';
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tile?: {
      /**
      * @docid
      */
      border?: {
        /**
        * @docid
        * @default "#000000"
        */
        color?: string,
        /**
        * @docid
        * @default 1
        */
        width?: number
      },
      /**
      * @docid
      * @default "#$5f8b95"
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
          width?: number
        },
        /**
        * @docid
        * @default undefined
        */
        color?: string
      },
      /**
      * @docid
      */
      label?: {
        /**
        * @docid
        * @type Font
        * @default '#FFFFFF' [prop](color)
        * @default 300 [prop](weight)
        */
        font?: Font,
        /**
        * @docid
        * @type Enums.VizTextOverflow
        * @default "ellipsis"
        */
        textOverflow?: VizTextOverflowType,
        /**
        * @docid
        * @defaultValue true
        */
        visible?: boolean,
        /**
        * @docid
        * @type Enums.VizWordWrap
        * @default "normal"
        */
        wordWrap?: WordWrapType
      },
      /**
      * @docid
      */
      selectionStyle?: {
        /**
        * @docid
        */
        border?: {
          /**
          * @docid
          * @default "#232323"
          */
          color?: string,
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
        color?: string
      }
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxTreeMapTooltip;
    /**
     * @docid
     * @type string
     * @default 'value'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidgetTooltip
 * @type object
 */
export interface dxTreeMapTooltip extends BaseWidgetTooltip {
    /**
     * @docid
     * @type template|function(info, element)
     * @type_function_param1 info:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 node:dxTreeMapNode
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }, element: dxElement) => string | Element | JQuery);
    /**
     * @docid
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
 * @docid
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
     * @docid
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName drillUp()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    drillUp(): void;
    /**
     * @docid
     * @publicName getCurrentNode()
     * @return dxTreeMapNode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getCurrentNode(): dxTreeMapNode;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getRootNode()
     * @return dxTreeMapNode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getRootNode(): dxTreeMapNode;
    /**
     * @docid
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName resetDrillDown()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resetDrillDown(): void;
}

/**
* @docid
* @publicName Node
*/
export interface dxTreeMapNode {
    /**
     * @docid
     * @publicName customize(options)
     * @param1 options:object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customize(options: any): void;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid
     * @publicName drillDown()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    drillDown(): void;
    /**
     * @docid
     * @publicName getAllChildren()
     * @return Array<dxTreeMapNode>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllChildren(): Array<dxTreeMapNode>;
    /**
     * @docid
     * @publicName getAllNodes()
     * @return Array<dxTreeMapNode>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllNodes(): Array<dxTreeMapNode>;
    /**
     * @docid
     * @publicName getChild(index)
     * @param1 index:number
     * @return dxTreeMapNode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getChild(index: number): dxTreeMapNode;
    /**
     * @docid
     * @publicName getChildrenCount()
     * @return number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getChildrenCount(): number;
    /**
     * @docid
     * @publicName getParent()
     * @return dxTreeMapNode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getParent(): dxTreeMapNode;
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    index?: number;
    /**
     * @docid
     * @publicName isActive()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isActive(): boolean;
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
     * @publicName isLeaf()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isLeaf(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @publicName label()
     * @return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label(): string;
    /**
     * @docid
     * @publicName label(label)
     * @param1 label:string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label(label: string): void;
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    level?: number;
    /**
     * @docid
     * @publicName resetCustomization()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resetCustomization(): void;
    /**
     * @docid
     * @publicName select(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    select(state: boolean): void;
    /**
     * @docid
     * @publicName showTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTooltip(): void;
    /**
     * @docid
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
