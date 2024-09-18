import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Editor, {
    EditorOptions,
    ValueChangedInfo,
} from './editor/editor';

/** @public */
export type RatingSelectionMode = 'continouus' | 'single';

/**
 * @docid _ui_rating_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxRating>;

/**
 * @docid _ui_rating_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxRating>;

/**
 * @docid _ui_rating_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxRating>;

/**
 * @docid _ui_rating_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxRating> & ChangedOptionInfo;

/**
 * @docid _ui_rating_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxRating, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated use Properties instead
 * @docid
 */
export interface dxRatingOptions extends EditorOptions<dxRating> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default true
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
     * @default 5
     * @public
     */
    itemCount?: number;
    /**
     * @docid
     * @default {}
     * @public
     */
    label?: {
        /**
        * @docid
        * @default false
        */
        enabled?: boolean;
       /**
        * @docid
        * @default function(value, itemCount) { return `${value}/${itemCount}` }
        */
       format?: string | ((value: number, itemCount: number) => string);
    };
    /**
     * @docid
     * @default 1
     * @public
     */
    precision?: number;
    /**
     * @docid
     * @default 'continouus'
     * @public
     */
    selectionMode?: RatingSelectionMode;
    /**
     * @docid
     * @default 0
     * @public
     */
    value?: number;
}
/**
 * @docid
 * @isEditor
 * @inherits Editor
 * @namespace DevExpress.ui
 * @public
 */
export default class dxRating extends Editor<Properties> {
    /**
     * @docid
     * @publicName blur()
     * @public
     */
    blur(): void;
    /**
     * @docid
     * @publicName reset(value)
     * @public
     */
    reset(value?: number): void;
}

/** @public */
export type Properties = dxRatingOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxRatingOptions.onContentReady
 * @type_function_param1 e:{ui/rating:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxRatingOptions.onDisposing
 * @type_function_param1 e:{ui/rating:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxRatingOptions.onInitialized
 * @type_function_param1 e:{ui/rating:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxRatingOptions.onOptionChanged
 * @type_function_param1 e:{ui/rating:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxRatingOptions.onValueChanged
 * @type_function_param1 e:{ui/rating:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
