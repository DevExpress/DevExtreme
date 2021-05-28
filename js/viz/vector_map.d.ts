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
     * @return DataSource
     * @public
     */
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getElements()
     * @return Array<MapLayerElement>
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
     * @return any
     * @param1 name:string
     * @public
     */
    attribute(name: string): any;
    /**
     * @docid
     * @publicName attribute(name, value)
     * @param1 name:string
     * @param2 value:any
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
     * @return boolean
     * @public
     */
    selected(): boolean;
    /**
     * @docid
     * @publicName selected(state)
     * @param1 state:boolean
     * @public
     */
    selected(state: boolean): void;
}

/**
 * @docid
 * @inherits BaseLegendItem
 * @type object
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
      borderColor?: string,
      /**
       * @docid
       * @default '#ffffff'
       */
      color?: string
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
      borderColor?: string,
      /**
       * @docid
       * @default '#ffffff'
       */
      color?: string,
      /**
       * @docid
       * @default true
       */
      enabled?: boolean,
      /**
       * @docid
       * @type Enums.HorizontalAlignment
       * @default 'left'
       */
      horizontalAlignment?: 'center' | 'left' | 'right',
      /**
       * @docid
       * @default 20
       */
      margin?: number,
      /**
       * @docid
       * @default 0.3
       */
      opacity?: number,
      /**
       * @docid
       * @type Enums.VerticalEdge
       * @default 'top'
       */
      verticalAlignment?: 'bottom' | 'top'
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
      borderColor?: string,
      /**
       * @docid
       * @default 1
       */
      borderWidth?: number,
      /**
       * @docid
       * @default '#d2d2d2'
       */
      color?: string,
      /**
       * @docid
       * @default undefined
       */
      colorGroupingField?: string,
      /**
       * @docid
       * @default undefined
       */
      colorGroups?: Array<number>,
      /**
       * @docid
       * @type_function_param1 elements:Array<MapLayerElement>
       * @notUsedInTheme
       */
      customize?: ((elements: Array<MapLayerElement>) => void),
      /**
       * @docid
       * @default undefined
       */
      dataField?: string,
      /**
       * @docid
       * @type object|DataSource|DataSourceOptions|string|Array<any>
       * @extends CommonVizDataSource
       */
      dataSource?: any | DataSource | DataSourceOptions | string,
      /**
       * @docid
       * @type Enums.VectorMapMarkerType
       * @notUsedInTheme
       */
      elementType?: 'bubble' | 'dot' | 'image' | 'pie',
      /**
       * @docid
       * @default true
       */
      hoverEnabled?: boolean,
      /**
       * @docid
       * @default '#303030'
       */
      hoveredBorderColor?: string,
      /**
       * @docid
       * @default 1
       */
      hoveredBorderWidth?: number,
      /**
       * @docid
       * @default '#d2d2d2'
       */
      hoveredColor?: string,
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         */
        dataField?: string,
        /**
         * @docid
         * @default <i>true</i> for markers; <i>false</i> for areas
         */
        enabled?: boolean,
        /**
         * @docid
         * @default '#2b2b2b' [prop](color)
         */
        font?: Font
      },
      /**
       * @docid
       * @default 50
       */
      maxSize?: number,
      /**
       * @docid
       * @default 20
       */
      minSize?: number,
      /**
       * @docid
       * @notUsedInTheme
       */
      name?: string,
      /**
       * @docid
       * @default 1
       */
      opacity?: number,
      /**
       * @docid
       * @extends CommonVizPalette
       * @type Array<string>|Enums.VizPalette
       */
      palette?: Array<string> | PaletteType,
      /**
       * @docid
       * @default 0
       */
      paletteSize?: number,
      /**
       * @docid
       */
      paletteIndex?: number;
      /**
       * @docid
       * @default '#303030'
       */
      selectedBorderColor?: string,
      /**
       * @docid
       * @default 2
       */
      selectedBorderWidth?: number,
      /**
       * @docid
       * @default '#d2d2d2'
       */
      selectedColor?: string,
      /**
       * @docid
       * @type Enums.SelectionMode
       * @default 'single'
       */
      selectionMode?: 'multiple' | 'none' | 'single',
      /**
       * @docid
       * @default 8
       */
      size?: number,
      /**
       * @docid
       * @default undefined
       */
      sizeGroupingField?: string,
      /**
       * @docid
       * @default undefined
       */
      sizeGroups?: Array<number>,
      /**
       * @docid
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
     * @public
     */
    legends?: Array<dxVectorMapLegends>;
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
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxVectorMap
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 center:Array<number>
     * @notUsedInTheme
     * @action
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
    projection?: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | VectorMapProjectionConfig | string | any;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: dxVectorMapTooltip;
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
     * @type_function_param1 annotation:dxVectorMapAnnotationConfig|any
     * @type_function_return dxVectorMapAnnotationConfig
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeAnnotation?: ((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig);
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
    name?: string;
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
     * @type_function_param1 annotation:dxVectorMapAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => any);
    /**
     * @docid
     * @default undefined
     * @type_function_param1 annotation:dxVectorMapAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((annotation: dxVectorMapAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @type_function_param1 annotation:dxVectorMapAnnotationConfig|any
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxVectorMapAnnotationConfig | any, element: DxElement) => string | UserDefinedElement);
}

/** @namespace DevExpress.viz */
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
     * @public
     */
    customizeHint?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
    /**
     * @docid dxVectorMapOptions.legends.customizeItems
     * @type_function_param1 items:Array<VectorMapLegendItem>
     * @type_function_return Array<VectorMapLegendItem>
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
     * @public
     */
    customizeText?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
    /**
     * @docid dxVectorMapOptions.legends.font
     * @default '#2b2b2b' [prop](color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxVectorMapOptions.legends.markerColor
     * @default undefined
     * @public
     */
    markerColor?: string;
    /**
     * @docid dxVectorMapOptions.legends.markerShape
     * @type Enums.VectorMapMarkerShape
     * @default "square"
     * @public
     */
    markerShape?: 'circle' | 'square';
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
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: VectorMapLegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
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
      grouping?: string,
      /**
       * @docid dxVectorMapOptions.legends.source.layer
       * @notUsedInTheme
       */
      layer?: string
    };
}
/** @namespace DevExpress.viz */
export interface dxVectorMapTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxVectorMapOptions.tooltip.contentTemplate
     * @type_function_param1 info:MapLayerElement
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((info: MapLayerElement, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid dxVectorMapOptions.tooltip.customizeTooltip
     * @type_function_param1 info:MapLayerElement
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((info: MapLayerElement) => any);
    /**
     * @docid dxVectorMapOptions.tooltip.format
     * @hidden
     */
    format?: format;
}
/**
 * @docid
 * @inherits BaseWidget
 * @module viz/vector_map
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxVectorMap extends BaseWidget<dxVectorMapOptions> {
    /**
     * @docid
     * @publicName center()
     * @return Array<number>
     * @public
     */
    center(): Array<number>;
    /**
     * @docid
     * @publicName center(centerCoordinates)
     * @param1 centerCoordinates:Array<number>
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
     * @param1 x:number
     * @param2 y:number
     * @return Array<number>
     * @deprecated dxVectorMap.convertToGeo
     * @public
     */
    convertCoordinates(x: number, y: number): Array<number>;
    /**
     * @docid
     * @publicName convertToGeo(x, y)
     * @param1 x:number
     * @param2 y:number
     * @return Array<number>
     * @public
     */
    convertToGeo(x: number, y: number): Array<number>;
    /**
     * @docid
     * @publicName convertToXY(longitude, latitude)
     * @param1 longitude:number
     * @param2 latitude:number
     * @return Array<number>
     * @public
     */
    convertToXY(longitude: number, latitude: number): Array<number>;
    /**
     * @docid
     * @publicName getLayerByIndex(index)
     * @return MapLayer
     * @param1 index:number
     * @public
     */
    getLayerByIndex(index: number): MapLayer;
    /**
     * @docid
     * @publicName getLayerByName(name)
     * @return MapLayer
     * @param1 name:string
     * @public
     */
    getLayerByName(name: string): MapLayer;
    /**
     * @docid
     * @publicName getLayers()
     * @return Array<MapLayer>
     * @public
     */
    getLayers(): Array<MapLayer>;
    /**
     * @docid
     * @publicName viewport()
     * @return Array<number>
     * @public
     */
    viewport(): Array<number>;
    /**
     * @docid
     * @publicName viewport(viewportCoordinates)
     * @param1 viewportCoordinates:Array<number>
     * @public
     */
    viewport(viewportCoordinates: Array<number>): void;
    /**
     * @docid
     * @publicName zoomFactor()
     * @return number
     * @public
     */
    zoomFactor(): number;
    /**
     * @docid
     * @publicName zoomFactor(zoomFactor)
     * @param1 zoomFactor:number
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
