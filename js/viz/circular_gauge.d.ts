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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
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
      endAngle?: number,
      /**
       * @docid
       * @default 225
       */
      startAngle?: number
    };
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
/** @namespace DevExpress.viz */
export interface dxCircularGaugeRangeContainer extends BaseGaugeRangeContainer {
    /**
     * @docid dxCircularGaugeOptions.rangeContainer.orientation
     * @type Enums.CircularGaugeElementOrientation
     * @default 'outside'
     * @public
     */
    orientation?: 'center' | 'inside' | 'outside';
    /**
     * @docid dxCircularGaugeOptions.rangeContainer.width
     * @default 5
     * @public
     */
    width?: number;
}
/** @namespace DevExpress.viz */
export interface dxCircularGaugeScale extends BaseGaugeScale {
    /**
     * @docid dxCircularGaugeOptions.scale.label
     * @type object
     * @public
     */
    label?: dxCircularGaugeScaleLabel;
    /**
     * @docid dxCircularGaugeOptions.scale.orientation
     * @type Enums.CircularGaugeElementOrientation
     * @default 'outside'
     * @public
     */
    orientation?: 'center' | 'inside' | 'outside';
}
/** @namespace DevExpress.viz */
export interface dxCircularGaugeScaleLabel extends BaseGaugeScaleLabel {
    /**
     * @docid dxCircularGaugeOptions.scale.label.hideFirstOrLast
     * @type Enums.GaugeOverlappingBehavior
     * @default 'last'
     * @public
     */
    hideFirstOrLast?: 'first' | 'last';
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
 * @module viz/circular_gauge
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxCircularGauge extends BaseGauge<dxCircularGaugeOptions> { }

/** @public */
export type Properties = dxCircularGaugeOptions;

/** @deprecated use Properties instead */
export type Options = dxCircularGaugeOptions;

/** @deprecated use Properties instead */
export type IOptions = dxCircularGaugeOptions;
