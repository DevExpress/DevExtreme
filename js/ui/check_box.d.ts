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
export type ContentReadyEvent = EventInfo<dxCheckBox>;

/** @public */
export type DisposingEvent = EventInfo<dxCheckBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxCheckBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxCheckBox> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxCheckBox, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    enableThreeStateBehavior?: boolean;
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
     * @default undefined
     * @public
     */
    iconSize?: number | string;
    /**
     * @docid
     * @hidden false
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default ""
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    value?: boolean | null | undefined;
}
/**
 * @docid
 * @isEditor
 * @inherits Editor
 * @namespace DevExpress.ui
 * @public
 */
export default class dxCheckBox extends Editor<dxCheckBoxOptions> {
    /**
     * @docid
     * @publicName blur()
     * @public
     */
     blur(): void;
}

/** @public */
export type Properties = dxCheckBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxCheckBoxOptions;

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
 * @skip
 * @docid dxCheckBoxOptions.onContentReady
 * @type_function_param1 e:{ui/check_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxCheckBoxOptions.onDisposing
 * @type_function_param1 e:{ui/check_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxCheckBoxOptions.onInitialized
 * @type_function_param1 e:{ui/check_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxCheckBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/check_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxCheckBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/check_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
