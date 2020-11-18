import '../jquery_augmentation';

import {
    dxElement
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
    event
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
    VizTextOverflowType
} from './core/base_widget';

/**
* @docid
* @type object
* @inherits BaseLegendItem
*/
export interface FunnelLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @type dxFunnelItem
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    item?: dxFunnelItem;
}

export interface dxFunnelOptions extends BaseWidgetOptions<dxFunnel> {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    algorithm?: 'dynamicHeight' | 'dynamicSlope';
    /**
     * @docid
     * @type string
     * @default 'arg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid
     * @type string
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
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    inverted?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
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
     * @type object
     * @prevFileNamespace DevExpress.viz
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
      * @type function(itemInfo)
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
      * @type Font
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxFunnelLegend;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    neckHeight?: number;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    neckWidth?: number;
    /**
     * @docid
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 item:dxFunnelItem
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onHoverChanged?: ((e: { component?: dxFunnel, element?: dxElement, model?: any, item?: dxFunnelItem }) => any);
    /**
     * @docid
     * @extends Action
     * @type function|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 item:dxFunnelItem
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onItemClick?: ((e: { component?: dxFunnel, element?: dxElement, model?: any, event?: event, item?: dxFunnelItem }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 item:dxFunnelItem
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: { component?: dxFunnel, element?: dxElement, model?: any, event?: event, item?: dxFunnelItem }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 item:dxFunnelItem
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxFunnel, element?: dxElement, model?: any, item?: dxFunnelItem }) => any);
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
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sortData?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxFunnelTooltip;
    /**
     * @docid
     * @type string
     * @default 'val'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
}
/**
 * @docid
 * @hidden
 * @inherits BaseLegend
 */
export interface dxFunnelLegend extends BaseLegend {
    /**
     * @docid
     * @type function(itemInfo)
     * @type_function_param1 itemInfo:object
     * @type_function_param1_field1 item:dxFunnelItem
     * @type_function_param1_field2 text:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
    /**
     * @docid
     * @type function(items)
     * @type_function_param1 items:Array<FunnelLegendItem>
     * @type_function_return Array<FunnelLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<FunnelLegendItem>) => Array<FunnelLegendItem>);
    /**
     * @docid
     * @type function(itemInfo)
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
     * @docid
     * @type template|function
     * @default undefined
     * @type_function_param1 legendItem:FunnelLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerTemplate?: template | ((legendItem: FunnelLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidgetTooltip
 * @type object
 */
export interface dxFunnelTooltip extends BaseWidgetTooltip {
    /**
     * @docid
     * @type template|function(info, element)
     * @type_function_param1 info:object
     * @type_function_param1_field1 item:dxFunnelItem
     * @type_function_param1_field2 value:Number
     * @type_function_param1_field3 valueText:string
     * @type_function_param1_field4 percent:Number
     * @type_function_param1_field5 percentText:string
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }, element: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @default undefined
     * @type function(info)
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
    constructor(element: Element, options?: dxFunnelOptions)
    constructor(element: JQuery, options?: dxFunnelOptions)
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
     * @type string|Date|number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: string | Date | number;
    /**
     * @docid
     * @type object
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
     * @type number
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
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number;
}

declare global {
interface JQuery {
    dxFunnel(): JQuery;
    dxFunnel(options: "instance"): dxFunnel;
    dxFunnel(options: string): any;
    dxFunnel(options: string, ...params: any[]): any;
    dxFunnel(options: dxFunnelOptions): JQuery;
}
}
export type Options = dxFunnelOptions;

/** @deprecated use Options instead */
export type IOptions = dxFunnelOptions;
