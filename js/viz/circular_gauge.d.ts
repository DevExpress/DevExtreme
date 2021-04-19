import {
    TElement
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

import {
    BaseGauge,
    BaseGaugeOptions,
    BaseGaugeRangeContainer,
    BaseGaugeScale,
    BaseGaugeScaleLabel,
    GaugeIndicator,
    TooltipInfo
} from './gauges/base_gauge';

/** @public */
export type DisposingEvent = EventInfo<dxCircularGauge>;

/** @public */
export type DrawnEvent = EventInfo<dxCircularGauge>;

/** @public */
export type ExportedEvent = EventInfo<dxCircularGauge>;

/** @public */
export type ExportingEvent = EventInfo<dxCircularGauge> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxCircularGauge>;

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

export interface dxCircularGaugeOptions extends BaseGaugeOptions<dxCircularGauge> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    geometry?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 315
       */
      endAngle?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 225
       */
      startAngle?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @type object
     * @public
     */
    rangeContainer?: dxCircularGaugeRangeContainer;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scale?: dxCircularGaugeScale;
    /**
     * @docid
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subvalueIndicator?: GaugeIndicator;
    /**
     * @docid
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueIndicator?: GaugeIndicator;
}
export interface dxCircularGaugeRangeContainer extends BaseGaugeRangeContainer {
    /**
     * @docid dxCircularGaugeOptions.rangeContainer.orientation
     * @type Enums.CircularGaugeElementOrientation
     * @default 'outside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    orientation?: 'center' | 'inside' | 'outside';
    /**
     * @docid dxCircularGaugeOptions.rangeContainer.width
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxCircularGaugeScale extends BaseGaugeScale {
    /**
     * @docid dxCircularGaugeOptions.scale.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxCircularGaugeScaleLabel;
    /**
     * @docid dxCircularGaugeOptions.scale.orientation
     * @type Enums.CircularGaugeElementOrientation
     * @default 'outside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    orientation?: 'center' | 'inside' | 'outside';
}
export interface dxCircularGaugeScaleLabel extends BaseGaugeScaleLabel {
    /**
     * @docid dxCircularGaugeOptions.scale.label.hideFirstOrLast
     * @type Enums.GaugeOverlappingBehavior
     * @default 'last'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideFirstOrLast?: 'first' | 'last';
    /**
     * @docid dxCircularGaugeOptions.scale.label.indentFromTick
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromTick?: number;
}
/**
 * @docid
 * @inherits BaseGauge
 * @module viz/circular_gauge
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxCircularGauge extends BaseGauge {
    constructor(element: TElement, options?: dxCircularGaugeOptions)
}

/** @public */
export type Options = dxCircularGaugeOptions;

/** @deprecated use Options instead */
export type IOptions = dxCircularGaugeOptions;
