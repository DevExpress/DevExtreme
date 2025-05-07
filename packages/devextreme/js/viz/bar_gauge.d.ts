import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    Format,
} from '../localization';

import {
    BaseLegend,
    BaseLegendItem,
} from './common';

import BaseWidget, {
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    LabelOverlap,
    Palette,
    PaletteExtensionMode,
    ShiftLabelOverlap,
    Font,
} from '../common/charts';

export {
    LabelOverlap,
    Palette,
    PaletteExtensionMode,
    ShiftLabelOverlap,
};

/**
 * @docid
 * @type object
 * @namespace DevExpress.viz
 */
export interface BarGaugeBarInfo {
    /**
     * @docid
     * @public
     */
    color?: string;
    /**
     * @docid
     * @public
     */
    index?: number;
    /**
     * @docid
     * @public
     */
    value?: number;
}

/**
 * @public
 * @docid BarGaugeLegendItem
 * @namespace DevExpress.viz.dxBarGauge
 * @inherits BaseLegendItem
 * @type object
 */
export type LegendItem = BarGaugeLegendItem;

/**
 * @deprecated Use LegendItem instead
 * @namespace DevExpress.viz
 */
export interface BarGaugeLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @public
     */
    item?: BarGaugeBarInfo;
}

/**
 * @docid _viz_bar_gauge_TooltipInfo
 * @hidden
 */
export interface TooltipInfo {
    /**
     * @docid _viz_bar_gauge_TooltipInfo.target
     * @type object
     */
    target?: any;
}

/**
 * @docid _viz_bar_gauge_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxBarGauge>;

/**
 * @docid _viz_bar_gauge_DrawnEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrawnEvent = EventInfo<dxBarGauge>;

/**
 * @docid _viz_bar_gauge_ExportedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ExportedEvent = EventInfo<dxBarGauge>;

/**
 * @docid _viz_bar_gauge_ExportingEvent
 * @public
 * @type object
 * @inherits EventInfo,ExportInfo
 */
export type ExportingEvent = EventInfo<dxBarGauge> & ExportInfo;

/**
 * @docid _viz_bar_gauge_FileSavingEvent
 * @public
 * @type object
 * @inherits FileSavingEventInfo
 */
export type FileSavingEvent = FileSavingEventInfo<dxBarGauge>;

/**
 * @docid _viz_bar_gauge_IncidentOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,IncidentInfo
 */
export type IncidentOccurredEvent = EventInfo<dxBarGauge> & IncidentInfo;

/**
 * @docid _viz_bar_gauge_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxBarGauge>;

/**
 * @docid _viz_bar_gauge_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxBarGauge> & ChangedOptionInfo;

/**
 * @docid _viz_bar_gauge_TooltipHiddenEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_bar_gauge_TooltipInfo
 */
export type TooltipHiddenEvent = EventInfo<dxBarGauge> & TooltipInfo;

/**
 * @docid _viz_bar_gauge_TooltipShownEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_bar_gauge_TooltipInfo
 */
export type TooltipShownEvent = EventInfo<dxBarGauge> & TooltipInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
 */
export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
    /**
     * @docid
     * @inherits BaseGaugeOptions.animation
     * @public
     */
    animation?: any;
    /**
     * @docid
     * @default '#e0e0e0'
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @default 4
     * @public
     */
    barSpacing?: number;
    /**
     * @docid
     * @default 0
     * @notUsedInTheme
     * @public
     */
    baseValue?: number;
    /**
     * @docid
     * @default 100
     * @notUsedInTheme
     * @public
     */
    endValue?: number;
    /**
     * @docid
     * @public
     */
    geometry?: {
      /**
       * @docid
       * @default 315
       */
      endAngle?: number;
      /**
       * @docid
       * @default 225
       */
      startAngle?: number;
    };
    /**
     * @docid
     * @default undefined
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    centerTemplate?: template | ((component: dxBarGauge, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * @docid
     * @public
     */
    label?: {
      /**
       * @docid
       * @default undefined
       */
      connectorColor?: string | undefined;
      /**
       * @docid
       * @default 2
       */
      connectorWidth?: number;
      /**
       * @docid
       * @notUsedInTheme
       */
      customizeText?: ((barValue: { value?: number; valueText?: string }) => string);
      /**
       * @docid
       * @default 16 &prop(size)
       */
      font?: Font;
      /**
       * @docid
       * @default undefined
       */
      format?: Format | undefined;
      /**
       * @docid
       * @default 20
       */
      indent?: number;
      /**
       * @docid
       * @default true
       */
      visible?: boolean;
    };
    /**
     * @docid
     * @inherits BaseLegend
     * @type object
     * @public
     */
    legend?: Legend;
    /**
     * @docid
     * @type object
     * @public
     */
    loadingIndicator?: LoadingIndicator;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/bar_gauge:TooltipHiddenEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/bar_gauge:TooltipShownEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipShown?: ((e: TooltipShownEvent) => void);
    /**
     * @docid
     * @default "Material"
     * @public
     */
    palette?: Array<string> | Palette;
    /**
     * @docid
     * @default 'blend'
     * @public
     */
    paletteExtensionMode?: PaletteExtensionMode;
    /**
     * @docid
     * @default 0.3
     * @public
     */
    relativeInnerRadius?: number;
    /**
     * @docid
     * @default 'hide'
     * @public
     */
    resolveLabelOverlapping?: ShiftLabelOverlap;
    /**
     * @docid
     * @default 0
     * @notUsedInTheme
     * @public
     */
    startValue?: number;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: Tooltip;
    /**
     * @docid
     * @default []
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @public
     */
    values?: Array<number>;
}

