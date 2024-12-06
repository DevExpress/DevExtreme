import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import VectorMap, { Properties } from "devextreme/viz/vector_map";
import  DataSource from "devextreme/data/data_source";
import {
 dxVectorMapAnnotationConfig,
 dxVectorMapCommonAnnotationConfig,
 CenterChangedEvent,
 ClickEvent,
 DisposingEvent,
 DrawnEvent,
 ExportedEvent,
 ExportingEvent,
 FileSavingEvent,
 IncidentOccurredEvent,
 InitializedEvent,
 OptionChangedEvent,
 SelectionChangedEvent,
 TooltipHiddenEvent,
 TooltipShownEvent,
 ZoomFactorChangedEvent,
 MapLayerElement,
 VectorMapMarkerType,
 VectorMapLayerType,
 VectorMapLegendItem,
 VectorMapMarkerShape,
} from "devextreme/viz/vector_map";
import {
 VectorMapProjection,
 VectorMapProjectionConfig,
} from "devextreme/viz/vector_map/projection";
import {
 Theme,
 Font,
 TextOverflow,
 AnnotationType,
 WordWrap,
 DashStyle,
 Palette,
} from "devextreme/common/charts";
import {
 HorizontalAlignment,
 VerticalEdge,
 ExportFormat,
 SingleMultipleOrNone,
 Position,
 Orientation,
} from "devextreme/common";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "annotations" |
  "background" |
  "bounds" |
  "center" |
  "commonAnnotationSettings" |
  "controlBar" |
  "customizeAnnotation" |
  "disabled" |
  "elementAttr" |
  "export" |
  "layers" |
  "legends" |
  "loadingIndicator" |
  "maxZoomFactor" |
  "onCenterChanged" |
  "onClick" |
  "onDisposing" |
  "onDrawn" |
  "onExported" |
  "onExporting" |
  "onFileSaving" |
  "onIncidentOccurred" |
  "onInitialized" |
  "onOptionChanged" |
  "onSelectionChanged" |
  "onTooltipHidden" |
  "onTooltipShown" |
  "onZoomFactorChanged" |
  "panningEnabled" |
  "pathModified" |
  "projection" |
  "redrawOnResize" |
  "rtlEnabled" |
  "size" |
  "theme" |
  "title" |
  "tooltip" |
  "touchEnabled" |
  "wheelEnabled" |
  "zoomFactor" |
  "zoomingEnabled"
>;

interface DxVectorMap extends AccessibleOptions {
  readonly instance?: VectorMap;
}

