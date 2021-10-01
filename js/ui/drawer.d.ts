import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    template,
} from '../core/templates/template';

import {
    DxEvent,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    DrawerOpenedStateMode,
    DrawerPosition,
    DrawerRevealMode,
} from '../types/enums';

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
     * @default "shrink"
     * @public
     */
    openedStateMode?: DrawerOpenedStateMode;
    /**
     * @docid
     * @default "left"
     * @public
     */
    position?: DrawerPosition;
    /**
     * @docid
     * @default "slide"
     * @public
     */
    revealMode?: DrawerRevealMode;
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
     * @default 'panel'
     * @public
     */
    template?: template | ((Element: DxElement) => any);
}
/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDrawer extends Widget<dxDrawerOptions> {
    /**
     * @docid
     * @publicName content()
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
