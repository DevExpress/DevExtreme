import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTrackBar, {
    dxTrackBarOptions,
} from './track_bar';

import {
    Format,
} from '../localization';

import {
    SliderValueChangeMode,
    TooltipShowMode,
    VerticalEdge,
} from '../common';

export {
    TooltipShowMode,
    VerticalEdge,
};

/** @public */
export type ContentReadyEvent = EventInfo<dxSlider>;

/** @public */
export type DisposingEvent = EventInfo<dxSlider>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSlider>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSlider> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxSlider, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | UIEvent | Event> & ValueChangedInfo;

/**
 * @deprecated Use /common/SliderValueChangeMode instead
 */
export type ValueChangeMode = SliderValueChangeMode;

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
     * @default true &for(desktop)
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
      format?: Format;
      /**
       * @docid
       * @default 'bottom'
       */
      position?: VerticalEdge;
      /**
       * @docid
       * @default false
       */
      visible?: boolean;
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
      enabled?: boolean;
      /**
       * @docid
       * @default function(value) { return value }
       */
      format?: Format;
      /**
       * @docid
       * @default 'top'
       */
      position?: VerticalEdge;
      /**
       * @docid
       * @default 'onHover'
       */
      showMode?: TooltipShowMode;
    };
    /**
     * @docid
     * @default 'onHandleMove'
     * @public
     */
     valueChangeMode?: SliderValueChangeMode;
}

/** @public */
export type Properties = dxSliderOptions;

/** @deprecated use Properties instead */
export type Options = dxSliderOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxSliderOptions.onContentReady
 * @type_function_param1 e:{ui/slider:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxSliderOptions.onDisposing
 * @type_function_param1 e:{ui/slider:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxSliderOptions.onInitialized
 * @type_function_param1 e:{ui/slider:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxSliderOptions.onOptionChanged
 * @type_function_param1 e:{ui/slider:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxSliderOptions.onValueChanged
 * @type_function_param1 e:{ui/slider:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
