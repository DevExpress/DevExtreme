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

export type TreeMapColorizerType = 'discrete' | 'gradient' | 'none' | 'range';
export type TreeMapLayoutAlgorithm = 'sliceanddice' | 'squarified' | 'strip';
export type TreeMapLayoutDirection = 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface InteractionInfo {
  /**
   * 
   */
  readonly node: dxTreeMapNode;
}

/**
 * The type of the click event handler&apos;s argument.
 */
export type ClickEvent = NativeEventInfo<dxTreeMap, MouseEvent | PointerEvent> & {
  /**
   * 
   */
  readonly node: dxTreeMapNode;
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxTreeMap>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxTreeMap>;

/**
 * The type of the drill event handler&apos;s argument.
 */
export type DrillEvent = EventInfo<dxTreeMap> & {
  /**
   * 
   */
  readonly node: dxTreeMapNode;
};

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxTreeMap>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxTreeMap> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxTreeMap>;

/**
 * The type of the hoverChanged event handler&apos;s argument.
 */
export type HoverChangedEvent = EventInfo<dxTreeMap> & InteractionInfo;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxTreeMap> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxTreeMap>;

/**
 * The type of the nodesInitialized event handler&apos;s argument.
 */
export type NodesInitializedEvent = EventInfo<dxTreeMap> & {
    /**
     * 
     */
    readonly root: dxTreeMapNode;
};

/**
 * The type of the nodesRendering event handler&apos;s argument.
 */
export type NodesRenderingEvent = EventInfo<dxTreeMap> & {
    /**
     * 
     */
    readonly node: dxTreeMapNode;
};

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxTreeMap> & ChangedOptionInfo;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxTreeMap> & InteractionInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
    /**
     * Specifies the name of the data source field that provides nested items for a group. Applies to hierarchical data sources only.
     */
    childrenField?: string;
    /**
     * Specifies the name of the data source field that provides colors for tiles.
     */
    colorField?: string;
    /**
     * Manages the color settings.
     */
    colorizer?: {
      /**
       * Specifies the name of the data source field whose values define the color of a tile. Applies only if the type property is &apos;gradient&apos; or &apos;range&apos;.
       */
      colorCodeField?: string | undefined;
      /**
       * Specifies whether or not all tiles in a group must be colored uniformly. Applies only if the type property is &apos;discrete&apos;.
       */
      colorizeGroups?: boolean;
      /**
       * Sets the palette to be used to colorize tiles.
       */
      palette?: Array<string> | Palette;
      /**
       * Specifies what to do with colors in the palette when their number is less than the number of treemap tiles.
       */
      paletteExtensionMode?: PaletteExtensionMode;
      /**
       * Allows you to paint tiles with similar values uniformly. Applies only if the type property is &apos;gradient&apos; or &apos;range&apos;.
       */
      range?: Array<number>;
      /**
       * Specifies the colorizing algorithm.
       */
      type?: TreeMapColorizerType | undefined;
    };
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * Configures groups.
     */
    group?: {
      /**
       * Configures the group borders.
       */
      border?: {
        /**
         * Colors the group borders.
         */
        color?: string | undefined;
        /**
         * Specifies the width of the group borders in pixels.
         */
        width?: number | undefined;
      };
      /**
       * Colors the group headers.
       */
      color?: string;
      /**
       * Specifies the distance in pixels between group borders and content.
       */
      padding?: number;
      /**
       * Specifies the height of the group headers in pixels.
       */
      headerHeight?: number | undefined;
      /**
       * Specifies whether groups change their style when a user pauses on them.
       */
      hoverEnabled?: boolean | undefined;
      /**
       * Specifies the appearance of groups in the hover state.
       */
      hoverStyle?: {
        /**
         * Configures the appearance of the group borders in the hover state.
         */
        border?: {
          /**
           * Colors the group borders in the hover state.
           */
          color?: string | undefined;
          /**
           * Specifies the width of the group borders in pixels. Applies to a group in the hover state.
           */
          width?: number | undefined;
        };
        /**
         * Colors the group headers in the hover state.
         */
        color?: string | undefined;
      };
      /**
       * Configures the group labels.
       */
      label?: {
        /**
         * Specifies the font settings of the group labels.
         */
        font?: Font;
        /**
         * Specifies what to do with labels that overflow their group headers: hide, truncated them with ellipsis, or leave them as they are.
         */
        textOverflow?: TextOverflow;
        /**
         * Changes the visibility of the group labels.
         */
        visible?: boolean;
      };
      /**
       * Specifies the appearance of groups in the selected state.
       */
      selectionStyle?: {
        /**
         * Configures the appearance of the group borders in the selected state.
         */
        border?: {
          /**
           * Colors the group borders in the selected state.
           */
          color?: string | undefined;
          /**
           * Specifies the width of the group borders in pixels. Applies to a group in the selected state.
           */
          width?: number | undefined;
        };
        /**
         * Colors the group headers in the selected state.
         */
        color?: string | undefined;
      };
    };
    /**
     * Specifies whether tiles and groups change their style when a user pauses on them.
     */
    hoverEnabled?: boolean | undefined;
    /**
     * Specifies the name of the data source field that provides IDs for items. Applies to plain data sources only.
     */
    idField?: string | undefined;
    /**
     * Specifies whether the user will interact with a single tile or its group.
     */
    interactWithGroup?: boolean;
    /**
     * Specifies the name of the data source field that provides texts for tile and group labels.
     */
    labelField?: string;
    /**
     * Specifies the layout algorithm.
     */
    layoutAlgorithm?: TreeMapLayoutAlgorithm | ((e: { rect?: Array<number>; sum?: number; items?: Array<any> }) => any);
    /**
     * Specifies the direction in which the items will be laid out.
     */
    layoutDirection?: TreeMapLayoutDirection;
    /**
     * Generates space around the UI component.
     */
    margin?: BaseWidgetMargin;
    /**
     * Specifies how many hierarchical levels must be visualized.
     */
    maxDepth?: number | undefined;
    /**
     * A function that is executed when a node is clicked or tapped.
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * A function that is executed when a user drills up or down.
     */
    onDrill?: ((e: DrillEvent) => void);
    /**
     * A function that is executed after the pointer enters or leaves a node.
     */
    onHoverChanged?: ((e: HoverChangedEvent) => void);
    /**
     * A function that is executed only once, after the nodes are initialized.
     */
    onNodesInitialized?: ((e: NodesInitializedEvent) => void);
    /**
     * A function that is executed before the nodes are displayed and each time the collection of active nodes is changed.
     */
    onNodesRendering?: ((e: NodesRenderingEvent) => void);
    /**
     * A function that is executed when a node is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * Specifies the name of the data source field that provides parent IDs for items. Applies to plain data sources only.
     */
    parentField?: string | undefined;
    /**
     * Specifies whether a single or multiple nodes can be in the selected state simultaneously.
     */
    selectionMode?: SingleMultipleOrNone | undefined;
    /**
     * Configures tiles.
     */
    tile?: {
      /**
       * Configures the tile borders.
       */
      border?: {
        /**
         * Colors the tile borders.
         */
        color?: string | undefined;
        /**
         * Specifies the width of the tile borders in pixels.
         */
        width?: number | undefined;
      };
      /**
       * Specifies a single color for all tiles.
       */
      color?: string;
      /**
       * Specifies the appearance of tiles in the hover state.
       */
      hoverStyle?: {
        /**
         * Configures the appearance of the tile borders in the hover state.
         */
        border?: {
          /**
           * Colors the tile borders in the hover state.
           */
          color?: string | undefined;
          /**
           * Specifies the width of the tile borders in pixels. Applies to a tile in the hover state.
           */
          width?: number | undefined;
        };
        /**
         * Colors tiles in the hover state.
         */
        color?: string | undefined;
      };
      /**
       * Configures the tile labels.
       */
      label?: {
        /**
         * Specifies the font settings of the tile labels.
         */
        font?: Font;
        /**
         * Specifies what to do with labels that overflow their tiles after applying wordWrap: hide, truncate them and display an ellipsis, or do nothing.
         */
        textOverflow?: TextOverflow;
        /**
         * Changes the visibility of the tile labels.
         */
        visible?: boolean;
        /**
         * Specifies how to wrap texts that do not fit into a single line.
         */
        wordWrap?: WordWrap;
      };
      /**
       * Specifies the appearance of tiles in the selected state.
       */
      selectionStyle?: {
        /**
         * Configures the appearance of the tile borders in the selected state.
         */
        border?: {
          /**
           * Colors the tile borders in the selected state.
           */
          color?: string | undefined;
          /**
           * Specifies the width of the tile borders in pixels. Applies to a tile in the selected state.
           */
          width?: number | undefined;
        };
        /**
         * Colors tiles in the selected state.
         */
        color?: string | undefined;
      };
    };
    /**
     * Configures tooltips - small pop-up rectangles that display information about a data-visualizing UI component element being pressed or hovered over with the mouse pointer.
     */
    tooltip?: Tooltip;
    /**
     * Specifies the name of the data source field that provides values for tiles.
     */
    valueField?: string;
}
/**
 * 
 */
