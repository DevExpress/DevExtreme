import {
    AnimationConfig,
} from '../animation/fx';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/** @public */
export type ContentReadyEvent<TKey = any> = EventInfo<dxOverlay<TKey>>;

/** @public */
export type DisposingEvent<TKey = any> = EventInfo<dxOverlay<TKey>>;

/** @public */
export type HiddenEvent<TKey = any> = EventInfo<dxOverlay<TKey>>;

/** @public */
export type HidingEvent<TKey = any> = Cancelable & EventInfo<dxOverlay<TKey>>;

/** @public */
export type InitializedEvent<TKey = any> = InitializedEventInfo<dxOverlay<TKey>>;

/** @public */
export type ShowingEvent<TKey = any> = Cancelable & EventInfo<dxOverlay<TKey>>;

/** @public */
export type OptionChangedEvent<TKey = any> = EventInfo<dxOverlay<TKey>> & ChangedOptionInfo;

/** @public */
export type ShownEvent<TKey = any> = EventInfo<dxOverlay<TKey>>;

/** @namespace DevExpress.ui */
export interface dxOverlayOptions<TComponent> extends WidgetOptions<TComponent> {
    /**
     * @docid
     * @ref
     * @public
     * @type object
     */
    animation?: dxOverlayAnimation;
    /**
     * @docid
     * @deprecated dxOverlayOptions.hideOnOutsideClick
     * @default false
     * @type_function_param1 event:event
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @default "content"
     * @type_function_return string|Element|jQuery
     * @public
     */
    contentTemplate?: template | ((contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @deprecated
     * @default false
     * @public
     */
    copyRootClassesToWrapper?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @deprecated dxOverlayOptions.wrapperAttr
     * @default {}
     * @public
     */
    elementAttr?: any;
    /**
     * @docid
     * @default false
     * @type boolean | function
     * @type_function_param1 event:event
     * @public
     */
    hideOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @default false
     * @public
     */
    hideOnParentScroll?: boolean;
    /**
     * @docid
     * @default '80vh'
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @public
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @public
     */
    minHeight?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @public
     */
    minWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:EventInfo
     * @action
     * @public
     */
    onHidden?: ((e: HiddenEvent<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field cancel:boolean | Promise<boolean>
     * @action
     * @public
     */
    onHiding?: ((e: HidingEvent<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field cancel:boolean | Promise<boolean>
     * @action
     * @public
     */
    onShowing?: ((e: ShowingEvent<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:EventInfo
     * @action
     * @public
     */
    onShown?: ((e: ShownEvent<TComponent>) => void);
    /**
     * @docid
     * @default { my: 'center', at: 'center', of: window }
     * @fires dxOverlayOptions.onPositioned
     * @public
     */
    position?: any;
    /**
     * @docid
     * @default true
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @default ''
     * @public
     */
    shadingColor?: string;
    /**
     * @docid
     * @default false
     * @fires dxOverlayOptions.onShowing
     * @fires dxOverlayOptions.onHiding
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default '80vw'
     * @public
     */
    width?: number | string | (() => number | string);
    /**
     * @docid
     * @default {}
     * @public
     */
    wrapperAttr?: any;
}
/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxOverlayAnimation {
    /**
     * @docid dxOverlayOptions.animation.hide
     * @default { type: "pop", duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 } } }
     * @public
     */
    hide?: AnimationConfig;
    /**
     * @docid dxOverlayOptions.animation.show
     * @default { type: "pop", duration: 400, from: { scale: 0.55 } }
     * @public
     */
    show?: AnimationConfig;
}
/**
 * @docid
 * @inherits Widget
 * @hidden
 * @namespace DevExpress.ui
 */
export default class dxOverlay<TProperties> extends Widget<TProperties> {
    /**
     * @docid
     * @publicName content()
     * @public
     */
    content(): DxElement;
    /**
     * @docid
     * @publicName hide()
     * @return Promise<boolean>
     * @public
     */
    hide(): DxPromise<boolean>;
    /**
     * @docid
     * @publicName repaint()
     * @public
     */
    repaint(): void;
    /**
     * @docid
     * @publicName show()
     * @return Promise<boolean>
     * @public
     */
    show(): DxPromise<boolean>;
    /**
     * @docid
     * @publicName toggle(showing)
     * @return Promise<boolean>
     * @public
     */
    toggle(showing: boolean): DxPromise<boolean>;
}

/**
 * @docid ui.dxOverlay.baseZIndex
 * @publicName baseZIndex(zIndex)
 * @namespace DevExpress.ui.dxOverlay
 * @static
 * @public
 */
export function baseZIndex(zIndex: number): void;

interface OverlayInstance extends dxOverlay<Properties> { }

type Properties = dxOverlayOptions<OverlayInstance>;

export type Options = Properties;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

type Events = {
/**
 * @skip
 * @docid dxOverlayOptions.onContentReady
 * @type_function_param1 e:{ui/overlay:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxOverlayOptions.onDisposing
 * @type_function_param1 e:{ui/overlay:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxOverlayOptions.onHidden
 * @type_function_param1 e:{ui/overlay:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @skip
 * @docid dxOverlayOptions.onHiding
 * @type_function_param1 e:{ui/overlay:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @skip
 * @docid dxOverlayOptions.onInitialized
 * @type_function_param1 e:{ui/overlay:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxOverlayOptions.onOptionChanged
 * @type_function_param1 e:{ui/overlay:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxOverlayOptions.onShowing
 * @type_function_param1 e:{ui/overlay:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @skip
 * @docid dxOverlayOptions.onShown
 * @type_function_param1 e:{ui/overlay:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
};
