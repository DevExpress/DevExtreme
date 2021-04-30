import {
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

export interface dxSlideOutViewOptions extends WidgetOptions<dxSlideOutView> {
    /**
     * @docid
     * @type_function_param1 contentElement:DxElement
     * @default "content"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((contentElement: DxElement) => any);
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
     * @type_function_param1 menuElement:DxElement
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuTemplate?: template | ((menuElement: DxElement) => any);
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
export default class dxSlideOutView extends Widget<dxSlideOutViewOptions> {
    /**
     * @docid
     * @publicName content()
     * @return DxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): DxElement;
    /**
     * @docid
     * @publicName hideMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName menuContent()
     * @return DxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuContent(): DxElement;
    /**
     * @docid
     * @publicName showMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggleMenuVisibility()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggleMenuVisibility(): DxPromise<void>;
}

/** @public */
export type Properties = dxSlideOutViewOptions;

/** @deprecated use Properties instead */
export type Options = dxSlideOutViewOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSlideOutViewOptions;
