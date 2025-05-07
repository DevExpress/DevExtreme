import {
    UserDefinedElement,
} from '../core/element';

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
    template,
} from '../common';

import {
    BaseGauge,
    BaseGaugeOptions,
    BaseGaugeRangeContainer,
    BaseGaugeScale,
    BaseGaugeScaleLabel,
    GaugeIndicator,
    TooltipInfo,
} from './gauges/base_gauge';

/** @public */
export type CircularGaugeElementOrientation = 'center' | 'inside' | 'outside';
/** @public */
export type CircularGaugeLabelOverlap = 'first' | 'last';

/**
 * @docid _viz_circular_gauge_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxCircularGauge>;

/**
 * @docid _viz_circular_gauge_DrawnEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrawnEvent = EventInfo<dxCircularGauge>;

/**
 * @docid _viz_circular_gauge_ExportedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ExportedEvent = EventInfo<dxCircularGauge>;

/**
 * @docid _viz_circular_gauge_ExportingEvent
 * @public
 * @type object
 * @inherits EventInfo,ExportInfo
 */
export type ExportingEvent = EventInfo<dxCircularGauge> & ExportInfo;

/**
 * @docid _viz_circular_gauge_FileSavingEvent
 * @public
 * @type object
 * @inherits FileSavingEventInfo
 */
export type FileSavingEvent = FileSavingEventInfo<dxCircularGauge>;

/**
 * @docid _viz_circular_gauge_IncidentOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,IncidentInfo
 */
export type IncidentOccurredEvent = EventInfo<dxCircularGauge> & IncidentInfo;

/**
 * @docid _viz_circular_gauge_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxCircularGauge>;

/**
 * @docid _viz_circular_gauge_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxCircularGauge> & ChangedOptionInfo;

/**
 * @docid _viz_circular_gauge_TooltipHiddenEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_base_gauge_TooltipInfo
 */
export type TooltipHiddenEvent = EventInfo<dxCircularGauge> & TooltipInfo;

/**
 * @docid _viz_circular_gauge_TooltipShownEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_base_gauge_TooltipInfo
 */
export type TooltipShownEvent = EventInfo<dxCircularGauge> & TooltipInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
 */
export interface dxCircularGaugeOptions extends BaseGaugeOptions<dxCircularGauge> {
    /**
     * @docid
     * @public
     */
    geometry?: {
      /**
       * @docid
       * @default 315
       */
      endAngle?: number;
      /**
       * @docid
       * @default 225
       */
      startAngle?: number;
    };
    /**
     * @docid
     * @default undefined
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    centerTemplate?: template | ((component: dxCircularGauge, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
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
 * @docid dxCircularGaugeRangeContainer
 */
export type RangeContainer = BaseGaugeRangeContainer & {
    /**
     * @docid dxCircularGaugeOptions.rangeContainer.orientation
     * @default 'outside'
     * @public
     */
    orientation?: CircularGaugeElementOrientation;
    /**
     * @docid dxCircularGaugeOptions.rangeContainer.width
     * @default 5
     * @public
     */
    width?: number;
};
/**
 * @public
 * @docid dxCircularGaugeScale
 */
export type Scale = BaseGaugeScale & {
    /**
     * @docid dxCircularGaugeOptions.scale.label
     * @type object
     * @public
     */
    label?: ScaleLabel;
    /**
     * @docid dxCircularGaugeOptions.scale.orientation
     * @default 'outside'
     * @public
     */
    orientation?: CircularGaugeElementOrientation;
};
/**
 * @public
 * @docid dxCircularGaugeScaleLabel
 */
export type ScaleLabel = BaseGaugeScaleLabel & {
    /**
     * @docid dxCircularGaugeOptions.scale.label.hideFirstOrLast
     * @default 'last'
     * @public
     */
    hideFirstOrLast?: CircularGaugeLabelOverlap;
    /**
     * @docid dxCircularGaugeOptions.scale.label.indentFromTick
     * @default 10
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
export default class dxCircularGauge extends BaseGauge<dxCircularGaugeOptions> { }

/** @public */
export type Properties = dxCircularGaugeOptions;

/** @deprecated use Properties instead */
export type Options = dxCircularGaugeOptions;

// #region deprecated in v23.1

/** @deprecated Use RangeContainer instead */
export type dxCircularGaugeRangeContainer = RangeContainer;

/** @deprecated Use Scale instead */
export type dxCircularGaugeScale = Scale;

/** @deprecated Use ScaleLabel instead */
export type dxCircularGaugeScaleLabel = ScaleLabel;

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
 * @docid dxCircularGaugeOptions.onDisposing
 * @type_function_param1 e:{viz/circular_gauge:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxCircularGaugeOptions.onDrawn
 * @type_function_param1 e:{viz/circular_gauge:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxCircularGaugeOptions.onExported
 * @type_function_param1 e:{viz/circular_gauge:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxCircularGaugeOptions.onExporting
 * @type_function_param1 e:{viz/circular_gauge:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxCircularGaugeOptions.onFileSaving
 * @type_function_param1 e:{viz/circular_gauge:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxCircularGaugeOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/circular_gauge:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxCircularGaugeOptions.onInitialized
 * @type_function_param1 e:{viz/circular_gauge:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxCircularGaugeOptions.onOptionChanged
 * @type_function_param1 e:{viz/circular_gauge:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxCircularGaugeOptions.onTooltipHidden
 * @type_function_param1 e:{viz/circular_gauge:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @docid dxCircularGaugeOptions.onTooltipShown
 * @type_function_param1 e:{viz/circular_gauge:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
