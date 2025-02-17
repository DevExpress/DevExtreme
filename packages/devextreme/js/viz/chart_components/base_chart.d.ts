import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
    SingleOrMultiple,
} from '../../common';

import DataSource, { DataSourceLike } from '../../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
} from '../../common/core/events';

import {
    Format,
  } from '../../localization';

import {
    basePointObject,
    baseSeriesObject,
    chartSeriesObject,
    dxChartAnnotationConfig,
} from '../chart';

import {
  BaseLegend,
} from '../common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    BaseWidgetAnnotationConfig,
} from '../core/base_widget';

import {
  AnimationEaseMode,
  LegendItem,
  SeriesLabel,
  SeriesPoint,
  Palette,
  PaletteExtensionMode,
} from '../../common/charts';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface PointInteractionInfo {
    /**
     * 
     */
    readonly target: basePointObject;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface TooltipInfo {
    /**
     * 
     */
    target?: basePointObject | dxChartAnnotationConfig | any;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseChartOptions<TComponent> extends BaseWidgetOptions<TComponent> {
    /**
     * Specifies adaptive layout properties.
     */
    adaptiveLayout?: BaseChartAdaptiveLayout;
    /**
     * Specifies animation properties.
     */
    animation?: {
      /**
       * Specifies how long the animation runs in milliseconds.
       */
      duration?: number;
      /**
       * Specifies the easing function of the animation.
       */
      easing?: AnimationEaseMode;
      /**
       * Enables the animation in the UI component.
       */
      enabled?: boolean;
      /**
       * Specifies how many series points the UI component should have before the animation will be disabled.
       */
      maxPointCountSupported?: number;
    } | boolean;
    /**
     * Customizes the appearance of an individual point label.
     */
    customizeLabel?: ((pointInfo: any) => SeriesLabel);
    /**
     * Customizes the appearance of an individual series point.
     */
    customizePoint?: ((pointInfo: any) => SeriesPoint);
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * Specifies properties of the legend.
     */
    legend?: BaseChartLegend;
    /**
     * A function that is executed when all series are ready.
     */
    onDone?: ((e: EventInfo<TComponent>) => void);
    /**
     * A function that is executed when a series point is clicked or tapped.
     */
    onPointClick?: ((e: NativeEventInfo<TComponent, MouseEvent | PointerEvent> & PointInteractionInfo) => void) | string;
    /**
     * A function that is executed after the pointer enters or leaves a series point.
     */
    onPointHoverChanged?: ((e: EventInfo<TComponent> & PointInteractionInfo) => void);
    /**
     * A function that is executed when a series point is selected or selection is canceled.
     */
    onPointSelectionChanged?: ((e: EventInfo<TComponent> & PointInteractionInfo) => void);
    /**
     * A function that is executed when a tooltip becomes hidden.
     */
    onTooltipHidden?: ((e: EventInfo<TComponent> & TooltipInfo) => void);
    /**
     * A function that is executed when a tooltip appears.
     */
    onTooltipShown?: ((e: EventInfo<TComponent> & TooltipInfo) => void);
    /**
     * Sets the palette to be used for colorizing series and their elements.
     */
    palette?: Array<string> | Palette;
    /**
     * Specifies what to do with colors in the palette when their number is less than the number of series (in the Chart UI component) or points in a series (in the PieChart UI component).
     */
    paletteExtensionMode?: PaletteExtensionMode;
    /**
     * Specifies whether a single point or multiple points can be selected in the chart.
     */
    pointSelectionMode?: SingleOrMultiple;
    /**
     * Specifies properties for series.
     */
    series?: any | Array<any> | undefined;
    /**
     * Configures tooltips.
     */
    tooltip?: BaseChartTooltip;
}
/**
 * Specifies adaptive layout properties.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseChartAdaptiveLayout {
    /**
     * Specifies the minimum container height at which the layout begins to adapt.
     */
    height?: number;
    /**
     * Specifies whether point labels should be kept when the UI component adapts the layout.
     */
    keepLabels?: boolean;
    /**
     * Specifies the minimum container width at which the layout begins to adapt.
     */
    width?: number;
}
/**
 * Specifies properties of the legend.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseChartLegend extends BaseLegend {
    /**
     * Allows you to change the order, text, and visibility of legend items.
     */
    customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
    /**
     * Specifies an SVG element that serves as a custom legend item marker.
     */
    markerTemplate?: template | ((legendItem: LegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
}
/**
 * Configures tooltips.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseChartTooltip extends BaseWidgetTooltip {
    /**
     * Formats the point argument before it is displayed in the tooltip. To format the point value, use the format property.
     */
    argumentFormat?: Format | undefined;
    /**
     * Specifies a custom template for a tooltip.
     */
    contentTemplate?: template | ((pointInfo: any, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * Allows you to change tooltip appearance.
     */
    customizeTooltip?: ((pointInfo: any) => any) | undefined;
    /**
     * Specifies whether the tooltip is shared across all series points with the same argument.
     */
    shared?: boolean;
    /**
     * Allows users to interact with the tooltip content.
     */
    interactive?: boolean;
}
/**
 * A base class for all chart UI components included in the ChartJS library.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export class BaseChart<TProperties> extends BaseWidget<TProperties> {
    /**
     * Deselects the chart&apos;s selected series. The series is displayed in an initial style.
     */
    clearSelection(): void;
    /**
     * Gets all the series.
     */
    getAllSeries(): Array<baseSeriesObject>;
    getDataSource(): DataSource;
    /**
     * Gets a series with a specific name.
     */
    getSeriesByName(seriesName: any): chartSeriesObject;
    /**
     * Gets a series with a specific index.
     */
    getSeriesByPos(seriesIndex: number): chartSeriesObject;
    /**
     * Hides all UI component tooltips.
     */
    hideTooltip(): void;
    /**
     * Reloads data and repaints the UI component.
     */
    refresh(): void;
    render(): void;
    /**
     * Redraws the UI component.
     */
    render(renderOptions: any): void;
}

/**
 * @deprecated Use LegendItem from common/charts instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type BaseChartLegendItem = LegendItem;

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseChartAnnotationConfig extends BaseWidgetAnnotationConfig {
    /**
     * Positions the annotation relative to a specific argument.
     */
    argument?: number | Date | string | undefined;
    /**
     * Anchors the annotation to a series point. Accepts the name of the point&apos;s series.
     */
    series?: string | undefined;
    /**
     * Positions the annotation relative to a value on the specified value axis.
     */
    value?: number | Date | string | undefined;
}
