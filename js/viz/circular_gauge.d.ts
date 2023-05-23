import {
    UserDefinedElement,
} from '../core/element';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    template,
} from '../core/templates/template';

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

/** @public */
export type DisposingEvent = EventInfo<dxCircularGauge>;

/** @public */
export type DrawnEvent = EventInfo<dxCircularGauge>;

/** @public */
export type ExportedEvent = EventInfo<dxCircularGauge>;

/** @public */
export type ExportingEvent = EventInfo<dxCircularGauge> & ExportInfo;

/** @public */
export type FileSavingEvent = FileSavingEventInfo<dxCircularGauge>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxCircularGauge> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxCircularGauge>;

/** @public */
export type OptionChangedEvent = EventInfo<dxCircularGauge> & ChangedOptionInfo;

/** @public */
export type TooltipHiddenEvent = EventInfo<dxCircularGauge> & TooltipInfo;

/** @public */
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
    centerTemplate?: template | ((component: dxCircularGauge, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @type object
     * @public
     */
    rangeContainer?: dxCircularGaugeRangeContainer;
    /**
     * @docid
     * @type object
     * @public
     */
    scale?: dxCircularGaugeScale;
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
 * @docid
 * @namespace DevExpress.viz
 */
export interface dxCircularGaugeRangeContainer extends BaseGaugeRangeContainer {
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
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface dxCircularGaugeScale extends BaseGaugeScale {
    /**
     * @docid dxCircularGaugeOptions.scale.label
     * @type object
     * @public
     */
    label?: dxCircularGaugeScaleLabel;
    /**
     * @docid dxCircularGaugeOptions.scale.orientation
     * @default 'outside'
     * @public
     */
    orientation?: CircularGaugeElementOrientation;
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface dxCircularGaugeScaleLabel extends BaseGaugeScaleLabel {
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
}
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

///#DEBUG
type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxCircularGaugeOptions.onDisposing
 * @type_function_param1 e:{viz/circular_gauge:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxCircularGaugeOptions.onDrawn
 * @type_function_param1 e:{viz/circular_gauge:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @skip
 * @docid dxCircularGaugeOptions.onExported
 * @type_function_param1 e:{viz/circular_gauge:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @skip
 * @docid dxCircularGaugeOptions.onExporting
 * @type_function_param1 e:{viz/circular_gauge:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @skip
 * @docid dxCircularGaugeOptions.onFileSaving
 * @type_function_param1 e:{viz/circular_gauge:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @skip
 * @docid dxCircularGaugeOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/circular_gauge:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @skip
 * @docid dxCircularGaugeOptions.onInitialized
 * @type_function_param1 e:{viz/circular_gauge:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxCircularGaugeOptions.onOptionChanged
 * @type_function_param1 e:{viz/circular_gauge:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxCircularGaugeOptions.onTooltipHidden
 * @type_function_param1 e:{viz/circular_gauge:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @skip
 * @docid dxCircularGaugeOptions.onTooltipShown
 * @type_function_param1 e:{viz/circular_gauge:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