const componentConfig = {
  props: {
    annotations: Array as PropType<Array<any | dxVectorMapAnnotationConfig>>,
    background: Object as PropType<Record<string, any>>,
    bounds: Array as PropType<Array<number>>,
    center: Array as PropType<Array<number>>,
    commonAnnotationSettings: Object as PropType<dxVectorMapCommonAnnotationConfig | Record<string, any>>,
    controlBar: Object as PropType<Record<string, any>>,
    customizeAnnotation: Function as PropType<((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig)>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    export: Object as PropType<Record<string, any>>,
    layers: [Array, Object] as PropType<Array<Record<string, any>> | Record<string, any>>,
    legends: Array as PropType<Array<Record<string, any>>>,
    loadingIndicator: Object as PropType<Record<string, any>>,
    maxZoomFactor: Number,
    onCenterChanged: Function as PropType<((e: CenterChangedEvent) => void)>,
    onClick: Function as PropType<((e: ClickEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onDrawn: Function as PropType<((e: DrawnEvent) => void)>,
    onExported: Function as PropType<((e: ExportedEvent) => void)>,
    onExporting: Function as PropType<((e: ExportingEvent) => void)>,
    onFileSaving: Function as PropType<((e: FileSavingEvent) => void)>,
    onIncidentOccurred: Function as PropType<((e: IncidentOccurredEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    onTooltipHidden: Function as PropType<((e: TooltipHiddenEvent) => void)>,
    onTooltipShown: Function as PropType<((e: TooltipShownEvent) => void)>,
    onZoomFactorChanged: Function as PropType<((e: ZoomFactorChangedEvent) => void)>,
    panningEnabled: Boolean,
    pathModified: Boolean,
    projection: [Object, String] as PropType<Record<string, any> | string | VectorMapProjection | VectorMapProjectionConfig>,
    redrawOnResize: Boolean,
    rtlEnabled: Boolean,
    size: Object as PropType<Record<string, any>>,
    theme: String as PropType<Theme>,
    title: [Object, String] as PropType<Record<string, any> | string>,
    tooltip: Object as PropType<Record<string, any>>,
    touchEnabled: Boolean,
    wheelEnabled: Boolean,
    zoomFactor: Number,
    zoomingEnabled: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:annotations": null,
    "update:background": null,
    "update:bounds": null,
    "update:center": null,
    "update:commonAnnotationSettings": null,
    "update:controlBar": null,
    "update:customizeAnnotation": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:layers": null,
    "update:legends": null,
    "update:loadingIndicator": null,
    "update:maxZoomFactor": null,
    "update:onCenterChanged": null,
    "update:onClick": null,
    "update:onDisposing": null,
    "update:onDrawn": null,
    "update:onExported": null,
    "update:onExporting": null,
    "update:onFileSaving": null,
    "update:onIncidentOccurred": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:onTooltipHidden": null,
    "update:onTooltipShown": null,
    "update:onZoomFactorChanged": null,
    "update:panningEnabled": null,
    "update:pathModified": null,
    "update:projection": null,
    "update:redrawOnResize": null,
    "update:rtlEnabled": null,
    "update:size": null,
    "update:theme": null,
    "update:title": null,
    "update:tooltip": null,
    "update:touchEnabled": null,
    "update:wheelEnabled": null,
    "update:zoomFactor": null,
    "update:zoomingEnabled": null,
  },
  computed: {
    instance(): VectorMap {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = VectorMap;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      annotation: { isCollectionItem: true, optionName: "annotations" },
      background: { isCollectionItem: false, optionName: "background" },
      commonAnnotationSettings: { isCollectionItem: false, optionName: "commonAnnotationSettings" },
      controlBar: { isCollectionItem: false, optionName: "controlBar" },
      export: { isCollectionItem: false, optionName: "export" },
      layer: { isCollectionItem: true, optionName: "layers" },
      legend: { isCollectionItem: true, optionName: "legends" },
      loadingIndicator: { isCollectionItem: false, optionName: "loadingIndicator" },
      projection: { isCollectionItem: false, optionName: "projection" },
      size: { isCollectionItem: false, optionName: "size" },
      title: { isCollectionItem: false, optionName: "title" },
      tooltip: { isCollectionItem: false, optionName: "tooltip" },
      vectorMapTitle: { isCollectionItem: false, optionName: "title" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxVectorMap = defineComponent(componentConfig);


const DxAnnotationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDragging": null,
    "update:arrowLength": null,
    "update:arrowWidth": null,
    "update:border": null,
    "update:color": null,
    "update:coordinates": null,
    "update:customizeTooltip": null,
    "update:data": null,
    "update:description": null,
    "update:font": null,
    "update:height": null,
    "update:image": null,
    "update:name": null,
    "update:offsetX": null,
    "update:offsetY": null,
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:shadow": null,
    "update:template": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:tooltipEnabled": null,
    "update:tooltipTemplate": null,
    "update:type": null,
    "update:width": null,
    "update:wordWrap": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    allowDragging: Boolean,
    arrowLength: Number,
    arrowWidth: Number,
    border: Object as PropType<Record<string, any>>,
    color: String,
    coordinates: Array as PropType<Array<number>>,
    customizeTooltip: Function as PropType<((annotation: dxVectorMapAnnotationConfig | any) => Record<string, any>)>,
    data: {},
    description: String,
    font: Object as PropType<Font | Record<string, any>>,
    height: Number,
    image: [Object, String] as PropType<Record<string, any> | string>,
    name: String,
    offsetX: Number,
    offsetY: Number,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    shadow: Object as PropType<Record<string, any>>,
    template: {},
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    tooltipEnabled: Boolean,
    tooltipTemplate: {},
    type: String as PropType<AnnotationType>,
    width: Number,
    wordWrap: String as PropType<WordWrap>,
    x: Number,
    y: Number
  }
};

prepareConfigurationComponentConfig(DxAnnotationConfig);

const DxAnnotation = defineComponent(DxAnnotationConfig);

(DxAnnotation as any).$_optionName = "annotations";
(DxAnnotation as any).$_isCollectionItem = true;
(DxAnnotation as any).$_expectedChildren = {
  annotationBorder: { isCollectionItem: false, optionName: "border" },
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  image: { isCollectionItem: false, optionName: "image" },
  shadow: { isCollectionItem: false, optionName: "shadow" }
};

const DxAnnotationBorderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:cornerRadius": null,
    "update:dashStyle": null,
    "update:opacity": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    cornerRadius: Number,
    dashStyle: String as PropType<DashStyle>,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxAnnotationBorderConfig);

const DxAnnotationBorder = defineComponent(DxAnnotationBorderConfig);

(DxAnnotationBorder as any).$_optionName = "border";

const DxBackgroundConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:borderColor": null,
    "update:color": null,
  },
  props: {
    borderColor: String,
    color: String
  }
};

prepareConfigurationComponentConfig(DxBackgroundConfig);

const DxBackground = defineComponent(DxBackgroundConfig);

(DxBackground as any).$_optionName = "background";

const DxBorderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:cornerRadius": null,
    "update:dashStyle": null,
    "update:opacity": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    cornerRadius: Number,
    dashStyle: String as PropType<DashStyle>,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxBorderConfig);

const DxBorder = defineComponent(DxBorderConfig);

(DxBorder as any).$_optionName = "border";

const DxCommonAnnotationSettingsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDragging": null,
    "update:arrowLength": null,
    "update:arrowWidth": null,
    "update:border": null,
    "update:color": null,
    "update:coordinates": null,
    "update:customizeTooltip": null,
    "update:data": null,
    "update:description": null,
    "update:font": null,
    "update:height": null,
    "update:image": null,
    "update:offsetX": null,
    "update:offsetY": null,
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:shadow": null,
    "update:template": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:tooltipEnabled": null,
    "update:tooltipTemplate": null,
    "update:type": null,
    "update:width": null,
    "update:wordWrap": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    allowDragging: Boolean,
    arrowLength: Number,
    arrowWidth: Number,
    border: Object as PropType<Record<string, any>>,
    color: String,
    coordinates: Array as PropType<Array<number>>,
    customizeTooltip: Function as PropType<((annotation: dxVectorMapAnnotationConfig | any) => Record<string, any>)>,
    data: {},
    description: String,
    font: Object as PropType<Font | Record<string, any>>,
    height: Number,
    image: [Object, String] as PropType<Record<string, any> | string>,
    offsetX: Number,
    offsetY: Number,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    shadow: Object as PropType<Record<string, any>>,
    template: {},
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    tooltipEnabled: Boolean,
    tooltipTemplate: {},
    type: String as PropType<AnnotationType>,
    width: Number,
    wordWrap: String as PropType<WordWrap>,
    x: Number,
    y: Number
  }
};

prepareConfigurationComponentConfig(DxCommonAnnotationSettingsConfig);

const DxCommonAnnotationSettings = defineComponent(DxCommonAnnotationSettingsConfig);

(DxCommonAnnotationSettings as any).$_optionName = "commonAnnotationSettings";

const DxControlBarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:borderColor": null,
    "update:color": null,
    "update:enabled": null,
    "update:horizontalAlignment": null,
    "update:margin": null,
    "update:opacity": null,
    "update:panVisible": null,
    "update:verticalAlignment": null,
    "update:zoomVisible": null,
  },
  props: {
    borderColor: String,
    color: String,
    enabled: Boolean,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    margin: Number,
    opacity: Number,
    panVisible: Boolean,
    verticalAlignment: String as PropType<VerticalEdge>,
    zoomVisible: Boolean
  }
};

