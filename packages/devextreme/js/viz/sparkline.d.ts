import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import BaseSparkline, {
    BaseSparklineOptions,
} from './sparklines/base_sparkline';

import {
    PointSymbol,
} from '../common/charts';

export {
    PointSymbol,
};

export type SparklineType = 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxSparkline>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxSparkline>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxSparkline>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxSparkline> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxSparkline>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxSparkline> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxSparkline>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxSparkline> & ChangedOptionInfo;

/**
 * The type of the tooltipHidden event handler&apos;s argument.
 */
export type TooltipHiddenEvent = EventInfo<dxSparkline>;

/**
 * The type of the tooltipShown event handler&apos;s argument.
 */
export type TooltipShownEvent = EventInfo<dxSparkline>;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSparklineOptions extends BaseSparklineOptions<dxSparkline> {
    /**
     * Specifies the data source field that provides arguments for a sparkline.
     */
    argumentField?: string;
    /**
     * Sets a color for the bars indicating negative values. Available for a sparkline of the bar type only.
     */
    barNegativeColor?: string;
    /**
     * Sets a color for the bars indicating positive values. Available for a sparkline of the bar type only.
     */
    barPositiveColor?: string;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * Sets a color for the boundary of both the first and last points on a sparkline.
     */
    firstLastColor?: string;
    /**
     * Specifies whether the sparkline should ignore null data points.
     */
    ignoreEmptyPoints?: boolean;
    /**
     * Sets a color for a line on a sparkline. Available for the sparklines of the line- and area-like types.
     */
    lineColor?: string;
    /**
     * Specifies a width for a line on a sparkline. Available for the sparklines of the line- and area-like types.
     */
    lineWidth?: number;
    /**
     * Sets a color for the bars indicating the values that are less than the winloss threshold. Available for a sparkline of the winloss type only.
     */
    lossColor?: string;
    /**
     * Sets a color for the boundary of the maximum point on a sparkline.
     */
    maxColor?: string;
    /**
     * Specifies the maximum value of the sparkline&apos;s value axis.
     */
    maxValue?: number | undefined;
    /**
     * Sets a color for the boundary of the minimum point on a sparkline.
     */
    minColor?: string;
    /**
     * Specifies the minimum value of the sparkline value axis.
     */
    minValue?: number | undefined;
    /**
     * Sets a color for points on a sparkline. Available for the sparklines of the line- and area-like types.
     */
    pointColor?: string;
    /**
     * Specifies the diameter of sparkline points in pixels. Available for the sparklines of line- and area-like types.
     */
    pointSize?: number;
    /**
     * Specifies a symbol to use as a point marker on a sparkline. Available for the sparklines of the line- and area-like types.
     */
    pointSymbol?: PointSymbol;
    /**
     * Specifies whether or not to indicate both the first and last values on a sparkline.
     */
    showFirstLast?: boolean;
    /**
     * Specifies whether or not to indicate both the minimum and maximum values on a sparkline.
     */
    showMinMax?: boolean;
    /**
     * Determines the type of a sparkline.
     */
    type?: SparklineType;
    /**
     * Specifies the data source field that provides values for a sparkline.
     */
    valueField?: string;
    /**
     * Sets a color for the bars indicating the values greater than a winloss threshold. Available for a sparkline of the winloss type only.
     */
    winColor?: string;
    /**
     * Specifies a value that serves as a threshold for the sparkline of the winloss type.
     */
    winlossThreshold?: number;
}
/**
 * The Sparkline UI component is a compact chart that contains only one series. Owing to their size, sparklines occupy very little space and can be easily collected in a table or embedded straight in text.
 */
export default class dxSparkline extends BaseSparkline<dxSparklineOptions> {
    getDataSource(): DataSource;
}

export type Properties = dxSparklineOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxSparklineOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxSparklineOptions.onDisposing
 * @type_function_param1 e:{viz/sparkline:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxSparklineOptions.onDrawn
 * @type_function_param1 e:{viz/sparkline:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxSparklineOptions.onExported
 * @type_function_param1 e:{viz/sparkline:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxSparklineOptions.onExporting
 * @type_function_param1 e:{viz/sparkline:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxSparklineOptions.onFileSaving
 * @type_function_param1 e:{viz/sparkline:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxSparklineOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/sparkline:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxSparklineOptions.onInitialized
 * @type_function_param1 e:{viz/sparkline:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxSparklineOptions.onOptionChanged
 * @type_function_param1 e:{viz/sparkline:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxSparklineOptions.onTooltipHidden
 * @type_function_param1 e:{viz/sparkline:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @docid dxSparklineOptions.onTooltipShown
 * @type_function_param1 e:{viz/sparkline:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
