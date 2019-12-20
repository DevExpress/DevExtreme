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
     * @docid BaseSparklineOptions.onTooltipHidden
     * @extends Action
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid BaseSparklineOptions.onTooltipShown
     * @extends Action
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid BaseSparklineOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseSparklineTooltip;
}
export interface BaseSparklineTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseSparklineOptions.tooltip.contentTemplate
     * @type template|function(pointsInfo, element)
     * @type_function_param1 pointsInfo:object
     * @type_function_param2 element:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((pointsInfo: any, element: dxElement) => string | Element | JQuery);
    /**
     * @docid BaseSparklineOptions.tooltip.customizeTooltip
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
     * @docid BaseSparklineOptions.tooltip.enabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
}
/**
 * @docid BaseSparkline
 * @type object
 * @hidden
 * @inherits BaseWidget
 * @prevFileNamespace DevExpress.viz
 */
export default class BaseSparkline extends BaseWidget {
    constructor(element: Element, options?: BaseSparklineOptions)
    constructor(element: JQuery, options?: BaseSparklineOptions)
}
