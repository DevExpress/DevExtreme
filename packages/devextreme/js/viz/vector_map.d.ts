import DataSource, { DataSourceLike } from '../data/data_source';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    HorizontalAlignment,
    SingleMultipleOrNone,
    VerticalEdge,
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
    BaseWidgetMargin,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    BaseWidgetAnnotationConfig,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    VectorMapProjection,
    VectorMapProjectionConfig,
} from './vector_map/projection';

import {
    Palette,
    Font,
} from '../common/charts';

export {
    SingleMultipleOrNone,
    Palette,
    VectorMapProjection,
    VerticalEdge,
};

/** @public */
export type VectorMapLayerType = 'area' | 'line' | 'marker';
/** @public */
export type VectorMapMarkerShape = 'circle' | 'square';
/** @public */
export type VectorMapMarkerType = 'bubble' | 'dot' | 'image' | 'pie';

/**
 * @docid _viz_vector_map_TooltipInfo
 * @hidden
 */
export interface TooltipInfo {
    /** @docid _viz_vector_map_TooltipInfo.target */
    target?: MapLayerElement | dxVectorMapAnnotationConfig;
}

/**
 * @docid _viz_vector_map_CenterChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type CenterChangedEvent = EventInfo<dxVectorMap> & {
    /**
     * @docid _viz_vector_map_CenterChangedEvent.center
     * @type Array<number>
     */
    readonly center: Array<number>;
};

/**
 * @docid _viz_vector_map_ClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ClickEvent = NativeEventInfo<dxVectorMap, MouseEvent | PointerEvent> & {
    /** @docid _viz_vector_map_ClickEvent.target */
    readonly target: MapLayerElement;
};

/**
 * @docid _viz_vector_map_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxVectorMap>;

/**
 * @docid _viz_vector_map_DrawnEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrawnEvent = EventInfo<dxVectorMap>;

/**
 * @docid _viz_vector_map_ExportedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ExportedEvent = EventInfo<dxVectorMap>;

/**
 * @docid _viz_vector_map_ExportingEvent
 * @public
 * @type object
 * @inherits EventInfo,ExportInfo
 */
export type ExportingEvent = EventInfo<dxVectorMap> & ExportInfo;

/**
 * @docid _viz_vector_map_FileSavingEvent
 * @public
 * @type object
 * @inherits FileSavingEventInfo
 */
export type FileSavingEvent = FileSavingEventInfo<dxVectorMap>;

/**
 * @docid _viz_vector_map_IncidentOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,IncidentInfo
 */
export type IncidentOccurredEvent = EventInfo<dxVectorMap> & IncidentInfo;

/**
 * @docid _viz_vector_map_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxVectorMap>;

/**
 * @docid _viz_vector_map_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxVectorMap> & ChangedOptionInfo;

/**
 * @docid _viz_vector_map_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectionChangedEvent = EventInfo<dxVectorMap> & {
    /** @docid _viz_vector_map_SelectionChangedEvent.target */
    readonly target: MapLayerElement;
};

/**
 * @docid _viz_vector_map_TooltipHiddenEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_vector_map_TooltipInfo
 */
export type TooltipHiddenEvent = EventInfo<dxVectorMap> & TooltipInfo;

/**
 * @docid _viz_vector_map_TooltipShownEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_vector_map_TooltipInfo
 */
export type TooltipShownEvent = EventInfo<dxVectorMap> & TooltipInfo;

/**
 * @docid _viz_vector_map_ZoomFactorChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ZoomFactorChangedEvent = EventInfo<dxVectorMap> & {
    /** @docid _viz_vector_map_ZoomFactorChangedEvent.zoomFactor */
    readonly zoomFactor: number;
};

/**
 * @docid
 * @publicName Layer
 * @namespace DevExpress.viz
 */
export interface MapLayer {
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @public
     */
    elementType?: string;
    /**
     * @docid
     * @publicName getDataSource()
     * @public
     */
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getElements()
     * @public
     */
    getElements(): Array<MapLayerElement>;
    /**
     * @docid
     * @public
     */
    index?: number;
    /**
     * @docid
     * @public
     */
    name?: string;
    /**
     * @docid
     * @public
     */
    type?: string;
}

/**
 * @docid
 * @publicName Layer Element
 * @namespace DevExpress.viz
 */
