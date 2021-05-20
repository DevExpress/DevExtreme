import {
    UserDefinedElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    ValueChangedInfo
} from './editor/editor';

import dxTrackBar, {
    dxTrackBarOptions
} from './track_bar';

import {
    format
} from './widget/ui.widget';

/** @public */
export type ContentReadyEvent = EventInfo<dxSlider>;

/** @public */
export type DisposingEvent = EventInfo<dxSlider>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSlider>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSlider> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxSlider> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSlider extends dxTrackBar {
    constructor(element: UserDefinedElement, options?: dxSliderOptions)
}

/**
 * @docid dxSliderBase
 * @inherits dxTrackBar
 * @hidden
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
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

/** @public */
export type Properties = dxSliderOptions;

/** @deprecated use Properties instead */
export type Options = dxSliderOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSliderOptions;
