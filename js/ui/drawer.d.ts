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
    DxEvent,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type DisposingEvent = EventInfo<dxDrawer>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDrawer>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDrawer> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxDrawerOptions extends WidgetOptions<dxDrawer> {
    /**
     * @docid
     * @default 400
     * @public
     */
    animationDuration?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
    /**
     * @docid
     * @default null
     * @public
     */
    maxSize?: number;
    /**
     * @docid
     * @default null
     * @public
     */
    minSize?: number;
    /**
     * @docid
     * @fires dxDrawerOptions.onOptionChanged
     * @default false
     * @public
     */
    opened?: boolean;
    /**
     * @docid
     * @type Enums.DrawerOpenedStateMode
     * @default "shrink"
     * @public
     */
    openedStateMode?: 'overlap' | 'shrink' | 'push';
    /**
     * @docid
     * @type Enums.DrawerPosition
     * @default "left"
     * @public
     */
    position?: 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';
    /**
     * @docid
     * @type Enums.DrawerRevealMode
     * @default "slide"
     * @public
     */
    revealMode?: 'slide' | 'expand';
    /**
     * @docid
     * @default false
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @deprecated
     * @public
     */
    target?: string | UserDefinedElement;
    /**
     * @docid
     * @type_function_param1 Element:DxElement
     * @default 'panel'
     * @public
     */
    template?: template | ((Element: DxElement) => any);
}
/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @module ui/drawer
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDrawer extends Widget {
    constructor(element: UserDefinedElement, options?: dxDrawerOptions)
    /**
     * @docid
     * @publicName content()
     * @return DxElement
     * @public
     */
    content(): DxElement;
    /**
     * @docid
     * @publicName hide()
     * @return Promise<void>
     * @public
     */
    hide(): DxPromise<void>;
    /**
     * @docid
     * @publicName show()
     * @return Promise<void>
     * @public
     */
    show(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggle()
     * @return Promise<void>
     * @public
     */
    toggle(): DxPromise<void>;
}

/** @public */
export type Properties = dxDrawerOptions;

/** @deprecated use Properties instead */
export type Options = dxDrawerOptions;

/** @deprecated use Properties instead */
export type IOptions = dxDrawerOptions;
