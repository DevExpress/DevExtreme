import {
    dxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip
} from '../core/base_widget';

export interface BaseSparklineOptions<T = BaseSparkline> extends BaseWidgetOptions<T> {
    /**
     * @docid
     * @extends Action
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseSparklineTooltip;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidgetTooltip
 * @type object
 */
export interface BaseSparklineTooltip extends BaseWidgetTooltip {
    /**
     * @docid
     * @type template|function(pointsInfo, element)
     * @type_function_param1 pointsInfo:object
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((pointsInfo: any, element: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type function(pointsInfo)
     * @type_function_param1 pointsInfo:object
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((pointsInfo: any) => any);
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @type object
 * @hidden
 * @inherits BaseWidget
 * @prevFileNamespace DevExpress.viz
 */
export default class BaseSparkline extends BaseWidget {
    constructor(element: Element, options?: BaseSparklineOptions)
    constructor(element: JQuery, options?: BaseSparklineOptions)
}
