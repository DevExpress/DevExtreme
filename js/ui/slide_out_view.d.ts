import {
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    SlideOutMenuPosition,
} from '../types/enums';

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
     * @default "content"
     * @public
     */
    contentTemplate?: template | ((contentElement: DxElement) => any);
    /**
     * @docid
     * @default "normal"
     * @public
     */
    menuPosition?: SlideOutMenuPosition;
    /**
     * @docid
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
 * @namespace DevExpress.ui
 * @deprecated dxDrawer
 * @public
 */
export default class dxSlideOutView extends Widget<dxSlideOutViewOptions> {
    /**
     * @docid
     * @publicName content()
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
