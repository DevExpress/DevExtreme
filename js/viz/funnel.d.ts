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
 */
export interface FunnelLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
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


export interface dxFunnelOptions extends BaseWidgetOptions<dxFunnel> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 80
       */
      height?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      keepLabels?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 80
       */
      width?: number
    };
    /**
     * @docid
     * @type Enums.FunnelAlgorithm
     * @default 'dynamicSlope'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    algorithm?: 'dynamicHeight' | 'dynamicSlope';
    /**
     * @docid
     * @default 'arg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid
     * @default 'color'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    colorField?: string;
    /**
     * @docid
     * @extends CommonVizDataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    inverted?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    item?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      border?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default #ffffff
         */
        color?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default false
         */
        visible?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 2
         */
        width?: number
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      hoverStyle?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         */
        border?: {
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default undefined
           */
          color?: string,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default undefined
           */
          visible?: boolean,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default undefined
           */
          width?: number
        },
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         */
        hatching?: {
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @type Enums.HatchingDirection
           * @default 'right'
           */
          direction?: HatchingDirectionType,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default 0.75
           */
          opacity?: number,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default 6
           */
          step?: number,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default 2
           */
          width?: number
        }
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      selectionStyle?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         */
        border?: {
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default undefined
           */
          color?: string,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default undefined
           */
          visible?: boolean,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default undefined
           */
          width?: number
        },
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         */
        hatching?: {
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @type Enums.HatchingDirection
           * @default "right"
           */
          direction?: HatchingDirectionType,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default 0.5
           */
          opacity?: number,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default 6
           */
          step?: number,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default 2
           */
          width?: number
        }
      }
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      backgroundColor?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      border?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default '#d3d3d3'
         */
        color?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @type Enums.DashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyleType,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default false
         */
        visible?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 1
         */
        width?: number
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      connector?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default undefined
         */
        color?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 0.5
         */
        opacity?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default true
         */
        visible?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 1
         */
        width?: number
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
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
       * @prevFileNamespace DevExpress.viz
       * @default '#767676' [prop](color)
       */
      font?: Font,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @extends CommonVizFormat
       */
      format?: format,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.HorizontalEdge
       * @default 'right'
       */
      horizontalAlignment?: 'left' | 'right',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      horizontalOffset?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.FunnelLabelPosition
       * @default 'columns'
       */
      position?: 'columns' | 'inside' | 'outside',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      showForZeroValues?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VizTextOverflow
       * @default 'ellipsis'
       */
      textOverflow?: VizTextOverflowType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      visible?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VizWordWrap
       * @default 'normal'
       */
      wordWrap?: WordWrapType
    };
    /**
     * @docid
     * @inherits BaseLegend
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxFunnelLegend;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    neckHeight?: number;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.viz
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
     * @prevFileNamespace DevExpress.viz
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
     * @prevFileNamespace DevExpress.viz
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
     * @prevFileNamespace DevExpress.viz
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid
     * @type Enums.FunnelResolveLabelOverlapping
     * @default "shift"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
    /**
     * @docid
     * @type Enums.SelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'multiple' | 'none' | 'single';
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sortData?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxFunnelTooltip;
    /**
     * @docid
     * @default 'val'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
}
export interface dxFunnelLegend extends BaseLegend {
    /**
     * @docid dxFunnelOptions.legend.customizeHint
     * @type_function_param1 itemInfo:object
     * @type_function_param1_field1 item:dxFunnelItem
     * @type_function_param1_field2 text:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
    /**
     * @docid dxFunnelOptions.legend.customizeItems
     * @type_function_param1 items:Array<FunnelLegendItem>
     * @type_function_return Array<FunnelLegendItem>
     * @prevFileNamespace DevExpress.viz
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
    /**
     * @docid dxFunnelOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:FunnelLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerTemplate?: template | ((legendItem: FunnelLegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid dxFunnelOptions.legend.visible
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
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
     * @prevFileNamespace DevExpress.viz
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => any);
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @module viz/funnel
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxFunnel extends BaseWidget {
    constructor(element: UserDefinedElement, options?: dxFunnelOptions)
    /**
     * @docid
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName getAllItems()
     * @return Array<dxFunnelItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllItems(): Array<dxFunnelItem>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
}

/**
 * @docid
 * @publicName Item
 */
export interface dxFunnelItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: string | Date | number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid
     * @publicName getColor()
     * @return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getColor(): string;
    /**
     * @docid
     * @publicName hover(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    percent?: number;
    /**
     * @docid
     * @publicName select(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    select(state: boolean): void;
    /**
     * @docid
     * @publicName showTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTooltip(): void;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
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
