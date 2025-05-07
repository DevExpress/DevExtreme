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
 * @docid _viz_linear_gauge_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxLinearGauge>;

/**
 * @docid _viz_linear_gauge_DrawnEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrawnEvent = EventInfo<dxLinearGauge>;

/**
 * @docid _viz_linear_gauge_ExportedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ExportedEvent = EventInfo<dxLinearGauge>;

/**
 * @docid _viz_linear_gauge_ExportingEvent
 * @public
 * @type object
 * @inherits EventInfo,ExportInfo
 */
export type ExportingEvent = EventInfo<dxLinearGauge> & ExportInfo;

/**
 * @docid _viz_linear_gauge_FileSavingEvent
 * @public
 * @type object
 * @inherits FileSavingEventInfo
 */
export type FileSavingEvent = FileSavingEventInfo<dxLinearGauge>;

/**
 * @docid _viz_linear_gauge_IncidentOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,IncidentInfo
 */
export type IncidentOccurredEvent = EventInfo<dxLinearGauge> & IncidentInfo;

/**
 * @docid _viz_linear_gauge_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxLinearGauge>;

/**
 * @docid _viz_linear_gauge_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxLinearGauge> & ChangedOptionInfo;

/**
 * @docid _viz_linear_gauge_TooltipHiddenEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_base_gauge_TooltipInfo
 */
export type TooltipHiddenEvent = EventInfo<dxLinearGauge> & TooltipInfo;

/**
 * @docid _viz_linear_gauge_TooltipShownEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_base_gauge_TooltipInfo
 */
export type TooltipShownEvent = EventInfo<dxLinearGauge> & TooltipInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
 */
export interface dxLinearGaugeOptions extends BaseGaugeOptions<dxLinearGauge> {
    /**
     * @docid
     * @public
     */
    geometry?: {
      /**
       * @docid
       * @default 'horizontal'
       */
      orientation?: Orientation;
    };
    /**
     * @docid
     * @type object
     * @public
     */
    rangeContainer?: RangeContainer;
    /**
     * @docid
     * @type object
     * @public
     */
    scale?: Scale;
    /**
     * @docid
     * @inheritAll
     * @public
     */
    subvalueIndicator?: GaugeIndicator;
    /**
     * @docid
     * @inheritAll
     * @public
     */
    valueIndicator?: GaugeIndicator;
}
/**
 * @public
 * @docid dxLinearGaugeRangeContainer
 */
export type RangeContainer = BaseGaugeRangeContainer & {
    /**
     * @docid dxLinearGaugeOptions.rangeContainer.horizontalOrientation
     * @default 'right'
     * @public
     */
    horizontalOrientation?: HorizontalAlignment;
    /**
     * @docid dxLinearGaugeOptions.rangeContainer.verticalOrientation
     * @default 'bottom'
     * @public
     */
    verticalOrientation?: VerticalAlignment;
    /**
     * @docid dxLinearGaugeOptions.rangeContainer.width
     * @public
     */
    width?: {
      /**
       * @docid dxLinearGaugeOptions.rangeContainer.width.start
       * @default 5
       */
      start?: number;
      /**
       * @docid dxLinearGaugeOptions.rangeContainer.width.end
       * @default 5
       */
      end?: number;
    } | number;
};
/**
 * @public
 * @docid dxLinearGaugeScale
 */
export type Scale = BaseGaugeScale & {
    /**
     * @docid dxLinearGaugeOptions.scale.horizontalOrientation
     * @default 'right'
     * @public
     */
    horizontalOrientation?: HorizontalAlignment;
    /**
     * @docid dxLinearGaugeOptions.scale.label
     * @type object
     * @public
     */
    label?: ScaleLabel;
    /**
     * @docid dxLinearGaugeOptions.scale.scaleDivisionFactor
     * @default 25
     * @public
     */
    scaleDivisionFactor?: number;
    /**
     * @docid dxLinearGaugeOptions.scale.verticalOrientation
     * @default 'bottom'
     * @public
     */
    verticalOrientation?: VerticalAlignment;
};
/**
 * @public
 * @docid dxLinearGaugeScaleLabel
 */
export type ScaleLabel = BaseGaugeScaleLabel & {
    /**
     * @docid dxLinearGaugeOptions.scale.label.indentFromTick
     * @default -10
     * @public
     */
    indentFromTick?: number;
};
/**
 * @docid
 * @inherits BaseGauge
 * @namespace DevExpress.viz
 * @public
 */
export default class dxLinearGauge extends BaseGauge<dxLinearGaugeOptions> { }

/** @public */
export type Properties = dxLinearGaugeOptions;

/** @deprecated use Properties instead */
export type Options = dxLinearGaugeOptions;

// #region deprecated in v23.1

/** @deprecated Use RangeContainer instead */
export type dxLinearGaugeRangeContainer = RangeContainer;

/** @deprecated Use Scale instead */
export type dxLinearGaugeScale = Scale;

/** @deprecated Use ScaleLabel instead */
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
