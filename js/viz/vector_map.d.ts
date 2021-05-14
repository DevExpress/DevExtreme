import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    PaletteType
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
    BaseLegendItem
} from './common';

import BaseWidget, {
    BaseWidgetMargin,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    BaseWidgetAnnotationConfig,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

import {
    VectorMapProjectionConfig
} from './vector_map/projection';

export interface TooltipInfo {
    target?: MapLayerElement | dxVectorMapAnnotationConfig;
}

/** @public */
export type CenterChangedEvent = EventInfo<dxVectorMap> & {
    readonly center: Array<number>;
}

/** @public */
export type ClickEvent = NativeEventInfo<dxVectorMap> & {
    readonly target: MapLayerElement;
}

/** @public */
export type DisposingEvent = EventInfo<dxVectorMap>;

/** @public */
export type DrawnEvent = EventInfo<dxVectorMap>;

/** @public */
export type ExportedEvent = EventInfo<dxVectorMap>;

/** @public */
export type ExportingEvent = EventInfo<dxVectorMap> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxVectorMap>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxVectorMap> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxVectorMap>;

/** @public */
export type OptionChangedEvent = EventInfo<dxVectorMap> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxVectorMap> & {
    readonly target: MapLayerElement;
}

/** @public */
export type TooltipHiddenEvent = EventInfo<dxVectorMap> & TooltipInfo;

/** @public */
export type TooltipShownEvent = EventInfo<dxVectorMap> & TooltipInfo;

/** @public */
export type ZoomFactorChangedEvent = EventInfo<dxVectorMap> & {
    readonly zoomFactor: number;
}

/**
 * @docid
 * @publicName Layer
 */
export interface MapLayer {
    /**
     * @docid
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    elementType?: string;
    /**
     * @docid
     * @publicName getDataSource()
     * @return DataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getElements()
     * @return Array<MapLayerElement>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getElements(): Array<MapLayerElement>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    index?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: string;
}

/**
 * @docid
 * @publicName Layer Element
 */
export interface MapLayerElement {
    /**
     * @docid
     * @publicName applySettings(settings)
     * @param1 settings:object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    applySettings(settings: any): void;
    /**
     * @docid
     * @publicName attribute(name)
     * @return any
     * @param1 name:string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    attribute(name: string): any;
    /**
     * @docid
     * @publicName attribute(name, value)
     * @param1 name:string
     * @param2 value:any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    attribute(name: string, value: any): void;
    /**
     * @docid
     * @publicName coordinates()
     * @return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    coordinates(): any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    layer?: any;
    /**
     * @docid
     * @publicName selected()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selected(): boolean;
    /**
     * @docid
     * @publicName selected(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selected(state: boolean): void;
}

/**
 * @docid
 * @inherits BaseLegendItem
 * @type object
 */
export interface VectorMapLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    end?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    start?: number;
}

/** @deprecated use Properties instead */
export interface dxVectorMapOptions extends BaseWidgetOptions<dxVectorMap> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    background?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#cacaca'
       */
      borderColor?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#ffffff'
       */
      color?: string
    };
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bounds?: Array<number>;
    /**
     * @docid
     * @default [0, 0]
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    center?: Array<number>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    controlBar?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#5d5d5d'
       */
      borderColor?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#ffffff'
       */
      color?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      enabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.HorizontalAlignment
       * @default 'left'
       */
      horizontalAlignment?: 'center' | 'left' | 'right',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 20
       */
      margin?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0.3
       */
      opacity?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VerticalEdge
       * @default 'top'
       */
      verticalAlignment?: 'bottom' | 'top'
    };
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    layers?: Array<{
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#9d9d9d'
       */
      borderColor?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      borderWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#d2d2d2'
       */
      color?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      colorGroupingField?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      colorGroups?: Array<number>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type_function_param1 elements:Array<MapLayerElement>
       * @notUsedInTheme
       */
      customize?: ((elements: Array<MapLayerElement>) => void),
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      dataField?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type object|DataSource|DataSourceOptions|string|Array<any>
       * @extends CommonVizDataSource
       */
      dataSource?: any | DataSource | DataSourceOptions | string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VectorMapMarkerType
       * @notUsedInTheme
       */
      elementType?: 'bubble' | 'dot' | 'image' | 'pie',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      hoverEnabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#303030'
       */
      hoveredBorderColor?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      hoveredBorderWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#d2d2d2'
       */
      hoveredColor?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      label?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         */
        dataField?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default <i>true</i> for markers; <i>false</i> for areas
         */
        enabled?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default '#2b2b2b' [prop](color)
         */
        font?: Font
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 50
       */
      maxSize?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 20
       */
      minSize?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @notUsedInTheme
       */
      name?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      opacity?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @extends CommonVizPalette
       * @type Array<string>|Enums.VizPalette
       */
      palette?: Array<string> | PaletteType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      paletteSize?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      paletteIndex?: number;
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#303030'
       */
      selectedBorderColor?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 2
       */
      selectedBorderWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#d2d2d2'
       */
      selectedColor?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.SelectionMode
       * @default 'single'
       */
      selectionMode?: 'multiple' | 'none' | 'single',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 8
       */
      size?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      sizeGroupingField?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      sizeGroups?: Array<number>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VectorMapLayerType
       * @notUsedInTheme
       */
      type?: 'area' | 'line' | 'marker'
    }> | { borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => any), dataField?: string, dataSource?: any | DataSource | DataSourceOptions | string, elementType?: 'bubble' | 'dot' | 'image' | 'pie', hoverEnabled?: boolean, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | PaletteType, paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: 'multiple' | 'none' | 'single', size?: number, sizeGroupingField?: string, sizeGroups?: Array<number>, type?: 'area' | 'line' | 'marker' };
    /**
     * @docid
     * @type Array<Object>
     * @inherits BaseLegend
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legends?: Array<dxVectorMapLegends>;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    margin?: BaseWidgetMargin;
    /**
     * @docid
     * @default 256
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxZoomFactor?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxVectorMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 center:Array<number>
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onCenterChanged?: ((e: CenterChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxVectorMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:MapLayerElement
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxVectorMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:MapLayerElement
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxVectorMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:MapLayerElement | dxVectorMapAnnotationConfig
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxVectorMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:MapLayerElement | dxVectorMapAnnotationConfig
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: TooltipShownEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxVectorMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 zoomFactor:number
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onZoomFactorChanged?: ((e: ZoomFactorChangedEvent) => void);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    panningEnabled?: boolean;
    /**
     * @docid
     * @type Enums.VectorMapProjection|VectorMapProjectionConfig|string|object
     * @default "mercator"
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    projection?: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | VectorMapProjectionConfig | string | any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxVectorMapTooltip;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    touchEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wheelEnabled?: boolean;
    /**
     * @docid
     * @default 1
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomFactor?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomingEnabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAnnotationSettings?: dxVectorMapCommonAnnotationConfig;
    /**
     * @docid
     * @inherits dxVectorMapOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    annotations?: Array<dxVectorMapAnnotationConfig | any>;
    /**
     * @docid
     * @type_function_param1 annotation:dxVectorMapAnnotationConfig|any
     * @type_function_return dxVectorMapAnnotationConfig
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeAnnotation?: ((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig);
}

/**
 * @docid
 * @inherits dxVectorMapCommonAnnotationConfig
 * @type object
 */
