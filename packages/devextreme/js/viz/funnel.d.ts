import DataSource, { DataSourceLike } from '../data/data_source';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    HorizontalEdge,
    SingleMultipleOrNone,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
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
    BaseWidgetOptions,
    BaseWidgetTooltip,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    DashStyle,
    HatchDirection,
    LabelPosition,
    Palette,
    PaletteExtensionMode,
    ShiftLabelOverlap,
    TextOverflow,
    WordWrap,
    Font,
} from '../common/charts';

export {
    DashStyle,
    HatchDirection,
    HorizontalEdge,
    LabelPosition,
    Palette,
    PaletteExtensionMode,
    TextOverflow,
    ShiftLabelOverlap,
    WordWrap,
};

/** @public */
export type FunnelAlgorithm = 'dynamicHeight' | 'dynamicSlope';
/**
 * @deprecated Use ShiftLabelOverlap from 'devextreme/common/charts' instead
 */
export type FunnelLabelOverlap = ShiftLabelOverlap;

/**
 * @public
 * @docid FunnelLegendItem
 * @inherits BaseLegendItem
 * @type object
 * @namespace DevExpress.viz.dxFunnel
 */
export type LegendItem = FunnelLegendItem;

/**
 * @deprecated Use LegendItem instead
 * @namespace DevExpress.viz
 */
export interface FunnelLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @type dxFunnelItem
     * @public
     */
    item?: Item;
}

/**
 * @docid
 * @hidden
 */
export interface FunnelItemInfo {
  /**
   * @docid
   * @type dxFunnelItem
   */
  readonly item: Item;
}

/**
 * @docid _viz_funnel_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxFunnel>;

/**
 * @docid _viz_funnel_DrawnEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrawnEvent = EventInfo<dxFunnel>;

/**
 * @docid _viz_funnel_ExportedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ExportedEvent = EventInfo<dxFunnel>;

/**
 * @docid _viz_funnel_ExportingEvent
 * @public
 * @type object
 * @inherits EventInfo,ExportInfo
 */
export type ExportingEvent = EventInfo<dxFunnel> & ExportInfo;

/**
 * @docid _viz_funnel_FileSavingEvent
 * @public
 * @type object
 * @inherits FileSavingEventInfo
 */
export type FileSavingEvent = FileSavingEventInfo<dxFunnel>;

/**
 * @docid _viz_funnel_HoverChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,FunnelItemInfo
 */
export type HoverChangedEvent = EventInfo<dxFunnel> & FunnelItemInfo;

/**
 * @docid _viz_funnel_IncidentOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,IncidentInfo
 */
export type IncidentOccurredEvent = EventInfo<dxFunnel> & IncidentInfo;

/**
 * @docid _viz_funnel_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxFunnel>;

/**
 * @docid _viz_funnel_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,FunnelItemInfo
 */
export type ItemClickEvent = NativeEventInfo<dxFunnel, MouseEvent | PointerEvent> & FunnelItemInfo;

/**
 * @docid _viz_funnel_LegendClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,FunnelItemInfo
 */
export type LegendClickEvent = NativeEventInfo<dxFunnel, MouseEvent | PointerEvent> & FunnelItemInfo;

/**
 * @docid _viz_funnel_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxFunnel> & ChangedOptionInfo;

/**
 * @docid _viz_funnel_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,FunnelItemInfo
 */
