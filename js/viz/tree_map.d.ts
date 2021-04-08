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
    Cancelable,
    ComponentEvent,
    ComponentNativeEvent,
    ComponentInitializedEvent,
    ChangedOptionInfo
} from '../events/index';

import BaseWidget, {
    BaseWidgetMargin,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    WordWrapType,
    VizTextOverflowType,
    ComponentFileSavingEvent,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

export interface InteractionInfo {
  readonly node: dxTreeMapNode;
}

/** @public */
export type ClickEvent = ComponentNativeEvent<dxTreeMap> & {
  readonly node: dxTreeMapNode
}

/** @public */
export type DisposingEvent = ComponentEvent<dxTreeMap>;

/** @public */
export type DrawnEvent = ComponentEvent<dxTreeMap>;

/** @public */
export type DrillEvent = ComponentEvent<dxTreeMap> & {
  readonly node: dxTreeMapNode;
}

/** @public */
export type ExportedEvent = ComponentEvent<dxTreeMap>;

/** @public */
export type ExportingEvent = ComponentEvent<dxTreeMap> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & ComponentFileSavingEvent<dxTreeMap>;

/** @public */
export type HoverChangedEvent = ComponentEvent<dxTreeMap> & InteractionInfo;

/** @public */
export type IncidentOccurredEvent = ComponentEvent<dxTreeMap> & IncidentInfo;

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxTreeMap>;

/** @public */
export type NodesInitializedEvent = ComponentEvent<dxTreeMap> & {
    readonly root: dxTreeMapNode;
}

/** @public */
export type NodesRenderingEvent = ComponentEvent<dxTreeMap> & {
    readonly node: dxTreeMapNode;
}

/** @public */
export type OptionChangedEvent = ComponentEvent<dxTreeMap> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = ComponentEvent<dxTreeMap> & InteractionInfo;


export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
    /**
     * @docid
     * @default 'items'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    childrenField?: string;
    /**
     * @docid
     * @default 'color'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    colorField?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    colorizer?: {
    /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      colorCodeField?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      colorizeGroups?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @extends CommonVizPalette
      * @type Array<string>|Enums.VizPalette
      */
      palette?: Array<string> | PaletteType,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type Enums.VizPaletteExtensionMode
      * @default 'blend'
      */
      paletteExtensionMode?: PaletteExtensionModeType,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      range?: Array<number>,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    group?: {
    /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      border?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default "#d3d3d3"
        */
        color?: string,
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
      * @default "#eeeeee"
      */
      color?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 4
      */
      padding?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
     * @default undefined
      */
      headerHeight?: number,
      /**
      * @docid
     * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      hoverEnabled?: boolean,
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
          width?: number
        },
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        */
        color?: string
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      label?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default '#767676' [prop](color)
        * @default 600 [prop](weight)
        */
        font?: Font,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @type Enums.VizTextOverflow
        * @default "ellipsis"
        */
        textOverflow?: VizTextOverflowType,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default true
        */
        visible?: boolean
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      selectionStyle?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        */
        border?: {
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default "#232323"
          */
          color?: string,
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
        color?: string
      }
    };
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    idField?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    interactWithGroup?: boolean;
    /**
     * @docid
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
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    margin?: BaseWidgetMargin;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxDepth?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onDrill?: ((e: DrillEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onHoverChanged?: ((e: HoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 root:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onNodesInitialized?: ((e: NodesInitializedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onNodesRendering?: ((e: NodesRenderingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tile?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      border?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default "#000000"
        */
        color?: string,
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
      * @default "#$5f8b95"
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
          width?: number
        },
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        */
        color?: string
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      label?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default '#FFFFFF' [prop](color)
        * @default 300 [prop](weight)
        */
        font?: Font,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @type Enums.VizTextOverflow
        * @default "ellipsis"
        */
        textOverflow?: VizTextOverflowType,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @defaultValue true
        */
        visible?: boolean,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @type Enums.VizWordWrap
        * @default "normal"
        */
        wordWrap?: WordWrapType
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      selectionStyle?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        */
        border?: {
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default "#232323"
          */
          color?: string,
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
        color?: string
      }
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxTreeMapTooltip;
    /**
     * @docid
     * @default 'value'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
}
export interface dxTreeMapTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxTreeMapOptions.tooltip.contentTemplate
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
    contentTemplate?: template | ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }, element: TElement) => string | TElement);
    /**
     * @docid dxTreeMapOptions.tooltip.customizeTooltip
     * @default undefined
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
    constructor(element: TElement, options?: dxTreeMapOptions)
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

export type Options = dxTreeMapOptions;

/** @deprecated use Options instead */
export type IOptions = dxTreeMapOptions;
