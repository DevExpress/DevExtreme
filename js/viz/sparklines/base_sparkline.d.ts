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

/** @namespace DevExpress.viz */
export interface BaseSparklineOptions<TComponent> extends BaseWidgetOptions<TComponent> {
    /**
     * @docid
     * @type object
     * @hidden
     */
    export?: BaseWidgetExport;
    /**
     * @docid
     * @type object
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
     * @public
     */
    onTooltipShown?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @hidden
     */
    redrawOnResize?: boolean;
    /**
     * @docid
     * @type object
     * @hidden
     */
    title?: BaseWidgetTitle | string;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: BaseSparklineTooltip;
}
/** @namespace DevExpress.viz */
export interface BaseSparklineTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseSparklineOptions.tooltip.contentTemplate
     * @type_function_param1 pointsInfo:object
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((pointsInfo: any, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid BaseSparklineOptions.tooltip.customizeTooltip
     * @type_function_param1 pointsInfo:object
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((pointsInfo: any) => any);
    /**
     * @docid BaseSparklineOptions.tooltip.enabled
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseSparklineOptions.tooltip.interactive
     * @default false
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidget
 * @namespace DevExpress.viz
 */
export default class BaseSparkline<TProperties> extends BaseWidget<TProperties> {
    /**
     * @docid
     * @publicName hideLoadingIndicator()
     * @hidden
     */
    hideLoadingIndicator(): void;
    /**
     * @docid
     * @publicName showLoadingIndicator()
     * @hidden
     */
    showLoadingIndicator(): void;
}
