/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.map {
    /** This section describes the Layer object, which represents a vector map layer. */
    export interface MapLayer {
        /** The name of the layer. */
        name: string;

        /** The layer index in the layers array. */
        index: number;

        /** The layer type. Can be "area", "line" or "marker". */
        type: string;

        /** The type of the layer elements. */
        elementType: string;

        /** Gets all layer elements. */
        getElements(): Array<MapLayerElement>;

        /** Deselects all layer elements. */
        clearSelection(): void;

        /** Returns the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }

    /** This section describes the Layer Element object, which represents a vector map layer element. */
    export interface MapLayerElement {
        /** The parent layer of the layer element. */
        layer: MapLayer;

        /** Gets the layer element coordinates. */
        coordinates(): Object;

        /** Sets the value of an attribute. */
        attribute(name: string, value: any): void;

        /** Gets the value of an attribute. */
        attribute(name: string): any;

        /** Gets the selection state of the layer element. */
        selected(): boolean;

        /** Sets the selection state of the layer element. */
        selected(state: boolean): void;

        /** Applies the layer element settings and updates element appearance. */
        applySettings(settings: any): void;
    }

    /**
                                                                          * This section describes the fields and methods that can be used in code to manipulate the Area object.
                                                                          * @deprecated Use the Layer Element instead.
                                                                          */
    export interface Area {
        /**
                                                                         * Contains the element type.
                                                                         * @deprecated Use the Layer.type instead.
                                                                         */
        type: string;

        /**
                                                                        * Return the value of an attribute.
                                                                        * @deprecated Use the Layer Element.attribute(name, value) method instead.
                                                                        */
        attribute(name: string): any;

        /**
                                                                       * Provides information about the selection state of an area.
                                                                       * @deprecated Use the Layer Element.selected() method instead.
                                                                       */
        selected(): boolean;

        /**
                                                                      * Sets a new selection state for an area.
                                                                      * @deprecated Use the Layer Element.selected(state) method instead.
                                                                      */
        selected(state: boolean): void;

        /**
                                                                     * Applies the area settings specified as a parameter and updates the area appearance.
                                                                     * @deprecated Use the Layer Element.applySettings(settings) method instead.
                                                                     */
        applySettings(settings: any): void;
    }

    /**
                                                                    * This section describes the fields and methods that can be used in code to manipulate the Markers object.
                                                                    * @deprecated Use the Layer Element instead.
                                                                    */
    export interface Marker {
        /**
                                                                   * Contains the descriptive text accompanying the map marker.
                                                                   * @deprecated Get the text using the Layer Element.attribute(name) method. The name parameter value for text is set at the dataField option.
                                                                   */
        text: string;

        /**
                                                                  * Contains the type of the element.
                                                                  * @deprecated Use the Layer.type instead.
                                                                  */
        type: string;

        /**
                                                                 * Contains the URL of an image map marker.
                                                                 * @deprecated Get the image URL using the Layer Element.attribute(name) method. The name parameter value for the image URL is set at the dataField option.
                                                                 */
        url: string;

        /**
                                                                * Contains the value of a bubble map marker.
                                                                * @deprecated Get the bubble value using the Layer Element.attribute(name) method. The name parameter for the bubble value is set at the dataField option.
                                                                */
        value: number;

        /**
                                                               * Contains the values of a pie map marker.
                                                               * @deprecated Get the pie values using the Layer Element.attribute(name) method. The name parameter for pie values is set at the dataField option.
                                                               */
        values: Array<number>;

        /**
                                                              * Returns the value of an attribute.
                                                              * @deprecated Use the Layer Element.attribute(name, value) method instead.
                                                              */
        attribute(name: string): any;

        /**
                                                             * Returns the coordinates of a specific marker.
                                                             * @deprecated Use the Layer Element.coordinates() method instead.
                                                             */
        coordinates(): Array<number>;

        /**
                                                            * Provides information about the selection state of a marker.
                                                            * @deprecated Use the Layer Element.selected() method instead.
                                                            */
        selected(): boolean;

        /**
                                                           * Sets a new selection state for a marker.
                                                           * @deprecated Use the Layer Element.selected(state) method instead.
                                                           */
        selected(state: boolean): void;

        /**
                                                          * Applies the marker settings specified as a parameter and updates marker appearance.
                                                          * @deprecated Use the Layer Element.applySettings(settings) method instead.
                                                          */
        applySettings(settings: any): void;
    }

    export interface MapLayerSettings {
        

        /** Specifies the layer name. */
        name?: string;

        /** Specifies layer type. */
        type?: string;

        /** Specifies the type of a marker element. Setting this option makes sense only if the layer type is "marker". */
        elementType?: string;

        /** Specifies a data source for the layer. */
        dataSource?: any;

        /** Specifies the line width (for layers of a line type) or width of the layer elements border in pixels. */
        borderWidth?: number;

        /** Specifies a color for the border of the layer elements. */
        borderColor?: string;

        /** Specifies a color for layer elements. */
        color?: string;

        /** Specifies a color for the border of the layer element when it is hovered over. */
        hoveredBorderColor?: string;

        /** Specifies the pixel-measured line width (for layers of a line type) or width for the border of the layer element when it is hovered over. */
        hoveredBorderWidth?: number;

        /** Specifies a color for a layer element when it is hovered over. */
        hoveredColor?: string;

        /** Specifies a pixel-measured line width (for layers of a line type) or width for the border of the layer element when it is selected. */
        selectedBorderWidth?: number;

        /** Specifies a color for the border of the layer element when it is selected. */
        selectedBorderColor?: string;

        /** Specifies a color for the layer element when it is selected. */
        selectedColor?: string;

        /** Specifies the layer opacity (from 0 to 1). */
        opacity?: number;

        /** Specifies the size of markers. Setting this option makes sense only if the layer type is "marker" and the elementType is "dot", "pie" or "image". */
        size?: number;

        /** Specifies the pixel-measured diameter of the marker that represents the smallest value. Setting this option makes sense only if the layer type is "marker". */
        minSize?: number;

        /** Specifies the pixel-measured diameter of the marker that represents the biggest value. Setting this option makes sense only if the layer type is "marker". */
        maxSize?: number;

        /** Specifies whether or not to change the appearance of a layer element when it is hovered over. */
        hoverEnabled?: boolean;

        /** Specifies whether single or multiple map elements can be selected on a vector map. */
        selectionMode?: string;

        /** Specifies the name of the palette or a custom range of colors to be used for coloring a layer. */
        palette?: any;

        /** Specifies the number of colors in a palette. */
        paletteSize?: number;

        /** Allows you to paint layer elements with similar attributes in the same color. */
        colorGroups?: Array<number>;

        /** Specifies the field that provides data to be used for coloring of layer elements. */
        colorGroupingField?: string;

        /** Allows you to display bubbles with similar attributes in the same size. Setting this option makes sense only if the layer type is "marker" and the elementType is "bubble". */
        sizeGroups?: Array<number>;

        /** Specifies the field that provides data to be used for sizing bubble markers. Setting this option makes sense only if the layer type is "marker" and the elementType is "bubble". */
        sizeGroupingField?: string;

        /** Specifies the name of the attribute containing marker data. Setting this option makes sense only if the layer type is "marker" and the elementType is "bubble", "pie" or "image". */
        dataField?: string;

        /** Specifies the function that customizes each layer element individually. */
        customize?: (eleemnts: Array<MapLayerElement>) => void;

        /** Specifies marker label options. */
        label?: {
            /** The name of the data source attribute containing marker texts. */
            dataField?: string;

            /** Enables marker labels. */
            enabled?: boolean;

            /** Specifies font options for marker labels. */
            font?: viz.core.Font;
        };
    }

    export interface AreaSettings {
        /**
                                                         * Specifies the width of the area border in pixels.
                                                         * @deprecated Use the layers.borderWidth option instead.
                                                         */
        borderWidth?: number;

        /**
                                                        * Specifies a color for the area border.
                                                        * @deprecated Use the layers.borderColor option instead.
                                                        */
        borderColor?: string;

        /**
                                                       * Specifies a color for an area.
                                                       * @deprecated Use the layers.color option instead.
                                                       */
        color?: string;

        /**
                                                      * Specifies the function that customizes each area individually.
                                                      * @deprecated Use the layers.customize option instead.
                                                      */
        customize?: (areaInfo: Area) => AreaSettings;

        /**
                                                     * Specifies a color for the area border when the area is hovered over.
                                                     * @deprecated Use the layers.hoveredBorderColor option instead.
                                                     */
        hoveredBorderColor?: string;

        /**
                                                    * Specifies the pixel-measured width of the area border when the area is hovered over.
                                                    * @deprecated Use the layers.hoveredBorderWidth option instead.
                                                    */
        hoveredBorderWidth?: number;

        /**
                                                   * Specifies a color for an area when this area is hovered over.
                                                   * @deprecated Use the layers.hoveredColor option instead.
                                                   */
        hoveredColor?: string;

        /**
                                                  * Specifies whether or not to change the appearance of an area when it is hovered over.
                                                  * @deprecated Use the layers.hoverEnabled option instead.
                                                  */
        hoverEnabled?: boolean;

        /**
                                                 * Configures area labels.
                                                 * @deprecated Use the layers.label option instead.
                                                 */
        label?: {

            /**
                                                * Specifies the data field that provides data for area labels.
                                                * @deprecated Use the layers.label.dataField option instead.
                                                */
            dataField?: string;

            /**
                                               * Enables area labels.
                                               * @deprecated Use the layers.label.enabled option instead.
                                               */
            enabled?: boolean;

            /**
                                              * Use the layers.label.font option instead.
                                              * @deprecated 
                                              */
            font?: viz.core.Font;
        };

        /**
                                             * Specifies the name of the palette or a custom range of colors to be used for coloring a map.
                                             * @deprecated Use the layers.palette option instead.
                                             */
        palette?: any;

        /**
                                            * Specifies the number of colors in a palette.
                                            * @deprecated Use the layers.paletteSize option instead.
                                            */
        paletteSize?: number;

        /**
                                           * Allows you to paint areas with similar attributes in the same color.
                                           * @deprecated Use the layers.colorGroups option instead.
                                           */
        colorGroups?: Array<number>;

        /**
                                          * Specifies the field that provides data to be used for coloring areas.
                                          * @deprecated Use the layers.colorGroupingField option instead.
                                          */
        colorGroupingField?: string;

        /**
                                         * Specifies a color for the area border when the area is selected.
                                         * @deprecated Use the layers.selectedBorderColor option instead.
                                         */
        selectedBorderColor?: string;

        /**
                                        * Specifies a color for an area when this area is selected.
                                        * @deprecated Use the layers.selectedColor option instead.
                                        */
        selectedColor?: string;

        /**
                                       * Specifies the pixel-measured width of the area border when the area is selected.
                                       * @deprecated Use the layers.selectedBorderWidth option instead.
                                       */
        selectedBorderWidth?: number;

        /**
                                      * Specifies whether single or multiple areas can be selected on a vector map.
                                      * @deprecated Use the layers.selectionMode option instead.
                                      */
        selectionMode?: string;
    }

    export interface MarkerSettings {
        /**
                                     * Specifies a color for the marker border.
                                     * @deprecated Use the layers.borderColor option instead.
                                     */
        borderColor?: string;

        /**
                                    * Specifies the width of the marker border in pixels.
                                    * @deprecated Use the layers.borderWidth option instead.
                                    */
        borderWidth?: number;

        /**
                                   * Specifies a color for a marker of the dot or bubble type.
                                   * @deprecated Use the layers.color option instead.
                                   */
        color?: string;

        /**
                                  * Specifies the function that customizes each marker individually.
                                  * @deprecated Use the layers.customize option instead.
                                  */
        customize?: (markerInfo: Marker) => MarkerSettings;

        /**
                                 * Specifies the pixel-measured width of the marker border when the marker is hovered over.
                                 * @deprecated Use the layers.hoveredBorderWidth option instead.
                                 */
        hoveredBorderWidth?: number;

        /**
                                * Specifies a color for the marker border when the marker is hovered over.
                                * @deprecated Use the layers.hoveredBorderColor option instead.
                                */
        hoveredBorderColor?: string;

        /**
                               * Specifies a color for a marker of the dot or bubble type when this marker is hovered over.
                               * @deprecated Use the layers.hoveredColor option instead.
                               */
        hoveredColor?: string;

        /**
                              * Specifies whether or not to change the appearance of a marker when it is hovered over.
                              * @deprecated Use the layers.hoverEnabled option instead.
                              */
        hoverEnabled?: boolean;

        /**
                             * Specifies marker label options.
                             * @deprecated Use the layers.label option instead.
                             */
        label?: {

            /**
                            * Enables marker labels.
                            * @deprecated Use the layers.label.enabled option instead.
                            */
            enabled?: boolean;

            /**
                           * Use the layers.label.font option instead.
                           * @deprecated 
                           */
            font?: viz.core.Font;
        };

        /**
                          * Specifies the pixel-measured diameter of the marker that represents the biggest value. Setting this option makes sense only if you use markers of the bubble type.
                          * @deprecated Use the layers.maxSize option instead.
                          */
        maxSize?: number;

        /**
                         * Specifies the pixel-measured diameter of the marker that represents the smallest value. Setting this option makes sense only if you use markers of the bubble type.
                         * @deprecated Use the layers.minSize option instead.
                         */
        minSize?: number;

        /**
                        * Specifies the opacity of markers. Setting this option makes sense only if you use markers of the bubble type.
                        * @deprecated Use the layers.opacity option instead.
                        */
        opacity?: number;

        /**
                       * Specifies the pixel-measured width of the marker border when the marker is selected.
                       * @deprecated Use the layers.selectedBorderWidth option instead.
                       */
        selectedBorderWidth?: number;

        /**
                      * Specifies a color for the marker border when the marker is selected.
                      * @deprecated Use the layers.selectedBorderColor option instead.
                      */
        selectedBorderColor?: string;

        /**
                     * Specifies a color for a marker of the dot or bubble type when this marker is selected.
                     * @deprecated Use the layers.selectedColor option instead.
                     */
        selectedColor?: string;

        /**
                    * Specifies whether a single or multiple markers can be selected on a vector map.
                    * @deprecated Use the layers.selectionMode option instead.
                    */
        selectionMode?: string;

        /**
                   * Specifies the size of markers. Setting this option makes sense for any type of marker except bubble.
                   * @deprecated Use the layers.size option instead.
                   */
        size?: number;

        /**
                  * Specifies the type of markers to be used on the map.
                  * @deprecated Use the layers.elementType option instead.
                  */
        type?: string;

        /**
                 * Specifies the name of a palette or a custom set of colors to be used for coloring markers of the pie type.
                 * @deprecated Use the layers.palette option instead.
                 */
        palette?: any;

        /**
                * Allows you to paint markers with similar attributes in the same color.
                * @deprecated Use the layers.colorGroups option instead.
                */
        colorGroups?: Array<number>;

        /**
               * Specifies the field that provides data to be used for coloring markers.
               * @deprecated Use the layers.colorGroupingField option instead.
               */
        colorGroupingField?: string;

        /**
              * Allows you to display bubbles with similar attributes in the same size.
              * @deprecated Use the layers.sizeGroups option instead.
              */
        sizeGroups?: Array<number>;

        /**
             * Specifies the field that provides data to be used for sizing bubble markers.
             * @deprecated Use the layers.sizeGroupingField option instead.
             */
        sizeGroupingField?: string;
    }

    export interface dxVectorMapOptions extends viz.core.BaseWidgetOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        

        
        

        
        
        
        
        
        

        /**
            * An object specifying options for the map areas.
            * @deprecated Use the "area" type element of the layers array.
            */
        areaSettings?: AreaSettings;

        /** Specifies the options for the map background. */
        background?: {

            /** Specifies a color for the background border. */
            borderColor?: string;

            /** Specifies a color for the background. */
            color?: string;
        };

        /** Specifies options for VectorMap widget layers. */
        layers?: Array<MapLayerSettings>;

        /** Specifies the map projection. */
        projection?: Object;

        /** Specifies the positioning of a map in geographical coordinates. */
        bounds?: Array<number>;

        /** Specifies the options of the control bar. */
        controlBar?: {

            /** Specifies a color for the outline of the control bar elements. */
            borderColor?: string;

            /** Specifies a color for the inner area of the control bar elements. */
            color?: string;

            /** Specifies whether or not to display the control bar. */
            enabled?: boolean;

            /** Specifies the margin of the control bar in pixels. */
            margin?: number;

            /** Specifies the position of the control bar. */
            horizontalAlignment?: string;

            /** Specifies the position of the control bar. */
            verticalAlignment?: string;

            /** Specifies the opacity of the control bar. */
            opacity?: number;
        };

        /**
           * Specifies a data source for the map area.
           * @deprecated Use the layers.dataSource option instead.
           */
        mapData?: any;

        /**
          * Specifies a data source for the map markers.
          * @deprecated Use the layers.dataSource option instead.
          */
        markers?: any;

        /**
         * An object specifying options for the map markers.
         * @deprecated Use the "marker" type element of the layers array.
         */
        markerSettings?: MarkerSettings;

        /** Configures tooltips. */
        tooltip?: viz.core.Tooltip;

        /** Configures map legends. */
        legends?: Array<Legend>;

        /** Specifies whether or not the map should respond when a user rolls the mouse wheel. */
        wheelEnabled?: boolean;

        /** Specifies whether the map should respond to touch gestures. */
        touchEnabled?: boolean;

        /** Disables the zooming capability. */
        zoomingEnabled?: boolean;

        /** Specifies the geographical coordinates of the center for a map. */
        center?: Array<number>;

        /** A handler for the centerChanged event. */
        onCenterChanged?: (e: {
			center: Array<number>;
			component: dxVectorMap;
			element: Element;
        }) => void;

        /** A handler for the tooltipShown event. */
        onTooltipShown?: (e: {
            component: dxVectorMap;
            element: Element;
            target: {};
        }) => void;

        /** A handler for the tooltipHidden event. */
        onTooltipHidden?: (e: {
            component: dxVectorMap;
            element: Element;
            target: {};
        }) => void;

        /** Specifies a number that is used to zoom a map initially. */
        zoomFactor?: number;

        /** Specifies a map's maximum zoom factor. */
        maxZoomFactor?: number;

        /** A handler for the zoomFactorChanged event. */
        onZoomFactorChanged?: (e: {
            component: dxVectorMap;
            element: Element;
            zoomFactor: number;
        }) => void;

        /** A handler for the click event. */
        onClick?: any;

        /** A handler for the selectionChanged event. */
        onSelectionChanged?: (e: {
            component: dxVectorMap;
            element: Element;
            target: MapLayerElement;
        }) => void;

        /**
        * A handler for the areaClick event.
        * @deprecated Use the onClick option instead.
        */
        onAreaClick?: any;

        /**
       * A handler for the areaSelectionChanged event.
       * @deprecated Use the onSelectionChanged option instead.
       */
        onAreaSelectionChanged?: (e: {
            target: Area;
            component: dxVectorMap;
            element: Element;
        }) => void;

        /**
      * A handler for the markerClick event.
      * @deprecated Use the onClick option instead.
      */
        onMarkerClick?: any;

        /**
     * A handler for the markerSelectionChanged event.
     * @deprecated Use the onSelecitonChanged option instead.
     */
        onMarkerSelectionChanged?: (e: {
            target: Marker;
            component: dxVectorMap;
            element: Element;
        }) => void;

        /** Disables the panning capability. */
        panningEnabled?: boolean;
    }

    export interface Legend extends viz.core.BaseLegend {
        /** Specifies the color of item markers in the legend. The specified color applied only when the legend uses 'size' source. */
        markerColor?: string;

        /** Specifies the shape of item markers. */
        markerShape?: string;

        /** Specifies text for legend items. */
        customizeText?: (itemInfo: { start: number; end: number; index: number; color: string; size: number; }) => string;

        /** Specifies text for a hint that appears when a user hovers the mouse pointer over the text of a legend item. */
        customizeHint?: (itemInfo: { start: number; end: number; index: number; color: string; size: number }) => string;

        /** Specifies the source of data for the legend. */
        source?: {
            /** Specifies a layer to which the legend belongs. */
            layer?: string;
            /** Specifies the type of the legend grouping. */
            grouping?: string;
        }
    }

    

    export var projection: ProjectionCreator;

    export interface ProjectionCreator {
        /** Creates a new projection. */
        (data: {
            to?: (coordinates: Array<number>) => Array<number>;
            from?: (coordinates: Array<number>) => Array<number>;
            aspectRatio?: number;
        }): Object;

        /** Gets the default or custom projection from the projection storage. */
        get(name: string): Object;

        /** Adds a new projection to the internal projections storage. */
        add(name: string, projection: Object): void;
    }
}

