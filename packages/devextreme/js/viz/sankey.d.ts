import DataSource, { DataSourceLike } from '../data/data_source';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    VerticalAlignment,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    HatchDirection,
    Palette,
    PaletteExtensionMode,
    TextOverflow,
    Font,
} from '../common/charts';

export {
    HatchDirection,
    Palette,
    PaletteExtensionMode,
    TextOverflow,
};

export type SankeyColorMode = 'none' | 'source' | 'target' | 'gradient';

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxSankey>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxSankey>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxSankey>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxSankey> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxSankey>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxSankey> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxSankey>;

/**
 * The type of the linkClick event handler&apos;s argument.
 */
export type LinkClickEvent = NativeEventInfo<dxSankey, MouseEvent | PointerEvent> & {
    /**
     * 
     */
    readonly target: dxSankeyLink;
};
/**
 * The type of the linkHoverChanged event handler&apos;s argument.
 */
export type LinkHoverEvent = EventInfo<dxSankey> & {
    /**
     * 
     */
    readonly target: dxSankeyLink;
};
/**
 * The type of the nodeClick event handler&apos;s argument.
 */
export type NodeClickEvent = NativeEventInfo<dxSankey, MouseEvent | PointerEvent> & {
    /**
     * 
     */
    readonly target: dxSankeyNode;
};
/**
 * The type of the nodeHoverChanged event handler&apos;s argument.
 */
