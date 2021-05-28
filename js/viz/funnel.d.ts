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

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    format
} from '../ui/widget/ui.widget';

import {
    BaseLegend,
    BaseLegendItem,
    DashStyleType,
    HatchingDirectionType
} from './common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    WordWrapType,
    VizTextOverflowType,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

/**
 * @docid
 * @inherits BaseLegendItem
 * @type object
 * @namespace DevExpress.viz
 */
export interface FunnelLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @public
     */
    item?: dxFunnelItem;
}

interface FunnelItemInfo {
  readonly item: dxFunnelItem
}

/** @public */
export type DisposingEvent = EventInfo<dxFunnel>;

/** @public */
export type DrawnEvent = EventInfo<dxFunnel>;

/** @public */
export type ExportedEvent = EventInfo<dxFunnel>;

/** @public */
export type ExportingEvent = EventInfo<dxFunnel> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxFunnel>;

/** @public */
export type HoverChangedEvent = EventInfo<dxFunnel> & FunnelItemInfo;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxFunnel> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxFunnel>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxFunnel> & FunnelItemInfo;

/** @public */
export type LegendClickEvent = NativeEventInfo<dxFunnel> & FunnelItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxFunnel> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxFunnel> & FunnelItemInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 */
export interface dxFunnelOptions extends BaseWidgetOptions<dxFunnel> {
    /**
     * @docid
     * @public
     */
    adaptiveLayout?: {
      /**
       * @docid
       * @default 80
       */
      height?: number,
      /**
       * @docid
       * @default true
       */
      keepLabels?: boolean,
      /**
       * @docid
       * @default 80
       */
      width?: number
    };
    /**
     * @docid
     * @type Enums.FunnelAlgorithm
     * @default 'dynamicSlope'
     * @public
     */
    algorithm?: 'dynamicHeight' | 'dynamicSlope';
    /**
     * @docid
     * @default 'arg'
     * @public
     */
    argumentField?: string;
    /**
     * @docid
     * @default 'color'
     * @public
     */
    colorField?: string;
    /**
     * @docid
     * @extends CommonVizDataSource
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    inverted?: boolean;
    /**
     * @docid
     * @public
     */
    item?: {
      /**
       * @docid
       */
      border?: {
        /**
         * @docid
         * @default #ffffff
         */
        color?: string,
        /**
         * @docid
         * @default false
         */
        visible?: boolean,
        /**
         * @docid
         * @default 2
         */
        width?: number
      },
      /**
       * @docid
       */
      hoverStyle?: {
        /**
         * @docid
         */
        border?: {
          /**
           * @docid
           * @default undefined
           */
          color?: string,
          /**
           * @docid
           * @default undefined
           */
          visible?: boolean,
          /**
           * @docid
           * @default undefined
           */
          width?: number
        },
        /**
         * @docid
         */
        hatching?: {
          /**
           * @docid
           * @type Enums.HatchingDirection
           * @default 'right'
           */
          direction?: HatchingDirectionType,
          /**
           * @docid
           * @default 0.75
           */
          opacity?: number,
          /**
           * @docid
           * @default 6
           */
          step?: number,
          /**
           * @docid
           * @default 2
           */
          width?: number
        }
      },
      /**
       * @docid
       */
      selectionStyle?: {
        /**
         * @docid
         */
        border?: {
          /**
           * @docid
           * @default undefined
           */
          color?: string,
          /**
           * @docid
           * @default undefined
           */
          visible?: boolean,
          /**
           * @docid
           * @default undefined
           */
          width?: number
        },
        /**
         * @docid
         */
        hatching?: {
          /**
           * @docid
           * @type Enums.HatchingDirection
           * @default "right"
           */
          direction?: HatchingDirectionType,
          /**
           * @docid
           * @default 0.5
           */
          opacity?: number,
          /**
           * @docid
           * @default 6
           */
          step?: number,
          /**
           * @docid
           * @default 2
           */
          width?: number
        }
      }
    };
    /**
     * @docid
     * @public
     */
    label?: {
      /**
       * @docid
       */
      backgroundColor?: string,
      /**
       * @docid
       */
      border?: {
        /**
         * @docid
         * @default '#d3d3d3'
         */
        color?: string,
        /**
         * @docid
         * @type Enums.DashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyleType,
        /**
         * @docid
         * @default false
         */
        visible?: boolean,
        /**
         * @docid
         * @default 1
         */
        width?: number
      },
      /**
       * @docid
       */
      connector?: {
        /**
         * @docid
         * @default undefined
         */
        color?: string,
        /**
         * @docid
         * @default 0.5
         */
        opacity?: number,
        /**
         * @docid
         * @default true
         */
        visible?: boolean,
        /**
         * @docid
         * @default 1
         */
        width?: number
      },
      /**
       * @docid
       * @type_function_param1 itemInfo:object
       * @type_function_param1_field1 item:dxFunnelItem
       * @type_function_param1_field2 value:Number
       * @type_function_param1_field3 valueText:string
       * @type_function_param1_field4 percent:Number
       * @type_function_param1_field5 percentText:string
       * @type_function_return string
       * @notUsedInTheme
       */
      customizeText?: ((itemInfo: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => string),
      /**
       * @docid
       * @default '#767676' [prop](color)
       */
      font?: Font,
      /**
       * @docid
       * @extends CommonVizFormat
       */
      format?: format,
      /**
       * @docid
       * @type Enums.HorizontalEdge
       * @default 'right'
       */
      horizontalAlignment?: 'left' | 'right',
      /**
       * @docid
       * @default 0
       */
      horizontalOffset?: number,
      /**
       * @docid
       * @type Enums.FunnelLabelPosition
       * @default 'columns'
       */
      position?: 'columns' | 'inside' | 'outside',
      /**
       * @docid
       * @default false
       */
      showForZeroValues?: boolean,
      /**
       * @docid
       * @type Enums.VizTextOverflow
       * @default 'ellipsis'
       */
      textOverflow?: VizTextOverflowType,
      /**
       * @docid
       * @default true
       */
      visible?: boolean,
      /**
       * @docid
       * @type Enums.VizWordWrap
       * @default 'normal'
       */
      wordWrap?: WordWrapType
    };
    /**
     * @docid
     * @inherits BaseLegend
     * @type object
     * @public
     */
    legend?: dxFunnelLegend;
    /**
     * @docid
     * @default 0
     * @public
     */
    neckHeight?: number;
    /**
     * @docid
     * @default 0
     * @public
     */
    neckWidth?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFunnel
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 item:dxFunnelItem
     * @notUsedInTheme
     * @action
     * @public
     */
    onHoverChanged?: ((e: HoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFunnel
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 item:dxFunnelItem
     * @notUsedInTheme
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFunnel
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 item:dxFunnelItem
     * @notUsedInTheme
     * @action
     * @public
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFunnel
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 item:dxFunnelItem
     * @notUsedInTheme
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid
     * @type Enums.FunnelResolveLabelOverlapping
     * @default "shift"
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
    /**
     * @docid
     * @type Enums.SelectionMode
     * @default 'single'
     * @public
     */
    selectionMode?: 'multiple' | 'none' | 'single';
    /**
     * @docid
     * @default true
     * @public
     */
    sortData?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: dxFunnelTooltip;
    /**
     * @docid
     * @default 'val'
     * @public
     */
    valueField?: string;
}
/** @namespace DevExpress.viz */
export interface dxFunnelLegend extends BaseLegend {
    /**
     * @docid dxFunnelOptions.legend.customizeHint
     * @type_function_param1 itemInfo:object
     * @type_function_param1_field1 item:dxFunnelItem
     * @type_function_param1_field2 text:string
     * @type_function_return string
     * @public
     */
    customizeHint?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
    /**
     * @docid dxFunnelOptions.legend.customizeItems
     * @type_function_param1 items:Array<FunnelLegendItem>
     * @type_function_return Array<FunnelLegendItem>
     * @public
     */
    customizeItems?: ((items: Array<FunnelLegendItem>) => Array<FunnelLegendItem>);
    /**
     * @docid dxFunnelOptions.legend.customizeText
     * @type_function_param1 itemInfo:object
     * @type_function_param1_field1 item:dxFunnelItem
     * @type_function_param1_field2 text:string
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
    /**
     * @docid dxFunnelOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:FunnelLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: FunnelLegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid dxFunnelOptions.legend.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxFunnelTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxFunnelOptions.tooltip.contentTemplate
     * @type_function_param1 info:object
     * @type_function_param1_field1 item:dxFunnelItem
     * @type_function_param1_field2 value:Number
     * @type_function_param1_field3 valueText:string
     * @type_function_param1_field4 percent:Number
     * @type_function_param1_field5 percentText:string
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid dxFunnelOptions.tooltip.customizeTooltip
     * @default undefined
     * @type_function_param1 info:object
     * @type_function_param1_field1 item:dxFunnelItem
     * @type_function_param1_field2 value:Number
     * @type_function_param1_field3 valueText:string
     * @type_function_param1_field4 percent:Number
     * @type_function_param1_field5 percentText:string
     * @type_function_return object
     * @public
     */
    customizeTooltip?: ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => any);
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @module viz/funnel
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxFunnel extends BaseWidget<dxFunnelOptions> {
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName getAllItems()
     * @return Array<dxFunnelItem>
     * @public
     */
    getAllItems(): Array<dxFunnelItem>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName hideTooltip()
     * @public
     */
    hideTooltip(): void;
}

/**
 * @docid
 * @publicName Item
 * @namespace DevExpress.viz
 */
export interface dxFunnelItem {
    /**
     * @docid
     * @public
     */
    argument?: string | Date | number;
    /**
     * @docid
     * @public
     */
    data?: any;
    /**
     * @docid
     * @publicName getColor()
     * @return string
     * @public
     */
    getColor(): string;
    /**
     * @docid
     * @publicName hover(state)
     * @param1 state:boolean
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid
     * @publicName isHovered()
     * @return boolean
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @return boolean
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @public
     */
    percent?: number;
    /**
     * @docid
     * @publicName select(state)
     * @param1 state:boolean
     * @public
     */
    select(state: boolean): void;
    /**
     * @docid
     * @publicName showTooltip()
     * @public
     */
    showTooltip(): void;
    /**
     * @docid
     * @public
     */
    value?: number;
}

/** @public */
export type Properties = dxFunnelOptions;

/** @deprecated use Properties instead */
export type Options = dxFunnelOptions;

/** @deprecated use Properties instead */
export type IOptions = dxFunnelOptions;
