import DataSource, { DataSourceLike } from '../data/data_source';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    SingleMultipleOrNone,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import BaseWidget, {
    BaseWidgetMargin,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    Palette,
    PaletteExtensionMode,
    TextOverflow,
    Font,
    WordWrap,
} from '../common/charts';

export {
    Palette,
    PaletteExtensionMode,
    TextOverflow,
    WordWrap,
};

/** @public */
export type TreeMapColorizerType = 'discrete' | 'gradient' | 'none' | 'range';
/** @public */
export type TreeMapLayoutAlgorithm = 'sliceanddice' | 'squarified' | 'strip';
/** @public */
export type TreeMapLayoutDirection = 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';

/**
 * @docid
 * @hidden
 */
export interface InteractionInfo {
  /** @docid */
  readonly node: dxTreeMapNode;
}

/**
 * @docid _viz_tree_map_ClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ClickEvent = NativeEventInfo<dxTreeMap, MouseEvent | PointerEvent> & {
  /** @docid _viz_tree_map_ClickEvent.node */
  readonly node: dxTreeMapNode;
};

/**
 * @docid _viz_tree_map_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxTreeMap>;

/**
 * @docid _viz_tree_map_DrawnEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrawnEvent = EventInfo<dxTreeMap>;

/**
 * @docid _viz_tree_map_DrillEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrillEvent = EventInfo<dxTreeMap> & {
  /** @docid _viz_tree_map_DrillEvent.node */
  readonly node: dxTreeMapNode;
};

/**
 * @docid _viz_tree_map_ExportedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ExportedEvent = EventInfo<dxTreeMap>;

/**
 * @docid _viz_tree_map_ExportingEvent
 * @public
 * @type object
 * @inherits EventInfo,ExportInfo
 */
export type ExportingEvent = EventInfo<dxTreeMap> & ExportInfo;

/**
 * @docid _viz_tree_map_FileSavingEvent
 * @public
 * @type object
 * @inherits FileSavingEventInfo
 */
export type FileSavingEvent = FileSavingEventInfo<dxTreeMap>;

/**
 * @docid _viz_tree_map_HoverChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,InteractionInfo
 */
export type HoverChangedEvent = EventInfo<dxTreeMap> & InteractionInfo;

/**
 * @docid _viz_tree_map_IncidentOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,IncidentInfo
 */
export type IncidentOccurredEvent = EventInfo<dxTreeMap> & IncidentInfo;

/**
 * @docid _viz_tree_map_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxTreeMap>;

/**
 * @docid _viz_tree_map_NodesInitializedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type NodesInitializedEvent = EventInfo<dxTreeMap> & {
    /** @docid _viz_tree_map_NodesInitializedEvent.root */
    readonly root: dxTreeMapNode;
};

/**
 * @docid _viz_tree_map_NodesRenderingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type NodesRenderingEvent = EventInfo<dxTreeMap> & {
    /** @docid _viz_tree_map_NodesRenderingEvent.node */
    readonly node: dxTreeMapNode;
};

/**
 * @docid _viz_tree_map_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxTreeMap> & ChangedOptionInfo;

/**
 * @docid _viz_tree_map_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,InteractionInfo
 */
