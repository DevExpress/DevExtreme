/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.map {
    /** @docid MapLayer */
    export interface MapLayer {
        /** @docid MapLayerfields_name */
        name: string;

        /** @docid MapLayerfields_index */
        index: number;

        /** @docid MapLayerfields_type */
        type: string;

        /** @docid MapLayerfields_elementType */
        elementType: string;

        /** @docid MapLayermethods_getElements */
        getElements(): Array<MapLayerElement>;

        /** @docid MapLayermethods_clearSelection */
        clearSelection(): void;

        /** @docid MapLayermethods_getDataSource */
        getDataSource(): DevExpress.data.DataSource;
    }

    /** @docid MapLayerElement */
    export interface MapLayerElement {
        /** @docid MapLayerElementfields_layer */
        layer: MapLayer;

        /** @docid MapLayerElementmethods_coordinates */
        coordinates(): Object;

        /** @docid MapLayerElementmethods_attribute#attribute(name, value) */
        attribute(name: string, value: any): void;

        /** @docid MapLayerElementmethods_attribute#attribute(name) */
        attribute(name: string): any;

        /** @docid MapLayerElementmethods_selected#selected() */
        selected(): boolean;

        /** @docid MapLayerElementmethods_selected#selected(state) */
        selected(state: boolean): void;

        /** @docid MapLayerElementmethods_applySettings */
        applySettings(settings: any): void;
    }

    /** @docid areaObjects */
    export interface Area {
        /** @docid areaObjectsfields_type */
        type: string;

        /** @docid areaObjectsmethods_attribute */
        attribute(name: string): any;

        /** @docid areaObjectsmethods_selected#selected() */
        selected(): boolean;

        /** @docid areaObjectsmethods_selected#selected(state) */
        selected(state: boolean): void;

        /** @docid areaObjectsmethods_applySettings */
        applySettings(settings: any): void;
    }

    /** @docid markerObjects */
    export interface Marker {
        /** @docid markerObjectsfields_text */
        text: string;

        /** @docid markerObjectsfields_type */
        type: string;

        /** @docid markerObjectsfields_url */
        url: string;

        /** @docid markerObjectsfields_value */
        value: number;

        /** @docid markerObjectsfields_values */
        values: Array<number>;

        /** @docid markerObjectsmethods_attribute */
        attribute(name: string): any;

        /** @docid markerObjectsmethods_coordinates */
        coordinates(): Array<number>;

        /** @docid markerObjectsmethods_selected#selected() */
        selected(): boolean;

        /** @docid markerObjectsmethods_selected#selected(state) */
        selected(state: boolean): void;

        /** @docid markerObjectsmethods_applySettings */
        applySettings(settings: any): void;
    }

    export interface MapLayerSettings {
        /** @docid_ignore dxvectormapoptions_layers_data */

        /** @docid dxvectormapoptions_layers_name */
        name?: string;

        /** @docid dxvectormapoptions_layers_type */
        type?: string;

        /** @docid dxvectormapoptions_layers_elementType */
        elementType?: string;

        /** @docid dxvectormapoptions_layers_dataSource */
        dataSource?: any;

        /** @docid dxvectormapoptions_layers_borderWidth */
        borderWidth?: number;

        /** @docid dxvectormapoptions_layers_borderColor */
        borderColor?: string;

        /** @docid dxvectormapoptions_layers_color */
        color?: string;

        /** @docid dxvectormapoptions_layers_hoveredBorderColor */
        hoveredBorderColor?: string;

        /** @docid dxvectormapoptions_layers_hoveredBorderWidth */
        hoveredBorderWidth?: number;

        /** @docid dxvectormapoptions_layers_hoveredColor */
        hoveredColor?: string;

        /** @docid dxvectormapoptions_layers_selectedBorderWidth */
        selectedBorderWidth?: number;

        /** @docid dxvectormapoptions_layers_selectedBorderColor */
        selectedBorderColor?: string;

        /** @docid dxvectormapoptions_layers_selectedColor */
        selectedColor?: string;

        /** @docid dxvectormapoptions_layers_opacity */
        opacity?: number;

        /** @docid dxvectormapoptions_layers_size */
        size?: number;

        /** @docid dxvectormapoptions_layers_minSize */
        minSize?: number;

        /** @docid dxvectormapoptions_layers_maxSize */
        maxSize?: number;

        /** @docid dxvectormapoptions_layers_hoverEnabled */
        hoverEnabled?: boolean;

        /** @docid dxvectormapoptions_layers_selectionMode */
        selectionMode?: string;

        /** @docid dxvectormapoptions_layers_palette */
        palette?: any;

        /** @docid dxvectormapoptions_layers_paletteSize */
        paletteSize?: number;

        /** @docid dxvectormapoptions_layers_colorGroups */
        colorGroups?: Array<number>;

        /** @docid dxvectormapoptions_layers_colorGroupingField */
        colorGroupingField?: string;

        /** @docid dxvectormapoptions_layers_sizeGroups */
        sizeGroups?: Array<number>;

        /** @docid dxvectormapoptions_layers_sizeGroupingField */
        sizeGroupingField?: string;

        /** @docid dxvectormapoptions_layers_dataField */
        dataField?: string;

        /** @docid dxvectormapoptions_layers_customize */
        customize?: (eleemnts: Array<MapLayerElement>) => void;

        /** @docid dxvectormapoptions_layers_label */
        label?: {
            /** @docid dxvectormapoptions_layers_label_dataField */
            dataField?: string;

            /** @docid dxvectormapoptions_layers_label_enabled */
            enabled?: boolean;

            /** @docid dxvectormapoptions_layers_label_font */
            font?: viz.core.Font;
        };
    }

    export interface AreaSettings {
        /** @docid dxvectormapoptions_areaSettings_borderWidth */
        borderWidth?: number;

        /** @docid dxvectormapoptions_areaSettings_borderColor */
        borderColor?: string;

        /** @docid dxvectormapoptions_areaSettings_color */
        color?: string;

        /** @docid dxvectormapoptions_areaSettings_customize */
        customize?: (areaInfo: Area) => AreaSettings;

        /** @docid dxvectormapoptions_areaSettings_hoveredBorderColor */
        hoveredBorderColor?: string;

        /** @docid dxvectormapoptions_areaSettings_hoveredBorderWidth */
        hoveredBorderWidth?: number;

        /** @docid dxvectormapoptions_areaSettings_hoveredColor */
        hoveredColor?: string;

        /** @docid dxvectormapoptions_areaSettings_hoverEnabled */
        hoverEnabled?: boolean;

        /** @docid dxvectormapoptions_areaSettings_label */
        label?: {

            /** @docid dxvectormapoptions_areaSettings_label_dataField */
            dataField?: string;

            /** @docid dxvectormapoptions_areaSettings_label_enabled */
            enabled?: boolean;

            /** @docid dxvectormapoptions_areaSettings_label_font */
            font?: viz.core.Font;
        };

        /** @docid dxvectormapoptions_areaSettings_palette */
        palette?: any;

        /** @docid dxvectormapoptions_areaSettings_paletteSize */
        paletteSize?: number;

        /** @docid dxvectormapoptions_areaSettings_colorGroups */
        colorGroups?: Array<number>;

        /** @docid dxvectormapoptions_areaSettings_colorGroupingField */
        colorGroupingField?: string;

        /** @docid dxvectormapoptions_areaSettings_selectedBorderColor */
        selectedBorderColor?: string;

        /** @docid dxvectormapoptions_areaSettings_selectedColor */
        selectedColor?: string;

        /** @docid dxvectormapoptions_areaSettings_selectedBorderWidth */
        selectedBorderWidth?: number;

        /** @docid dxvectormapoptions_areaSettings_selectionMode */
        selectionMode?: string;
    }

    export interface MarkerSettings {
        /** @docid dxvectormapoptions_markerSettings_borderColor */
        borderColor?: string;

        /** @docid dxvectormapoptions_markerSettings_borderWidth */
        borderWidth?: number;

        /** @docid dxvectormapoptions_markerSettings_color */
        color?: string;

        /** @docid dxvectormapoptions_markerSettings_customize */
        customize?: (markerInfo: Marker) => MarkerSettings;

        /** @docid dxvectormapoptions_markerSettings_hoveredBorderWidth */
        hoveredBorderWidth?: number;

        /** @docid dxvectormapoptions_markerSettings_hoveredBorderColor */
        hoveredBorderColor?: string;

        /** @docid dxvectormapoptions_markerSettings_hoveredColor */
        hoveredColor?: string;

        /** @docid dxvectormapoptions_markerSettings_hoverEnabled */
        hoverEnabled?: boolean;

        /** @docid dxvectormapoptions_markerSettings_label */
        label?: {

            /** @docid dxvectormapoptions_markerSettings_label_enabled */
            enabled?: boolean;

            /** @docid dxvectormapoptions_markerSettings_label_font */
            font?: viz.core.Font;
        };

        /** @docid dxvectormapoptions_markerSettings_maxSize */
        maxSize?: number;

        /** @docid dxvectormapoptions_markerSettings_minSize */
        minSize?: number;

        /** @docid dxvectormapoptions_markerSettings_opacity */
        opacity?: number;

        /** @docid dxvectormapoptions_markerSettings_selectedBorderWidth */
        selectedBorderWidth?: number;

        /** @docid dxvectormapoptions_markerSettings_selectedBorderColor */
        selectedBorderColor?: string;

        /** @docid dxvectormapoptions_markerSettings_selectedColor */
        selectedColor?: string;

        /** @docid dxvectormapoptions_markerSettings_selectionMode */
        selectionMode?: string;

        /** @docid dxvectormapoptions_markerSettings_size */
        size?: number;

        /** @docid dxvectormapoptions_markerSettings_type */
        type?: string;

        /** @docid dxvectormapoptions_markerSettings_palette */
        palette?: any;

        /** @docid dxvectormapoptions_markerSettings_colorGroups */
        colorGroups?: Array<number>;

        /** @docid dxvectormapoptions_markerSettings_colorGroupingField */
        colorGroupingField?: string;

        /** @docid dxvectormapoptions_markerSettings_sizeGroups */
        sizeGroups?: Array<number>;

        /** @docid dxvectormapoptions_markerSettings_sizeGroupingField */
        sizeGroupingField?: string;
    }

    export interface dxVectorMapOptions extends viz.core.BaseWidgetOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        /** @docid_ignore dxvectormapoptions_margin */

        /** @docid_ignore dxvectormapoptions_tooltip_format */
        /** @docid_ignore dxvectormapoptions_tooltip_precision */

        /** @docid_ignore dxvectormapoptions_markers_attributes */
        /** @docid_ignore dxvectormapoptions_markers_coordinates */
        /** @docid_ignore dxvectormapoptions_markers_text */
        /** @docid_ignore dxvectormapoptions_markers_url */
        /** @docid_ignore dxvectormapoptions_markers_value */
        /** @docid_ignore dxvectormapoptions_markers_values */

        /** @docid dxvectormapoptions_areaSettings */
        areaSettings?: AreaSettings;

        /** @docid dxvectormapoptions_background */
        background?: {

            /** @docid dxvectormapoptions_background_borderColor */
            borderColor?: string;

            /** @docid dxvectormapoptions_background_color */
            color?: string;
        };

        /** @docid dxvectormapoptions_layers */
        layers?: Array<MapLayerSettings>;

        /** @docid dxvectormapoptions_projection */
        projection?: Object;

        /** @docid dxvectormapoptions_bounds */
        bounds?: Array<number>;

        /** @docid dxvectormapoptions_controlbar */
        controlBar?: {

            /** @docid dxvectormapoptions_controlbar_borderColor */
            borderColor?: string;

            /** @docid dxvectormapoptions_controlbar_color */
            color?: string;

            /** @docid dxvectormapoptions_controlbar_enabled */
            enabled?: boolean;

            /** @docid dxvectormapoptions_controlbar_margin */
            margin?: number;

            /** @docid dxvectormapoptions_controlbar_horizontalAlignment */
            horizontalAlignment?: string;

            /** @docid dxvectormapoptions_controlbar_verticalAlignment */
            verticalAlignment?: string;

            /** @docid dxvectormapoptions_controlbar_opacity */
            opacity?: number;
        };

        /** @docid dxvectormapoptions_mapData */
        mapData?: any;

        /** @docid dxvectormapoptions_markers */
        markers?: any;

        /** @docid dxvectormapoptions_markerSettings */
        markerSettings?: MarkerSettings;

        /** @docid dxvectormapoptions_tooltip */
        tooltip?: viz.core.Tooltip;

        /** @docid dxvectormapoptions_legends */
        legends?: Array<Legend>;

        /** @docid dxvectormapoptions_wheelEnabled */
        wheelEnabled?: boolean;

        /** @docid dxvectormapoptions_touchEnabled */
        touchEnabled?: boolean;

        /** @docid dxvectormapoptions_zoomingEnabled */
        zoomingEnabled?: boolean;

        /** @docid dxvectormapoptions_center */
        center?: Array<number>;

        /** @docid dxvectormapoptions_onCenterChanged */
        onCenterChanged?: (e: {
			center: Array<number>;
			component: dxVectorMap;
			element: Element;
        }) => void;

        /** @docid dxvectormapoptions_ontooltipshown*/
        onTooltipShown?: (e: {
            component: dxVectorMap;
            element: Element;
            target: {};
        }) => void;

        /** @docid dxvectormapoptions_ontooltiphidden*/
        onTooltipHidden?: (e: {
            component: dxVectorMap;
            element: Element;
            target: {};
        }) => void;

        /** @docid dxvectormapoptions_zoomFactor */
        zoomFactor?: number;

        /** @docid dxvectormapoptions_maxZoomFactor */
        maxZoomFactor?: number;

        /** @docid dxvectormapoptions_onZoomFactorChanged */
        onZoomFactorChanged?: (e: {
            component: dxVectorMap;
            element: Element;
            zoomFactor: number;
        }) => void;

        /** @docid dxvectormapoptions_onClick */
        onClick?: any;

        /** @docid dxvectormapoptions_onSelectionChanged */
        onSelectionChanged?: (e: {
            component: dxVectorMap;
            element: Element;
            target: MapLayerElement;
        }) => void;

        /** @docid dxvectormapoptions_onAreaClick */
        onAreaClick?: any;

        /** @docid dxvectormapoptions_onAreaSelectionChanged */
        onAreaSelectionChanged?: (e: {
            target: Area;
            component: dxVectorMap;
            element: Element;
        }) => void;

        /** @docid dxvectormapoptions_onMarkerClick */
        onMarkerClick?: any;

        /** @docid dxvectormapoptions_onMarkerSelectionChanged */
        onMarkerSelectionChanged?: (e: {
            target: Marker;
            component: dxVectorMap;
            element: Element;
        }) => void;

        /** @docid dxvectormapoptions_panningEnabled */
        panningEnabled?: boolean;
    }

    export interface Legend extends viz.core.BaseLegend {
        /** @docid dxvectormapoptions_legends_markerColor */
        markerColor?: string;

        /** @docid dxvectormapoptions_legends_markerShape */
        markerShape?: string;

        /** @docid dxvectormapoptions_legends_customizetext */
        customizeText?: (itemInfo: { start: number; end: number; index: number; color: string; size: number; }) => string;

        /** @docid dxvectormapoptions_legends_customizehint */
        customizeHint?: (itemInfo: { start: number; end: number; index: number; color: string; size: number }) => string;

        /** @docid dxvectormapoptions_legends_source */
        source?: {
            /** @docid dxvectormapoptions_legends_source_layer */
            layer?: string;
            /** @docid dxvectormapoptions_legends_source_grouping */
            grouping?: string;
        }
    }

    /** @docid_ignore viz_map */

    export var projection: ProjectionCreator;

    export interface ProjectionCreator {
        /** @docid viz_mapmethods_projection */
        (data: {
            to?: (coordinates: Array<number>) => Array<number>;
            from?: (coordinates: Array<number>) => Array<number>;
            aspectRatio?: number;
        }): Object;

        /** @docid viz_mapmethods_projection_get */
        get(name: string): Object;

        /** @docid viz_mapmethods_projection_add */
        add(name: string, projection: Object): void;
    }
}

