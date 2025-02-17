import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
} from '../../common';

import {
    EventInfo,
} from '../../common/core/events';

import BaseWidget, {
    BaseWidgetExport,
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTitle,
    BaseWidgetTooltip,
} from '../core/base_widget';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseSparklineOptions<TComponent> extends BaseWidgetOptions<TComponent> {
    /**
     * Configures the exporting and printing features.
     */
    export?: BaseWidgetExport;
    /**
     * Configures the loading indicator.
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * A function that is executed when a tooltip becomes hidden.
     */
    onTooltipHidden?: ((e: EventInfo<TComponent>) => void);
    /**
     * A function that is executed when a tooltip appears.
     */
    onTooltipShown?: ((e: EventInfo<TComponent>) => void);
    /**
     * Specifies whether to redraw the UI component when the size of the container changes or a mobile device rotates.
     */
    redrawOnResize?: boolean;
    /**
     * Configures the UI component&apos;s title.
     */
    title?: BaseWidgetTitle | string;
    /**
     * Configures the tooltip.
     */
    tooltip?: BaseSparklineTooltip;
}
/**
 * Configures the tooltip.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseSparklineTooltip extends BaseWidgetTooltip {
    /**
     * Specifies a custom template for tooltips.
     */
    contentTemplate?: template | ((pointsInfo: any, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * Allows you to change tooltip appearance.
     */
    customizeTooltip?: ((pointsInfo: any) => any) | undefined;
    /**
     * Specifies whether a tooltip is enabled.
     */
    enabled?: boolean;
    /**
     * 
     */
    interactive?: boolean;
}
/**
 * Overridden by descriptions for particular UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class BaseSparkline<TProperties> extends BaseWidget<TProperties> {
    /**
     * Hides the loading indicator.
     */
    hideLoadingIndicator(): void;
    /**
     * Shows the loading indicator.
     */
    showLoadingIndicator(): void;
}
