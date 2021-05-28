import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    PaletteType,
    PaletteExtensionModeType
} from './palette';

import {
    template
} from '../core/templates/template';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    format
} from '../ui/widget/ui.widget';

import {
    BaseLegend,
    BaseLegendItem
} from './common';

import BaseWidget, {
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

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
 * @docid
 * @inherits BaseLegendItem
 * @type object
 * @namespace DevExpress.viz
 */
export interface BarGaugeLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @public
     */
    item?: BarGaugeBarInfo;
}

export interface TooltipInfo {
    target?: any;
}

/** @public */
export type DisposingEvent = EventInfo<dxBarGauge>;

/** @public */
export type DrawnEvent = EventInfo<dxBarGauge>;

/** @public */
export type ExportedEvent = EventInfo<dxBarGauge>;

/** @public */
export type ExportingEvent = EventInfo<dxBarGauge> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxBarGauge>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxBarGauge> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxBarGauge>;

/** @public */
export type OptionChangedEvent = EventInfo<dxBarGauge> & ChangedOptionInfo;

/** @public */
export type TooltipHiddenEvent = EventInfo<dxBarGauge> & TooltipInfo;

/** @public */
export type TooltipShownEvent = EventInfo<dxBarGauge> & TooltipInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
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
      endAngle?: number,
      /**
       * @docid
       * @default 225
       */
      startAngle?: number
    };
    /**
     * @docid
     * @public
     */
    label?: {
      /**
       * @docid
       * @default undefined
       */
      connectorColor?: string,
      /**
       * @docid
       * @default 2
       */
      connectorWidth?: number,
      /**
       * @docid
       * @type_function_param1 barValue:object
       * @type_function_param1_field1 value:Number
       * @type_function_param1_field2 valueText:string
       * @type_function_return string
       * @notUsedInTheme
       */
      customizeText?: ((barValue: { value?: number, valueText?: string }) => string),
      /**
       * @docid
       * @default 16 [prop](size)
       */
      font?: Font,
      /**
       * @docid
       * @extends CommonVizFormat
       */
      format?: format,
      /**
       * @docid
       * @default 20
       */
      indent?: number,
      /**
       * @docid
       * @default true
       */
      visible?: boolean
    };
    /**
     * @docid
     * @inherits BaseLegend
     * @type object
     * @public
     */
    legend?: dxBarGaugeLegend;
    /**
     * @docid
     * @type object
     * @public
     */
    loadingIndicator?: dxBarGaugeLoadingIndicator;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxBarGauge
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxBarGauge
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipShown?: ((e: TooltipShownEvent) => void);
    /**
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @default 'blend'
     * @type Enums.VizPaletteExtensionMode
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid
     * @default 0.3
     * @public
     */
    relativeInnerRadius?: number;
    /**
     * @docid
     * @type Enums.BarGaugeResolveLabelOverlapping
     * @default 'hide'
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none';
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
    tooltip?: dxBarGaugeTooltip;
    /**
     * @docid
     * @default []
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @public
     */
    values?: Array<number>;
}
/** @namespace DevExpress.viz */
export interface dxBarGaugeLegend extends BaseLegend {
    /**
     * @docid dxBarGaugeOptions.legend.customizeHint
     * @type_function_param1 arg:object
     * @type_function_param1_field1 item:BarGaugeBarInfo
     * @type_function_param1_field2 text:string
     * @type_function_return string
     * @public
     */
    customizeHint?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
    /**
     * @docid dxBarGaugeOptions.legend.customizeItems
     * @type_function_param1 items:Array<BarGaugeLegendItem>
     * @type_function_return Array<BarGaugeLegendItem>
     * @public
     */
    customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>);
    /**
     * @docid dxBarGaugeOptions.legend.customizeText
     * @type_function_param1 arg:object
     * @type_function_param1_field1 item:BarGaugeBarInfo
     * @type_function_param1_field2 text:string
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
    /**
     * @docid dxBarGaugeOptions.legend.itemTextFormat
     * @extends CommonVizFormat
     * @public
     */
    itemTextFormat?: format;
    /**
     * @docid dxBarGaugeOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:BarGaugeLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: BarGaugeLegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid dxBarGaugeOptions.legend.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxBarGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    /**
     * @docid dxBarGaugeOptions.loadingIndicator.enabled
     * @hidden
     */
    enabled?: boolean
}
/** @namespace DevExpress.viz */
export interface dxBarGaugeTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxBarGaugeOptions.tooltip.contentTemplate
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 index:number
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((scaleValue: { value?: number, valueText?: string, index?: number }, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid dxBarGaugeOptions.tooltip.customizeTooltip
     * @default undefined
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 index:number
     * @type_function_return object
     * @public
     */
    customizeTooltip?: ((scaleValue: { value?: number, valueText?: string, index?: number }) => any);
    /**
     * @docid dxBarGaugeOptions.tooltip.interactive
     * @default false
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @inherits BaseWidget
 * @module viz/bar_gauge
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxBarGauge extends BaseWidget<dxBarGaugeOptions> {
    /**
     * @docid
     * @publicName values()
     * @return Array<number>
     * @public
     */
    values(): Array<number>;
    /**
     * @docid
     * @publicName values(newValues)
     * @param1 values:Array<number>
     * @public
     */
    values(values: Array<number>): void;
}

/** @public */
export type Properties = dxBarGaugeOptions;

/** @deprecated use Properties instead */
export type Options = dxBarGaugeOptions;

/** @deprecated use Properties instead */
export type IOptions = dxBarGaugeOptions;
