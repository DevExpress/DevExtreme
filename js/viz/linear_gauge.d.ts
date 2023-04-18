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

/** @public */
export type DisposingEvent = EventInfo<dxLinearGauge>;

/** @public */
export type DrawnEvent = EventInfo<dxLinearGauge>;

/** @public */
export type ExportedEvent = EventInfo<dxLinearGauge>;

/** @public */
export type ExportingEvent = EventInfo<dxLinearGauge> & ExportInfo;

/** @public */
export type FileSavingEvent = FileSavingEventInfo<dxLinearGauge>;

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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
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
    rangeContainer?: dxLinearGaugeRangeContainer;
    /**
     * @docid
     * @type object
     * @public
     */
    scale?: dxLinearGaugeScale;
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
export interface dxLinearGaugeRangeContainer extends BaseGaugeRangeContainer {
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
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface dxLinearGaugeScale extends BaseGaugeScale {
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
    label?: dxLinearGaugeScaleLabel;
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
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface dxLinearGaugeScaleLabel extends BaseGaugeScaleLabel {
    /**
     * @docid dxLinearGaugeOptions.scale.label.indentFromTick
     * @default -10
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
export default class dxLinearGauge extends BaseGauge<dxLinearGaugeOptions> { }

/** @public */
export type Properties = dxLinearGaugeOptions;

/** @deprecated use Properties instead */
export type Options = dxLinearGaugeOptions;
