import DataSource, { DataSourceLike } from '../data/data_source';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    VerticalAlignment,
} from '../common';

import {
    HatchDirection,
    Palette,
    PaletteExtensionMode,
    TextOverflow,
} from '../common/charts';

export {
    HatchDirection,
    Palette,
    PaletteExtensionMode,
    TextOverflow,
};

/** @public */
export type SankeyColorMode = 'none' | 'source' | 'target' | 'gradient';

/** @public */
export type DisposingEvent = EventInfo<dxSankey>;

/** @public */
export type DrawnEvent = EventInfo<dxSankey>;

/** @public */
export type ExportedEvent = EventInfo<dxSankey>;

/** @public */
export type ExportingEvent = EventInfo<dxSankey> & ExportInfo;

/** @public */
export type FileSavingEvent = FileSavingEventInfo<dxSankey>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxSankey> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSankey>;

/** @public */
export type LinkClickEvent = NativeEventInfo<dxSankey, MouseEvent | PointerEvent> & {
    readonly target: dxSankeyLink;
};
/** @public */
export type LinkHoverEvent = EventInfo<dxSankey> & {
    readonly target: dxSankeyLink;
};
/** @public */
export type NodeClickEvent = NativeEventInfo<dxSankey, MouseEvent | PointerEvent> & {
    readonly target: dxSankeyNode;
};
/** @public */
export type NodeHoverEvent = EventInfo<dxSankey> & {
    readonly target: dxSankeyNode;
};

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
      height?: number;
      /**
       * @docid
       * @default true
       */
      keepLabels?: boolean;
      /**
       * @docid
       * @default 80
       */
      width?: number;
    };
    /**
     * @docid
     * @default 'center'
     * @public
     */
    alignment?: VerticalAlignment | Array<VerticalAlignment>;
    /**
     * @docid
     * @notUsedInTheme
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
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
        color?: string;
        /**
         * @docid
         * @default false
         */
        visible?: boolean;
        /**
         * @docid
         * @default 2
         */
        width?: number;
      };
      /**
       * @docid
       * @notUsedInTheme
       */
      customizeText?: ((itemInfo: dxSankeyNode) => string);
      /**
       * @docid
       * @default '#FFFFFF' &prop(color)
       */
      font?: Font;
      /**
       * @docid
       * @default 5
       */
      horizontalOffset?: number;
      /**
       * @docid
       * @default 'ellipsis'
       */
      overlappingBehavior?: TextOverflow;
      /**
       * @docid
       */
      shadow?: {
        /**
         * @docid
         * @default 1
         */
        blur?: number;
        /**
         * @docid
         * @default '#000000'
         */
        color?: string;
        /**
         * @docid
         * @default 0
         */
        offsetX?: number;
        /**
         * @docid
         * @default 1
         */
        offsetY?: number;
        /**
         * @docid
         * @default 0
         */
        opacity?: number;
      };
      /**
       * @docid
       * @default false
       */
      useNodeColors?: boolean;
      /**
       * @docid
       * @default 0
       */
      verticalOffset?: number;
      /**
       * @docid
       * @default true
       */
      visible?: boolean;
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
        color?: string;
        /**
         * @docid
         * @default false
         */
        visible?: boolean;
        /**
         * @docid
         * @default 2
         */
        width?: number;
      };
      /**
       * @docid
       * @default '#000000'
       */
      color?: string;
      /**
       * @docid
       * @default 'none'
       */
      colorMode?: SankeyColorMode;
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
          color?: string;
          /**
           * @docid
           * @default undefined
           */
          visible?: boolean;
          /**
           * @docid
           * @default undefined
           */
          width?: number;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string;
        /**
         * @docid
         */
        hatching?: {
          /**
           * @docid
           * @default 'right'
           */
          direction?: HatchDirection;
          /**
           * @docid
           * @default 0.75
           */
          opacity?: number;
          /**
           * @docid
           * @default 6
           */
          step?: number;
          /**
           * @docid
           * @default 2
           */
          width?: number;
        };
        /**
         * @docid
         * @default 0.5
         */
        opacity?: number;
      };
      /**
       * @docid
       * @default 0.3
       */
      opacity?: number;
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
        color?: string;
        /**
         * @docid
         * @default false
         */
        visible?: boolean;
        /**
         * @docid
         * @default 1
         */
        width?: number;
      };
      /**
       * @docid
       * @default undefined
       */
      color?: string;
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
          color?: string;
          /**
           * @docid
           * @default undefined
           */
          visible?: boolean;
          /**
           * @docid
           * @default undefined
           */
          width?: number;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string;
        /**
         * @docid
         */
        hatching?: {
          /**
           * @docid
           * @default 'right'
           */
          direction?: HatchDirection;
          /**
           * @docid
           * @default 0.75
           */
          opacity?: number;
          /**
           * @docid
           * @default 6
           */
          step?: number;
          /**
           * @docid
           * @default 2
           */
          width?: number;
        };
        /**
         * @docid
         * @default undefined
         */
        opacity?: number;
      };
      /**
       * @docid
       * @default 1
       */
      opacity?: number;
      /**
       * @docid
       * @default 30
       */
      padding?: number;
      /**
       * @docid
       * @default 15
       */
      width?: number;
    };
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSankey
     * @type_function_param1_field event:event
     * @notUsedInTheme
     * @action
     * @public
     */
    onLinkClick?: ((e: LinkClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSankey
     * @notUsedInTheme
     * @action
     * @public
     */
    onLinkHoverChanged?: ((e: LinkHoverEvent) => void);
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSankey
     * @type_function_param1_field event:event
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodeClick?: ((e: NodeClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSankey
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodeHoverChanged?: ((e: NodeHoverEvent) => void);
    /**
     * @docid
     * @default "Material"
     * @public
     */
    palette?: Array<string> | Palette;
    /**
     * @docid
     * @default 'blend'
     * @public
     */
    paletteExtensionMode?: PaletteExtensionMode;
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
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface dxSankeyTooltip extends BaseWidgetTooltip {
    /**
     * @docid  dxSankeyOptions.tooltip.customizeLinkTooltip
     * @default undefined
     * @type_function_return object
     * @public
     */
    customizeLinkTooltip?: ((info: { source?: string; target?: string; weight?: number }) => any);
    /**
     * @docid  dxSankeyOptions.tooltip.customizeNodeTooltip
     * @default undefined
     * @type_function_param1_field title:string:deprecated(label)
     * @type_function_return object
     * @public
     */
    customizeNodeTooltip?: ((info: { title?: string; label?: string; weightIn?: number; weightOut?: number }) => any);
    /**
     * @docid dxSankeyOptions.tooltip.enabled
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid dxSankeyOptions.tooltip.linkTooltipTemplate
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    linkTooltipTemplate?: template | ((info: { source?: string; target?: string; weight?: number }, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid dxSankeyOptions.tooltip.nodeTooltipTemplate
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    nodeTooltipTemplate?: template | ((info: { label?: string; weightIn?: number; weightOut?: number }, element: DxElement) => string | UserDefinedElement);
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @namespace DevExpress.viz
 * @public
 */
export default class dxSankey extends BaseWidget<dxSankeyOptions> {
    /**
     * @docid
     * @publicName getAllLinks()
     * @public
     */
    getAllLinks(): Array<dxSankeyLink>;
    /**
     * @docid
     * @publicName getAllNodes()
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
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid
     * @publicName isHovered()
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
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid
     * @publicName isHovered()
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
     * @deprecated dxSankeyNode.label
     * @public
     */
    title?: string;
}

/** @public */
export type Properties = dxSankeyOptions;

/** @deprecated use Properties instead */
export type Options = dxSankeyOptions;
