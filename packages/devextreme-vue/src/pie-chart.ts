import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import PieChart, { Properties } from "devextreme/viz/pie_chart";
import  DataSource from "devextreme/data/data_source";
import {
 dxPieChartAnnotationConfig,
 dxPieChartCommonAnnotationConfig,
 DisposingEvent,
 DoneEvent,
 DrawnEvent,
 ExportedEvent,
 ExportingEvent,
 FileSavingEvent,
 IncidentOccurredEvent,
 InitializedEvent,
 LegendClickEvent,
 OptionChangedEvent,
 PointClickEvent,
 PointHoverChangedEvent,
 PointSelectionChangedEvent,
 TooltipHiddenEvent,
 TooltipShownEvent,
 PieChartSegmentDirection,
 PieChartSeries,
 PieChartType,
 PieChartAnnotationLocation,
 PieChartSeriesInteractionMode,
 PieChartLegendItem,
 PieChartLegendHoverMode,
 SmallValuesGroupingMode,
} from "devextreme/viz/pie_chart";
import {
 SeriesLabel,
 SeriesPoint,
 Palette,
 PaletteExtensionMode,
 ShiftLabelOverlap,
 Theme,
 AnimationEaseMode,
 Font,
 TextOverflow,
 AnnotationType,
 WordWrap,
 DashStyle,
 ChartsDataType,
 ChartsColor,
 HatchDirection,
 LabelPosition,
} from "devextreme/common/charts";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 SingleOrMultiple,
 Format,
 ExportFormat,
 HorizontalAlignment,
 Position,
 Orientation,
 VerticalEdge,
} from "devextreme/common";
import {
 Format as LocalizationFormat,
} from "devextreme/common/core/localization";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "adaptiveLayout" |
  "animation" |
  "annotations" |
  "centerTemplate" |
  "commonAnnotationSettings" |
  "commonSeriesSettings" |
  "customizeAnnotation" |
  "customizeLabel" |
  "customizePoint" |
  "dataSource" |
  "diameter" |
  "disabled" |
  "elementAttr" |
  "export" |
  "innerRadius" |
  "legend" |
  "loadingIndicator" |
  "margin" |
  "minDiameter" |
  "onDisposing" |
  "onDone" |
  "onDrawn" |
  "onExported" |
  "onExporting" |
  "onFileSaving" |
  "onIncidentOccurred" |
  "onInitialized" |
  "onLegendClick" |
  "onOptionChanged" |
  "onPointClick" |
  "onPointHoverChanged" |
  "onPointSelectionChanged" |
  "onTooltipHidden" |
  "onTooltipShown" |
  "palette" |
  "paletteExtensionMode" |
  "pathModified" |
  "pointSelectionMode" |
  "redrawOnResize" |
  "resolveLabelOverlapping" |
  "rtlEnabled" |
  "segmentsDirection" |
  "series" |
  "seriesTemplate" |
  "size" |
  "sizeGroup" |
  "startAngle" |
  "theme" |
  "title" |
  "tooltip" |
  "type"
>;

interface DxPieChart extends AccessibleOptions {
  readonly instance?: PieChart;
}

