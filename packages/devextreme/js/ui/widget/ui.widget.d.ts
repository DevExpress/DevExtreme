import { Format } from '../../localization';
import DOMComponent, {
    DOMComponentOptions,
} from '../../core/dom_component';

import {
    EventInfo,
} from '../../common/core/events';

/**
 * @namespace DevExpress.ui
 * @docid
 * @type object
 */
export interface WidgetOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    accessKey?: string | undefined;
    /**
     * @docid
     * @default false
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    hint?: string | undefined;
    /**
     * @docid
     * @default false
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @action
     * @public
     */
    onContentReady?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default 0
     * @public
     */
    tabIndex?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @inherits DOMComponent
 * @hidden
 * @namespace DevExpress.ui
 * @options WidgetOptions
 */
export default class Widget<TProperties> extends DOMComponent<TProperties> {
    /**
     * @docid
     * @publicName focus()
     * @public
     */
    focus(): void;
    /**
     * @docid
     * @publicName registerKeyHandler(key, handler)
     * @public
     */
    registerKeyHandler(key: string, handler: Function): void;
    /**
     * @docid
     * @publicName repaint()
     * @public
     */
    repaint(): void;
}

/**
 * @const dxItem
 * @section uiWidgetMarkupComponents
 * @public
 * @namespace DevExpress.ui
 */
// eslint-disable-next-line vars-on-top, import/no-mutable-exports, no-var, @typescript-eslint/init-declarations, @typescript-eslint/no-explicit-any
export var dxItem: any;

/**
 * @docid
 * @deprecated
 */
export type format = Format;
