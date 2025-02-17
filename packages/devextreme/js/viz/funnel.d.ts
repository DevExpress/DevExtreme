import DataSource, { DataSourceLike } from '../data/data_source';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    HorizontalEdge,
    SingleMultipleOrNone,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    Format,
} from '../localization';

import {
    BaseLegend,
    BaseLegendItem,
} from './common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    DashStyle,
    HatchDirection,
    LabelPosition,
    Palette,
    PaletteExtensionMode,
    ShiftLabelOverlap,
    TextOverflow,
    WordWrap,
    Font,
} from '../common/charts';

export {
    DashStyle,
    HatchDirection,
    HorizontalEdge,
    LabelPosition,
    Palette,
    PaletteExtensionMode,
    TextOverflow,
    ShiftLabelOverlap,
    WordWrap,
};

export type FunnelAlgorithm = 'dynamicHeight' | 'dynamicSlope';
/**
 * @deprecated Use ShiftLabelOverlap from 'devextreme/common/charts' instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type FunnelLabelOverlap = ShiftLabelOverlap;

/**
 * An object that provides information about a legend item in the Funnel UI component.
 */
export type LegendItem = FunnelLegendItem;

/**
 * @deprecated Use LegendItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface FunnelLegendItem extends BaseLegendItem {
    /**
     * The funnel item that the legend item represents.
     */
    item?: Item;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface FunnelItemInfo {
  /**
   * 
   */
  readonly item: Item;
}

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxFunnel>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxFunnel>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxFunnel>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxFunnel> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxFunnel>;

/**
 * The type of the hoverChanged event handler&apos;s argument.
 */
export type HoverChangedEvent = EventInfo<dxFunnel> & FunnelItemInfo;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxFunnel> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxFunnel>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent = NativeEventInfo<dxFunnel, MouseEvent | PointerEvent> & FunnelItemInfo;

/**
 * The type of the legendClick event handler&apos;s argument.
 */