export interface dxVectorMapAnnotationConfig extends dxVectorMapCommonAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
}

/**
 * @docid
 * @inherits BaseWidgetAnnotationConfig
 * @type object
 */
export interface dxVectorMapCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    coordinates?: Array<number>;
    /**
     * @docid
     * @type_function_param1 annotation:dxVectorMapAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => any);
    /**
     * @docid
     * @default undefined
     * @type_function_param1 annotation:dxVectorMapAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((annotation: dxVectorMapAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @type_function_param1 annotation:dxVectorMapAnnotationConfig|any
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxVectorMapAnnotationConfig | any, element: DxElement) => string | UserDefinedElement);
}

export interface dxVectorMapLegends extends BaseLegend {
    /**
     * @docid dxVectorMapOptions.legends.customizeHint
     * @type_function_param1 itemInfo:object
     * @type_function_param1_field1 start:number
     * @type_function_param1_field2 end:number
     * @type_function_param1_field3 index:number
     * @type_function_param1_field4 color:string
     * @type_function_param1_field5 size:number
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
    /**
     * @docid dxVectorMapOptions.legends.customizeItems
     * @type_function_param1 items:Array<VectorMapLegendItem>
     * @type_function_return Array<VectorMapLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>);
    /**
     * @docid dxVectorMapOptions.legends.customizeText
     * @type_function_param1 itemInfo:object
     * @type_function_param1_field1 start:number
     * @type_function_param1_field2 end:number
     * @type_function_param1_field3 index:number
     * @type_function_param1_field4 color:string
     * @type_function_param1_field5 size:number
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
    /**
     * @docid dxVectorMapOptions.legends.font
     * @default '#2b2b2b' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxVectorMapOptions.legends.markerColor
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerColor?: string;
    /**
     * @docid dxVectorMapOptions.legends.markerShape
     * @type Enums.VectorMapMarkerShape
     * @default "square"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerShape?: 'circle' | 'square';
    /**
     * @docid dxVectorMapOptions.legends.markerSize
     * @default 12
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerSize?: number;
    /**
     * @docid dxVectorMapOptions.legends.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:VectorMapLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerTemplate?: template | ((legendItem: VectorMapLegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid dxVectorMapOptions.legends.source
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    source?: {
      /**
       * @docid dxVectorMapOptions.legends.source.grouping
       * @prevFileNamespace DevExpress.viz
       * @notUsedInTheme
       */
      grouping?: string,
      /**
       * @docid dxVectorMapOptions.legends.source.layer
       * @prevFileNamespace DevExpress.viz
       * @notUsedInTheme
       */
      layer?: string
    };
}
export interface dxVectorMapTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxVectorMapOptions.tooltip.contentTemplate
     * @type_function_param1 info:MapLayerElement
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((info: MapLayerElement, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid dxVectorMapOptions.tooltip.customizeTooltip
     * @type_function_param1 info:MapLayerElement
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((info: MapLayerElement) => any);
    /**
     * @docid dxVectorMapOptions.tooltip.format
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    format?: format;
}
/**
 * @docid
 * @inherits BaseWidget
 * @module viz/vector_map
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxVectorMap extends BaseWidget {
    constructor(element: UserDefinedElement, options?: dxVectorMapOptions)
    /**
     * @docid
     * @publicName center()
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    center(): Array<number>;
    /**
     * @docid
     * @publicName center(centerCoordinates)
     * @param1 centerCoordinates:Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    center(centerCoordinates: Array<number>): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName convertCoordinates(x, y)
     * @param1 x:number
     * @param2 y:number
     * @return Array<number>
     * @deprecated dxVectorMap.convertToGeo
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    convertCoordinates(x: number, y: number): Array<number>;
    /**
     * @docid
     * @publicName convertToGeo(x, y)
     * @param1 x:number
     * @param2 y:number
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    convertToGeo(x: number, y: number): Array<number>;
    /**
     * @docid
     * @publicName convertToXY(longitude, latitude)
     * @param1 longitude:number
     * @param2 latitude:number
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    convertToXY(longitude: number, latitude: number): Array<number>;
    /**
     * @docid
     * @publicName getLayerByIndex(index)
     * @return MapLayer
     * @param1 index:number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getLayerByIndex(index: number): MapLayer;
    /**
     * @docid
     * @publicName getLayerByName(name)
     * @return MapLayer
     * @param1 name:string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getLayerByName(name: string): MapLayer;
    /**
     * @docid
     * @publicName getLayers()
     * @return Array<MapLayer>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getLayers(): Array<MapLayer>;
    /**
     * @docid
     * @publicName viewport()
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    viewport(): Array<number>;
    /**
     * @docid
     * @publicName viewport(viewportCoordinates)
     * @param1 viewportCoordinates:Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    viewport(viewportCoordinates: Array<number>): void;
    /**
     * @docid
     * @publicName zoomFactor()
     * @return number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomFactor(): number;
    /**
     * @docid
     * @publicName zoomFactor(zoomFactor)
     * @param1 zoomFactor:number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomFactor(zoomFactor: number): void;
}

/** @public */
export type Properties = dxVectorMapOptions;

/** @deprecated use Properties instead */
export type Options = dxVectorMapOptions;

/** @deprecated use Properties instead */
export type IOptions = dxVectorMapOptions;
