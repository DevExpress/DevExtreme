import {
    ElementIntake,
    THTMLElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    template
} from '../core/templates/template';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type DisposingEvent = EventInfo<dxSlideOutView>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSlideOutView>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSlideOutView> & ChangedOptionInfo;

export interface dxSlideOutViewOptions extends WidgetOptions<dxSlideOutView> {
    /**
     * @docid
     * @type_function_param1 contentElement:dxElement
     * @default "content"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((contentElement: THTMLElement) => any);
    /**
     * @docid
     * @type Enums.SlideOutMenuPosition
     * @default "normal"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * @docid
     * @type_function_param1 menuElement:dxElement
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuTemplate?: template | ((menuElement: THTMLElement) => any);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuVisible?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @module ui/slide_out_view
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSlideOutView extends Widget {
    constructor(element: ElementIntake, options?: dxSlideOutViewOptions)
    /**
     * @docid
     * @publicName content()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): THTMLElement;
    /**
     * @docid
     * @publicName hideMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideMenu(): TPromise<void>;
    /**
     * @docid
     * @publicName menuContent()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuContent(): THTMLElement;
    /**
     * @docid
     * @publicName showMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMenu(): TPromise<void>;
    /**
     * @docid
     * @publicName toggleMenuVisibility()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggleMenuVisibility(): TPromise<void>;
}

/** @public */
export type Options = dxSlideOutViewOptions;

/** @deprecated use Options instead */
export type IOptions = dxSlideOutViewOptions;
