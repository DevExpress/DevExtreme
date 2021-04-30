import {
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import {
    EventInfo
} from '../../events/index';

import BaseWidget, {
    BaseWidgetExport,
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTitle,
    BaseWidgetTooltip
} from '../core/base_widget';

export interface BaseSparklineOptions<TComponent> extends BaseWidgetOptions<TComponent> {
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
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: EventInfo<TComponent>) => void);
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
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((pointsInfo: any, element: DxElement) => string | UserDefinedElement);
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
export default class BaseSparkline<TProperties> extends BaseWidget<TProperties> {
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
