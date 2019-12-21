import {
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    event
} from '../events';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxDrawerOptions extends WidgetOptions<dxDrawer> {
    /**
     * @docid dxDrawerOptions.animationDuration
     * @type number
     * @default 400
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationDuration?: number;
    /**
     * @docid dxDrawerOptions.animationEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid dxDrawerOptions.closeOnOutsideClick
     * @type boolean|function
     * @default false
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: event) => boolean);
    /**
     * @docid dxDrawerOptions.maxSize
     * @type number
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxSize?: number;
    /**
     * @docid dxDrawerOptions.minSize
     * @type number
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minSize?: number;
    /**
     * @docid dxDrawerOptions.opened
     * @type boolean
     * @fires dxDrawerOptions.onOptionChanged
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    opened?: boolean;
    /**
     * @docid dxDrawerOptions.openedStateMode
     * @type Enums.DrawerOpenedStateMode
     * @default "shrink"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    openedStateMode?: 'overlap' | 'shrink' | 'push';
    /**
     * @docid dxDrawerOptions.position
     * @type Enums.DrawerPosition
     * @default "left"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';
    /**
     * @docid dxDrawerOptions.revealMode
     * @type Enums.DrawerRevealMode
     * @default "slide"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    revealMode?: 'slide' | 'expand';
    /**
     * @docid dxDrawerOptions.shading
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid dxDrawerOptions.target
     * @type string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    target?: string | Element | JQuery;
    /**
     * @docid dxDrawerOptions.template
     * @type_function_param1 Element:dxElement
     * @type template|function
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((Element: dxElement) => any);
}
/**
 * @docid dxDrawer
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
     * @docid dxDrawerMethods.content
     * @publicName content()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): dxElement;
    /**
     * @docid dxDrawerMethods.hide
     * @publicName hide()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxDrawerMethods.show
     * @publicName show()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxDrawerMethods.toggle
     * @publicName toggle()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(): Promise<void> & JQueryPromise<void>;
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