export type NodeHoverEvent = EventInfo<dxSankey> & {
    /**
     * 
     */
    readonly target: dxSankeyNode;
};

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxSankey> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSankeyOptions extends BaseWidgetOptions<dxSankey> {
    /**
     * Specifies adaptive layout properties.
     */
    adaptiveLayout?: {
      /**
       * Specifies the minimum container height at which the layout begins to adapt.
       */
      height?: number;
      /**
       * Specifies whether node labels should be kept when the UI component adapts the layout.
       */
      keepLabels?: boolean;
      /**
       * Specifies the minimum container width at which the layout begins to adapt.
       */
      width?: number;
    };
    /**
     * Aligns node columns vertically.
     */
    alignment?: VerticalAlignment | Array<VerticalAlignment>;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * Specifies whether nodes and links change their style when they are hovered over or pressed.
     */
    hoverEnabled?: boolean;
    /**
     * Configures sankey nodes&apos; labels.
     */
    label?: {
      /**
       * Configures the labels&apos; borders.
       */
      border?: {
        /**
         * Colors the labels&apos; borders.
         */
        color?: string | undefined;
        /**
         * Specifies whether the borders are visible.
         */
        visible?: boolean | undefined;
        /**
         * Sets the borders&apos; width in pixels.
         */
        width?: number | undefined;
      };
      /**
       * Customizes the labels&apos; texts.
       */
      customizeText?: ((itemInfo: dxSankeyNode) => string);
      /**
       * Specifies the labels&apos; font properties.
       */
      font?: Font;
      /**
       * Moves the labels horizontally from their initial positions.
       */
      horizontalOffset?: number;
      /**
       * Specifies how to arrange labels when there is insufficient space to display them all.
       */
      overlappingBehavior?: TextOverflow;
      /**
       * Configures the labels&apos; shadows.
       */
      shadow?: {
        /**
         * Specifies the shadows&apos; blur distance. A larger value increases the blur distance.
         */
        blur?: number;
        /**
         * Colors the labels&apos; shadows.
         */
        color?: string;
        /**
         * Moves the shadows horizontally from their initial positions.
         */
        offsetX?: number;
        /**
         * Moves the shadows vertically from their initial positions.
         */
        offsetY?: number;
        /**
         * Specifies the shadows&apos; transparency.
         */
        opacity?: number;
      };
      /**
       * Specifies whether to color labels in the nodes&apos; colors.
       */
      useNodeColors?: boolean;
      /**
       * Moves the labels vertically from their initial positions.
       */
      verticalOffset?: number;
      /**
       * Specifies whether the labels are visible.
       */
      visible?: boolean;
    };
    /**
     * Configures sankey links&apos; appearance.
     */
    link?: {
      /**
       * Configures the links&apos; borders.
       */
      border?: {
        /**
         * Colors the links&apos; borders.
         */
        color?: string | undefined;
        /**
         * Specifies whether the borders are visible.
         */
        visible?: boolean | undefined;
        /**
         * Sets the borders&apos; width in pixels.
         */
        width?: number | undefined;
      };
      /**
       * Colors the sankey links. Applies only if colorMode is &apos;none&apos;.
       */
      color?: string;
      /**
       * Specifies how to color links.
       */
      colorMode?: SankeyColorMode;
      /**
       * Configures the appearance a link changes to when it is hovered over or pressed.
       */
      hoverStyle?: {
        /**
         * Configures the appearance a link&apos;s border changes to when the link is hovered over or pressed.
         */
        border?: {
          /**
           * Specifies the color a link&apos;s border changes to when the link is hovered over or pressed.
           */
          color?: string | undefined;
          /**
           * Specifies whether a link&apos;s border is visible when the link is hovered over or pressed.
           */
          visible?: boolean | undefined;
          /**
           * Specifies the width a link&apos;s border changes to when the link is hovered over or pressed.
           */
          width?: number | undefined;
        };
        /**
         * Specifies the color a link changes to when it is hovered over or pressed.
         */
        color?: string | undefined;
        /**
         * Applies hatching to a link when it is hovered over or pressed.
         */
        hatching?: {
          /**
           * Specifies hatching lines&apos; direction.
           */
          direction?: HatchDirection;
          /**
           * Specifies hatching lines&apos; transparency.
           */
          opacity?: number;
          /**
           * Specifies the distance in pixels between two hatching lines.
           */
          step?: number;
          /**
           * Specifies hatching lines&apos; width.
           */
          width?: number;
        };
        /**
         * Specifies the transparency a link changes to when it is hovered over or pressed.
         */
        opacity?: number | undefined;
      };
      /**
       * Specifies the links&apos; transparency.
       */
      opacity?: number;
    };
    /**
     * Configures sankey nodes&apos; appearance.
     */
    node?: {
      /**
       * Configures the nodes&apos; borders.
       */
      border?: {
        /**
         * Colors the nodes&apos; borders.
         */
        color?: string | undefined;
        /**
         * Specifies whether the borders are visible.
         */
        visible?: boolean | undefined;
        /**
         * Sets the borders&apos; width in pixels.
         */
        width?: number | undefined;
      };
      /**
       * Colors the sankey nodes.
       */
      color?: string | undefined;
      /**
       * Configures the appearance a node changes to when it is hovered over or pressed.
       */
      hoverStyle?: {
        /**
         * Configures the appearance a node&apos;s border changes to when the node is hovered over or pressed.
         */
        border?: {
          /**
           * Specifies the color a node&apos;s border changes to when the node is hovered over or pressed.
           */
          color?: string | undefined;
          /**
           * Specifies whether a node&apos;s border is visible when the node is hovered over or pressed.
           */
          visible?: boolean | undefined;
          /**
           * Specifies the width a node&apos;s border changes to when the node is hovered over or pressed.
           */
          width?: number | undefined;
        };
        /**
         * Specifies the color a node changes to when it is hovered over or pressed.
         */
        color?: string | undefined;
        /**
         * Applies hatching to a node when it is hovered over or pressed.
         */
        hatching?: {
          /**
           * Specifies hatching lines&apos; direction.
           */
          direction?: HatchDirection;
          /**
           * Specifies hatching lines&apos; transparency.
           */
          opacity?: number;
          /**
           * Specifies the distance in pixels between two hatching lines.
           */
          step?: number;
          /**
           * Specifies hatching lines&apos; width.
           */
          width?: number;
        };
        /**
         * Specifies the transparency a node changes to when it is hovered over or pressed.
         */
        opacity?: number | undefined;
      };
      /**
       * Specifies the nodes&apos; transparency.
       */
      opacity?: number;
      /**
       * Specifies the vertical distance, in pixels, between two nodes.
       */
      padding?: number;
      /**
       * Specifies the nodes&apos; width in pixels.
       */
      width?: number;
    };
    /**
     * A function that is executed when a sankey link is clicked or tapped.
     */
    onLinkClick?: ((e: LinkClickEvent) => void) | string;
    /**
     * A function that is executed after the pointer enters or leaves a sankey link.
     */
    onLinkHoverChanged?: ((e: LinkHoverEvent) => void);
    /**
     * A function that is executed when a sankey node is clicked or tapped.
     */
    onNodeClick?: ((e: NodeClickEvent) => void) | string;
    /**
     * A function that is executed after the pointer enters or leaves a sankey node.
     */
    onNodeHoverChanged?: ((e: NodeHoverEvent) => void);
    /**
     * Sets the palette to be used to colorize sankey nodes.
     */
    palette?: Array<string> | Palette;
    /**
     * Specifies how to extend the palette when it contains less colors than the number of sankey nodes.
     */
    paletteExtensionMode?: PaletteExtensionMode;
    /**
     * Specifies nodes&apos; sorting order in their columns.
     */
    sortData?: any | undefined;
    /**
     * Specifies which data source field provides links&apos; source nodes.
     */
    sourceField?: string;
    /**
     * Specifies which data source field provides links&apos; target nodes.
     */
    targetField?: string;
    /**
     * Configures tooltips - small pop-up rectangles that display information about a data-visualizing UI component element being pressed or hovered over with the mouse pointer.
     */
    tooltip?: Tooltip;
    /**
     * Specifies which data source field provides links&apos; weights.
     */
    weightField?: string;
}
/**
 * 
 */
