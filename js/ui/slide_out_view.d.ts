import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxPromise
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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxSlideOutViewOptions extends WidgetOptions<dxSlideOutView> {
    /**
     * @docid
     * @type_function_param1 contentElement:DxElement
     * @default "content"
     * @public
     */
    contentTemplate?: template | ((contentElement: DxElement) => any);
    /**
     * @docid
     * @type Enums.SlideOutMenuPosition
     * @default "normal"
     * @public
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * @docid
     * @type_function_param1 menuElement:DxElement
     * @default null
     * @public
     */
    menuTemplate?: template | ((menuElement: DxElement) => any);
    /**
     * @docid
     * @default false
     * @public
     */
    menuVisible?: boolean;
    /**
     * @docid
     * @default true
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSlideOutView extends Widget {
    constructor(element: UserDefinedElement, options?: dxSlideOutViewOptions)
    /**
     * @docid
     * @publicName content()
     * @return DxElement
     * @public
     */
    content(): DxElement;
    /**
     * @docid
     * @publicName hideMenu()
     * @return Promise<void>
     * @public
     */
    hideMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName menuContent()
     * @return DxElement
     * @public
     */
    menuContent(): DxElement;
    /**
     * @docid
     * @publicName showMenu()
     * @return Promise<void>
     * @public
     */
    showMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggleMenuVisibility(showing)
     * @param1 showing:Boolean|undefined
     * @return Promise<void>
     * @public
     */
    toggleMenuVisibility(showing?: boolean): DxPromise<void>;
}

/** @public */
export type Properties = dxSlideOutViewOptions;

/** @deprecated use Properties instead */
export type Options = dxSlideOutViewOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSlideOutViewOptions;
