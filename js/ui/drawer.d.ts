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
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
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
    target?: string | UserDefinedElement;
    /**
     * @docid
     * @type_function_param1 Element:DxElement
     * @default 'panel'
     * @prevFileNamespace DevExpress.ui
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
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDrawer extends Widget {
    constructor(element: UserDefinedElement, options?: dxDrawerOptions)
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
     * @publicName hide()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): DxPromise<void>;
    /**
     * @docid
     * @publicName show()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggle()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
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
