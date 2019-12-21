import {
    dxElement
} from '../core/element';

import {
    event
} from '../events';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxSpeedDialActionOptions extends WidgetOptions<dxSpeedDialAction> {
    /**
     * @docid dxSpeedDialActionOptions.icon
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxSpeedDialActionOptions.index
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    index?: number;
    /**
     * @docid dxSpeedDialActionOptions.label
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    label?: string;
    /**
     * @docid dxSpeedDialActionOptions.onClick
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field1 event:event
     * @type_function_param1_field2 component:this
     * @type_function_param1_field3 element:dxElement
     * @type_function_param1_field4 actionElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: { event?: event, component?: dxSpeedDialAction, element?: dxElement, actionElement?: dxElement }) => any);
    /**
     * @docid dxSpeedDialActionOptions.onContentReady
     * @type function
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 actionElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContentReady?: ((e: { component?: dxSpeedDialAction, element?: dxElement, model?: any, actionElement?: dxElement }) => any);
    /**
     * @docid dxSpeedDialActionOptions.visible
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}
/**
 * @docid dxSpeedDialAction
 * @inherits Widget
 * @module ui/speed_dial_action
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSpeedDialAction extends Widget {
    constructor(element: Element, options?: dxSpeedDialActionOptions)
    constructor(element: JQuery, options?: dxSpeedDialActionOptions)
}

declare global {
interface JQuery {
    dxSpeedDialAction(): JQuery;
    dxSpeedDialAction(options: "instance"): dxSpeedDialAction;
    dxSpeedDialAction(options: string): any;
    dxSpeedDialAction(options: string, ...params: any[]): any;
    dxSpeedDialAction(options: dxSpeedDialActionOptions): JQuery;
}
}
export type Options = dxSpeedDialActionOptions;

/** @deprecated use Options instead */
export type IOptions = dxSpeedDialActionOptions;