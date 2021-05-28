import {
    UserDefinedElement,
    DxElement
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
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import BaseWidget, {
    BaseWidgetMargin,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    WordWrapType,
    VizTextOverflowType,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

export interface InteractionInfo {
  readonly node: dxTreeMapNode;
}

/** @public */
export type ClickEvent = NativeEventInfo<dxTreeMap> & {
  readonly node: dxTreeMapNode
}

/** @public */
export type DisposingEvent = EventInfo<dxTreeMap>;

/** @public */
export type DrawnEvent = EventInfo<dxTreeMap>;

/** @public */
export type DrillEvent = EventInfo<dxTreeMap> & {
  readonly node: dxTreeMapNode;
}

/** @public */
export type ExportedEvent = EventInfo<dxTreeMap>;

/** @public */
export type ExportingEvent = EventInfo<dxTreeMap> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxTreeMap>;

/** @public */
export type HoverChangedEvent = EventInfo<dxTreeMap> & InteractionInfo;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxTreeMap> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTreeMap>;

/** @public */
export type NodesInitializedEvent = EventInfo<dxTreeMap> & {
    readonly root: dxTreeMapNode;
}

/** @public */
export type NodesRenderingEvent = EventInfo<dxTreeMap> & {
    readonly node: dxTreeMapNode;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxTreeMap> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxTreeMap> & InteractionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 */
export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
    /**
     * @docid
     * @default 'items'
     * @public
     */
    childrenField?: string;
    /**
     * @docid
     * @default 'color'
     * @public
     */
    colorField?: string;
    /**
     * @docid
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
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid
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
       * @default 4
       */
      padding?: number,
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
     * @default undefined
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    idField?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    interactWithGroup?: boolean;
    /**
     * @docid
     * @default 'name'
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
     * @public
     */
    layoutAlgorithm?: 'sliceanddice' | 'squarified' | 'strip' | ((e: { rect?: Array<number>, sum?: number, items?: Array<any> }) => any);
    /**
     * @docid
     * @type Enums.TreeMapLayoutDirection
     * @default 'leftTopRightBottom'
     * @public
     */
    layoutDirection?: 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';
    /**
     * @docid
     * @type object
     * @hidden
     */
    margin?: BaseWidgetMargin;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxDepth?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @public
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @public
     */
    onDrill?: ((e: DrillEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @public
     */
    onHoverChanged?: ((e: HoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 root:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodesInitialized?: ((e: NodesInitializedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodesRendering?: ((e: NodesRenderingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 node:dxTreeMapNode
     * @notUsedInTheme
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default undefined
     * @public
     */
    parentField?: string;
    /**
     * @docid
     * @type Enums.SelectionMode
     * @default undefined
     * @public
     */
    selectionMode?: 'multiple' | 'none' | 'single';
    /**
     * @docid
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
     * @type object
     * @public
     */
    tooltip?: dxTreeMapTooltip;
    /**
     * @docid
     * @default 'value'
     * @public
     */
    valueField?: string;
}
/** @namespace DevExpress.viz */
export interface dxTreeMapTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxTreeMapOptions.tooltip.contentTemplate
     * @type_function_param1 info:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 node:dxTreeMapNode
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid dxTreeMapOptions.tooltip.customizeTooltip
     * @default undefined
     * @type_function_param1 info:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 node:dxTreeMapNode
     * @type_function_return object
     * @public
     */
    customizeTooltip?: ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }) => any);
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @module viz/tree_map
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxTreeMap extends BaseWidget<dxTreeMapOptions> {
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName drillUp()
     * @public
     */
    drillUp(): void;
    /**
     * @docid
     * @publicName getCurrentNode()
     * @return dxTreeMapNode
     * @public
     */
    getCurrentNode(): dxTreeMapNode;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getRootNode()
     * @return dxTreeMapNode
     * @public
     */
    getRootNode(): dxTreeMapNode;
    /**
     * @docid
     * @publicName hideTooltip()
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName resetDrillDown()
     * @public
     */
    resetDrillDown(): void;
}

/**
 * @docid
 * @publicName Node
 * @namespace DevExpress.viz
 */
export interface dxTreeMapNode {
    /**
     * @docid
     * @publicName customize(options)
     * @param1 options:object
     * @public
     */
    customize(options: any): void;
    /**
     * @docid
     * @public
     */
    data?: any;
    /**
     * @docid
     * @publicName drillDown()
     * @public
     */
    drillDown(): void;
    /**
     * @docid
     * @publicName getAllChildren()
     * @return Array<dxTreeMapNode>
     * @public
     */
    getAllChildren(): Array<dxTreeMapNode>;
    /**
     * @docid
     * @publicName getAllNodes()
     * @return Array<dxTreeMapNode>
     * @public
     */
    getAllNodes(): Array<dxTreeMapNode>;
    /**
     * @docid
     * @publicName getChild(index)
     * @param1 index:number
     * @return dxTreeMapNode
     * @public
     */
    getChild(index: number): dxTreeMapNode;
    /**
     * @docid
     * @publicName getChildrenCount()
     * @return number
     * @public
     */
    getChildrenCount(): number;
    /**
     * @docid
     * @publicName getParent()
     * @return dxTreeMapNode
     * @public
     */
    getParent(): dxTreeMapNode;
    /**
     * @docid
     * @public
     */
    index?: number;
    /**
     * @docid
     * @publicName isActive()
     * @return boolean
     * @public
     */
    isActive(): boolean;
    /**
     * @docid
     * @publicName isHovered()
     * @return boolean
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isLeaf()
     * @return boolean
     * @public
     */
    isLeaf(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @return boolean
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @publicName label()
     * @return string
     * @public
     */
    label(): string;
    /**
     * @docid
     * @publicName label(label)
     * @param1 label:string
     * @public
     */
    label(label: string): void;
    /**
     * @docid
     * @public
     */
    level?: number;
    /**
     * @docid
     * @publicName resetCustomization()
     * @public
     */
    resetCustomization(): void;
    /**
     * @docid
     * @publicName select(state)
     * @param1 state:boolean
     * @public
     */
    select(state: boolean): void;
    /**
     * @docid
     * @publicName showTooltip()
     * @public
     */
    showTooltip(): void;
    /**
     * @docid
     * @publicName value()
     * @return number
     * @public
     */
    value(): number;
}

/** @public */
export type Properties = dxTreeMapOptions;

/** @deprecated use Properties instead */
export type Options = dxTreeMapOptions;

/** @deprecated use Properties instead */
export type IOptions = dxTreeMapOptions;