prepareConfigurationComponentConfig(DxControlBarConfig);

const DxControlBar = defineComponent(DxControlBarConfig);

(DxControlBar as any).$_optionName = "controlBar";

const DxExportConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:enabled": null,
    "update:fileName": null,
    "update:formats": null,
    "update:margin": null,
    "update:printingEnabled": null,
    "update:svgToCanvas": null,
  },
  props: {
    backgroundColor: String,
    enabled: Boolean,
    fileName: String,
    formats: Array as PropType<Array<ExportFormat>>,
    margin: Number,
    printingEnabled: Boolean,
    svgToCanvas: Function as PropType<((svg: any, canvas: any) => any)>
  }
};

prepareConfigurationComponentConfig(DxExportConfig);

const DxExport = defineComponent(DxExportConfig);

(DxExport as any).$_optionName = "export";

const DxFontConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:family": null,
    "update:opacity": null,
    "update:size": null,
    "update:weight": null,
  },
  props: {
    color: String,
    family: String,
    opacity: Number,
    size: [Number, String],
    weight: Number
  }
};

prepareConfigurationComponentConfig(DxFontConfig);

const DxFont = defineComponent(DxFontConfig);

(DxFont as any).$_optionName = "font";

const DxImageConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:height": null,
    "update:url": null,
    "update:width": null,
  },
  props: {
    height: Number,
    url: String,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxImageConfig);

