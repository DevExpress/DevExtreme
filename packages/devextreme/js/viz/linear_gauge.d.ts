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

import {
    BaseGauge,
    BaseGaugeOptions,
    BaseGaugeRangeContainer,
    BaseGaugeScale,
    BaseGaugeScaleLabel,
    GaugeIndicator,
    TooltipInfo,
} from './gauges/base_gauge';

import {
    HorizontalAlignment,
    Orientation,
    VerticalAlignment,
} from '../common';

export {
    HorizontalAlignment,
    Orientation,
    VerticalAlignment,
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxLinearGauge>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxLinearGauge>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxLinearGauge>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxLinearGauge> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxLinearGauge>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxLinearGauge> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxLinearGauge>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxLinearGauge> & ChangedOptionInfo;

/**
 * The type of the tooltipHidden event handler&apos;s argument.
 */
export type TooltipHiddenEvent = EventInfo<dxLinearGauge> & TooltipInfo;

/**
 * The type of the tooltipShown event handler&apos;s argument.
 */
export type TooltipShownEvent = EventInfo<dxLinearGauge> & TooltipInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxLinearGaugeOptions extends BaseGaugeOptions<dxLinearGauge> {
    /**
     * Specifies the properties required to set the geometry of the LinearGauge UI component.
     */
    geometry?: {
      /**
       * Indicates whether to display the LinearGauge UI component vertically or horizontally.
       */
      orientation?: Orientation;
    };
    /**
     * Specifies gauge range container properties.
     */
    rangeContainer?: RangeContainer;
    /**
     * Specifies the gauge&apos;s scale properties.
     */
    scale?: Scale;
    /**
     * Specifies the appearance properties of subvalue indicators.
     */
    subvalueIndicator?: GaugeIndicator;
    /**
     * Specifies the appearance properties of the value indicator.
     */
    valueIndicator?: GaugeIndicator;
}
/**
 * Specifies gauge range container properties.
 */
export type RangeContainer = BaseGaugeRangeContainer & {
    /**
     * Specifies the orientation of the range container. Applies only if the geometry.orientation property is &apos;vertical&apos;.
     */
    horizontalOrientation?: HorizontalAlignment;
    /**
     * Specifies the orientation of the range container. Applies only if the geometry.orientation property is &apos;horizontal&apos;.
     */
    verticalOrientation?: VerticalAlignment;
    /**
     * Specifies the width of the range container&apos;s start and end boundaries in the LinearGauge UI component.
     */
    width?: {
      /**
       * Specifies a start width of a range container.
       */
      start?: number;
      /**
       * Specifies an end width of a range container.
       */
      end?: number;
    } | number;
};
/**
 * Specifies the gauge&apos;s scale properties.
 */
export type Scale = BaseGaugeScale & {
    /**
     * Specifies the orientation of scale ticks. Applies only if the geometry.orientation property is &apos;vertical&apos;.
     */
    horizontalOrientation?: HorizontalAlignment;
    /**
     * Specifies common properties for scale labels.
     */
    label?: ScaleLabel;
    /**
     * Specifies the minimum distance between two neighboring major ticks in pixels.
     */
    scaleDivisionFactor?: number;
    /**
     * Specifies the orientation of scale ticks. Applies only if the geometry.orientation property is &apos;horizontal&apos;.
     */
    verticalOrientation?: VerticalAlignment;
};
/**
 * Specifies common properties for scale labels.
 */
export type ScaleLabel = BaseGaugeScaleLabel & {
    /**
     * Specifies the spacing between scale labels and ticks.
     */
    indentFromTick?: number;
};
/**
 * The LinearGauge is a UI component that indicates values on a linear numeric scale.
 */
export default class dxLinearGauge extends BaseGauge<dxLinearGaugeOptions> { }

export type Properties = dxLinearGaugeOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxLinearGaugeOptions;

// #region deprecated in v23.1

/**
 * @deprecated Use RangeContainer instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxLinearGaugeRangeContainer = RangeContainer;

/**
 * @deprecated Use Scale instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxLinearGaugeScale = Scale;

/**
 * @deprecated Use ScaleLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxLinearGaugeScaleLabel = ScaleLabel;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxLinearGaugeOptions.onDisposing
 * @type_function_param1 e:{viz/linear_gauge:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxLinearGaugeOptions.onDrawn
 * @type_function_param1 e:{viz/linear_gauge:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxLinearGaugeOptions.onExported
 * @type_function_param1 e:{viz/linear_gauge:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxLinearGaugeOptions.onExporting
 * @type_function_param1 e:{viz/linear_gauge:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxLinearGaugeOptions.onFileSaving
 * @type_function_param1 e:{viz/linear_gauge:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxLinearGaugeOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/linear_gauge:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxLinearGaugeOptions.onInitialized
 * @type_function_param1 e:{viz/linear_gauge:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxLinearGaugeOptions.onOptionChanged
 * @type_function_param1 e:{viz/linear_gauge:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxLinearGaugeOptions.onTooltipHidden
 * @type_function_param1 e:{viz/linear_gauge:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @docid dxLinearGaugeOptions.onTooltipShown
 * @type_function_param1 e:{viz/linear_gauge:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
