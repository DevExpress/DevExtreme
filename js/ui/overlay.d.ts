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
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/** @namespace DevExpress.ui */
export interface dxOverlayOptions<TComponent> extends WidgetOptions<TComponent> {
    /**
     * @docid
     * @default { show: { type: "pop", duration: 300, from: { scale: 0.55 } }, hide: { type: "pop", duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 } } }
     * @ref
     * @default { show: { type: 'fade', duration: 400 }, hide: { type: 'fade', duration: 400, to: { opacity: 0 }, from: { opacity: 1 } }} &for(Android_below_version_4.2)
     * @public
     * @type object
     */
    animation?: dxOverlayAnimation;
    /**
     * @docid
     * @deprecated dxOverlayOptions.hideOnOutsideClick
     * @default false
     * @type_function_param1 event:event
     * @type_function_return Boolean
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
     * @type_function_return Boolean
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
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onHidden?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @public
     */
    onHiding?: ((e: Cancelable & EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:Boolean
     * @action
     * @public
     */
    onShowing?: ((e: Cancelable & EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onShown?: ((e: EventInfo<TComponent>) => void);
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
/** @namespace DevExpress.ui */
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
