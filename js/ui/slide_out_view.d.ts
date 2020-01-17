import {
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxSlideOutViewOptions extends WidgetOptions<dxSlideOutView> {
    /**
     * @docid dxSlideOutViewOptions.contentTemplate
     * @type_function_param1 contentElement:dxElement
     * @type template|function
     * @default "content"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((contentElement: dxElement) => any);
    /**
     * @docid dxSlideOutViewOptions.menuPosition
     * @type Enums.SlideOutMenuPosition
     * @default "normal"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * @docid dxSlideOutViewOptions.menuTemplate
     * @type_function_param1 menuElement:dxElement
     * @type template|function
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuTemplate?: template | ((menuElement: dxElement) => any);
    /**
     * @docid dxSlideOutViewOptions.menuVisible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuVisible?: boolean;
    /**
     * @docid dxSlideOutViewOptions.swipeEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid dxSlideOutView
 * @inherits Widget
 * @hasTranscludedContent
 * @module ui/slide_out_view
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSlideOutView extends Widget {
    constructor(element: Element, options?: dxSlideOutViewOptions)
    constructor(element: JQuery, options?: dxSlideOutViewOptions)
    /**
     * @docid dxSlideOutViewMethods.content
     * @publicName content()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): dxElement;
    /**
     * @docid dxSlideOutViewMethods.hideMenu
     * @publicName hideMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideMenu(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxSlideOutViewMethods.menuContent
     * @publicName menuContent()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuContent(): dxElement;
    /**
     * @docid dxSlideOutViewMethods.showMenu
     * @publicName showMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMenu(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxSlideOutViewMethods.toggleMenuVisibility
     * @publicName toggleMenuVisibility()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggleMenuVisibility(): Promise<void> & JQueryPromise<void>;
}

declare global {
interface JQuery {
    dxSlideOutView(): JQuery;
    dxSlideOutView(options: "instance"): dxSlideOutView;
    dxSlideOutView(options: string): any;
    dxSlideOutView(options: string, ...params: any[]): any;
    dxSlideOutView(options: dxSlideOutViewOptions): JQuery;
}
}
export type Options = dxSlideOutViewOptions;

/** @deprecated use Options instead */
export type IOptions = dxSlideOutViewOptions;