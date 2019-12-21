import {
    dxBaseGauge,
    BaseGaugeOptions,
    BaseGaugeRangeContainer,
    BaseGaugeScale,
    BaseGaugeScaleLabel,
    GaugeIndicator
} from './gauges/base_gauge';

export interface dxCircularGaugeOptions extends BaseGaugeOptions<dxCircularGauge> {
    /**
     * @docid dxCircularGaugeOptions.geometry
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    geometry?: { endAngle?: number, startAngle?: number };
    /**
     * @docid dxCircularGaugeOptions.rangeContainer
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeContainer?: dxCircularGaugeRangeContainer;
    /**
     * @docid dxCircularGaugeOptions.scale
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scale?: dxCircularGaugeScale;
    /**
     * @docid dxCircularGaugeOptions.subvalueIndicator
     * @type GaugeIndicator
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subvalueIndicator?: GaugeIndicator;
    /**
     * @docid dxCircularGaugeOptions.valueIndicator
     * @type GaugeIndicator
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
     * @type number
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
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromTick?: number;
}
/**
 * @docid dxCircularGauge
 * @inherits BaseGauge
 * @module viz/circular_gauge
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxCircularGauge extends dxBaseGauge {
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