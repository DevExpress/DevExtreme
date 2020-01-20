import dxTrackBar, {
    dxTrackBarOptions
} from './track_bar';

import {
    format
} from './widget/ui.widget';

export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
    /**
     * @docid dxSliderOptions.value
     * @type number
     * @default 50
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: number;
}
/**
 * @docid dxSlider
 * @isEditor
 * @inherits dxSliderBase
 * @module ui/slider
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSlider extends dxTrackBar {
    constructor(element: Element, options?: dxSliderOptions)
    constructor(element: JQuery, options?: dxSliderOptions)
}

/**
 * @docid dxSliderBase
 * @inherits dxTrackBar
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export interface dxSliderBaseOptions<T> extends dxTrackBarOptions<T> {
    /**
     * @docid dxSliderBaseOptions.activeStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid dxSliderBaseOptions.focusStateEnabled
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxSliderBaseOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxSliderBaseOptions.keyStep
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyStep?: number;
    /**
     * @docid dxSliderBaseOptions.label
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    label?: { format?: format, position?: 'bottom' | 'top', visible?: boolean };
    /**
     * @docid dxSliderBaseOptions.name
     * @type string
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxSliderBaseOptions.showRange
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRange?: boolean;
    /**
     * @docid dxSliderBaseOptions.step
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    step?: number;
    /**
     * @docid dxSliderBaseOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tooltip?: { enabled?: boolean, format?: format, position?: 'bottom' | 'top', showMode?: 'always' | 'onHover' };
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