const componentConfig = {
  props: {
    adaptiveLayout: Object as PropType<Record<string, any>>,
    animation: [Boolean, Object] as PropType<boolean | Record<string, any>>,
    annotations: Array as PropType<Array<any | dxPieChartAnnotationConfig>>,
    centerTemplate: {},
    commonAnnotationSettings: Object as PropType<dxPieChartCommonAnnotationConfig | Record<string, any>>,
    commonSeriesSettings: {},
    customizeAnnotation: Function as PropType<((annotation: dxPieChartAnnotationConfig | any) => dxPieChartAnnotationConfig)>,
    customizeLabel: Function as PropType<((pointInfo: any) => SeriesLabel)>,
    customizePoint: Function as PropType<((pointInfo: any) => SeriesPoint)>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    diameter: Number,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    export: Object as PropType<Record<string, any>>,
    innerRadius: Number,
    legend: Object as PropType<Record<string, any>>,
    loadingIndicator: Object as PropType<Record<string, any>>,
    margin: Object as PropType<Record<string, any>>,
    minDiameter: Number,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onDone: Function as PropType<((e: DoneEvent) => void)>,
    onDrawn: Function as PropType<((e: DrawnEvent) => void)>,
    onExported: Function as PropType<((e: ExportedEvent) => void)>,
    onExporting: Function as PropType<((e: ExportingEvent) => void)>,
    onFileSaving: Function as PropType<((e: FileSavingEvent) => void)>,
    onIncidentOccurred: Function as PropType<((e: IncidentOccurredEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onLegendClick: Function as PropType<((e: LegendClickEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onPointClick: Function as PropType<((e: PointClickEvent) => void)>,
    onPointHoverChanged: Function as PropType<((e: PointHoverChangedEvent) => void)>,
    onPointSelectionChanged: Function as PropType<((e: PointSelectionChangedEvent) => void)>,
    onTooltipHidden: Function as PropType<((e: TooltipHiddenEvent) => void)>,
    onTooltipShown: Function as PropType<((e: TooltipShownEvent) => void)>,
    palette: [Array, String] as PropType<Array<string> | Palette>,
    paletteExtensionMode: String as PropType<PaletteExtensionMode>,
    pathModified: Boolean,
    pointSelectionMode: String as PropType<SingleOrMultiple>,
    redrawOnResize: Boolean,
    resolveLabelOverlapping: String as PropType<ShiftLabelOverlap>,
    rtlEnabled: Boolean,
    segmentsDirection: String as PropType<PieChartSegmentDirection>,
    series: [Array, Object] as PropType<Array<PieChartSeries> | PieChartSeries | Record<string, any>>,
    seriesTemplate: Object as PropType<Record<string, any>>,
    size: Object as PropType<Record<string, any>>,
    sizeGroup: String,
    startAngle: Number,
    theme: String as PropType<Theme>,
    title: [Object, String] as PropType<Record<string, any> | string>,
    tooltip: Object as PropType<Record<string, any>>,
    type: String as PropType<PieChartType>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:adaptiveLayout": null,
    "update:animation": null,
    "update:annotations": null,
    "update:centerTemplate": null,
    "update:commonAnnotationSettings": null,
    "update:commonSeriesSettings": null,
    "update:customizeAnnotation": null,
    "update:customizeLabel": null,
    "update:customizePoint": null,
    "update:dataSource": null,
    "update:diameter": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:innerRadius": null,
    "update:legend": null,
    "update:loadingIndicator": null,
    "update:margin": null,
    "update:minDiameter": null,
    "update:onDisposing": null,
    "update:onDone": null,
    "update:onDrawn": null,
    "update:onExported": null,
    "update:onExporting": null,
    "update:onFileSaving": null,
    "update:onIncidentOccurred": null,
    "update:onInitialized": null,
    "update:onLegendClick": null,
    "update:onOptionChanged": null,
    "update:onPointClick": null,
    "update:onPointHoverChanged": null,
    "update:onPointSelectionChanged": null,
    "update:onTooltipHidden": null,
    "update:onTooltipShown": null,
    "update:palette": null,
    "update:paletteExtensionMode": null,
    "update:pathModified": null,
    "update:pointSelectionMode": null,
    "update:redrawOnResize": null,
    "update:resolveLabelOverlapping": null,
    "update:rtlEnabled": null,
    "update:segmentsDirection": null,
    "update:series": null,
    "update:seriesTemplate": null,
    "update:size": null,
    "update:sizeGroup": null,
    "update:startAngle": null,
    "update:theme": null,
    "update:title": null,
    "update:tooltip": null,
    "update:type": null,
  },
  computed: {
    instance(): PieChart {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = PieChart;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      adaptiveLayout: { isCollectionItem: false, optionName: "adaptiveLayout" },
      animation: { isCollectionItem: false, optionName: "animation" },
      annotation: { isCollectionItem: true, optionName: "annotations" },
      commonAnnotationSettings: { isCollectionItem: false, optionName: "commonAnnotationSettings" },
      commonSeriesSettings: { isCollectionItem: false, optionName: "commonSeriesSettings" },
      export: { isCollectionItem: false, optionName: "export" },
      legend: { isCollectionItem: false, optionName: "legend" },
      loadingIndicator: { isCollectionItem: false, optionName: "loadingIndicator" },
      margin: { isCollectionItem: false, optionName: "margin" },
      pieChartTitle: { isCollectionItem: false, optionName: "title" },
      series: { isCollectionItem: true, optionName: "series" },
      seriesTemplate: { isCollectionItem: false, optionName: "seriesTemplate" },
      size: { isCollectionItem: false, optionName: "size" },
      title: { isCollectionItem: false, optionName: "title" },
      tooltip: { isCollectionItem: false, optionName: "tooltip" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxPieChart = defineComponent(componentConfig);


const DxAdaptiveLayoutConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:height": null,
    "update:keepLabels": null,
    "update:width": null,
  },
  props: {
    height: Number,
    keepLabels: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxAdaptiveLayoutConfig);

const DxAdaptiveLayout = defineComponent(DxAdaptiveLayoutConfig);

(DxAdaptiveLayout as any).$_optionName = "adaptiveLayout";

const DxAnimationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:duration": null,
    "update:easing": null,
    "update:enabled": null,
    "update:maxPointCountSupported": null,
  },
  props: {
    duration: Number,
    easing: String as PropType<AnimationEaseMode>,
    enabled: Boolean,
    maxPointCountSupported: Number
  }
};

prepareConfigurationComponentConfig(DxAnimationConfig);

const DxAnimation = defineComponent(DxAnimationConfig);

(DxAnimation as any).$_optionName = "animation";

const DxAnnotationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDragging": null,
    "update:argument": null,
    "update:arrowLength": null,
    "update:arrowWidth": null,
    "update:border": null,
    "update:color": null,
    "update:customizeTooltip": null,
    "update:data": null,
    "update:description": null,
    "update:font": null,
    "update:height": null,
    "update:image": null,
    "update:location": null,
    "update:name": null,
    "update:offsetX": null,
    "update:offsetY": null,
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:series": null,
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
    argument: [Date, Number, String],
    arrowLength: Number,
    arrowWidth: Number,
    border: Object as PropType<Record<string, any>>,
    color: String,
    customizeTooltip: Function as PropType<((annotation: dxPieChartAnnotationConfig | any) => Record<string, any>)>,
    data: {},
    description: String,
    font: Object as PropType<Font | Record<string, any>>,
    height: Number,
    image: [Object, String] as PropType<Record<string, any> | string>,
    location: String as PropType<PieChartAnnotationLocation>,
    name: String,
    offsetX: Number,
    offsetY: Number,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    series: String,
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

const DxArgumentFormatConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function as PropType<((value: number | Date) => string)>,
    parser: Function as PropType<((value: string) => number | Date)>,
    precision: Number,
    type: String as PropType<Format | string>,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxArgumentFormatConfig);

const DxArgumentFormat = defineComponent(DxArgumentFormatConfig);

(DxArgumentFormat as any).$_optionName = "argumentFormat";

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

const DxColorConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:base": null,
    "update:fillId": null,
  },
  props: {
    base: String,
    fillId: String
  }
};

prepareConfigurationComponentConfig(DxColorConfig);

const DxColor = defineComponent(DxColorConfig);

(DxColor as any).$_optionName = "color";

const DxCommonAnnotationSettingsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDragging": null,
    "update:argument": null,
    "update:arrowLength": null,
    "update:arrowWidth": null,
    "update:border": null,
    "update:color": null,
    "update:customizeTooltip": null,
    "update:data": null,
    "update:description": null,
    "update:font": null,
    "update:height": null,
    "update:image": null,
    "update:location": null,
    "update:offsetX": null,
    "update:offsetY": null,
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:series": null,
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
    argument: [Date, Number, String],
    arrowLength: Number,
    arrowWidth: Number,
    border: Object as PropType<Record<string, any>>,
    color: String,
    customizeTooltip: Function as PropType<((annotation: dxPieChartAnnotationConfig | any) => Record<string, any>)>,
    data: {},
    description: String,
    font: Object as PropType<Font | Record<string, any>>,
    height: Number,
    image: [Object, String] as PropType<Record<string, any> | string>,
    location: String as PropType<PieChartAnnotationLocation>,
    offsetX: Number,
    offsetY: Number,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    series: String,
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

const DxCommonSeriesSettingsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:argumentField": null,
    "update:argumentType": null,
    "update:border": null,
    "update:color": null,
    "update:hoverMode": null,
    "update:hoverStyle": null,
    "update:label": null,
    "update:maxLabelCount": null,
    "update:minSegmentSize": null,
    "update:selectionMode": null,
    "update:selectionStyle": null,
    "update:smallValuesGrouping": null,
    "update:tagField": null,
    "update:valueField": null,
  },
  props: {
    argumentField: String,
    argumentType: String as PropType<ChartsDataType>,
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    hoverMode: String as PropType<PieChartSeriesInteractionMode>,
    hoverStyle: Object as PropType<Record<string, any>>,
    label: Object as PropType<Record<string, any>>,
    maxLabelCount: Number,
    minSegmentSize: Number,
    selectionMode: String as PropType<PieChartSeriesInteractionMode>,
    selectionStyle: Object as PropType<Record<string, any>>,
    smallValuesGrouping: Object as PropType<Record<string, any>>,
    tagField: String,
    valueField: String
  }
};