declare module DevExpress.viz {
    /** The VectorMap is a widget that visualizes geographical locations. This widget represents a geographical map that contains areas and markers. Areas embody continents and countries. Markers flag specific points on the map, for example, towns, cities or capitals. */
    export class dxVectorMap extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.map.dxVectorMapOptions);
        constructor(element: Element, options?: DevExpress.viz.map.dxVectorMapOptions);

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** Gets the current coordinates of the map center. */
        center(): Array<number>;

        /** Sets the coordinates of the map center. */
        center(centerCoordinates: Array<number>): void;

        /**
    * Deselects all the selected areas on a map. The areas are displayed in their initial style after.
    * @deprecated Use the layer's clearSelection() method instead.
    */
        clearAreaSelection(): void;

        /**
   * Deselects all the selected markers on a map. The markers are displayed in their initial style after.
   * @deprecated Use the layer's clearSelection() method instead.
   */
        clearMarkerSelection(): void;

        /** Deselects all the selected area and markers on a map at once. The areas and markers are displayed in their initial style after. */
        clearSelection(): void;

        /** Converts client area coordinates into map coordinates. */
        convertCoordinates(x: number, y: number): Array<number>;

        /** Gets all map layers. */
        getLayers(): Array<DevExpress.viz.map.MapLayer>;

        /** Gets the layer by its index. */
        getLayerByIndex(index: number): DevExpress.viz.map.MapLayer;

        /** Gets the layer by its name. */
        getLayerByName(name: string): DevExpress.viz.map.MapLayer;

        /**
  * Returns an array with all the map areas.
  * @deprecated Use the layer's getElements() method instead.
  */
        getAreas(): Array<DevExpress.viz.map.Area>;

        /**
 * Returns an array with all the map markers.
 * @deprecated Use the layer's getElements() method instead.
 */
        getMarkers(): Array<DevExpress.viz.map.Marker>;

        /** Gets the current coordinates of the map viewport. */
        viewport(): Array<any>;

        /** Sets the coordinates of the map viewport. */
        viewport(viewportCoordinates: Array<number>): void;

        /** Gets the current value of the map zoom factor. */
        zoomFactor(): number;

        /** Sets the value of the map zoom factor. */
        zoomFactor(zoomFactor: number): void;
    }
}
