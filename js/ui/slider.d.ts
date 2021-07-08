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
    Format
} from '../localization';

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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSlider extends dxTrackBar<dxSliderOptions> { }

/**
 * @docid dxSliderBase
 * @inherits dxTrackBar
 * @hidden
 * @namespace DevExpress.ui
 */
export interface dxSliderBaseOptions<TComponent> extends dxTrackBarOptions<TComponent> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default 1
     * @public
     */
    keyStep?: number;
    /**
     * @docid
     * @public
     */
    label?: {
      /**
       * @docid
       * @default function(value) { return value }
       */
      format?: Format,
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
     * @hidden false
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    showRange?: boolean;
    /**
     * @docid
     * @default 1
     * @public
     */
    step?: number;
    /**
     * @docid
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
      format?: Format,
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

/** @public */
export type Properties = dxSliderOptions;

/** @deprecated use Properties instead */
export type Options = dxSliderOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSliderOptions;
