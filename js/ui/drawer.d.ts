import '../jquery_augmentation';

import {
    TPromise
} from '../core';

import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    TEvent
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxDrawerOptions extends WidgetOptions<dxDrawer> {
    /**
     * @docid
     * @default 400
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationDuration?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: TEvent) => boolean);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxSize?: number;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minSize?: number;
    /**
     * @docid
     * @fires dxDrawerOptions.onOptionChanged
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    opened?: boolean;
    /**
     * @docid
     * @type Enums.DrawerOpenedStateMode
     * @default "shrink"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    openedStateMode?: 'overlap' | 'shrink' | 'push';
    /**
     * @docid
     * @type Enums.DrawerPosition
     * @default "left"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';
    /**
     * @docid
     * @type Enums.DrawerRevealMode
     * @default "slide"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    revealMode?: 'slide' | 'expand';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @deprecated
     * @public
     */
    target?: string | Element | JQuery;
    /**
     * @docid
     * @type_function_param1 Element:dxElement
     * @default 'panel'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((Element: TElement) => any);
}
/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @module ui/drawer
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxDrawer extends Widget {
    constructor(element: Element, options?: dxDrawerOptions)
    constructor(element: JQuery, options?: dxDrawerOptions)
    /**
     * @docid
     * @publicName content()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): TElement;
    /**
     * @docid
     * @publicName hide()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): TPromise<void>;
    /**
     * @docid
     * @publicName show()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): TPromise<void>;
    /**
     * @docid
     * @publicName toggle()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(): TPromise<void>;
}

declare global {
interface JQuery {
    dxDrawer(): JQuery;
    dxDrawer(options: "instance"): dxDrawer;
    dxDrawer(options: string): any;
    dxDrawer(options: string, ...params: any[]): any;
    dxDrawer(options: dxDrawerOptions): JQuery;
}
}
export type Options = dxDrawerOptions;

/** @deprecated use Options instead */
export type IOptions = dxDrawerOptions;