declare module DevExpress.viz {
    /** @docid dxvectormap */
    export class dxVectorMap extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.map.dxVectorMapOptions);
        constructor(element: Element, options?: DevExpress.viz.map.dxVectorMapOptions);

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** @docid dxvectormapmethods_center#center() */
        center(): Array<number>;

        /** @docid dxvectormapmethods_center#center(centerCoordinates) */
        center(centerCoordinates: Array<number>): void;

        /** @docid dxvectormapmethods_clearAreaSelection */
        clearAreaSelection(): void;

        /** @docid dxvectormapmethods_clearMarkerSelection */
        clearMarkerSelection(): void;

        /** @docid dxvectormapmethods_clearSelection */
        clearSelection(): void;

        /** @docid dxvectormapmethods_convertCoordinates */
        convertCoordinates(x: number, y: number): Array<number>;

        /** @docid dxvectormapmethods_getLayers */
        getLayers(): Array<DevExpress.viz.map.MapLayer>;

        /** @docid dxvectormapmethods_getLayerByIndex */
        getLayerByIndex(index: number): DevExpress.viz.map.MapLayer;

        /** @docid dxvectormapmethods_getLayerByName */
        getLayerByName(name: string): DevExpress.viz.map.MapLayer;

        /** @docid dxvectormapmethods_getAreas */
        getAreas(): Array<DevExpress.viz.map.Area>;

        /** @docid dxvectormapmethods_getMarkers */
        getMarkers(): Array<DevExpress.viz.map.Marker>;

        /** @docid dxvectormapmethods_viewport#viewport() */
        viewport(): Array<any>;

        /** @docid dxvectormapmethods_viewport#viewport(viewportCoordinates) */
        viewport(viewportCoordinates: Array<number>): void;

        /** @docid dxvectormapmethods_zoomFactor#zoomFactor() */
        zoomFactor(): number;

        /** @docid dxvectormapmethods_zoomFactor#zoomFactor(zoomFactor) */
        zoomFactor(zoomFactor: number): void;
    }
}