const DxImage = defineComponent(DxImageConfig);

(DxImage as any).$_optionName = "image";

const DxLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:dataField": null,
    "update:enabled": null,
    "update:font": null,
  },
  props: {
    dataField: String,
    enabled: Boolean,
    font: Object as PropType<Font | Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

const DxLayerConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:borderColor": null,
    "update:borderWidth": null,
    "update:color": null,
    "update:colorGroupingField": null,
    "update:colorGroups": null,
    "update:customize": null,
    "update:dataField": null,
    "update:dataSource": null,
    "update:elementType": null,
    "update:hoveredBorderColor": null,
    "update:hoveredBorderWidth": null,
    "update:hoveredColor": null,
    "update:hoverEnabled": null,
    "update:label": null,
    "update:maxSize": null,
    "update:minSize": null,
    "update:name": null,
    "update:opacity": null,
    "update:palette": null,
    "update:paletteIndex": null,
    "update:paletteSize": null,
    "update:selectedBorderColor": null,
    "update:selectedBorderWidth": null,
    "update:selectedColor": null,
    "update:selectionMode": null,
    "update:size": null,
    "update:sizeGroupingField": null,
    "update:sizeGroups": null,
    "update:type": null,
  },
  props: {
    borderColor: String,
    borderWidth: Number,
    color: String,
    colorGroupingField: String,
    colorGroups: Array as PropType<Array<number>>,
    customize: Function as PropType<((elements: Array<MapLayerElement>) => void)>,
    dataField: String,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Record<string, any> | Store | string>,
    elementType: String as PropType<VectorMapMarkerType>,
    hoveredBorderColor: String,
    hoveredBorderWidth: Number,
    hoveredColor: String,
    hoverEnabled: Boolean,
    label: Object as PropType<Record<string, any>>,
    maxSize: Number,
    minSize: Number,
    name: String,
    opacity: Number,
    palette: [Array, String] as PropType<Array<string> | Palette>,
    paletteIndex: Number,
    paletteSize: Number,
    selectedBorderColor: String,
    selectedBorderWidth: Number,
    selectedColor: String,
    selectionMode: String as PropType<SingleMultipleOrNone>,
    size: Number,
    sizeGroupingField: String,
    sizeGroups: Array as PropType<Array<number>>,
    type: String as PropType<VectorMapLayerType>
  }
};

prepareConfigurationComponentConfig(DxLayerConfig);

const DxLayer = defineComponent(DxLayerConfig);

(DxLayer as any).$_optionName = "layers";
(DxLayer as any).$_isCollectionItem = true;
(DxLayer as any).$_expectedChildren = {
  label: { isCollectionItem: false, optionName: "label" }
};

const DxLegendConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:border": null,
    "update:columnCount": null,
    "update:columnItemSpacing": null,
    "update:customizeHint": null,
    "update:customizeItems": null,
    "update:customizeText": null,
    "update:font": null,
    "update:horizontalAlignment": null,
    "update:itemsAlignment": null,
    "update:itemTextPosition": null,
    "update:margin": null,
    "update:markerColor": null,
    "update:markerShape": null,
    "update:markerSize": null,
    "update:markerTemplate": null,
    "update:orientation": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:rowCount": null,
    "update:rowItemSpacing": null,
    "update:source": null,
    "update:title": null,
    "update:verticalAlignment": null,
    "update:visible": null,
  },
  props: {
    backgroundColor: String,
    border: Object as PropType<Record<string, any>>,
    columnCount: Number,
    columnItemSpacing: Number,
    customizeHint: Function as PropType<((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string)>,
    customizeItems: Function as PropType<((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>)>,
    customizeText: Function as PropType<((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string)>,
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    itemsAlignment: String as PropType<HorizontalAlignment>,
    itemTextPosition: String as PropType<Position>,
    margin: [Number, Object] as PropType<number | Record<string, any>>,
    markerColor: String,
    markerShape: String as PropType<VectorMapMarkerShape>,
    markerSize: Number,
    markerTemplate: {},
    orientation: String as PropType<Orientation>,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    rowCount: Number,
    rowItemSpacing: Number,
    source: Object as PropType<Record<string, any>>,
    title: [Object, String] as PropType<Record<string, any> | string>,
    verticalAlignment: String as PropType<VerticalEdge>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxLegendConfig);

const DxLegend = defineComponent(DxLegendConfig);

(DxLegend as any).$_optionName = "legends";
(DxLegend as any).$_isCollectionItem = true;
(DxLegend as any).$_expectedChildren = {
  annotationBorder: { isCollectionItem: false, optionName: "border" },
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  legendTitle: { isCollectionItem: false, optionName: "title" },
  margin: { isCollectionItem: false, optionName: "margin" },
  source: { isCollectionItem: false, optionName: "source" },
  title: { isCollectionItem: false, optionName: "title" }
};

const DxLegendTitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:horizontalAlignment": null,
    "update:margin": null,
    "update:placeholderSize": null,
    "update:subtitle": null,
    "update:text": null,
    "update:verticalAlignment": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    margin: Object as PropType<Record<string, any>>,
    placeholderSize: Number,
    subtitle: [Object, String] as PropType<Record<string, any> | string>,
    text: String,
    verticalAlignment: String as PropType<VerticalEdge>
  }
};

prepareConfigurationComponentConfig(DxLegendTitleConfig);

const DxLegendTitle = defineComponent(DxLegendTitleConfig);

(DxLegendTitle as any).$_optionName = "title";
(DxLegendTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  legendTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};

const DxLegendTitleSubtitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:offset": null,
    "update:text": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    offset: Number,
    text: String
  }
};

prepareConfigurationComponentConfig(DxLegendTitleSubtitleConfig);

const DxLegendTitleSubtitle = defineComponent(DxLegendTitleSubtitleConfig);

(DxLegendTitleSubtitle as any).$_optionName = "subtitle";
(DxLegendTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

const DxLoadingIndicatorConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:enabled": null,
    "update:font": null,
    "update:show": null,
    "update:text": null,
  },
  props: {
    backgroundColor: String,
    enabled: Boolean,
    font: Object as PropType<Font | Record<string, any>>,
    show: Boolean,
    text: String
  }
};

prepareConfigurationComponentConfig(DxLoadingIndicatorConfig);

const DxLoadingIndicator = defineComponent(DxLoadingIndicatorConfig);

(DxLoadingIndicator as any).$_optionName = "loadingIndicator";
(DxLoadingIndicator as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

const DxMarginConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:bottom": null,
    "update:left": null,
    "update:right": null,
    "update:top": null,
  },
  props: {
    bottom: Number,
    left: Number,
    right: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxMarginConfig);

const DxMargin = defineComponent(DxMarginConfig);

(DxMargin as any).$_optionName = "margin";

const DxProjectionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aspectRatio": null,
    "update:from": null,
    "update:to": null,
  },
  props: {
    aspectRatio: Number,
    from: Function as PropType<((coordinates: Array<number>) => Array<number>)>,
    to: Function as PropType<((coordinates: Array<number>) => Array<number>)>
  }
};

prepareConfigurationComponentConfig(DxProjectionConfig);

const DxProjection = defineComponent(DxProjectionConfig);

(DxProjection as any).$_optionName = "projection";

const DxShadowConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:blur": null,
    "update:color": null,
    "update:offsetX": null,
    "update:offsetY": null,
    "update:opacity": null,
  },
  props: {
    blur: Number,
    color: String,
    offsetX: Number,
    offsetY: Number,
    opacity: Number
  }
};

prepareConfigurationComponentConfig(DxShadowConfig);

const DxShadow = defineComponent(DxShadowConfig);

(DxShadow as any).$_optionName = "shadow";

const DxSizeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:height": null,
    "update:width": null,
  },
  props: {
    height: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxSizeConfig);

const DxSize = defineComponent(DxSizeConfig);

(DxSize as any).$_optionName = "size";

const DxSourceConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:grouping": null,
    "update:layer": null,
  },
  props: {
    grouping: String,
    layer: String
  }
};