prepareConfigurationComponentConfig(DxCommonSeriesSettingsConfig);

const DxCommonSeriesSettings = defineComponent(DxCommonSeriesSettingsConfig);

(DxCommonSeriesSettings as any).$_optionName = "commonSeriesSettings";
(DxCommonSeriesSettings as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  label: { isCollectionItem: false, optionName: "label" },
  selectionStyle: { isCollectionItem: false, optionName: "selectionStyle" },
  seriesBorder: { isCollectionItem: false, optionName: "border" },
  smallValuesGrouping: { isCollectionItem: false, optionName: "smallValuesGrouping" }
};

const DxConnectorConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxConnectorConfig);

const DxConnector = defineComponent(DxConnectorConfig);

(DxConnector as any).$_optionName = "connector";

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

const DxFormatConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function as PropType<((value: number | Date) => string)>,
    parser: Function as PropType<((value: string) => number | Date)>,
    precision: Number,
    type: String as PropType<Format | string>,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxFormatConfig);

const DxFormat = defineComponent(DxFormatConfig);

(DxFormat as any).$_optionName = "format";

const DxHatchingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:direction": null,
    "update:opacity": null,
    "update:step": null,
    "update:width": null,
  },
  props: {
    direction: String as PropType<HatchDirection>,
    opacity: Number,
    step: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxHatchingConfig);

