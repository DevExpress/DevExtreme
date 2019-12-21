import {
    JQueryEventObject
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events';

import {
    BaseLegend,
    BaseLegendItem
} from './common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font
} from './core/base_widget';

import {
    VectorMapProjectionConfig
} from './vector_map/projection';

export interface MapLayer {
    /**
     * @docid MapLayerMethods.clearSelection
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid MapLayerFields.elementType
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    elementType?: string;
    /**
     * @docid MapLayerMethods.getDataSource
     * @publicName getDataSource()
     * @return DataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getDataSource(): DataSource;
    /**
     * @docid MapLayerMethods.getElements
     * @publicName getElements()
     * @return Array<MapLayerElement>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getElements(): Array<MapLayerElement>;
    /**
     * @docid MapLayerFields.index
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    index?: number;
    /**
     * @docid MapLayerFields.name
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid MapLayerFields.type
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: string;
}

export interface MapLayerElement {
    /**
     * @docid MapLayerElementMethods.applySettings
     * @publicName applySettings(settings)
     * @param1 settings:object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    applySettings(settings: any): void;
    /**
     * @docid MapLayerElementMethods.attribute
     * @publicName attribute(name)
     * @return any
     * @param1 name:string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    attribute(name: string): any;
    /**
     * @docid MapLayerElementMethods.attribute
     * @publicName attribute(name, value)
     * @param1 name:string
     * @param2 value:any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    attribute(name: string, value: any): void;
    /**
     * @docid MapLayerElementMethods.coordinates
     * @publicName coordinates()
     * @return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    coordinates(): any;
    /**
     * @docid MapLayerElementFields.layer
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    layer?: any;
    /**
     * @docid MapLayerElementMethods.selected
     * @publicName selected()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selected(): boolean;
    /**
     * @docid MapLayerElementMethods.selected
     * @publicName selected(state)
     * @param1 state:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selected(state: boolean): void;
}

export interface VectorMapLegendItem extends BaseLegendItem {
    /**
     * @docid VectorMapLegendItem.color
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid VectorMapLegendItem.end
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    end?: number;
    /**
     * @docid VectorMapLegendItem.size
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number;
    /**
     * @docid VectorMapLegendItem.start
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    start?: number;
}

export interface dxVectorMapOptions extends BaseWidgetOptions<dxVectorMap> {
    /**
     * @docid dxVectorMapOptions.background
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    background?: { borderColor?: string, color?: string };
    /**
     * @docid dxVectorMapOptions.bounds
     * @type Array<number>
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bounds?: Array<number>;
    /**
     * @docid dxVectorMapOptions.center
     * @type Array<number>
     * @default [0, 0]
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    center?: Array<number>;
    /**
     * @docid dxVectorMapOptions.controlBar
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    controlBar?: { borderColor?: string, color?: string, enabled?: boolean, horizontalAlignment?: 'center' | 'left' | 'right', margin?: number, opacity?: number, verticalAlignment?: 'bottom' | 'top' };
    /**
     * @docid dxVectorMapOptions.layers
     * @type Array<Object>|Object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    layers?: Array<{ borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => any), dataField?: string, dataSource?: any | DataSource | DataSourceOptions | string, elementType?: 'bubble' | 'dot' | 'image' | 'pie', hoverEnabled?: boolean, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: 'multiple' | 'none' | 'single', size?: number, sizeGroupingField?: string, sizeGroups?: Array<number>, type?: 'area' | 'line' | 'marker' }> | { borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => any), dataField?: string, dataSource?: any | DataSource | DataSourceOptions | string, elementType?: 'bubble' | 'dot' | 'image' | 'pie', hoverEnabled?: boolean, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: 'multiple' | 'none' | 'single', size?: number, sizeGroupingField?: string, sizeGroups?: Array<number>, type?: 'area' | 'line' | 'marker' };
    /**
     * @docid dxVectorMapOptions.legends
     * @type Array<Object>
     * @inherits BaseLegend
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legends?: Array<dxVectorMapLegends>;
    /**
     * @docid dxVectorMapOptions.maxZoomFactor
     * @type number
     * @default 256
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxZoomFactor?: number;
    /**
     * @docid dxVectorMapOptions.onCenterChanged
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 center:Array<number>
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onCenterChanged?: ((e: { component?: dxVectorMap, element?: dxElement, model?: any, center?: Array<number> }) => any);
    /**
     * @docid dxVectorMapOptions.onClick
     * @extends Action
     * @type function|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 target:MapLayerElement
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onClick?: ((e: { component?: dxVectorMap, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: MapLayerElement }) => any) | string;
    /**
     * @docid dxVectorMapOptions.onSelectionChanged
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:MapLayerElement
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxVectorMap, element?: dxElement, model?: any, target?: MapLayerElement }) => any);
    /**
     * @docid dxVectorMapOptions.onTooltipHidden
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:MapLayerElement
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: { component?: dxVectorMap, element?: dxElement, model?: any, target?: MapLayerElement }) => any);
    /**
     * @docid dxVectorMapOptions.onTooltipShown
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:MapLayerElement
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: { component?: dxVectorMap, element?: dxElement, model?: any, target?: MapLayerElement }) => any);
    /**
     * @docid dxVectorMapOptions.onZoomFactorChanged
     * @extends Action
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 zoomFactor:number
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onZoomFactorChanged?: ((e: { component?: dxVectorMap, element?: dxElement, model?: any, zoomFactor?: number }) => any);
    /**
     * @docid dxVectorMapOptions.panningEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    panningEnabled?: boolean;
    /**
     * @docid dxVectorMapOptions.projection
     * @type Enums.VectorMapProjection|VectorMapProjectionConfig|string|object
     * @default "mercator"
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    projection?: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | VectorMapProjectionConfig | string | any;
    /**
     * @docid dxVectorMapOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxVectorMapTooltip;
    /**
     * @docid dxVectorMapOptions.touchEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    touchEnabled?: boolean;
    /**
     * @docid dxVectorMapOptions.wheelEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wheelEnabled?: boolean;
    /**
     * @docid dxVectorMapOptions.zoomFactor
     * @type number
     * @default 1
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomFactor?: number;
    /**
     * @docid dxVectorMapOptions.zoomingEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomingEnabled?: boolean;
}
export interface dxVectorMapLegends extends BaseLegend {
    /**
     * @docid dxVectorMapOptions.legends.customizeHint
     * @type function(itemInfo)
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
     * @type function(items)
     * @type_function_param1 items:Array<VectorMapLegendItem>
     * @type_function_return Array<VectorMapLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>);
    /**
     * @docid dxVectorMapOptions.legends.customizeText
     * @type function(itemInfo)
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
     * @type Font
     * @default '#2b2b2b' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxVectorMapOptions.legends.markerColor
     * @type string
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
     * @type number
     * @default 12
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerSize?: number;
    /**
     * @docid dxVectorMapOptions.legends.markerTemplate
     * @type template|function
     * @default undefined
     * @type_function_param1 legendItem:VectorMapLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerTemplate?: template | ((legendItem: VectorMapLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
    /**
     * @docid dxVectorMapOptions.legends.source
     * @type object
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    source?: { grouping?: string, layer?: string };
}
export interface dxVectorMapTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxVectorMapOptions.tooltip.contentTemplate
     * @type template | function(info, element)
     * @type_function_param1 info:MapLayerElement
     * @type_function_param2 element:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((info: MapLayerElement, element: dxElement) => string | Element | JQuery);
    /**
     * @docid dxVectorMapOptions.tooltip.customizeTooltip
     * @type function(info)
     * @type_function_param1 info:MapLayerElement
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((info: MapLayerElement) => any);
}
/**
 * @docid dxVectorMap
 * @inherits BaseWidget
 * @module viz/vector_map
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxVectorMap extends BaseWidget {
    constructor(element: Element, options?: dxVectorMapOptions)
    constructor(element: JQuery, options?: dxVectorMapOptions)
    /**
     * @docid dxVectorMapMethods.center
     * @publicName center()
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    center(): Array<number>;
    /**
     * @docid dxVectorMapMethods.center
     * @publicName center(centerCoordinates)
     * @param1 centerCoordinates:Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    center(centerCoordinates: Array<number>): void;
    /**
     * @docid dxVectorMapMethods.clearSelection
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid dxVectorMapMethods.convertCoordinates
     * @publicName convertCoordinates(x, y)
     * @param1 x:number
     * @param2 y:number
     * @return Array<number>
     * @deprecated dxVectorMapMethods.convertToGeo
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    convertCoordinates(x: number, y: number): Array<number>;
    /**
     * @docid dxVectorMapMethods.convertToGeo
     * @publicName convertToGeo(x, y)
     * @param1 x:number
     * @param2 y:number
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    convertToGeo(x: number, y: number): Array<number>;
    /**
     * @docid dxVectorMapMethods.convertToXY
     * @publicName convertToXY(longitude, latitude)
     * @param1 longitude:number
     * @param2 latitude:number
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    convertToXY(longitude: number, latitude: number): Array<number>;
    /**
     * @docid dxVectorMapMethods.getLayerByIndex
     * @publicName getLayerByIndex(index)
     * @return MapLayer
     * @param1 index:number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getLayerByIndex(index: number): MapLayer;
    /**
     * @docid dxVectorMapMethods.getLayerByName
     * @publicName getLayerByName(name)
     * @return MapLayer
     * @param1 name:string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getLayerByName(name: string): MapLayer;
    /**
     * @docid dxVectorMapMethods.getLayers
     * @publicName getLayers()
     * @return Array<MapLayer>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getLayers(): Array<MapLayer>;
    /**
     * @docid dxVectorMapMethods.viewport
     * @publicName viewport()
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    viewport(): Array<number>;
    /**
     * @docid dxVectorMapMethods.viewport
     * @publicName viewport(viewportCoordinates)
     * @param1 viewportCoordinates:Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    viewport(viewportCoordinates: Array<number>): void;
    /**
     * @docid dxVectorMapMethods.zoomFactor
     * @publicName zoomFactor()
     * @return number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomFactor(): number;
    /**
     * @docid dxVectorMapMethods.zoomFactor
     * @publicName zoomFactor(zoomFactor)
     * @param1 zoomFactor:number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomFactor(zoomFactor: number): void;
}

declare global {
interface JQuery {
    dxVectorMap(): JQuery;
    dxVectorMap(options: "instance"): dxVectorMap;
    dxVectorMap(options: string): any;
    dxVectorMap(options: string, ...params: any[]): any;
    dxVectorMap(options: dxVectorMapOptions): JQuery;
}
}
export type Options = dxVectorMapOptions;

/** @deprecated use Options instead */
export type IOptions = dxVectorMapOptions;