export type LegendClickEvent = NativeEventInfo<dxFunnel, MouseEvent | PointerEvent> & FunnelItemInfo;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxFunnel> & ChangedOptionInfo;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxFunnel> & FunnelItemInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFunnelOptions extends BaseWidgetOptions<dxFunnel> {
    /**
     * Specifies adaptive layout properties.
     */
    adaptiveLayout?: {
      /**
       * Specifies the minimum container height at which the layout begins to adapt.
       */
      height?: number;
      /**
       * Specifies whether item labels should be kept when the UI component adapts the layout.
       */
      keepLabels?: boolean;
      /**
       * Specifies the minimum container width at which the layout begins to adapt.
       */
      width?: number;
    };
    /**
     * Specifies the algorithm for building the funnel.
     */
    algorithm?: FunnelAlgorithm;
    /**
     * Specifies which data source field provides arguments for funnel items. The argument identifies a funnel item and represents it on the legend.
     */
    argumentField?: string;
    /**
     * Specifies which data source field provides colors for funnel items. If this field is absent, the palette provides the colors.
     */
    colorField?: string;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * Specifies whether funnel items change their style when a user pauses on them.
     */
    hoverEnabled?: boolean;
    /**
     * Turns the funnel upside down.
     */
    inverted?: boolean;
    /**
     * Configures funnel items&apos; appearance.
     */
    item?: {
      /**
       * Configures a funnel item&apos;s border.
       */
      border?: {
        /**
         * Colors a funnel item&apos;s border.
         */
        color?: string | undefined;
        /**
         * Makes a funnel item&apos;s border visible.
         */
        visible?: boolean | undefined;
        /**
         * Sets the width of a funnel item&apos;s border in pixels.
         */
        width?: number | undefined;
      };
      /**
       * Configures a funnel item&apos;s appearance when a user presses the item or hovers the mouse pointer over it.
       */
      hoverStyle?: {
        /**
         * Configures a funnel item&apos;s border appearance when a user presses the item or hovers the mouse pointer over it.
         */
        border?: {
          /**
           * Colors a funnel item&apos;s border when a user presses the item or hovers the mouse pointer over it.
           */
          color?: string | undefined;
          /**
           * Shows a funnel item&apos;s border when a user presses the item or hovers the mouse pointer over it.
           */
          visible?: boolean | undefined;
          /**
           * Thickens a funnel item&apos;s border when a user presses the item or hovers the mouse pointer over it.
           */
          width?: number | undefined;
        };
        /**
         * Applies hatching to a funnel item when a user presses the item or hovers the mouse pointer over it.
         */
        hatching?: {
          /**
           * Specifies hatching line direction.
           */
          direction?: HatchDirection;
          /**
           * Specifies the transparency of hatching lines.
           */
          opacity?: number;
          /**
           * Specifies the distance between two side-by-side hatching lines in pixels.
           */
          step?: number;
          /**
           * Specifies hatching lines&apos; width in pixels.
           */
          width?: number;
        };
      };
      /**
       * Configures a funnel item&apos;s appearance when a user selects it.
       */
      selectionStyle?: {
        /**
         * Configures a funnel item&apos;s border appearance when a user selects this item.
         */
        border?: {
          /**
           * Colors the selected funnel item&apos;s border.
           */
          color?: string | undefined;
          /**
           * Shows the selected funnel item&apos;s border.
           */
          visible?: boolean | undefined;
          /**
           * Thickens the selected funnel item&apos;s border.
           */
          width?: number | undefined;
        };
        /**
         * Applies hatching to a selected funnel item.
         */
        hatching?: {
          /**
           * Specifies hatching line direction.
           */
          direction?: HatchDirection;
          /**
           * Specifies hatching line transparency.
           */
          opacity?: number;
          /**
           * Specifies the distance between two side-by-side hatching lines in pixels.
           */
          step?: number;
          /**
           * Specifies hatching line width in pixels.
           */
          width?: number;
        };
      };
    };
    /**
     * Configures funnel item labels.
     */
    label?: {
      /**
       * Colors the labels&apos; background. The default color is inherited from the funnel items.
       */
      backgroundColor?: string;
      /**
       * Configures the label borders.
       */
      border?: {
        /**
         * Colors the label borders.
         */
        color?: string;
        /**
         * Sets the label border dash style.
         */
        dashStyle?: DashStyle;
        /**
         * Shows the label borders.
         */
        visible?: boolean;
        /**
         * Specifies the label border width.
         */
        width?: number;
      };
      /**
       * Configures label connectors.
       */
      connector?: {
        /**
         * Colors label connectors.
         */
        color?: string | undefined;
        /**
         * Specifies the transparency of label connectors.
         */
        opacity?: number;
        /**
         * Shows label connectors.
         */
        visible?: boolean;
        /**
         * Specifies the label connector width in pixels.
         */
        width?: number;
      };
      /**
       * Customizes labels&apos; text.
       */
      customizeText?: ((itemInfo: { item?: Item; value?: number; valueText?: string; percent?: number; percentText?: string }) => string);
      /**
       * Specifies labels&apos; font properties.
       */
      font?: Font;
      /**
       * Formats the item value before displaying it in the label.
       */
      format?: Format | undefined;
      /**
       * Specifies labels&apos; position in relation to the funnel items.
       */
      horizontalAlignment?: HorizontalEdge;
      /**
       * Moves labels from their initial positions.
       */
      horizontalOffset?: number;
      /**
       * Specifies whether to display labels inside or outside funnel items or arrange them in columns.
       */
      position?: LabelPosition;
      /**
       * Specifies whether to show labels for items with zero value.
       */
      showForZeroValues?: boolean;
      /**
       * Specifies what to do with label texts that overflow the allocated space after applying wordWrap: hide, truncate them and display an ellipsis, or do nothing.
       */
      textOverflow?: TextOverflow;
      /**
       * Controls the labels&apos; visibility.
       */
      visible?: boolean;
      /**
       * Specifies how to wrap label texts if they do not fit into a single line.
       */
      wordWrap?: WordWrap;
    };
    /**
     * Configures the legend.
     */
    legend?: Legend;
    /**
     * Specifies the ratio between the height of the neck and that of the whole funnel. Accepts values from 0 to 1. Applies only if the algorithm is &apos;dynamicHeight&apos;.
     */
    neckHeight?: number;
    /**
     * Specifies the ratio between the width of the neck and that of the whole funnel. Accepts values from 0 to 1. Applies only if the algorithm is &apos;dynamicHeight&apos;.
     */
    neckWidth?: number;
    /**
     * A function that is executed after the pointer enters or leaves a funnel item.
     */
    onHoverChanged?: ((e: HoverChangedEvent) => void);
    /**
     * A function that is executed when a funnel item is clicked or tapped.
     */
    onItemClick?: ((e: ItemClickEvent) => void) | string;
    /**
     * A function that is executed when a legend item is clicked or tapped.
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * A function that is executed when a funnel item is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * Sets the palette to be used to colorize funnel items.
     */
    palette?: Array<string> | Palette;
    /**
     * Specifies what to do with colors in the palette when their number is less than the number of funnel items.
     */
    paletteExtensionMode?: PaletteExtensionMode;
    /**
     * Specifies how item labels should behave when they overlap.
     */
    resolveLabelOverlapping?: ShiftLabelOverlap;
    /**
     * Specifies whether a single or multiple funnel items can be in the selected state at a time. Assigning &apos;none&apos; disables the selection feature.
     */
    selectionMode?: SingleMultipleOrNone;
    /**
     * Specifies whether to sort funnel items.
     */
    sortData?: boolean;
    /**
     * Configures tooltips - small pop-up rectangles that display information about a data-visualizing UI component element being pressed or hovered over with the mouse pointer.
     */
    tooltip?: Tooltip;
    /**
     * Specifies which data source field provides values for funnel items. The value defines a funnel item&apos;s area.
     */
    valueField?: string;
}
/**
 * Configures the legend.
 */
