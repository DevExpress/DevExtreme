import {
    BaseGauge,
    BaseGaugeOptions,
    BaseGaugeRangeContainer,
    BaseGaugeScale,
    BaseGaugeScaleLabel,
    GaugeIndicator
} from './gauges/base_gauge';

export interface dxLinearGaugeOptions extends BaseGaugeOptions<dxLinearGauge> {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    geometry?: {
      /**
       * @docid
       * @type Enums.Orientation
       * @default 'horizontal'
       */
      orientation?: 'horizontal' | 'vertical'
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeContainer?: dxLinearGaugeRangeContainer;
    /**
     * @docid
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
/**
 * @docid
 * @inherits BaseGaugeRangeContainer
 * @hidden
 */
export interface dxLinearGaugeRangeContainer extends BaseGaugeRangeContainer {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalOrientation?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type Enums.VerticalAlignment
     * @default 'bottom'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalOrientation?: 'bottom' | 'center' | 'top';
    /**
     * @docid
     * @type object|number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: {
      /**
       * @docid
       * @type number
       * @default 5
       */
      start?: number,
      /**
       * @docid
       * @type number
       * @default 5
       */
      end?: number
    } | number;
}
/**
 * @docid
 * @inherits BaseGaugeScale
 * @hidden
 */
export interface dxLinearGaugeScale extends BaseGaugeScale {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalOrientation?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxLinearGaugeScaleLabel;
    /**
     * @docid
     * @default 25
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scaleDivisionFactor?: number;
    /**
     * @docid
     * @type Enums.VerticalAlignment
     * @default 'bottom'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalOrientation?: 'bottom' | 'center' | 'top';
}
/**
 * @docid
 * @inherits BaseGaugeScaleLabel
 * @hidden
 */
export interface dxLinearGaugeScaleLabel extends BaseGaugeScaleLabel {
    /**
     * @docid
     * @type number
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
    constructor(element: Element, options?: dxLinearGaugeOptions)
    constructor(element: JQuery, options?: dxLinearGaugeOptions)
}

declare global {
interface JQuery {
    dxLinearGauge(): JQuery;
    dxLinearGauge(options: "instance"): dxLinearGauge;
    dxLinearGauge(options: string): any;
    dxLinearGauge(options: string, ...params: any[]): any;
    dxLinearGauge(options: dxLinearGaugeOptions): JQuery;
}
}
export type Options = dxLinearGaugeOptions;

/** @deprecated use Options instead */
export type IOptions = dxLinearGaugeOptions;
