import dxTrackBar, {
    dxTrackBarOptions
} from './track_bar';

import {
    format
} from './widget/ui.widget';

export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
    /**
     * @docid
     * @type number
     * @default 50
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: number;
}
/**
 * @docid
 * @isEditor
 * @inherits dxSliderBase
 * @module ui/slider
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSlider extends dxSliderBase {
    constructor(element: Element, options?: dxSliderOptions)
    constructor(element: JQuery, options?: dxSliderOptions)
}

/**
 * @docid
 * @inherits dxTrackBar
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export class dxSliderBase extends dxTrackBar {
    constructor(element: Element, options?: dxSliderBaseOptions)
    constructor(element: JQuery, options?: dxSliderBaseOptions)
}

export interface dxSliderBaseOptions<T = dxSliderBase> extends dxTrackBarOptions<T> {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyStep?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    label?: {
      /**
      * @docid
      * @default function(value) { return value }
      */
      format?: format,
      /**
      * @docid
      * @type Enums.VerticalEdge
      * @default 'bottom'
      */
      position?: 'bottom' | 'top',
      /**
      * @docid
      * @default false
      */
      visible?: boolean
    };
    /**
     * @docid
     * @type string
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRange?: boolean;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    step?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tooltip?: {
      /**
      * @docid
      * @default false
      */
      enabled?: boolean,
      /**
      * @docid
      * @default function(value) { return value }
      */
      format?: format,
      /**
      * @docid
      * @type Enums.VerticalEdge
      * @default 'top'
      */
      position?: 'bottom' | 'top',
      /**
      * @docid
      * @type Enums.SliderTooltipShowMode
      * @default 'onHover'
      */
      showMode?: 'always' | 'onHover'
    };
}

declare global {
interface JQuery {
    dxSlider(): JQuery;
    dxSlider(options: "instance"): dxSlider;
    dxSlider(options: string): any;
    dxSlider(options: string, ...params: any[]): any;
    dxSlider(options: dxSliderOptions): JQuery;
}
}
export type Options = dxSliderOptions;

/** @deprecated use Options instead */
export type IOptions = dxSliderOptions;
