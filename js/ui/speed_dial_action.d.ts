import {
    DxElement,
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/** @public */
export type ClickEvent = NativeEventInfo<dxSpeedDialAction, MouseEvent | PointerEvent> & {
    actionElement?: DxElement;
};

/** @public */
export type ContentReadyEvent = EventInfo<dxSpeedDialAction> & {
    actionElement?: DxElement;
};

/** @public */
export type DisposingEvent = EventInfo<dxSpeedDialAction>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSpeedDialAction>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSpeedDialAction> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxSpeedDialActionOptions extends WidgetOptions<dxSpeedDialAction> {
    /**
     * @docid
     * @default ""
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @default 0
     * @public
     */
    index?: number;
    /**
     * @docid
     * @default ""
     * @public
     */
    label?: string;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onClick?: ((e: ClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSpeedDialAction
     * @action
     * @public
     */
    onContentReady?: ((e: ContentReadyEvent) => void);
    /**
     * @docid
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSpeedDialAction extends Widget<dxSpeedDialActionOptions> { }

/** @public */
export type Properties = dxSpeedDialActionOptions;

/** @deprecated use Properties instead */
export type Options = dxSpeedDialActionOptions;

///#DEBUG
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
 * @docid dxSpeedDialActionOptions.onClick
 * @type_function_param1 e:{ui/speed_dial_action:ClickEvent}
 */
onClick?: ((e: ClickEvent) => void);
/**
 * @skip
 * @docid dxSpeedDialActionOptions.onContentReady
 * @type_function_param1 e:{ui/speed_dial_action:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxSpeedDialActionOptions.onDisposing
 * @type_function_param1 e:{ui/speed_dial_action:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxSpeedDialActionOptions.onInitialized
 * @type_function_param1 e:{ui/speed_dial_action:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxSpeedDialActionOptions.onOptionChanged
 * @type_function_param1 e:{ui/speed_dial_action:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