export type Legend = BaseLegend & {
    /**
     * Specifies the hint that appears when a user hovers the mouse pointer over a legend item.
     */
    customizeHint?: ((itemInfo: { item?: Item; text?: string }) => string);
    /**
     * Allows you to change the order, text, and visibility of legend items.
     */
    customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
    /**
     * Customizes the text displayed by legend items.
     */
    customizeText?: ((itemInfo: { item?: Item; text?: string }) => string);
    /**
     * Specifies an SVG element that serves as a custom legend item marker.
     */
    markerTemplate?: template | ((legendItem: LegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * Specifies whether the legend is visible.
     */
    visible?: boolean;
};
/**
 * 
 */
export type Tooltip = BaseWidgetTooltip & {
    /**
     * Specifies a custom template for a tooltip.
     */
    contentTemplate?: template | ((info: { item?: Item; value?: number; valueText?: string; percent?: number; percentText?: string }, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * Customizes a specific tooltip&apos;s appearance.
     */
    customizeTooltip?: ((info: { item?: Item; value?: number; valueText?: string; percent?: number; percentText?: string }) => any) | undefined;
};
/**
 * The Funnel is a UI component that visualizes a value at different stages. It helps assess value changes throughout these stages and identify potential issues. The Funnel UI component conveys information using different interactive elements (tooltips, labels, legend) and enables you to create not only a funnel, but also a pyramid chart.
 */
export default class dxFunnel extends BaseWidget<dxFunnelOptions> {
    /**
     * Cancels the selection of all funnel items.
     */
    clearSelection(): void;
    /**
     * Provides access to all funnel items.
     */
    getAllItems(): Array<Item>;
    getDataSource(): DataSource;
    /**
     * Hides all UI component tooltips.
     */
    hideTooltip(): void;
}

export type Item = dxFunnelItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFunnelItem {
    /**
     * The item&apos;s argument.
     */
    argument?: string | Date | number;
    /**
     * The item&apos;s original data object.
     */
    data?: any;
    /**
     * Gets the funnel item&apos;s color specified in the data source or palette.
     */
    getColor(): string;
    /**
     * Changes the funnel item&apos;s hover state.
     */
    hover(state: boolean): void;
    /**
     * Indicates whether the funnel item is in the hover state.
     */
    isHovered(): boolean;
    /**
     * Indicates whether the funnel item is selected.
     */
    isSelected(): boolean;
    /**
     * The item&apos;s calculated percentage value.
     */
    percent?: number;
    /**
     * Selects or cancels the funnel item&apos;s selection.
     */
    select(state: boolean): void;
    /**
     * Shows the funnel item&apos;s tooltip.
     */
    showTooltip(): void;
    /**
     * The item&apos;s value.
     */
    value?: number;
}

export type Properties = dxFunnelOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxFunnelOptions;

// #region deprecated in v23.1

/**
 * @deprecated Use Legend instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxFunnelLegend = Legend;

/**
 * @deprecated Use Tooltip instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxFunnelTooltip = Tooltip;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onHoverChanged' | 'onItemClick' | 'onLegendClick' | 'onSelectionChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxFunnelOptions.onDisposing
 * @type_function_param1 e:{viz/funnel:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxFunnelOptions.onDrawn
 * @type_function_param1 e:{viz/funnel:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxFunnelOptions.onExported
 * @type_function_param1 e:{viz/funnel:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxFunnelOptions.onExporting
 * @type_function_param1 e:{viz/funnel:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxFunnelOptions.onFileSaving
 * @type_function_param1 e:{viz/funnel:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxFunnelOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/funnel:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxFunnelOptions.onInitialized
 * @type_function_param1 e:{viz/funnel:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxFunnelOptions.onOptionChanged
 * @type_function_param1 e:{viz/funnel:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