export type SelectionChangedEvent = EventInfo<dxTreeMap> & InteractionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
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
      colorCodeField?: string | undefined;
      /**
       * @docid
       * @default false
       */
      colorizeGroups?: boolean;
      /**
       * @docid
       * @default "Material"
       */
      palette?: Array<string> | Palette;
      /**
       * @docid
       * @default 'blend'
       */
      paletteExtensionMode?: PaletteExtensionMode;
      /**
       * @docid
       * @default undefined
       */
      range?: Array<number>;
      /**
       * @docid
       * @default undefined
       */
      type?: TreeMapColorizerType | undefined;
    };
    /**
     * @docid
     * @notUsedInTheme
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
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
        color?: string | undefined;
        /**
         * @docid
         * @default 1
         */
        width?: number | undefined;
      };
      /**
       * @docid
       * @default "#eeeeee"
       */
      color?: string;
      /**
       * @docid
       * @default 4
       */
      padding?: number;
      /**
       * @docid
       * @default undefined
       */
      headerHeight?: number | undefined;
      /**
       * @docid
       * @default undefined
       */
      hoverEnabled?: boolean | undefined;
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
          color?: string | undefined;
          /**
           * @docid
           * @default undefined
           */
          width?: number | undefined;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string | undefined;
      };
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         * @default '#767676' &prop(color)
         * @default 600 &prop(weight)
         */
        font?: Font;
        /**
         * @docid
         * @default "ellipsis"
         */
        textOverflow?: TextOverflow;
        /**
         * @docid
         * @default true
         */
        visible?: boolean;
      };
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
          color?: string | undefined;
          /**
           * @docid
           * @default undefined
           */
          width?: number | undefined;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string | undefined;
      };
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    hoverEnabled?: boolean | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    idField?: string | undefined;
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
     * @default 'squarified'
     * @type_function_return void
     * @public
     */
    layoutAlgorithm?: TreeMapLayoutAlgorithm | ((e: { rect?: Array<number>; sum?: number; items?: Array<any> }) => any);
    /**
     * @docid
     * @default 'leftTopRightBottom'
     * @public
     */
    layoutDirection?: TreeMapLayoutDirection;
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
    maxDepth?: number | undefined;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/tree_map:ClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:DrillEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onDrill?: ((e: DrillEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:HoverChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onHoverChanged?: ((e: HoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:NodesInitializedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodesInitialized?: ((e: NodesInitializedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:NodesRenderingEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodesRendering?: ((e: NodesRenderingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:SelectionChangedEvent}
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
    parentField?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    selectionMode?: SingleMultipleOrNone | undefined;
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
        color?: string | undefined;
        /**
         * @docid
         * @default 1
         */
        width?: number | undefined;
      };
      /**
       * @docid
       * @default "#$5f8b95"
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
          color?: string | undefined;
          /**
           * @docid
           * @default undefined
           */
          width?: number | undefined;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string | undefined;
      };
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         * @default '#FFFFFF' &prop(color)
         * @default 300 &prop(weight)
         */
        font?: Font;
        /**
         * @docid
         * @default "ellipsis"
         */
        textOverflow?: TextOverflow;
        /**
         * @docid
         * @defaultValue true
         */
        visible?: boolean;
        /**
         * @docid
         * @default "normal"
         */
        wordWrap?: WordWrap;
      };
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
          color?: string | undefined;
          /**
           * @docid
           * @default undefined
           */
          width?: number | undefined;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string | undefined;
      };
    };
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: Tooltip;
    /**
     * @docid
     * @default 'value'
     * @public
     */
    valueField?: string;
}
/**
 * @public
 * @docid dxTreeMapTooltip
 */
export type Tooltip = BaseWidgetTooltip & {
    /**
     * @docid dxTreeMapOptions.tooltip.contentTemplate
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((info: { value?: number; valueText?: string; node?: dxTreeMapNode }, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * @docid dxTreeMapOptions.tooltip.customizeTooltip
     * @default undefined
     * @type_function_return object
     * @public
     */
    customizeTooltip?: ((info: { value?: number; valueText?: string; node?: dxTreeMapNode }) => any) | undefined;
};
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
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
     * @public
     */
    getCurrentNode(): dxTreeMapNode;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getRootNode()
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
     * @public
     */
    getAllChildren(): Array<dxTreeMapNode>;
    /**
     * @docid
     * @publicName getAllNodes()
     * @public
     */
    getAllNodes(): Array<dxTreeMapNode>;
    /**
     * @docid
     * @publicName getChild(index)
     * @public
     */
    getChild(index: number): dxTreeMapNode;
    /**
     * @docid
     * @publicName getChildrenCount()
     * @public
     */
    getChildrenCount(): number;
    /**
     * @docid
     * @publicName getParent()
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
     * @public
     */
    isActive(): boolean;
    /**
     * @docid
     * @publicName isHovered()
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isLeaf()
     * @public
     */
    isLeaf(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @publicName label()
     * @public
     */
    label(): string;
    /**
     * @docid
     * @publicName label(label)
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
     * @public
     */
    value(): number;
}

/** @public */
export type Properties = dxTreeMapOptions;

/** @deprecated use Properties instead */
export type Options = dxTreeMapOptions;

// #region deprecated in v23.1

/** @deprecated Use Tooltip instead */
export type dxTreeMapTooltip = Tooltip;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onClick' | 'onDrill' | 'onHoverChanged' | 'onNodesInitialized' | 'onNodesRendering' | 'onSelectionChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTreeMapOptions.onDisposing
 * @type_function_param1 e:{viz/tree_map:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTreeMapOptions.onDrawn
 * @type_function_param1 e:{viz/tree_map:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxTreeMapOptions.onExported
 * @type_function_param1 e:{viz/tree_map:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxTreeMapOptions.onExporting
 * @type_function_param1 e:{viz/tree_map:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxTreeMapOptions.onFileSaving
 * @type_function_param1 e:{viz/tree_map:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxTreeMapOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/tree_map:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxTreeMapOptions.onInitialized
 * @type_function_param1 e:{viz/tree_map:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTreeMapOptions.onOptionChanged
 * @type_function_param1 e:{viz/tree_map:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