export type Tooltip = BaseWidgetTooltip & {
    /**
     * Specifies a custom template for a tooltip.
     */
    contentTemplate?: template | ((info: { value?: number; valueText?: string; node?: dxTreeMapNode }, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * Allows you to change tooltip appearance.
     */
    customizeTooltip?: ((info: { value?: number; valueText?: string; node?: dxTreeMapNode }) => any) | undefined;
};
/**
 * The TreeMap is a UI component that displays hierarchical data by using nested rectangles.
 */
export default class dxTreeMap extends BaseWidget<dxTreeMapOptions> {
    /**
     * Deselects all nodes in the UI component.
     */
    clearSelection(): void;
    /**
     * Drills one level up.
     */
    drillUp(): void;
    /**
     * Gets the current node.
     */
    getCurrentNode(): dxTreeMapNode;
    getDataSource(): DataSource;
    /**
     * Gets the root node.
     */
    getRootNode(): dxTreeMapNode;
    /**
     * Hides the tooltip.
     */
    hideTooltip(): void;
    /**
     * Resets the drill down level.
     */
    resetDrillDown(): void;
}

/**
 * This section describes the Node object, which represents a treemap node.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTreeMapNode {
    /**
     * Customizes the node.
     */
    customize(options: any): void;
    /**
     * The object from the data source visualized by the node.
     */
    data?: any;
    /**
     * Drills down into the node.
     */
    drillDown(): void;
    /**
     * Returns all nodes nested in the current node.
     */
    getAllChildren(): Array<dxTreeMapNode>;
    /**
     * Returns all descendant nodes.
     */
    getAllNodes(): Array<dxTreeMapNode>;
    /**
     * Gets a specific node from a collection of direct descendants.
     */
    getChild(index: number): dxTreeMapNode;
    /**
     * Indicates how many direct descendants the current node has.
     */
    getChildrenCount(): number;
    /**
     * Returns the parent node of the current node.
     */
    getParent(): dxTreeMapNode;
    /**
     * The index of the current node in the array of all nodes on the same level.
     */
    index?: number;
    /**
     * Indicates whether the current node is active.
     */
    isActive(): boolean;
    /**
     * Indicates whether the node is in the hover state or not.
     */
    isHovered(): boolean;
    /**
     * Indicates whether the node is visualized by a tile or a group of tiles.
     */
    isLeaf(): boolean;
    /**
     * Indicates whether the node is selected or not.
     */
    isSelected(): boolean;
    /**
     * Returns the label of the node.
     */
    label(): string;
    /**
     * Sets the label to the node.
     */
    label(label: string): void;
    /**
     * The level that the current node occupies in the hierarchy of nodes.
     */
    level?: number;
    /**
     * Reverts the appearance of the node to the initial state.
     */
    resetCustomization(): void;
    /**
     * Sets the selection state of a node.
     */
    select(state: boolean): void;
    /**
     * Shows the tooltip.
     */
    showTooltip(): void;
    /**
     * Gets the raw value of the node.
     */
    value(): number;
}

export type Properties = dxTreeMapOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxTreeMapOptions;

// #region deprecated in v23.1

/**
 * @deprecated Use Tooltip instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
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
