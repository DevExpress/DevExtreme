import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

import {
    EventInfo,
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
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    LabelOverlap,
    Palette,
    PaletteExtensionMode,
    ShiftLabelOverlap,
    Font,
} from '../common/charts';

export {
    LabelOverlap,
    Palette,
    PaletteExtensionMode,
    ShiftLabelOverlap,
};

/**
 * An object that provides information about a bar in the BarGauge UI component.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BarGaugeBarInfo {
    /**
     * The bar&apos;s hexadecimal color code.
     */
    color?: string;
    /**
     * The bar&apos;s zero-based index. Bars closest to the gauge&apos;s center have higher indexes.
     */
    index?: number;
    /**
     * The bar&apos;s value.
     */
    value?: number;
}

/**
 * An object that provides information about a legend item in the BarGauge UI component.
 */
export type LegendItem = BarGaugeLegendItem;

/**
 * @deprecated Use LegendItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BarGaugeLegendItem extends BaseLegendItem {
    /**
     * The bar that the legend item represents.
     */
    item?: BarGaugeBarInfo;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface TooltipInfo {
    /**
     * 
     */
    target?: any;
}

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxBarGauge>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxBarGauge>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxBarGauge>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxBarGauge> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxBarGauge>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxBarGauge> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxBarGauge>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxBarGauge> & ChangedOptionInfo;

/**
 * The type of the tooltipHidden event handler&apos;s argument.
 */
export type TooltipHiddenEvent = EventInfo<dxBarGauge> & TooltipInfo;

/**
 * The type of the tooltipShown event handler&apos;s argument.
 */
export type TooltipShownEvent = EventInfo<dxBarGauge> & TooltipInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
    /**
     * Specifies animation properties.
     */
    animation?: any;
    /**
     * Specifies a color for the remaining segment of the bar&apos;s track.
     */
    backgroundColor?: string;
    /**
     * Specifies a distance between bars in pixels.
     */
    barSpacing?: number;
    /**
     * Specifies a base value for bars.
     */
    baseValue?: number;
    /**
     * Specifies an end value for the gauge&apos;s invisible scale.
     */
    endValue?: number;
    /**
     * Defines the shape of the gauge&apos;s arc.
     */
    geometry?: {
      /**
       * Specifies the end angle of the bar gauge&apos;s arc.
       */
      endAngle?: number;
      /**
       * Specifies the start angle of the bar gauge&apos;s arc.
       */
      startAngle?: number;
    };
    /**
     * Specifies a custom template for content in the component&apos;s center.
     */
    centerTemplate?: template | ((component: dxBarGauge, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * Specifies the properties of the labels that accompany gauge bars.
     */
    label?: {
      /**
       * Specifies a color for the label connector text.
       */
      connectorColor?: string | undefined;
      /**
       * Specifies the width of the label connector in pixels.
       */
      connectorWidth?: number;
      /**
       * Specifies a callback function that returns a text for labels.
       */
      customizeText?: ((barValue: { value?: number; valueText?: string }) => string);
      /**
       * Specifies font properties for bar labels.
       */
      font?: Font;
      /**
       * Formats a value before it is displayed in a label. Accepts only numeric formats.
       */
      format?: Format | undefined;
      /**
       * Specifies the distance between the upper bar and bar labels in pixels.
       */
      indent?: number;
      /**
       * Specifies whether bar labels appear on a gauge or not.
       */
      visible?: boolean;
    };
    /**
     * Configures the legend.
     */
    legend?: Legend;
    /**
     * Configures the loading indicator.
     */
    loadingIndicator?: LoadingIndicator;
    /**
     * A function that is executed when a tooltip becomes hidden.
     */
    onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
    /**
     * A function that is executed when a tooltip appears.
     */
    onTooltipShown?: ((e: TooltipShownEvent) => void);
    /**
     * Sets the palette to be used for colorizing bars in the gauge.
     */
    palette?: Array<string> | Palette;
    /**
     * Specifies what to do with colors in the palette when their number is less than the number of bars in the gauge.
     */
    paletteExtensionMode?: PaletteExtensionMode;
    /**
     * Defines the radius of the bar that is closest to the center relatively to the radius of the topmost bar.
     */
    relativeInnerRadius?: number;
    /**
     * Specifies how the UI component should behave when bar labels overlap.
     */
    resolveLabelOverlapping?: ShiftLabelOverlap;
    /**
     * Specifies a start value for the gauge&apos;s invisible scale.
     */
    startValue?: number;
    /**
     * Configures tooltips.
     */
    tooltip?: Tooltip;
    /**
     * Specifies the array of values to be indicated on a bar gauge.
     */
    values?: Array<number>;
}

/**
 * Configures the legend.
 */
export type Legend = BaseLegend & {
    /**
     * Specifies the hint that appears when a user hovers the mouse pointer over a legend item.
     */
    customizeHint?: ((arg: { item?: BarGaugeBarInfo; text?: string }) => string);
    /**
     * Allows you to change the order, text, and visibility of legend items.
     */
    customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
    /**
     * Customizes the text displayed by legend items.
     */
    customizeText?: ((arg: { item?: BarGaugeBarInfo; text?: string }) => string);
    /**
     * Formats the item text before it is displayed. Accepts only numeric formats. When unspecified, it inherits the label&apos;s format.
     */
    itemTextFormat?: Format | undefined;
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
 * Configures the loading indicator.
 */
export type LoadingIndicator = BaseWidgetLoadingIndicator & {
    /**
     * Specifies whether the loading indicator should be displayed and hidden automatically.
     */
    enabled?: boolean;
};
/**
 * Configures tooltips.
 */
export type Tooltip = BaseWidgetTooltip & {
    /**
     * Specifies a custom template for a tooltip.
     */
    contentTemplate?: template | ((scaleValue: { value?: number; valueText?: string; index?: number }, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * Allows you to change tooltip appearance.
     */
    customizeTooltip?: ((scaleValue: { value?: number; valueText?: string; index?: number }) => any) | undefined;
    /**
     * 
     */
    interactive?: boolean;
};
/**
 * The BarGauge UI component contains several circular bars that each indicates a single value.
 */
export default class dxBarGauge extends BaseWidget<dxBarGaugeOptions> {
    /**
     * Gets all the values.
     */
    values(): Array<number>;
    /**
     * Updates all the values.
     */
    values(values: Array<number>): void;
}

export type Properties = dxBarGaugeOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxBarGaugeOptions;

// #region deprecated in v23.1

/**
 * @deprecated Use Legend instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxBarGaugeLegend = Legend;

/**
 * @deprecated Use LoadingIndicator instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxBarGaugeLoadingIndicator = LoadingIndicator;

/**
 * @deprecated Use Tooltip instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxBarGaugeTooltip = Tooltip;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onTooltipHidden' | 'onTooltipShown'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxBarGaugeOptions.onDisposing
 * @type_function_param1 e:{viz/bar_gauge:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxBarGaugeOptions.onDrawn
 * @type_function_param1 e:{viz/bar_gauge:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxBarGaugeOptions.onExported
 * @type_function_param1 e:{viz/bar_gauge:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxBarGaugeOptions.onExporting
 * @type_function_param1 e:{viz/bar_gauge:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxBarGaugeOptions.onFileSaving
 * @type_function_param1 e:{viz/bar_gauge:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxBarGaugeOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/bar_gauge:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxBarGaugeOptions.onInitialized
 * @type_function_param1 e:{viz/bar_gauge:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxBarGaugeOptions.onOptionChanged
 * @type_function_param1 e:{viz/bar_gauge:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