prepareConfigurationComponentConfig(DxSourceConfig);

const DxSource = defineComponent(DxSourceConfig);

(DxSource as any).$_optionName = "source";

const DxSubtitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:offset": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:wordWrap": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    offset: Number,
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxSubtitleConfig);

const DxSubtitle = defineComponent(DxSubtitleConfig);

(DxSubtitle as any).$_optionName = "subtitle";
(DxSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

const DxTitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:horizontalAlignment": null,
    "update:margin": null,
    "update:placeholderSize": null,
    "update:subtitle": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:verticalAlignment": null,
    "update:wordWrap": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    margin: [Object, Number] as PropType<Record<string, any> | number>,
    placeholderSize: Number,
    subtitle: [Object, String] as PropType<Record<string, any> | string>,
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    verticalAlignment: String as PropType<VerticalEdge>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxTitleConfig);

const DxTitle = defineComponent(DxTitleConfig);

(DxTitle as any).$_optionName = "title";
(DxTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  legendTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  margin: { isCollectionItem: false, optionName: "margin" },
  vectorMapTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" }
};

const DxTooltipConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:arrowLength": null,
    "update:border": null,
    "update:color": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:cornerRadius": null,
    "update:customizeTooltip": null,
    "update:enabled": null,
    "update:font": null,
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:shadow": null,
    "update:zIndex": null,
  },
  props: {
    arrowLength: Number,
    border: Object as PropType<Record<string, any>>,
    color: String,
    container: {},
    contentTemplate: {},
    cornerRadius: Number,
    customizeTooltip: Function as PropType<((info: MapLayerElement) => Record<string, any>)>,
    enabled: Boolean,
    font: Object as PropType<Font | Record<string, any>>,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    shadow: Object as PropType<Record<string, any>>,
    zIndex: Number
  }
};

prepareConfigurationComponentConfig(DxTooltipConfig);

const DxTooltip = defineComponent(DxTooltipConfig);

(DxTooltip as any).$_optionName = "tooltip";
(DxTooltip as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  shadow: { isCollectionItem: false, optionName: "shadow" },
  tooltipBorder: { isCollectionItem: false, optionName: "border" }
};

const DxTooltipBorderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:opacity": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String as PropType<DashStyle>,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxTooltipBorderConfig);

const DxTooltipBorder = defineComponent(DxTooltipBorderConfig);

(DxTooltipBorder as any).$_optionName = "border";

const DxVectorMapTitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:horizontalAlignment": null,
    "update:margin": null,
    "update:placeholderSize": null,
    "update:subtitle": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:verticalAlignment": null,
    "update:wordWrap": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    margin: [Number, Object] as PropType<number | Record<string, any>>,
    placeholderSize: Number,
    subtitle: [Object, String] as PropType<Record<string, any> | string>,
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    verticalAlignment: String as PropType<VerticalEdge>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxVectorMapTitleConfig);

const DxVectorMapTitle = defineComponent(DxVectorMapTitleConfig);

(DxVectorMapTitle as any).$_optionName = "title";
(DxVectorMapTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" },
  vectorMapTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" }
};

const DxVectorMapTitleSubtitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:offset": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:wordWrap": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    offset: Number,
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxVectorMapTitleSubtitleConfig);

const DxVectorMapTitleSubtitle = defineComponent(DxVectorMapTitleSubtitleConfig);

(DxVectorMapTitleSubtitle as any).$_optionName = "subtitle";
(DxVectorMapTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

export default DxVectorMap;
export {
  DxVectorMap,
  DxAnnotation,
  DxAnnotationBorder,
  DxBackground,
  DxBorder,
  DxCommonAnnotationSettings,
  DxControlBar,
  DxExport,
  DxFont,
  DxImage,
  DxLabel,
  DxLayer,
  DxLegend,
  DxLegendTitle,
  DxLegendTitleSubtitle,
  DxLoadingIndicator,
  DxMargin,
  DxProjection,
  DxShadow,
  DxSize,
  DxSource,
  DxSubtitle,
  DxTitle,
  DxTooltip,
  DxTooltipBorder,
  DxVectorMapTitle,
  DxVectorMapTitleSubtitle
};
import type * as DxVectorMapTypes from "devextreme/viz/vector_map_types";
export { DxVectorMapTypes };