const DxHatching = defineComponent(DxHatchingConfig);

(DxHatching as any).$_optionName = "hatching";

const DxHoverStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:hatching": null,
    "update:highlight": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    hatching: Object as PropType<Record<string, any>>,
    highlight: Boolean
  }
};

prepareConfigurationComponentConfig(DxHoverStyleConfig);

const DxHoverStyle = defineComponent(DxHoverStyleConfig);

(DxHoverStyle as any).$_optionName = "hoverStyle";
(DxHoverStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};

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
    "update:argumentFormat": null,
    "update:backgroundColor": null,
    "update:border": null,
    "update:connector": null,
    "update:customizeText": null,
    "update:displayFormat": null,
    "update:font": null,
    "update:format": null,
    "update:position": null,
    "update:radialOffset": null,
    "update:rotationAngle": null,
    "update:textOverflow": null,
    "update:visible": null,
    "update:wordWrap": null,
  },
  props: {
    argumentFormat: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    backgroundColor: String,
    border: Object as PropType<Record<string, any>>,
    connector: Object as PropType<Record<string, any>>,
    customizeText: Function as PropType<((pointInfo: any) => string)>,
    displayFormat: String,
    font: Object as PropType<Font | Record<string, any>>,
    format: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    position: String as PropType<LabelPosition>,
    radialOffset: Number,
    rotationAngle: Number,
    textOverflow: String as PropType<TextOverflow>,
    visible: Boolean,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  argumentFormat: { isCollectionItem: false, optionName: "argumentFormat" },
  border: { isCollectionItem: false, optionName: "border" },
  connector: { isCollectionItem: false, optionName: "connector" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
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
    "update:hoverMode": null,
    "update:itemsAlignment": null,
    "update:itemTextPosition": null,
    "update:margin": null,
    "update:markerSize": null,
    "update:markerTemplate": null,
    "update:orientation": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:rowCount": null,
    "update:rowItemSpacing": null,
    "update:title": null,
    "update:verticalAlignment": null,
    "update:visible": null,
  },
  props: {
    backgroundColor: String,
    border: Object as PropType<Record<string, any>>,
    columnCount: Number,
    columnItemSpacing: Number,
    customizeHint: Function as PropType<((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string)>,
    customizeItems: Function as PropType<((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>)>,
    customizeText: Function as PropType<((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string)>,
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    hoverMode: String as PropType<PieChartLegendHoverMode>,
    itemsAlignment: String as PropType<HorizontalAlignment>,
    itemTextPosition: String as PropType<Position>,
    margin: [Number, Object] as PropType<number | Record<string, any>>,
    markerSize: Number,
    markerTemplate: {},
    orientation: String as PropType<Orientation>,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    rowCount: Number,
    rowItemSpacing: Number,
    title: [Object, String] as PropType<Record<string, any> | string>,
    verticalAlignment: String as PropType<VerticalEdge>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxLegendConfig);

const DxLegend = defineComponent(DxLegendConfig);

(DxLegend as any).$_optionName = "legend";
(DxLegend as any).$_expectedChildren = {
  annotationBorder: { isCollectionItem: false, optionName: "border" },
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  legendTitle: { isCollectionItem: false, optionName: "title" },
  margin: { isCollectionItem: false, optionName: "margin" },
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

const DxPieChartTitleConfig = {
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

prepareConfigurationComponentConfig(DxPieChartTitleConfig);

const DxPieChartTitle = defineComponent(DxPieChartTitleConfig);

(DxPieChartTitle as any).$_optionName = "title";
(DxPieChartTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  margin: { isCollectionItem: false, optionName: "margin" },
  pieChartTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};

const DxPieChartTitleSubtitleConfig = {
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

prepareConfigurationComponentConfig(DxPieChartTitleSubtitleConfig);

const DxPieChartTitleSubtitle = defineComponent(DxPieChartTitleSubtitleConfig);

(DxPieChartTitleSubtitle as any).$_optionName = "subtitle";
(DxPieChartTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

const DxSelectionStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:hatching": null,
    "update:highlight": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    hatching: Object as PropType<Record<string, any>>,
    highlight: Boolean
  }
};

prepareConfigurationComponentConfig(DxSelectionStyleConfig);

const DxSelectionStyle = defineComponent(DxSelectionStyleConfig);

(DxSelectionStyle as any).$_optionName = "selectionStyle";
(DxSelectionStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};

const DxSeriesConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:argumentField": null,
    "update:argumentType": null,
    "update:border": null,
    "update:color": null,
    "update:hoverMode": null,
    "update:hoverStyle": null,
    "update:label": null,
    "update:maxLabelCount": null,
    "update:minSegmentSize": null,
    "update:name": null,
    "update:selectionMode": null,
    "update:selectionStyle": null,
    "update:smallValuesGrouping": null,
    "update:tag": null,
    "update:tagField": null,
    "update:valueField": null,
  },
  props: {
    argumentField: String,
    argumentType: String as PropType<ChartsDataType>,
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    hoverMode: String as PropType<PieChartSeriesInteractionMode>,
    hoverStyle: Object as PropType<Record<string, any>>,
    label: Object as PropType<Record<string, any>>,
    maxLabelCount: Number,
    minSegmentSize: Number,
    name: String,
    selectionMode: String as PropType<PieChartSeriesInteractionMode>,
    selectionStyle: Object as PropType<Record<string, any>>,
    smallValuesGrouping: Object as PropType<Record<string, any>>,
    tag: {},
    tagField: String,
    valueField: String
  }
};

prepareConfigurationComponentConfig(DxSeriesConfig);

const DxSeries = defineComponent(DxSeriesConfig);

(DxSeries as any).$_optionName = "series";
(DxSeries as any).$_isCollectionItem = true;

const DxSeriesBorderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String as PropType<DashStyle>,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxSeriesBorderConfig);

const DxSeriesBorder = defineComponent(DxSeriesBorderConfig);

(DxSeriesBorder as any).$_optionName = "border";

const DxSeriesTemplateConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeSeries": null,
    "update:nameField": null,
  },
  props: {
    customizeSeries: Function as PropType<((seriesName: any) => PieChartSeries)>,
    nameField: String
  }
};

prepareConfigurationComponentConfig(DxSeriesTemplateConfig);

const DxSeriesTemplate = defineComponent(DxSeriesTemplateConfig);

(DxSeriesTemplate as any).$_optionName = "seriesTemplate";

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

const DxSmallValuesGroupingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:groupName": null,
    "update:mode": null,
    "update:threshold": null,
    "update:topCount": null,
  },
  props: {
    groupName: String,
    mode: String as PropType<SmallValuesGroupingMode>,
    threshold: Number,
    topCount: Number
  }
};

