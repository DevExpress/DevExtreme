import {
    UserDefinedElement
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
export type DisposingEvent = EventInfo<dxLinearGauge>;

/** @public */
export type DrawnEvent = EventInfo<dxLinearGauge>;

/** @public */
export type ExportedEvent = EventInfo<dxLinearGauge>;

/** @public */
export type ExportingEvent = EventInfo<dxLinearGauge> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxLinearGauge>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxLinearGauge> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxLinearGauge>;

/** @public */
export type OptionChangedEvent = EventInfo<dxLinearGauge> & ChangedOptionInfo;

/** @public */
export type TooltipHiddenEvent = EventInfo<dxLinearGauge> & TooltipInfo;

/** @public */
export type TooltipShownEvent = EventInfo<dxLinearGauge> & TooltipInfo;


export interface dxLinearGaugeOptions extends BaseGaugeOptions<dxLinearGauge> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    geometry?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.Orientation
       * @default 'horizontal'
       */
      orientation?: 'horizontal' | 'vertical'
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeContainer?: dxLinearGaugeRangeContainer;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scale?: dxLinearGaugeScale;
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
export interface dxLinearGaugeRangeContainer extends BaseGaugeRangeContainer {
    /**
     * @docid dxLinearGaugeOptions.rangeContainer.horizontalOrientation
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalOrientation?: 'center' | 'left' | 'right';
    /**
     * @docid dxLinearGaugeOptions.rangeContainer.verticalOrientation
     * @type Enums.VerticalAlignment
     * @default 'bottom'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalOrientation?: 'bottom' | 'center' | 'top';
    /**
     * @docid dxLinearGaugeOptions.rangeContainer.width
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: {
      /**
       * @docid dxLinearGaugeOptions.rangeContainer.width.start
       * @prevFileNamespace DevExpress.viz
       * @default 5
       */
      start?: number,
      /**
       * @docid dxLinearGaugeOptions.rangeContainer.width.end
       * @prevFileNamespace DevExpress.viz
       * @default 5
       */
      end?: number
    } | number;
}
export interface dxLinearGaugeScale extends BaseGaugeScale {
    /**
     * @docid dxLinearGaugeOptions.scale.horizontalOrientation
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalOrientation?: 'center' | 'left' | 'right';
    /**
     * @docid dxLinearGaugeOptions.scale.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxLinearGaugeScaleLabel;
    /**
     * @docid dxLinearGaugeOptions.scale.scaleDivisionFactor
     * @default 25
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scaleDivisionFactor?: number;
    /**
     * @docid dxLinearGaugeOptions.scale.verticalOrientation
     * @type Enums.VerticalAlignment
     * @default 'bottom'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalOrientation?: 'bottom' | 'center' | 'top';
}
export interface dxLinearGaugeScaleLabel extends BaseGaugeScaleLabel {
    /**
     * @docid dxLinearGaugeOptions.scale.label.indentFromTick
     * @default -10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromTick?: number;
}
/**
 * @docid
 * @inherits BaseGauge
 * @module viz/linear_gauge
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxLinearGauge extends BaseGauge {
    constructor(element: UserDefinedElement, options?: dxLinearGaugeOptions)
}

/** @public */
export type Properties = dxLinearGaugeOptions;

/** @deprecated use Properties instead */
export type Options = dxLinearGaugeOptions;

/** @deprecated use Properties instead */
export type IOptions = dxLinearGaugeOptions;
