import {
    TElement
} from '../core/element';

import {
    ComponentValueChangedEvent
} from './editor/editor';

import dxTrackBar, {
    dxTrackBarOptions
} from './track_bar';

import {
    ComponentContentReadyEvent,
    format
} from './widget/ui.widget';

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxSlider>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxSlider>;

export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
    /**
     * @docid
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
export default class dxSlider extends dxTrackBar {
    constructor(element: TElement, options?: dxSliderOptions)
}

/**
 * @docid dxSliderBase
 * @inherits dxTrackBar
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export interface dxSliderBaseOptions<T> extends dxTrackBarOptions<T> {
    /**
     * @docid
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
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyStep?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    label?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default function(value) { return value }
      */
      format?: format,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @type Enums.VerticalEdge
      * @default 'bottom'
      */
      position?: 'bottom' | 'top',
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default false
      */
      visible?: boolean
    };
    /**
     * @docid
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRange?: boolean;
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    step?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tooltip?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default false
      */
      enabled?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default function(value) { return value }
      */
      format?: format,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @type Enums.VerticalEdge
      * @default 'top'
      */
      position?: 'bottom' | 'top',
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @type Enums.SliderTooltipShowMode
      * @default 'onHover'
      */
      showMode?: 'always' | 'onHover'
    };
}

export type Options = dxSliderOptions;

/** @deprecated use Options instead */
export type IOptions = dxSliderOptions;
