import { Format } from '../../localization';
import DOMComponent, {
    DOMComponentOptions
} from '../../core/dom_component';

import {
    EventInfo
} from '../../events/index';

/** @namespace DevExpress.ui */
export interface WidgetOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    accessKey?: string;
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
    hint?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
 * @module ui/widget/ui.widget
 * @export default
 * @hidden
 * @namespace DevExpress.ui
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
     * @param1 key:string
     * @param2 handler:function
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
export var dxItem: any;

/**
 * @docid
 * @type Enums.Format|string|function|Object
 * @type_function_param1 value:number|date
 * @type_function_return string
 * @default undefined
 * @section Common
 * @namespace DevExpress.ui
 * @deprecated Use import { Format } from 'devextreme/localization' instead
 * @public
 */
export type format = Format;
