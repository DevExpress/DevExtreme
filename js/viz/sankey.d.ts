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
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

import { HatchingDirectionType } from './common';

/** @public */
export type DisposingEvent = EventInfo<dxSankey>;

/** @public */
export type DrawnEvent = EventInfo<dxSankey>;

/** @public */
export type ExportedEvent = EventInfo<dxSankey>;

/** @public */
export type ExportingEvent = EventInfo<dxSankey> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxSankey>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxSankey> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSankey>;

/** @public */
export type LinkClickEvent = NativeEventInfo<dxSankey> & {
    readonly target: dxSankeyLink;
}
/** @public */
export type LinkHoverEvent = EventInfo<dxSankey> & {
    readonly target: dxSankeyLink;
}
/** @public */
export type NodeClickEvent = NativeEventInfo<dxSankey> & {
    readonly target: dxSankeyNode;
}
/** @public */
export type NodeHoverEvent = EventInfo<dxSankey> & {
    readonly target: dxSankeyNode;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxSankey> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 */
export interface dxSankeyOptions extends BaseWidgetOptions<dxSankey> {
    /**
     * @docid
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
     * @public
     */
    alignment?: 'bottom' | 'center' | 'top' | Array<'bottom' | 'center' | 'top'>;
    /**
     * @docid
     * @extends CommonVizDataSource
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
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
       * @type_function_param1 itemInfo: dxSankeyNode
       * @type_function_return string
       * @notUsedInTheme
       */
      customizeText?: ((itemInfo: dxSankeyNode) => string),
      /**
       * @docid
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
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSankey
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:dxSankeyLink
     * @notUsedInTheme
     * @action
     * @public
     */
    onLinkClick?: ((e: LinkClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSankey
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:dxSankeyLink
     * @notUsedInTheme
     * @action
     * @public
     */
    onLinkHoverChanged?: ((e: LinkHoverEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSankey
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:dxSankeyNode
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodeClick?: ((e: NodeClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSankey
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:dxSankeyNode
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodeHoverChanged?: ((e: NodeHoverEvent) => void);
    /**
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid
     * @default undefined
     * @public
     */
    sortData?: any;
    /**
     * @docid
     * @default 'source'
     * @public
     */
    sourceField?: string;
    /**
     * @docid
     * @default 'target'
     * @public
     */
    targetField?: string;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: dxSankeyTooltip;
    /**
     * @docid
     * @default 'weight'
     * @public
     */
    weightField?: string;
}
/** @namespace DevExpress.viz */
export interface dxSankeyTooltip extends BaseWidgetTooltip {
    /**
     * @docid  dxSankeyOptions.tooltip.customizeLinkTooltip
     * @default undefined
     * @type_function_param1 info:object
     * @type_function_param1_field1 source:string
     * @type_function_param1_field2 target:string
     * @type_function_param1_field3 weight:Number
     * @type_function_return object
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
     * @public
     */
    customizeNodeTooltip?: ((info: { title?: string, label?: string, weightIn?: number, weightOut?: number }) => any);
    /**
     * @docid dxSankeyOptions.tooltip.enabled
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid dxSankeyOptions.tooltip.linkTooltipTemplate
     * @type_function_param1 info:object
     * @type_function_param1_field1 source:string
     * @type_function_param1_field2 target:string
     * @type_function_param1_field3 weight:Number
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    linkTooltipTemplate?: template | ((info: { source?: string, target?: string, weight?: number }, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid dxSankeyOptions.tooltip.nodeTooltipTemplate
     * @type_function_param1 info:object
     * @type_function_param1_field1 label:string
     * @type_function_param1_field2 weightIn:Number
     * @type_function_param1_field3 weightOut:Number
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    nodeTooltipTemplate?: template | ((info: { label?: string, weightIn?: number, weightOut?: number }, element: DxElement) => string | UserDefinedElement);
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @module viz/sankey
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxSankey extends BaseWidget {
    constructor(element: UserDefinedElement, options?: dxSankeyOptions)
    /**
     * @docid
     * @publicName getAllLinks()
     * @return Array<dxSankeyLink>
     * @public
     */
    getAllLinks(): Array<dxSankeyLink>;
    /**
     * @docid
     * @publicName getAllNodes()
     * @return Array<dxSankeyNode>
     * @public
     */
    getAllNodes(): Array<dxSankeyNode>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName hideTooltip()
     * @public
     */
    hideTooltip(): void;
}

/**
 * @docid
 * @publicName connection
 * @type object
 * @namespace DevExpress.viz
 */
export interface dxSankeyConnectionInfoObject {
    /**
     * @docid
     * @public
     */
    source?: string;
    /**
     * @docid
     * @public
     */
    target?: string;
    /**
     * @docid
     * @public
     */
    weight?: number;
}

/**
 * @docid
 * @publicName Link
 * @namespace DevExpress.viz
 */
export interface dxSankeyLink {
    /**
     * @docid
     * @public
     */
    connection?: dxSankeyConnectionInfoObject;
    /**
     * @docid
     * @publicName hideTooltip()
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName hover(state)
     * @param1 state:boolean
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid
     * @publicName isHovered()
     * @return boolean
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName showTooltip()
     * @public
     */
    showTooltip(): void;
}

/**
 * @docid
 * @publicName Node
 * @namespace DevExpress.viz
 */
export interface dxSankeyNode {
    /**
     * @docid
     * @publicName hideTooltip()
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName hover(state)
     * @param1 state:boolean
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid
     * @publicName isHovered()
     * @return boolean
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @public
     */
    label?: string;
    /**
     * @docid
     * @public
     */
    linksIn?: Array<any>;
    /**
     * @docid
     * @public
     */
    linksOut?: Array<any>;
    /**
     * @docid
     * @publicName showTooltip()
     * @public
     */
    showTooltip(): void;
    /**
     * @docid
     * @deprecated
     * @public
     */
    title?: string;
}

/** @public */
export type Properties = dxSankeyOptions;

/** @deprecated use Properties instead */
export type Options = dxSankeyOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSankeyOptions;