export interface MapLayerElement {
    /**
     * @docid
     * @publicName applySettings(settings)
     * @param1 settings:object
     * @public
     */
    applySettings(settings: any): void;
    /**
     * @docid
     * @publicName attribute(name)
     * @public
     */
    attribute(name: string): any;
    /**
     * @docid
     * @publicName attribute(name, value)
     * @public
     */
    attribute(name: string, value: any): void;
    /**
     * @docid
     * @publicName coordinates()
     * @return object
     * @public
     */
    coordinates(): any;
    /**
     * @docid
     * @public
     */
    layer?: any;
    /**
     * @docid
     * @publicName selected()
     * @public
     */
    selected(): boolean;
    /**
     * @docid
     * @publicName selected(state)
     * @public
     */
    selected(state: boolean): void;
}

/**
 * @public
 * @docid VectorMapLegendItem
 * @namespace DevExpress.viz.dxVectorMap
 * @inherits BaseLegendItem
 * @type object
 */
export type LegendItem = VectorMapLegendItem;

/**
 * @deprecated Use LegendItem instead
 * @namespace DevExpress.viz
 */
export interface VectorMapLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @public
     */
    color?: string;
    /**
     * @docid
     * @public
     */
    end?: number;
    /**
     * @docid
     * @public
     */
    size?: number;
    /**
     * @docid
     * @public
     */
    start?: number;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
 */
