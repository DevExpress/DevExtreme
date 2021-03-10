import {
    TElement
} from '../core/element';

import {
    TEvent
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxSpeedDialActionOptions extends WidgetOptions<dxSpeedDialAction> {
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    index?: number;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    label?: string;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 event:event
     * @type_function_param1_field2 component:this
     * @type_function_param1_field3 element:dxElement
     * @type_function_param1_field4 actionElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: { event?: TEvent, component?: dxSpeedDialAction, element?: TElement, actionElement?: TElement }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 actionElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContentReady?: ((e: { component?: dxSpeedDialAction, element?: TElement, model?: any, actionElement?: TElement }) => any);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/speed_dial_action
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSpeedDialAction extends Widget {
    constructor(element: TElement, options?: dxSpeedDialActionOptions)
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