/**
 * @public
 * @docid dxBarGaugeLegend
 */
export type Legend = BaseLegend & {
    /**
     * @docid dxBarGaugeOptions.legend.customizeHint
     * @public
     */
    customizeHint?: ((arg: { item?: BarGaugeBarInfo; text?: string }) => string);
    /**
     * @docid dxBarGaugeOptions.legend.customizeItems
     * @type_function_param1 items:Array<BarGaugeLegendItem>
     * @type_function_return Array<BarGaugeLegendItem>
     * @public
     */
    customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
    /**
     * @docid dxBarGaugeOptions.legend.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((arg: { item?: BarGaugeBarInfo; text?: string }) => string);
    /**
     * @docid dxBarGaugeOptions.legend.itemTextFormat
     * @default undefined
     * @public
     */
    itemTextFormat?: Format | undefined;
    /**
     * @docid dxBarGaugeOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:BarGaugeLegendItem
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: LegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * @docid dxBarGaugeOptions.legend.visible
     * @default false
     * @public
     */
    visible?: boolean;
};

/**
 * @public
 * @docid dxBarGaugeLoadingIndicator
 */
export type LoadingIndicator = BaseWidgetLoadingIndicator & {
    /**
     * @docid dxBarGaugeOptions.loadingIndicator.enabled
     * @hidden
     */
    enabled?: boolean;
};
/**
 * @public
 * @docid dxBarGaugeTooltip
 */
export type Tooltip = BaseWidgetTooltip & {
    /**
     * @docid dxBarGaugeOptions.tooltip.contentTemplate
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((scaleValue: { value?: number; valueText?: string; index?: number }, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * @docid dxBarGaugeOptions.tooltip.customizeTooltip
     * @default undefined
     * @type_function_return object
     * @public
     */
    customizeTooltip?: ((scaleValue: { value?: number; valueText?: string; index?: number }) => any) | undefined;
    /**
     * @docid dxBarGaugeOptions.tooltip.interactive
     * @default false
     * @public
     */
    interactive?: boolean;
};
/**
 * @docid
 * @inherits BaseWidget
 * @namespace DevExpress.viz
 * @public
 */
export default class dxBarGauge extends BaseWidget<dxBarGaugeOptions> {
    /**
     * @docid
     * @publicName values()
     * @public
     */
    values(): Array<number>;
    /**
     * @docid
     * @publicName values(newValues)
     * @public
     */
    values(values: Array<number>): void;
}

/** @public */
export type Properties = dxBarGaugeOptions;

/** @deprecated use Properties instead */
export type Options = dxBarGaugeOptions;

// #region deprecated in v23.1

/** @deprecated Use Legend instead */
export type dxBarGaugeLegend = Legend;

/** @deprecated Use LoadingIndicator instead */
export type dxBarGaugeLoadingIndicator = LoadingIndicator;

/** @deprecated Use Tooltip instead */
export type dxBarGaugeTooltip = Tooltip;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onTooltipHidden' | 'onTooltipShown'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxBarGaugeOptions.onDisposing
 * @type_function_param1 e:{viz/bar_gauge:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxBarGaugeOptions.onDrawn
 * @type_function_param1 e:{viz/bar_gauge:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxBarGaugeOptions.onExported
 * @type_function_param1 e:{viz/bar_gauge:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxBarGaugeOptions.onExporting
 * @type_function_param1 e:{viz/bar_gauge:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxBarGaugeOptions.onFileSaving
 * @type_function_param1 e:{viz/bar_gauge:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxBarGaugeOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/bar_gauge:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxBarGaugeOptions.onInitialized
 * @type_function_param1 e:{viz/bar_gauge:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxBarGaugeOptions.onOptionChanged
 * @type_function_param1 e:{viz/bar_gauge:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