export type SelectionChangedEvent = EventInfo<dxFunnel> & FunnelItemInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
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
      height?: number;
      /**
       * @docid
       * @default true
       */
      keepLabels?: boolean;
      /**
       * @docid
       * @default 80
       */
      width?: number;
    };
    /**
     * @docid
     * @default 'dynamicSlope'
     * @public
     */
    algorithm?: FunnelAlgorithm;
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
     * @notUsedInTheme
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
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
        color?: string | undefined;
        /**
         * @docid
         * @default false
         */
        visible?: boolean | undefined;
        /**
         * @docid
         * @default 2
         */
        width?: number | undefined;
      };
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
          color?: string | undefined;
          /**
           * @docid
           * @default undefined
           */
          visible?: boolean | undefined;
          /**
           * @docid
           * @default undefined
           */
          width?: number | undefined;
        };
        /**
         * @docid
         */
        hatching?: {
          /**
           * @docid
           * @default 'right'
           */
          direction?: HatchDirection;
          /**
           * @docid
           * @default 0.75
           */
          opacity?: number;
          /**
           * @docid
           * @default 6
           */
          step?: number;
          /**
           * @docid
           * @default 2
           */
          width?: number;
        };
      };
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
          color?: string | undefined;
          /**
           * @docid
           * @default undefined
           */
          visible?: boolean | undefined;
          /**
           * @docid
           * @default undefined
           */
          width?: number | undefined;
        };
        /**
         * @docid
         */
        hatching?: {
          /**
           * @docid
           * @default "right"
           */
          direction?: HatchDirection;
          /**
           * @docid
           * @default 0.5
           */
          opacity?: number;
          /**
           * @docid
           * @default 6
           */
          step?: number;
          /**
           * @docid
           * @default 2
           */
          width?: number;
        };
      };
    };
    /**
     * @docid
     * @public
     */
    label?: {
      /**
       * @docid
       */
      backgroundColor?: string;
      /**
       * @docid
       */
      border?: {
        /**
         * @docid
         * @default '#d3d3d3'
         */
        color?: string;
        /**
         * @docid
         * @default 'solid'
         */
        dashStyle?: DashStyle;
        /**
         * @docid
         * @default false
         */
        visible?: boolean;
        /**
         * @docid
         * @default 1
         */
        width?: number;
      };
      /**
       * @docid
       */
      connector?: {
        /**
         * @docid
         * @default undefined
         */
        color?: string | undefined;
        /**
         * @docid
         * @default 0.5
         */
        opacity?: number;
        /**
         * @docid
         * @default true
         */
        visible?: boolean;
        /**
         * @docid
         * @default 1
         */
        width?: number;
      };
      /**
       * @docid
       * @type_function_param1_field item:dxFunnelItem
       * @notUsedInTheme
       */
      customizeText?: ((itemInfo: { item?: Item; value?: number; valueText?: string; percent?: number; percentText?: string }) => string);
      /**
       * @docid
       * @default '#767676' &prop(color)
       */
      font?: Font;
      /**
       * @docid
       * @default undefined
       */
      format?: Format | undefined;
      /**
       * @docid
       * @default 'right'
       */
      horizontalAlignment?: HorizontalEdge;
      /**
       * @docid
       * @default 0
       */
      horizontalOffset?: number;
      /**
       * @docid
       * @default 'columns'
       */
      position?: LabelPosition;
      /**
       * @docid
       * @default false
       */
      showForZeroValues?: boolean;
      /**
       * @docid
       * @default 'ellipsis'
       */
      textOverflow?: TextOverflow;
      /**
       * @docid
       * @default true
       */
      visible?: boolean;
      /**
       * @docid
       * @default 'normal'
       */
      wordWrap?: WordWrap;
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
     * @type_function_param1 e:{viz/funnel:HoverChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onHoverChanged?: ((e: HoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/funnel:ItemClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/funnel:LegendClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/funnel:SelectionChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
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
     * @default "shift"
     * @public
     */
    resolveLabelOverlapping?: ShiftLabelOverlap;
    /**
     * @docid
     * @default 'single'
     * @public
     */
    selectionMode?: SingleMultipleOrNone;
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
    tooltip?: Tooltip;
    /**
     * @docid
     * @default 'val'
     * @public
     */
    valueField?: string;
}
/**
 * @public
 * @docid dxFunnelLegend
 */
export type Legend = BaseLegend & {
    /**
     * @docid dxFunnelOptions.legend.customizeHint
     * @type_function_param1_field item:dxFunnelItem
     * @public
     */
    customizeHint?: ((itemInfo: { item?: Item; text?: string }) => string);
    /**
     * @docid dxFunnelOptions.legend.customizeItems
     * @type_function_param1 items:Array<FunnelLegendItem>
     * @type_function_return Array<FunnelLegendItem>
     * @public
     */
    customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
    /**
     * @docid dxFunnelOptions.legend.customizeText
     * @type_function_param1_field item:dxFunnelItem
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((itemInfo: { item?: Item; text?: string }) => string);
    /**
     * @docid dxFunnelOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:FunnelLegendItem
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: LegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * @docid dxFunnelOptions.legend.visible
     * @default false
     * @public
     */
    visible?: boolean;
};
/**
 * @public
 * @docid dxFunnelTooltip
 */
export type Tooltip = BaseWidgetTooltip & {
    /**
     * @docid dxFunnelOptions.tooltip.contentTemplate
     * @type_function_param1_field item:dxFunnelItem
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((info: { item?: Item; value?: number; valueText?: string; percent?: number; percentText?: string }, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * @docid dxFunnelOptions.tooltip.customizeTooltip
     * @default undefined
     * @type_function_param1_field item:dxFunnelItem
     * @type_function_return object
     * @public
     */
    customizeTooltip?: ((info: { item?: Item; value?: number; valueText?: string; percent?: number; percentText?: string }) => any) | undefined;
};
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
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
    getAllItems(): Array<Item>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName hideTooltip()
     * @public
     */
    hideTooltip(): void;
}

/**
 * @public
 * @namespace DevExpress.viz.dxFunnel
 */
export type Item = dxFunnelItem;

/**
 * @deprecated Use Item instead
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
     * @public
     */
    getColor(): string;
    /**
     * @docid
     * @publicName hover(state)
     * @public
     */
    hover(state: boolean): void;
    /**
     * @docid
     * @publicName isHovered()
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isSelected()
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

// #region deprecated in v23.1

/** @deprecated Use Legend instead */
export type dxFunnelLegend = Legend;

/** @deprecated Use Tooltip instead */
export type dxFunnelTooltip = Tooltip;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onHoverChanged' | 'onItemClick' | 'onLegendClick' | 'onSelectionChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxFunnelOptions.onDisposing
 * @type_function_param1 e:{viz/funnel:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxFunnelOptions.onDrawn
 * @type_function_param1 e:{viz/funnel:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxFunnelOptions.onExported
 * @type_function_param1 e:{viz/funnel:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxFunnelOptions.onExporting
 * @type_function_param1 e:{viz/funnel:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxFunnelOptions.onFileSaving
 * @type_function_param1 e:{viz/funnel:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxFunnelOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/funnel:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxFunnelOptions.onInitialized
 * @type_function_param1 e:{viz/funnel:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxFunnelOptions.onOptionChanged
 * @type_function_param1 e:{viz/funnel:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
