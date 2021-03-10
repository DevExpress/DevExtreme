import {
    TElement
} from '../core/element';

import BaseSparkline, {
    BaseSparklineOptions
} from './sparklines/base_sparkline';

export interface dxBulletOptions extends BaseSparklineOptions<dxBullet> {
    /**
     * @docid
     * @default '#e8c267'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endScaleValue?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTarget?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showZeroLevel?: boolean;
    /**
     * @docid
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startScaleValue?: number;
    /**
     * @docid
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    target?: number;
    /**
     * @docid
     * @default '#666666'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    targetColor?: string;
    /**
     * @docid
     * @default 4
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    targetWidth?: number;
    /**
     * @docid
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number;
}
/**
 * @docid
 * @inherits BaseSparkline
 * @module viz/bullet
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxBullet extends BaseSparkline {
    constructor(element: TElement, options?: dxBulletOptions)
}

export type Options = dxBulletOptions;

/** @deprecated use Options instead */
export type IOptions = dxBulletOptions;