prepareConfigurationComponentConfig(DxSmallValuesGroupingConfig);

const DxSmallValuesGrouping = defineComponent(DxSmallValuesGroupingConfig);

(DxSmallValuesGrouping as any).$_optionName = "smallValuesGrouping";

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
  pieChartTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" }
};

const DxTooltipConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:argumentFormat": null,
    "update:arrowLength": null,
    "update:border": null,
    "update:color": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:cornerRadius": null,
    "update:customizeTooltip": null,
    "update:enabled": null,
    "update:font": null,
    "update:format": null,
    "update:interactive": null,
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:shadow": null,
    "update:shared": null,
    "update:zIndex": null,
  },
  props: {
    argumentFormat: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    arrowLength: Number,
    border: Object as PropType<Record<string, any>>,
    color: String,
    container: {},
    contentTemplate: {},
    cornerRadius: Number,
    customizeTooltip: Function as PropType<((pointInfo: any) => Record<string, any>)>,
    enabled: Boolean,
    font: Object as PropType<Font | Record<string, any>>,
    format: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    interactive: Boolean,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    shadow: Object as PropType<Record<string, any>>,
    shared: Boolean,
    zIndex: Number
  }
};

prepareConfigurationComponentConfig(DxTooltipConfig);

const DxTooltip = defineComponent(DxTooltipConfig);

