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

export type VectorMapLayerType = 'area' | 'line' | 'marker';
export type VectorMapMarkerShape = 'circle' | 'square';
export type VectorMapMarkerType = 'bubble' | 'dot' | 'image' | 'pie';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface TooltipInfo {
    /**
     * 
     */
    target?: MapLayerElement | dxVectorMapAnnotationConfig;
}

/**
 * The type of the centerChanged event handler&apos;s argument.
 */
export type CenterChangedEvent = EventInfo<dxVectorMap> & {
    /**
     * 
     */
    readonly center: Array<number>;
};

/**
 * The type of the click event handler&apos;s argument.
 */
export type ClickEvent = NativeEventInfo<dxVectorMap, MouseEvent | PointerEvent> & {
    /**
     * 
     */
    readonly target: MapLayerElement;
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxVectorMap>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxVectorMap>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxVectorMap>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxVectorMap> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxVectorMap>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxVectorMap> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxVectorMap>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxVectorMap> & ChangedOptionInfo;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxVectorMap> & {
    /**
     * 
     */
    readonly target: MapLayerElement;
};

/**
 * The type of the tooltipHidden event handler&apos;s argument.
 */
export type TooltipHiddenEvent = EventInfo<dxVectorMap> & TooltipInfo;

/**
 * The type of the tooltipShown event handler&apos;s argument.
 */
export type TooltipShownEvent = EventInfo<dxVectorMap> & TooltipInfo;

/**
 * The type of the zoomFactorChanged event handler&apos;s argument.
 */
export type ZoomFactorChangedEvent = EventInfo<dxVectorMap> & {
    /**
     * 
     */
    readonly zoomFactor: number;
};

/**
 * This section describes the Layer object, which represents a vector map layer.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface MapLayer {
    /**
     * Deselects all layer elements.
     */
    clearSelection(): void;
    /**
     * The type of the layer elements.
     */
    elementType?: string;
    /**
     * Returns the DataSource instance.
     */
    getDataSource(): DataSource;
    /**
     * Gets all layer elements.
     */
    getElements(): Array<MapLayerElement>;
    /**
     * The layer index in the layers array.
     */
    index?: number;
    /**
     * The name of the layer.
     */
    name?: string;
    /**
     * The layer type. Can be &apos;area&apos;, &apos;line&apos; or &apos;marker&apos;.
     */
    type?: string;
}

/**
 * This section describes the Layer Element object, which represents a vector map layer element.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface MapLayerElement {
    /**
     * Applies the layer element settings and updates element appearance.
     */
    applySettings(settings: any): void;
    /**
     * Gets the value of an attribute.
     */
    attribute(name: string): any;
    /**
     * Sets the value of an attribute.
     */
    attribute(name: string, value: any): void;
    /**
     * Gets the layer element coordinates.
     */
    coordinates(): any;
    /**
     * The parent layer of the layer element.
     */
    layer?: any;
    /**
     * Gets the selection state of the layer element.
     */
    selected(): boolean;
    /**
     * Sets the selection state of the layer element.
     */
    selected(state: boolean): void;
}

/**
 * An object that provides information about a legend item in the VectorMap UI component.
 */
export type LegendItem = VectorMapLegendItem;

