import {
    AnimationConfig,
} from '../common/core/animation';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    Cancelable,
    EventInfo,
} from '../common/core/events';

import { DxEvent } from '../events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/**
 * @namespace DevExpress.ui
 * @docid
 * @type object
 */
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
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @deprecated
     * @default {}
     * @hidden
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
     * @action
     * @public
     */
    onHidden?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field cancel:boolean | Promise<boolean>
     * @action
     * @public
     */
    onHiding?: ((e: Cancelable & EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field cancel:boolean | Promise<boolean>
     * @action
     * @public
     */
    onShowing?: ((e: Cancelable & EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
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
 * @options dxOverlayOptions
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