(DxTooltip as any).$_optionName = "tooltip";
(DxTooltip as any).$_expectedChildren = {
  argumentFormat: { isCollectionItem: false, optionName: "argumentFormat" },
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
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

export default DxPieChart;
export {
  DxPieChart,
  DxAdaptiveLayout,
  DxAnimation,
  DxAnnotation,
  DxAnnotationBorder,
  DxArgumentFormat,
  DxBorder,
  DxColor,
  DxCommonAnnotationSettings,
  DxCommonSeriesSettings,
  DxConnector,
  DxExport,
  DxFont,
  DxFormat,
  DxHatching,
  DxHoverStyle,
  DxImage,
  DxLabel,
  DxLegend,
  DxLegendTitle,
  DxLegendTitleSubtitle,
  DxLoadingIndicator,
  DxMargin,
  DxPieChartTitle,
  DxPieChartTitleSubtitle,
  DxSelectionStyle,
  DxSeries,
  DxSeriesBorder,
  DxSeriesTemplate,
  DxShadow,
  DxSize,
  DxSmallValuesGrouping,
  DxSubtitle,
  DxTitle,
  DxTooltip,
  DxTooltipBorder
};
import type * as DxPieChartTypes from "devextreme/viz/pie_chart_types";
export { DxPieChartTypes };
