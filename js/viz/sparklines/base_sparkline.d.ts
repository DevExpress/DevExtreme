import {
    TElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import {
    ComponentEvent
} from '../../events/index';

import BaseWidget, {
    BaseWidgetExport,
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTitle,
    BaseWidgetTooltip
} from '../core/base_widget';

export interface BaseSparklineOptions<T = BaseSparkline> extends BaseWidgetOptions<T> {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    export?: BaseWidgetExport;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: ComponentEvent<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: ComponentEvent<T>) => void);
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    redrawOnResize?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    title?: BaseWidgetTitle | string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseSparklineTooltip;
}
export interface BaseSparklineTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseSparklineOptions.tooltip.contentTemplate
     * @type_function_param1 pointsInfo:object
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((pointsInfo: any, element: TElement) => string | TElement);
    /**
     * @docid BaseSparklineOptions.tooltip.customizeTooltip
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
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseSparklineOptions.tooltip.interactive
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidget
 * @prevFileNamespace DevExpress.viz
 */
export default class BaseSparkline extends BaseWidget {
    constructor(element: TElement, options?: BaseSparklineOptions)

    /**
     * @docid
     * @publicName hideLoadingIndicator()
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    hideLoadingIndicator(): void;
    /**
     * @docid
     * @publicName showLoadingIndicator()
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    showLoadingIndicator(): void;
}