/**
 * @deprecated Use LegendItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface VectorMapLegendItem extends BaseLegendItem {
    /**
     * The color of the legend item&apos;s marker.
     */
    color?: string;
    /**
     * The end value of the group that the legend item indicates.
     */
    end?: number;
    /**
     * The diameter of the legend item&apos;s marker in pixels.
     */
    size?: number;
    /**
     * The start value of the group that the legend item indicates.
     */
    start?: number;
}

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxVectorMapOptions extends BaseWidgetOptions<dxVectorMap> {
    /**
     * Specifies the properties for the map background.
     */
    background?: {
      /**
       * Specifies a color for the background border.
       */
      borderColor?: string;
      /**
       * Specifies a color for the background.
       */
      color?: string;
    };
    /**
     * Specifies the positioning of a map in geographical coordinates.
     */
    bounds?: Array<number>;
    /**
     * Specifies the geographical coordinates of the center for a map.
     */
    center?: Array<number>;
    /**
     * Configures the control bar.
     */
    controlBar?: {
      /**
       * Specifies a color for the outline of the control bar elements.
       */
      borderColor?: string;
      /**
       * Specifies a color for the inner area of the control bar elements.
       */
      color?: string;
      /**
       * Specifies whether or not to display the control bar.
       */
      enabled?: boolean;
      /**
       * Specifies whether the pan control is visible.
       */
      panVisible?: boolean;
      /**
       * Specifies whether the zoom bar is visible.
       */
      zoomVisible?: boolean;
      /**
       * Specifies the position of the control bar.
       */
      horizontalAlignment?: HorizontalAlignment;
      /**
       * Specifies the margin of the control bar in pixels.
       */
      margin?: number;
      /**
       * Specifies the opacity of the control bar.
       */
      opacity?: number;
      /**
       * Specifies the position of the control bar.
       */
      verticalAlignment?: VerticalEdge;
    };
    /**
     * Specifies properties for VectorMap UI component layers.
     */
    layers?: Array<{
      /**
       * Specifies a color for the border of the layer elements.
       */
      borderColor?: string;
      /**
       * Specifies the line width (for layers of a line type) or width of the layer elements border in pixels.
       */
      borderWidth?: number;
      /**
       * Specifies a color for layer elements.
       */
      color?: string;
      /**
       * Specifies the field that provides data to be used for coloring of layer elements.
       */
      colorGroupingField?: string | undefined;
      /**
       * Allows you to paint layer elements with similar attributes in the same color.
       */
      colorGroups?: Array<number>;
      /**
       * A function that customizes each layer element individually.
       */
      customize?: ((elements: Array<MapLayerElement>) => void);
      /**
       * Specifies the name of the attribute containing marker data. Setting this property makes sense only if the layer type is &apos;marker&apos; and the elementType is &apos;bubble&apos;, &apos;pie&apos; or &apos;image&apos;.
       */
      dataField?: string | undefined;
      /**
       * Specifies a data source for the layer.
       */
      dataSource?: object | DataSourceLike<any> | null;
      /**
       * Specifies the type of a marker element. Setting this property makes sense only if the layer type is &apos;marker&apos;.
       */
      elementType?: VectorMapMarkerType;
      /**
       * Specifies whether or not to change the appearance of a layer element when it is hovered over.
       */
      hoverEnabled?: boolean;
      /**
       * Specifies a color for the border of the layer element when it is hovered over.
       */
      hoveredBorderColor?: string;
      /**
       * Specifies the pixel-measured line width (for layers of a line type) or width for the border of the layer element when it is hovered over.
       */
      hoveredBorderWidth?: number;
      /**
       * Specifies a color for a layer element when it is hovered over.
       */
      hoveredColor?: string;
      /**
       * Specifies marker label properties.
       */
      label?: {
        /**
         * The name of the data source attribute containing marker texts.
         */
        dataField?: string;
        /**
         * Enables marker labels.
         */
        enabled?: boolean;
        /**
         * Specifies font properties for marker labels.
         */
        font?: Font;
      };
      /**
       * Specifies the pixel-measured diameter of the marker that represents the biggest value. Setting this property makes sense only if the layer type is &apos;marker&apos;.
       */
      maxSize?: number;
      /**
       * Specifies the pixel-measured diameter of the marker that represents the smallest value. Setting this property makes sense only if the layer type is &apos;marker&apos;.
       */
      minSize?: number;
      /**
       * Specifies the layer name.
       */
      name?: string;
      /**
       * Specifies the layer opacity (from 0 to 1).
       */
      opacity?: number;
      /**
       * The name of a predefined palette or a custom range of colors to be used as a palette.
       */
      palette?: Array<string> | Palette;
      /**
       * Specifies the number of colors in a palette.
       */
      paletteSize?: number;
      /**
       * The position of a color in the palette[] array. Should not exceed the value of the paletteSize property.
       */
      paletteIndex?: number;
      /**
       * Specifies a color for the border of the layer element when it is selected.
       */
      selectedBorderColor?: string;
      /**
       * Specifies a pixel-measured line width (for layers of a line type) or width for the border of the layer element when it is selected.
       */
      selectedBorderWidth?: number;
      /**
       * Specifies a color for the layer element when it is selected.
       */
      selectedColor?: string;
      /**
       * Specifies whether single or multiple map elements can be selected on a vector map.
       */
      selectionMode?: SingleMultipleOrNone;
      /**
       * Specifies the size of markers. Setting this property makes sense only if the layer type is &apos;marker&apos; and the elementType is &apos;dot&apos;, &apos;pie&apos; or &apos;image&apos;.
       */
      size?: number;
      /**
       * Specifies the field that provides data to be used for sizing bubble markers. Setting this property makes sense only if the layer type is &apos;marker&apos; and the elementType is &apos;bubble&apos;.
       */
      sizeGroupingField?: string | undefined;
      /**
       * Allows you to display bubbles with similar attributes in the same size. Setting this property makes sense only if the layer type is &apos;marker&apos; and the elementType is &apos;bubble&apos;.
       */
      sizeGroups?: Array<number>;
      /**
       * Specifies layer type.
       */
      type?: VectorMapLayerType;
    }> | { borderColor?: string; borderWidth?: number; color?: string; colorGroupingField?: string; colorGroups?: Array<number>; customize?: ((elements: Array<MapLayerElement>) => any); dataField?: string; dataSource?: object | DataSourceLike<any> | null; elementType?: 'bubble' | 'dot' | 'image' | 'pie'; hoverEnabled?: boolean; hoveredBorderColor?: string; hoveredBorderWidth?: number; hoveredColor?: string; label?: { dataField?: string; enabled?: boolean; font?: Font }; maxSize?: number; minSize?: number; name?: string; opacity?: number; palette?: Array<string> | Palette; paletteSize?: number; selectedBorderColor?: string; selectedBorderWidth?: number; selectedColor?: string; selectionMode?: SingleMultipleOrNone; size?: number; sizeGroupingField?: string; sizeGroups?: Array<number>; type?: 'area' | 'line' | 'marker' };
    /**
     * Configures map legends.
     */
    legends?: Array<Legend> | undefined;
    /**
     * Generates space around the UI component.
     */
    margin?: BaseWidgetMargin;
    /**
     * Specifies a map&apos;s maximum zoom factor.
     */
    maxZoomFactor?: number;
    /**
     * A function that is executed each time the center coordinates are changed.
     */
    onCenterChanged?: ((e: CenterChangedEvent) => void);
    /**
     * A function that is executed when any location on the map is clicked or tapped.
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * A function that is executed when a layer element is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * A function that is executed when a tooltip becomes hidden.
     */
    onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
    /**
     * A function that is executed when a tooltip appears.
     */
    onTooltipShown?: ((e: TooltipShownEvent) => void);
    /**
     * A function that is executed each time the zoom factor is changed.
     */
    onZoomFactorChanged?: ((e: ZoomFactorChangedEvent) => void);
    /**
     * Disables the panning capability.
     */
    panningEnabled?: boolean;
    /**
     * Specifies the map projection.
     */
    projection?: VectorMapProjection | VectorMapProjectionConfig | string | any;
    /**
     * Configures tooltips.
     */
    tooltip?: Tooltip;
    /**
     * Specifies whether the map should respond to touch gestures.
     */
    touchEnabled?: boolean;
    /**
     * Specifies whether or not the map should respond when a user rolls the mouse wheel.
     */
    wheelEnabled?: boolean;
    /**
     * Specifies a number that is used to zoom a map initially.
     */
    zoomFactor?: number;
    /**
     * Disables the zooming capability.
     */
    zoomingEnabled?: boolean;
    /**
     * Specifies settings common for all annotations in the VectorMap.
     */
    commonAnnotationSettings?: dxVectorMapCommonAnnotationConfig;
    /**
     * Specifies the annotation collection.
     */
    annotations?: Array<dxVectorMapAnnotationConfig | any>;
    /**
     * Customizes an individual annotation.
     */
    customizeAnnotation?: ((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig) | undefined;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxVectorMapAnnotationConfig extends dxVectorMapCommonAnnotationConfig {
    /**
     * Specifies the annotation&apos;s name.
     */
    name?: string | undefined;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxVectorMapCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
    /**
     * Positions the annotation&apos;s center at specified geographic coordinates: [longitude, latitude].
     */
    coordinates?: Array<number>;
    /**
     * Customizes the text and appearance of the annotation&apos;s tooltip.
     */
    customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => any) | undefined;
    /**
     * Specifies a custom template for the annotation. Applies only if the type is &apos;custom&apos;.
     */
    template?: template | ((annotation: dxVectorMapAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * Specifies a custom template for an annotation&apos;s tooltip.
     */
    tooltipTemplate?: template | ((annotation: dxVectorMapAnnotationConfig | any, element: DxElement) => string | UserDefinedElement) | undefined;
}

/**
 * Configures map legends.
 */
export type Legend = BaseLegend & {
    /**
     * Specifies text for a hint that appears when a user hovers the mouse pointer over the text of a legend item.
     */
    customizeHint?: ((itemInfo: { start?: number; end?: number; index?: number; color?: string; size?: number }) => string);
    /**
     * Allows you to change the order and visibility of legend items.
     */
    customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
    /**
     * Specifies text for legend items.
     */
    customizeText?: ((itemInfo: { start?: number; end?: number; index?: number; color?: string; size?: number }) => string);
    /**
     * Specifies the legend items&apos; font properties.
     */
    font?: Font;
    /**
     * Specifies the color of item markers in the legend. The specified color applied only when the legend uses &apos;size&apos; source.
     */
    markerColor?: string | undefined;
    /**
     * Specifies the shape of item markers.
     */
    markerShape?: VectorMapMarkerShape;
    /**
     * Specifies the marker&apos;s size in a legend item in pixels.
     */
    markerSize?: number;
    /**
     * Specifies an SVG element that serves as a custom legend item marker.
     */
    markerTemplate?: template | ((legendItem: LegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * Specifies the source of data for the legend.
     */
    source?: {
      /**
       * Specifies the type of the legend grouping.
       */
      grouping?: string;
      /**
       * Specifies a layer to which the legend belongs.
       */
      layer?: string;
    };
};
/**
 * Configures tooltips.
 */
export type Tooltip = BaseWidgetTooltip & {
    /**
     * Specifies a custom template for a tooltip.
     */
    contentTemplate?: template | ((info: MapLayerElement, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * Specifies text and appearance of a set of tooltips.
     */
    customizeTooltip?: ((info: MapLayerElement) => any) | undefined;
    /**
     * 
     */
    format?: Format;
};
/**
 * The VectorMap is a UI component that visualizes geographical locations. This UI component represents a geographical map that contains areas and markers. Areas embody continents and countries. Markers flag specific points on the map, for example, towns, cities or capitals.
 */
export default class dxVectorMap extends BaseWidget<dxVectorMapOptions> {
    /**
     * Gets the current map center coordinates.
     */
    center(): Array<number>;
    /**
     * Sets the map center coordinates.
     */
    center(centerCoordinates: Array<number>): void;
    /**
     * Deselects all the selected area and markers on a map at once. The areas and markers are displayed in their initial style after.
     */
    clearSelection(): void;
    /**
     * Converts client area coordinates into map coordinates.
     * @deprecated Use the convertToGeo(x, y) method instead.
     */
    convertCoordinates(x: number, y: number): Array<number>;
    /**
     * Converts coordinates from pixels to the dataSource coordinate system.
     */
    convertToGeo(x: number, y: number): Array<number>;
    /**
     * Converts coordinates from the dataSource coordinate system to pixels.
     */
    convertToXY(longitude: number, latitude: number): Array<number>;
    /**
     * Gets a layer with a specific index.
     */
    getLayerByIndex(index: number): MapLayer;
    /**
     * Gets a layer with a specific name.
     */
    getLayerByName(name: string): MapLayer;
    /**
     * Gets all layers.
     */
    getLayers(): Array<MapLayer>;
    /**
     * Gets the current map viewport coordinates.
     */
    viewport(): Array<number>;
    /**
     * Sets the map viewport coordinates.
     */
    viewport(viewportCoordinates: Array<number>): void;
    /**
     * Gets the current zoom factor value.
     */
    zoomFactor(): number;
    /**
     * Sets the zoom factor value.
     */
    zoomFactor(zoomFactor: number): void;
}

export type Properties = dxVectorMapOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxVectorMapOptions;

// #region deprecated in v23.1

/**
 * @deprecated Use Legend instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxVectorMapLegends = Legend;

/**
 * @deprecated Use Tooltip instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
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
