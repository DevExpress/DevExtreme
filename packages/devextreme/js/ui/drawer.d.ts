import {
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    template,
} from '../common';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import { DxEvent } from '../events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/** @public */
export type OpenedStateMode = 'overlap' | 'shrink' | 'push';
/** @public */
export type PanelLocation = 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';
/** @public */
export type RevealMode = 'slide' | 'expand';

/**
 * @docid _ui_drawer_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxDrawer>;

/**
 * @docid _ui_drawer_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxDrawer>;

/**
 * @docid _ui_drawer_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxDrawer> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
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
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
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
    openedStateMode?: OpenedStateMode;
    /**
     * @docid
     * @default "left"
     * @public
     */
    position?: PanelLocation;
    /**
     * @docid
     * @default "slide"
     * @public
     */
    revealMode?: RevealMode;
    /**
     * @docid
     * @default false
     * @public
     */
    shading?: boolean;
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

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onContentReady' | 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxDrawerOptions.onDisposing
 * @type_function_param1 e:{ui/drawer:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxDrawerOptions.onInitialized
 * @type_function_param1 e:{ui/drawer:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxDrawerOptions.onOptionChanged
 * @type_function_param1 e:{ui/drawer:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