export interface dxVectorMapOptions extends BaseWidgetOptions<dxVectorMap> {
    /**
     * @docid
     * @public
     */
    background?: {
      /**
       * @docid
       * @default '#cacaca'
       */
      borderColor?: string;
      /**
       * @docid
       * @default '#ffffff'
       */
      color?: string;
    };
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    bounds?: Array<number>;
    /**
     * @docid
     * @default [0, 0]
     * @notUsedInTheme
     * @public
     */
    center?: Array<number>;
    /**
     * @docid
     * @public
     */
    controlBar?: {
      /**
       * @docid
       * @default '#5d5d5d'
       */
      borderColor?: string;
      /**
       * @docid
       * @default '#ffffff'
       */
      color?: string;
      /**
       * @docid
       * @default true
       */
      enabled?: boolean;
      /**
       * @docid
       * @default 'true'
       */
      panVisible?: boolean;
      /**
       * @docid
       * @default 'true'
       */
      zoomVisible?: boolean;
      /**
       * @docid
       * @default 'left'
       */
      horizontalAlignment?: HorizontalAlignment;
      /**
       * @docid
       * @default 20
       */
      margin?: number;
      /**
       * @docid
       * @default 0.3
       */
      opacity?: number;
      /**
       * @docid
       * @default 'top'
       */
      verticalAlignment?: VerticalEdge;
    };
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    layers?: Array<{
      /**
       * @docid
       * @default '#9d9d9d'
       */
      borderColor?: string;
      /**
       * @docid
       * @default 1
       */
      borderWidth?: number;
      /**
       * @docid
       * @default '#d2d2d2'
       */
      color?: string;
      /**
       * @docid
       * @default undefined
       */
      colorGroupingField?: string | undefined;
      /**
       * @docid
       * @default undefined
       */
      colorGroups?: Array<number>;
      /**
       * @docid
       * @notUsedInTheme
       */
      customize?: ((elements: Array<MapLayerElement>) => void);
      /**
       * @docid
       * @default undefined
       */
      dataField?: string | undefined;
      /**
       * @docid
       * @type object|Store|DataSource|DataSourceOptions|string|Array<any>|null
       * @notUsedInTheme
       */
      dataSource?: object | DataSourceLike<any> | null;
      /**
       * @docid
       * @notUsedInTheme
       */
      elementType?: VectorMapMarkerType;
      /**
       * @docid
       * @default true
       */
      hoverEnabled?: boolean;
      /**
       * @docid
       * @default '#303030'
       */
      hoveredBorderColor?: string;
      /**
       * @docid
       * @default 1
       */
      hoveredBorderWidth?: number;
      /**
       * @docid
       * @default '#d2d2d2'
       */
      hoveredColor?: string;
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         */
        dataField?: string;
        /**
         * @docid
         * @default <i>true</i> for markers; <i>false</i> for areas
         */
        enabled?: boolean;
        /**
         * @docid
         * @default '#2b2b2b' &prop(color)
         */
        font?: Font;
      };
      /**
       * @docid
       * @default 50
       */
      maxSize?: number;
      /**
       * @docid
       * @default 20
       */
      minSize?: number;
      /**
       * @docid
       * @notUsedInTheme
       */
      name?: string;
      /**
       * @docid
       * @default 1
       */
      opacity?: number;
      /**
       * @docid
       * @default "Material"
       */
      palette?: Array<string> | Palette;
      /**
       * @docid
       * @default 0
       */
      paletteSize?: number;
      /**
       * @docid
       */
      paletteIndex?: number;
      /**
       * @docid
       * @default '#303030'
       */
      selectedBorderColor?: string;
      /**
       * @docid
       * @default 2
       */
      selectedBorderWidth?: number;
      /**
       * @docid
       * @default '#d2d2d2'
       */
      selectedColor?: string;
      /**
       * @docid
       * @default 'single'
       */
      selectionMode?: SingleMultipleOrNone;
      /**
       * @docid
       * @default 8
       */
      size?: number;
      /**
       * @docid
       * @default undefined
       */
      sizeGroupingField?: string | undefined;
      /**
       * @docid
       * @default undefined
       */
      sizeGroups?: Array<number>;
      /**
       * @docid
       * @notUsedInTheme
       */
      type?: VectorMapLayerType;
    }> | { borderColor?: string; borderWidth?: number; color?: string; colorGroupingField?: string; colorGroups?: Array<number>; customize?: ((elements: Array<MapLayerElement>) => any); dataField?: string; dataSource?: object | DataSourceLike<any> | null; elementType?: 'bubble' | 'dot' | 'image' | 'pie'; hoverEnabled?: boolean; hoveredBorderColor?: string; hoveredBorderWidth?: number; hoveredColor?: string; label?: { dataField?: string; enabled?: boolean; font?: Font }; maxSize?: number; minSize?: number; name?: string; opacity?: number; palette?: Array<string> | Palette; paletteSize?: number; selectedBorderColor?: string; selectedBorderWidth?: number; selectedColor?: string; selectionMode?: SingleMultipleOrNone; size?: number; sizeGroupingField?: string; sizeGroups?: Array<number>; type?: 'area' | 'line' | 'marker' };
    /**
     * @docid
     * @type Array<Object>
     * @inherits BaseLegend
     * @default undefined
     * @public
     */
    legends?: Array<Legend> | undefined;
    /**
     * @docid
     * @type object
     * @hidden
     */
    margin?: BaseWidgetMargin;
    /**
     * @docid
     * @default 256
     * @notUsedInTheme
     * @public
     */
    maxZoomFactor?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/vector_map:CenterChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onCenterChanged?: ((e: CenterChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/vector_map:ClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/vector_map:SelectionChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/vector_map:TooltipHiddenEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/vector_map:TooltipShownEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipShown?: ((e: TooltipShownEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/vector_map:ZoomFactorChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onZoomFactorChanged?: ((e: ZoomFactorChangedEvent) => void);
    /**
     * @docid
     * @default true
     * @public
     */
    panningEnabled?: boolean;
    /**
     * @docid
     * @type Enums.VectorMapProjection|VectorMapProjectionConfig|string|object
     * @default "mercator"
     * @notUsedInTheme
     * @public
     */
    projection?: VectorMapProjection | VectorMapProjectionConfig | string | any;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: Tooltip;
    /**
     * @docid
     * @default true
     * @public
     */
    touchEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    wheelEnabled?: boolean;
    /**
     * @docid
     * @default 1
     * @notUsedInTheme
     * @public
     */
    zoomFactor?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    zoomingEnabled?: boolean;
    /**
     * @docid
     * @public
     */
    commonAnnotationSettings?: dxVectorMapCommonAnnotationConfig;
    /**
     * @docid
     * @inherits dxVectorMapOptions.commonAnnotationSettings
     * @public
     */
    annotations?: Array<dxVectorMapAnnotationConfig | any>;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeAnnotation?: ((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig) | undefined;
}

/**
 * @docid
 * @inherits dxVectorMapCommonAnnotationConfig
 * @type object
 * @namespace DevExpress.viz
 */
export interface dxVectorMapAnnotationConfig extends dxVectorMapCommonAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
}

/**
 * @docid
 * @inherits BaseWidgetAnnotationConfig
 * @type object
 * @namespace DevExpress.viz
 */
export interface dxVectorMapCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @public
     */
    coordinates?: Array<number>;
    /**
     * @docid
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => any) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((annotation: dxVectorMapAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxVectorMapAnnotationConfig | any, element: DxElement) => string | UserDefinedElement) | undefined;
}

/**
 * @public
 * @docid dxVectorMapLegends
 */
export type Legend = BaseLegend & {
    /**
     * @docid dxVectorMapOptions.legends.customizeHint
     * @notUsedInTheme
     * @public
     */
    customizeHint?: ((itemInfo: { start?: number; end?: number; index?: number; color?: string; size?: number }) => string);
    /**
     * @docid dxVectorMapOptions.legends.customizeItems
     * @type_function_param1 items:Array<VectorMapLegendItem>
     * @type_function_return Array<VectorMapLegendItem>
     * @public
     */
    customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
    /**
     * @docid dxVectorMapOptions.legends.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((itemInfo: { start?: number; end?: number; index?: number; color?: string; size?: number }) => string);
    /**
     * @docid dxVectorMapOptions.legends.font
     * @default '#2b2b2b' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxVectorMapOptions.legends.markerColor
     * @default undefined
     * @public
     */
    markerColor?: string | undefined;
    /**
     * @docid dxVectorMapOptions.legends.markerShape
     * @default "square"
     * @public
     */
    markerShape?: VectorMapMarkerShape;
    /**
     * @docid dxVectorMapOptions.legends.markerSize
     * @default 12
     * @public
     */
    markerSize?: number;
    /**
     * @docid dxVectorMapOptions.legends.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:VectorMapLegendItem
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: LegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * @docid dxVectorMapOptions.legends.source
     * @notUsedInTheme
     * @public
     */
    source?: {
      /**
       * @docid dxVectorMapOptions.legends.source.grouping
       * @notUsedInTheme
       */
      grouping?: string;
      /**
       * @docid dxVectorMapOptions.legends.source.layer
       * @notUsedInTheme
       */
      layer?: string;
    };
};
/**
 * @public
 * @docid dxVectorMapTooltip
 */
export type Tooltip = BaseWidgetTooltip & {
    /**
     * @docid dxVectorMapOptions.tooltip.contentTemplate
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((info: MapLayerElement, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * @docid dxVectorMapOptions.tooltip.customizeTooltip
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((info: MapLayerElement) => any) | undefined;
    /**
     * @docid dxVectorMapOptions.tooltip.format
     * @hidden
     */
    format?: Format;
};
/**
 * @docid
 * @inherits BaseWidget
 * @namespace DevExpress.viz
 * @public
 */
export default class dxVectorMap extends BaseWidget<dxVectorMapOptions> {
    /**
     * @docid
     * @publicName center()
     * @public
     */
    center(): Array<number>;
    /**
     * @docid
     * @publicName center(centerCoordinates)
     * @public
     */
    center(centerCoordinates: Array<number>): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName convertCoordinates(x, y)
     * @deprecated dxVectorMap.convertToGeo
     * @public
     */
    convertCoordinates(x: number, y: number): Array<number>;
    /**
     * @docid
     * @publicName convertToGeo(x, y)
     * @public
     */
    convertToGeo(x: number, y: number): Array<number>;
    /**
     * @docid
     * @publicName convertToXY(longitude, latitude)
     * @public
     */
    convertToXY(longitude: number, latitude: number): Array<number>;
    /**
     * @docid
     * @publicName getLayerByIndex(index)
     * @public
     */
    getLayerByIndex(index: number): MapLayer;
    /**
     * @docid
     * @publicName getLayerByName(name)
     * @public
     */
    getLayerByName(name: string): MapLayer;
    /**
     * @docid
     * @publicName getLayers()
     * @public
     */
    getLayers(): Array<MapLayer>;
    /**
     * @docid
     * @publicName viewport()
     * @public
     */
    viewport(): Array<number>;
    /**
     * @docid
     * @publicName viewport(viewportCoordinates)
     * @public
     */
    viewport(viewportCoordinates: Array<number>): void;
    /**
     * @docid
     * @publicName zoomFactor()
     * @public
     */
    zoomFactor(): number;
    /**
     * @docid
     * @publicName zoomFactor(zoomFactor)
     * @public
     */
    zoomFactor(zoomFactor: number): void;
}

/** @public */
export type Properties = dxVectorMapOptions;

/** @deprecated use Properties instead */
export type Options = dxVectorMapOptions;

// #region deprecated in v23.1

/** @deprecated Use Legend instead */
export type dxVectorMapLegends = Legend;

/** @deprecated Use Tooltip instead */
export type dxVectorMapTooltip = Tooltip;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onCenterChanged' | 'onClick' | 'onSelectionChanged' | 'onTooltipHidden' | 'onTooltipShown' | 'onZoomFactorChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxVectorMapOptions.onDisposing
 * @type_function_param1 e:{viz/vector_map:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxVectorMapOptions.onDrawn
 * @type_function_param1 e:{viz/vector_map:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxVectorMapOptions.onExported
 * @type_function_param1 e:{viz/vector_map:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxVectorMapOptions.onExporting
 * @type_function_param1 e:{viz/vector_map:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxVectorMapOptions.onFileSaving
 * @type_function_param1 e:{viz/vector_map:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxVectorMapOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/vector_map:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxVectorMapOptions.onInitialized
 * @type_function_param1 e:{viz/vector_map:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxVectorMapOptions.onOptionChanged
 * @type_function_param1 e:{viz/vector_map:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