export type Tooltip = BaseWidgetTooltip & {
    /**
     * Customizes link tooltips&apos; appearance.
     */
    customizeLinkTooltip?: ((info: { source?: string; target?: string; weight?: number }) => any) | undefined;
    /**
     * Customizes node tooltips&apos; appearance.
     */
    customizeNodeTooltip?: ((info: { title?: string; label?: string; weightIn?: number; weightOut?: number }) => any) | undefined;
    /**
     * Specifies whether the tooltip is enabled.
     */
    enabled?: boolean;
    /**
     * Specifies a custom template for a link&apos;s tooltip.
     */
    linkTooltipTemplate?: template | ((info: { source?: string; target?: string; weight?: number }, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * Specifies a custom template for a node&apos;s tooltip.
     */
    nodeTooltipTemplate?: template | ((info: { label?: string; weightIn?: number; weightOut?: number }, element: DxElement) => string | UserDefinedElement) | undefined;
};
/**
 * The Sankey is a UI component that visualizes the flow magnitude between value sets. The values being connected are called nodes; the connections - links. The higher the flow magnitude, the wider the link is.
 */
export default class dxSankey extends BaseWidget<dxSankeyOptions> {
    /**
     * Gets all sankey links.
     */
    getAllLinks(): Array<dxSankeyLink>;
    /**
     * Gets all sankey nodes.
     */
    getAllNodes(): Array<dxSankeyNode>;
    getDataSource(): DataSource;
    /**
     * Hides all UI component tooltips.
     */
    hideTooltip(): void;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSankeyConnectionInfoObject {
    /**
     * The title of the link&apos;s source node.
     */
    source?: string;
    /**
     * The title of the link&apos;s target node.
     */
    target?: string;
    /**
     * The link&apos;s weight.
     */
    weight?: number;
}

/**
 * A sankey link&apos;s structure.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSankeyLink {
    /**
     * An object that describes the connection.
     */
    connection?: dxSankeyConnectionInfoObject;
    /**
     * Hides the sankey link&apos;s tooltip.
     */
    hideTooltip(): void;
    /**
     * Changes the sankey link&apos;s hover state.
     */
    hover(state: boolean): void;
    /**
     * Indicates whether the sankey link is in the hover state.
     */
    isHovered(): boolean;
    /**
     * Shows the sankey link&apos;s tooltip.
     */
    showTooltip(): void;
}

/**
 * A sankey node&apos;s structure.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSankeyNode {
    /**
     * Hides the sankey node&apos;s tooltip.
     */
    hideTooltip(): void;
    /**
     * Changes the sankey node&apos;s hover state.
     */
    hover(state: boolean): void;
    /**
     * Indicates whether the sankey node is in the hover state.
     */
    isHovered(): boolean;
    /**
     * The node&apos;s label.
     */
    label?: string;
    /**
     * The node&apos;s incoming links.
     */
    linksIn?: Array<any>;
    /**
     * The node&apos;s outgoing links.
     */
    linksOut?: Array<any>;
    /**
     * Shows the sankey node&apos;s tooltip.
     */
    showTooltip(): void;
    /**
     * The node&apos;s label.
     * @deprecated Use label instead.
     */
    title?: string;
}

export type Properties = dxSankeyOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxSankeyOptions;

// #region deprecated in v23.1

/**
 * @deprecated Use Tooltip instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxSankeyTooltip = Tooltip;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onLinkClick' | 'onLinkHoverChanged' | 'onNodeClick' | 'onNodeHoverChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxSankeyOptions.onDisposing
 * @type_function_param1 e:{viz/sankey:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxSankeyOptions.onDrawn
 * @type_function_param1 e:{viz/sankey:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxSankeyOptions.onExported
 * @type_function_param1 e:{viz/sankey:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxSankeyOptions.onExporting
 * @type_function_param1 e:{viz/sankey:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxSankeyOptions.onFileSaving
 * @type_function_param1 e:{viz/sankey:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxSankeyOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/sankey:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxSankeyOptions.onInitialized
 * @type_function_param1 e:{viz/sankey:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxSankeyOptions.onOptionChanged
 * @type_function_param1 e:{viz/sankey:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
