import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    ButtonType,
    ButtonStyle,
} from '../common';

export {
    ButtonType,
    ButtonStyle,
};

/** @public */
export type ClickEvent = NativeEventInfo<dxButton, KeyboardEvent | MouseEvent | PointerEvent> & {
    validationGroup?: any;
};

/** @public */
export type ContentReadyEvent = EventInfo<dxButton>;

/** @public */
export type DisposingEvent = EventInfo<dxButton>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxButton>;

/** @public */
export type OptionChangedEvent = EventInfo<dxButton> & ChangedOptionInfo;

/** @public */
export type TemplateData = {
    readonly text?: string;
    readonly icon?: string;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxButtonOptions extends WidgetOptions<dxButton> {
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
     * @default ""
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field validationGroup:object
     * @type_function_param1_field component:dxButton
     * @action
     * @public
     */
    onClick?: ((e: ClickEvent) => void);
    /**
     * @docid
     * @default 'contained'
     * @public
     */
    stylingMode?: ButtonStyle;
    /**
     * @docid
     * @default "content"
     * @type_function_param1 buttonData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    template?: template | ((data: TemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default ""
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default 'normal'
     * @public
     */
    type?: ButtonType;
    /**
     * @docid
     * @default false
     * @public
     */
    useSubmitBehavior?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    validationGroup?: string;
}
/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxButton extends Widget<dxButtonOptions> { }

/** @public */
export type Properties = dxButtonOptions;

/** @deprecated use Properties instead */
export type Options = dxButtonOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type Events = CheckedEvents<FilterOutHidden<Properties>, Required<{
/**
 * @skip
 * @docid dxButtonOptions.onClick
 * @type_function_param1 e:{ui/button:ClickEvent}
 */
onClick?: ((e: ClickEvent) => void);
/**
 * @skip
 * @docid dxButtonOptions.onContentReady
 * @type_function_param1 e:{ui/button:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxButtonOptions.onDisposing
 * @type_function_param1 e:{ui/button:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxButtonOptions.onInitialized
 * @type_function_param1 e:{ui/button:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxButtonOptions.onOptionChanged
 * @type_function_param1 e:{ui/button:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
}>>;
