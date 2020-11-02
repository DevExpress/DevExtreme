import {
    BaseGauge,
    BaseGaugeOptions,
    BaseGaugeRangeContainer,
    BaseGaugeScale,
    BaseGaugeScaleLabel,
    GaugeIndicator
} from './gauges/base_gauge';

export interface dxCircularGaugeOptions extends BaseGaugeOptions<dxCircularGauge> {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    geometry?: {
      /**
       * @docid
       * @type number
       * @default 315
       */
      endAngle?: number,
      /**
       * @docid
       * @type number
       * @default 225
       */
      startAngle?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeContainer?: dxCircularGaugeRangeContainer;
    /**
     * @docid
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
/**
 * @docid
 * @inherits BaseGaugeRangeContainer
 * @hidden
 */
export interface dxCircularGaugeRangeContainer extends BaseGaugeRangeContainer {
    /**
     * @docid
     * @type Enums.CircularGaugeElementOrientation
     * @default 'outside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    orientation?: 'center' | 'inside' | 'outside';
    /**
     * @docid
     * @type number
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @inherits BaseGaugeScale
 * @hidden
 */
export interface dxCircularGaugeScale extends BaseGaugeScale {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxCircularGaugeScaleLabel;
    /**
     * @docid
     * @type Enums.CircularGaugeElementOrientation
     * @default 'outside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    orientation?: 'center' | 'inside' | 'outside';
}
/**
 * @docid
 * @inherits BaseGaugeScaleLabel
 * @hidden
 */
export interface dxCircularGaugeScaleLabel extends BaseGaugeScaleLabel {
    /**
     * @docid
     * @type Enums.GaugeOverlappingBehavior
     * @default 'last'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideFirstOrLast?: 'first' | 'last';
    /**
     * @docid
     * @type number
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
    constructor(element: Element, options?: dxCircularGaugeOptions)
    constructor(element: JQuery, options?: dxCircularGaugeOptions)
}

declare global {
interface JQuery {
    dxCircularGauge(): JQuery;
    dxCircularGauge(options: "instance"): dxCircularGauge;
    dxCircularGauge(options: string): any;
    dxCircularGauge(options: string, ...params: any[]): any;
    dxCircularGauge(options: dxCircularGaugeOptions): JQuery;
}
}
export type Options = dxCircularGaugeOptions;

/** @deprecated use Options instead */
export type IOptions = dxCircularGaugeOptions;
