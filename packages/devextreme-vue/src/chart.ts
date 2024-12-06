import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Chart, { Properties } from "devextreme/viz/chart";
import  DataSource from "devextreme/data/data_source";
import {
 dxChartAnnotationConfig,
 dxChartCommonAnnotationConfig,
 ArgumentAxisClickEvent,
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
 SeriesClickEvent,
 SeriesHoverChangedEvent,
 SeriesSelectionChangedEvent,
 TooltipHiddenEvent,
 TooltipShownEvent,
 ZoomEndEvent,
 ZoomStartEvent,
 chartPointAggregationInfoObject,
 chartSeriesObject,
 ChartSeriesAggregationMethod,
 AggregatedPointsPosition,
 ChartLabelDisplayMode,
 chartPointObject,
 FinancialChartReductionLevel,
 ChartTooltipLocation,
 ChartZoomAndPanMode,
 EventKeyModifier,
} from "devextreme/viz/chart";
import {
 SeriesLabel,
 SeriesPoint,
 Palette,
 PaletteExtensionMode,
 ChartsLabelOverlap,
 Theme,
 AnimationEaseMode,
 Font,
 TextOverflow,
 AnnotationType,
 WordWrap,
 DashStyle,
 TimeInterval,
 ChartsDataType,
 ScaleBreak,
 DiscreteAxisDivisionMode,
 ArgumentAxisHoverMode,
 AxisScaleType,
 VisualRangeUpdateMode,
 RelativePosition,
 ChartsAxisLabelOverlap,
 ScaleBreakLineStyle,
 ChartsColor,
 SeriesHoverMode,
 SeriesSelectionMode,
 SeriesType,
 HatchDirection,
 LegendItem,
 LegendHoverMode,
 PointInteractionMode,
 PointSymbol,
 ValueErrorBarDisplayMode,
 ValueErrorBarType,
} from "devextreme/common/charts";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 SingleOrMultiple,
 Position,
 Format,
 HorizontalAlignment,
 VerticalAlignment,
 VerticalEdge,
 ExportFormat,
 Orientation,
} from "devextreme/common";
import {
 ChartSeries,
} from "devextreme/viz/common";
import {
 Format as LocalizationFormat,
} from "devextreme/common/core/localization";
import  * as CommonChartTypes from "devextreme/common/charts";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "adaptiveLayout" |
  "adjustOnZoom" |
  "animation" |
  "annotations" |
  "argumentAxis" |
  "autoHidePointMarkers" |
  "barGroupPadding" |
  "barGroupWidth" |
  "commonAnnotationSettings" |
  "commonAxisSettings" |
  "commonPaneSettings" |
  "commonSeriesSettings" |
  "containerBackgroundColor" |
  "crosshair" |
  "customizeAnnotation" |
  "customizeLabel" |
  "customizePoint" |
  "dataPrepareSettings" |
  "dataSource" |
  "defaultPane" |
  "disabled" |
  "elementAttr" |
  "export" |
  "legend" |
  "loadingIndicator" |
  "margin" |
  "maxBubbleSize" |
  "minBubbleSize" |
  "negativesAsZeroes" |
  "onArgumentAxisClick" |
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
  "onSeriesClick" |
  "onSeriesHoverChanged" |
  "onSeriesSelectionChanged" |
  "onTooltipHidden" |
  "onTooltipShown" |
  "onZoomEnd" |
  "onZoomStart" |
  "palette" |
  "paletteExtensionMode" |
  "panes" |
  "pathModified" |
  "pointSelectionMode" |
  "redrawOnResize" |
  "resizePanesOnZoom" |
  "resolveLabelOverlapping" |
  "rotated" |
  "rtlEnabled" |
  "scrollBar" |
  "series" |
  "seriesSelectionMode" |
  "seriesTemplate" |
  "size" |
  "stickyHovering" |
  "synchronizeMultiAxes" |
  "theme" |
  "title" |
  "tooltip" |
  "valueAxis" |
  "zoomAndPan"
>;

interface DxChart extends AccessibleOptions {
  readonly instance?: Chart;
}

const componentConfig = {
  props: {
    adaptiveLayout: Object as PropType<Record<string, any>>,
    adjustOnZoom: Boolean,
    animation: [Boolean, Object] as PropType<boolean | Record<string, any>>,
    annotations: Array as PropType<Array<any | dxChartAnnotationConfig>>,
    argumentAxis: Object as PropType<Record<string, any>>,
    autoHidePointMarkers: Boolean,
    barGroupPadding: Number,
    barGroupWidth: Number,
    commonAnnotationSettings: Object as PropType<dxChartCommonAnnotationConfig | Record<string, any>>,
    commonAxisSettings: Object as PropType<Record<string, any>>,
    commonPaneSettings: Object as PropType<Record<string, any>>,
    commonSeriesSettings: Object as PropType<Record<string, any>>,
    containerBackgroundColor: String,
    crosshair: Object as PropType<Record<string, any>>,
    customizeAnnotation: Function as PropType<((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig)>,
    customizeLabel: Function as PropType<((pointInfo: any) => SeriesLabel)>,
    customizePoint: Function as PropType<((pointInfo: any) => SeriesPoint)>,
    dataPrepareSettings: Object as PropType<Record<string, any>>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    defaultPane: String,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    export: Object as PropType<Record<string, any>>,
    legend: Object as PropType<Record<string, any>>,
    loadingIndicator: Object as PropType<Record<string, any>>,
    margin: Object as PropType<Record<string, any>>,
    maxBubbleSize: Number,
    minBubbleSize: Number,
    negativesAsZeroes: Boolean,
    onArgumentAxisClick: Function as PropType<((e: ArgumentAxisClickEvent) => void)>,
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
    onSeriesClick: Function as PropType<((e: SeriesClickEvent) => void)>,
    onSeriesHoverChanged: Function as PropType<((e: SeriesHoverChangedEvent) => void)>,
    onSeriesSelectionChanged: Function as PropType<((e: SeriesSelectionChangedEvent) => void)>,
    onTooltipHidden: Function as PropType<((e: TooltipHiddenEvent) => void)>,
    onTooltipShown: Function as PropType<((e: TooltipShownEvent) => void)>,
    onZoomEnd: Function as PropType<((e: ZoomEndEvent) => void)>,
    onZoomStart: Function as PropType<((e: ZoomStartEvent) => void)>,
    palette: [Array, String] as PropType<Array<string> | Palette>,
    paletteExtensionMode: String as PropType<PaletteExtensionMode>,
    panes: [Array, Object] as PropType<Array<Record<string, any>> | Record<string, any>>,
    pathModified: Boolean,
    pointSelectionMode: String as PropType<SingleOrMultiple>,
    redrawOnResize: Boolean,
    resizePanesOnZoom: Boolean,
    resolveLabelOverlapping: String as PropType<ChartsLabelOverlap>,
    rotated: Boolean,
    rtlEnabled: Boolean,
    scrollBar: Object as PropType<Record<string, any>>,
    series: [Array, Object] as PropType<Array<ChartSeries> | ChartSeries | Record<string, any>>,
    seriesSelectionMode: String as PropType<SingleOrMultiple>,
    seriesTemplate: Object as PropType<Record<string, any>>,
    size: Object as PropType<Record<string, any>>,
    stickyHovering: Boolean,
    synchronizeMultiAxes: Boolean,
    theme: String as PropType<Theme>,
    title: [Object, String] as PropType<Record<string, any> | string>,
    tooltip: Object as PropType<Record<string, any>>,
    valueAxis: [Array, Object] as PropType<Array<Record<string, any>> | Record<string, any>>,
    zoomAndPan: Object as PropType<Record<string, any>>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:adaptiveLayout": null,
    "update:adjustOnZoom": null,
    "update:animation": null,
    "update:annotations": null,
    "update:argumentAxis": null,
    "update:autoHidePointMarkers": null,
    "update:barGroupPadding": null,
    "update:barGroupWidth": null,
    "update:commonAnnotationSettings": null,
    "update:commonAxisSettings": null,
    "update:commonPaneSettings": null,
    "update:commonSeriesSettings": null,
    "update:containerBackgroundColor": null,
    "update:crosshair": null,
    "update:customizeAnnotation": null,
    "update:customizeLabel": null,
    "update:customizePoint": null,
    "update:dataPrepareSettings": null,
    "update:dataSource": null,
    "update:defaultPane": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:legend": null,
    "update:loadingIndicator": null,
    "update:margin": null,
    "update:maxBubbleSize": null,
    "update:minBubbleSize": null,
    "update:negativesAsZeroes": null,
    "update:onArgumentAxisClick": null,
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
    "update:onSeriesClick": null,
    "update:onSeriesHoverChanged": null,
    "update:onSeriesSelectionChanged": null,
    "update:onTooltipHidden": null,
    "update:onTooltipShown": null,
    "update:onZoomEnd": null,
    "update:onZoomStart": null,
    "update:palette": null,
    "update:paletteExtensionMode": null,
    "update:panes": null,
    "update:pathModified": null,
    "update:pointSelectionMode": null,
    "update:redrawOnResize": null,
    "update:resizePanesOnZoom": null,
    "update:resolveLabelOverlapping": null,
    "update:rotated": null,
    "update:rtlEnabled": null,
    "update:scrollBar": null,
    "update:series": null,
    "update:seriesSelectionMode": null,
    "update:seriesTemplate": null,
    "update:size": null,
    "update:stickyHovering": null,
    "update:synchronizeMultiAxes": null,
    "update:theme": null,
    "update:title": null,
    "update:tooltip": null,
    "update:valueAxis": null,
    "update:zoomAndPan": null,
  },
  computed: {
    instance(): Chart {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Chart;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      adaptiveLayout: { isCollectionItem: false, optionName: "adaptiveLayout" },
      animation: { isCollectionItem: false, optionName: "animation" },
      annotation: { isCollectionItem: true, optionName: "annotations" },
      argumentAxis: { isCollectionItem: false, optionName: "argumentAxis" },
      chartTitle: { isCollectionItem: false, optionName: "title" },
      commonAnnotationSettings: { isCollectionItem: false, optionName: "commonAnnotationSettings" },
      commonAxisSettings: { isCollectionItem: false, optionName: "commonAxisSettings" },
      commonPaneSettings: { isCollectionItem: false, optionName: "commonPaneSettings" },
      commonSeriesSettings: { isCollectionItem: false, optionName: "commonSeriesSettings" },
      crosshair: { isCollectionItem: false, optionName: "crosshair" },
      dataPrepareSettings: { isCollectionItem: false, optionName: "dataPrepareSettings" },
      export: { isCollectionItem: false, optionName: "export" },
      legend: { isCollectionItem: false, optionName: "legend" },
      loadingIndicator: { isCollectionItem: false, optionName: "loadingIndicator" },
      margin: { isCollectionItem: false, optionName: "margin" },
      pane: { isCollectionItem: true, optionName: "panes" },
      scrollBar: { isCollectionItem: false, optionName: "scrollBar" },
      series: { isCollectionItem: true, optionName: "series" },
      seriesTemplate: { isCollectionItem: false, optionName: "seriesTemplate" },
      size: { isCollectionItem: false, optionName: "size" },
      title: { isCollectionItem: false, optionName: "title" },
      tooltip: { isCollectionItem: false, optionName: "tooltip" },
      valueAxis: { isCollectionItem: true, optionName: "valueAxis" },
      zoomAndPan: { isCollectionItem: false, optionName: "zoomAndPan" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxChart = defineComponent(componentConfig);


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

const DxAggregationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:calculate": null,
    "update:enabled": null,
    "update:method": null,
  },
  props: {
    calculate: Function as PropType<((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>)>,
    enabled: Boolean,
    method: String as PropType<ChartSeriesAggregationMethod>
  }
};

prepareConfigurationComponentConfig(DxAggregationConfig);

const DxAggregation = defineComponent(DxAggregationConfig);

(DxAggregation as any).$_optionName = "aggregation";

const DxAggregationIntervalConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:days": null,
    "update:hours": null,
    "update:milliseconds": null,
    "update:minutes": null,
    "update:months": null,
    "update:quarters": null,
    "update:seconds": null,
    "update:weeks": null,
    "update:years": null,
  },
  props: {
    days: Number,
    hours: Number,
    milliseconds: Number,
    minutes: Number,
    months: Number,
    quarters: Number,
    seconds: Number,
    weeks: Number,
    years: Number
  }
};

prepareConfigurationComponentConfig(DxAggregationIntervalConfig);

const DxAggregationInterval = defineComponent(DxAggregationIntervalConfig);

(DxAggregationInterval as any).$_optionName = "aggregationInterval";

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
    "update:axis": null,
    "update:border": null,
    "update:color": null,
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
    "update:series": null,
    "update:shadow": null,
    "update:template": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:tooltipEnabled": null,
    "update:tooltipTemplate": null,
    "update:type": null,
    "update:value": null,
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
    axis: String,
    border: Object as PropType<Record<string, any>>,
    color: String,
    customizeTooltip: Function as PropType<((annotation: dxChartAnnotationConfig | any) => Record<string, any>)>,
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
    series: String,
    shadow: Object as PropType<Record<string, any>>,
    template: {},
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    tooltipEnabled: Boolean,
    tooltipTemplate: {},
    type: String as PropType<AnnotationType>,
    value: [Date, Number, String],
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
  annotationImage: { isCollectionItem: false, optionName: "image" },
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

const DxAnnotationImageConfig = {
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

prepareConfigurationComponentConfig(DxAnnotationImageConfig);

const DxAnnotationImage = defineComponent(DxAnnotationImageConfig);

(DxAnnotationImage as any).$_optionName = "image";

const DxArgumentAxisConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aggregateByCategory": null,
    "update:aggregatedPointsPosition": null,
    "update:aggregationGroupWidth": null,
    "update:aggregationInterval": null,
    "update:allowDecimals": null,
    "update:argumentType": null,
    "update:axisDivisionFactor": null,
    "update:breaks": null,
    "update:breakStyle": null,
    "update:categories": null,
    "update:color": null,
    "update:constantLines": null,
    "update:constantLineStyle": null,
    "update:customPosition": null,
    "update:customPositionAxis": null,
    "update:discreteAxisDivisionMode": null,
    "update:endOnTick": null,
    "update:grid": null,
    "update:holidays": null,
    "update:hoverMode": null,
    "update:inverted": null,
    "update:label": null,
    "update:linearThreshold": null,
    "update:logarithmBase": null,
    "update:maxValueMargin": null,
    "update:minorGrid": null,
    "update:minorTick": null,
    "update:minorTickCount": null,
    "update:minorTickInterval": null,
    "update:minValueMargin": null,
    "update:minVisualRangeLength": null,
    "update:offset": null,
    "update:opacity": null,
    "update:placeholderSize": null,
    "update:position": null,
    "update:singleWorkdays": null,
    "update:strips": null,
    "update:stripStyle": null,
    "update:tick": null,
    "update:tickInterval": null,
    "update:title": null,
    "update:type": null,
    "update:valueMarginsEnabled": null,
    "update:visible": null,
    "update:visualRange": null,
    "update:visualRangeUpdateMode": null,
    "update:wholeRange": null,
    "update:width": null,
    "update:workdaysOnly": null,
    "update:workWeek": null,
  },
  props: {
    aggregateByCategory: Boolean,
    aggregatedPointsPosition: String as PropType<AggregatedPointsPosition>,
    aggregationGroupWidth: Number,
    aggregationInterval: [Number, Object, String] as PropType<number | Record<string, any> | TimeInterval>,
    allowDecimals: Boolean,
    argumentType: String as PropType<ChartsDataType>,
    axisDivisionFactor: Number,
    breaks: Array as PropType<Array<ScaleBreak>>,
    breakStyle: Object as PropType<Record<string, any>>,
    categories: Array as PropType<Array<Date | number | string>>,
    color: String,
    constantLines: Array as PropType<Array<Record<string, any>>>,
    constantLineStyle: Object as PropType<Record<string, any>>,
    customPosition: [Date, Number, String],
    customPositionAxis: String,
    discreteAxisDivisionMode: String as PropType<DiscreteAxisDivisionMode>,
    endOnTick: Boolean,
    grid: Object as PropType<Record<string, any>>,
    holidays: Array as PropType<(Array<Date | string>) | Array<number>>,
    hoverMode: String as PropType<ArgumentAxisHoverMode>,
    inverted: Boolean,
    label: Object as PropType<Record<string, any>>,
    linearThreshold: Number,
    logarithmBase: Number,
    maxValueMargin: Number,
    minorGrid: Object as PropType<Record<string, any>>,
    minorTick: Object as PropType<Record<string, any>>,
    minorTickCount: Number,
    minorTickInterval: [Number, Object, String] as PropType<number | Record<string, any> | TimeInterval>,
    minValueMargin: Number,
    minVisualRangeLength: [Number, Object, String] as PropType<number | Record<string, any> | TimeInterval>,
    offset: Number,
    opacity: Number,
    placeholderSize: Number,
    position: String as PropType<Position>,
    singleWorkdays: Array as PropType<(Array<Date | string>) | Array<number>>,
    strips: Array as PropType<Array<Record<string, any>>>,
    stripStyle: Object as PropType<Record<string, any>>,
    tick: Object as PropType<Record<string, any>>,
    tickInterval: [Number, Object, String] as PropType<number | Record<string, any> | TimeInterval>,
    title: [Object, String] as PropType<Record<string, any> | string>,
    type: String as PropType<AxisScaleType>,
    valueMarginsEnabled: Boolean,
    visible: Boolean,
    visualRange: [Array, Object] as PropType<(Array<Date | number | string>) | CommonChartTypes.VisualRange | Record<string, any>>,
    visualRangeUpdateMode: String as PropType<VisualRangeUpdateMode>,
    wholeRange: [Array, Object] as PropType<(Array<Date | number | string>) | CommonChartTypes.VisualRange | Record<string, any>>,
    width: Number,
    workdaysOnly: Boolean,
    workWeek: Array as PropType<Array<number>>
  }
};

prepareConfigurationComponentConfig(DxArgumentAxisConfig);

const DxArgumentAxis = defineComponent(DxArgumentAxisConfig);

(DxArgumentAxis as any).$_optionName = "argumentAxis";
(DxArgumentAxis as any).$_expectedChildren = {
  aggregationInterval: { isCollectionItem: false, optionName: "aggregationInterval" },
  axisConstantLineStyle: { isCollectionItem: false, optionName: "constantLineStyle" },
  axisLabel: { isCollectionItem: false, optionName: "label" },
  axisTitle: { isCollectionItem: false, optionName: "title" },
  break: { isCollectionItem: true, optionName: "breaks" },
  breakStyle: { isCollectionItem: false, optionName: "breakStyle" },
  constantLine: { isCollectionItem: true, optionName: "constantLines" },
  constantLineStyle: { isCollectionItem: false, optionName: "constantLineStyle" },
  grid: { isCollectionItem: false, optionName: "grid" },
  label: { isCollectionItem: false, optionName: "label" },
  minorGrid: { isCollectionItem: false, optionName: "minorGrid" },
  minorTick: { isCollectionItem: false, optionName: "minorTick" },
  minorTickInterval: { isCollectionItem: false, optionName: "minorTickInterval" },
  minVisualRangeLength: { isCollectionItem: false, optionName: "minVisualRangeLength" },
  strip: { isCollectionItem: true, optionName: "strips" },
  stripStyle: { isCollectionItem: false, optionName: "stripStyle" },
  tick: { isCollectionItem: false, optionName: "tick" },
  tickInterval: { isCollectionItem: false, optionName: "tickInterval" },
  title: { isCollectionItem: false, optionName: "title" },
  visualRange: { isCollectionItem: false, optionName: "visualRange" },
  wholeRange: { isCollectionItem: false, optionName: "wholeRange" }
};

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

const DxAxisConstantLineStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:label": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String as PropType<DashStyle>,
    label: Object as PropType<Record<string, any>>,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxAxisConstantLineStyleConfig);

const DxAxisConstantLineStyle = defineComponent(DxAxisConstantLineStyleConfig);

(DxAxisConstantLineStyle as any).$_optionName = "constantLineStyle";

const DxAxisConstantLineStyleLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:horizontalAlignment": null,
    "update:position": null,
    "update:verticalAlignment": null,
    "update:visible": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    position: String as PropType<RelativePosition>,
    verticalAlignment: String as PropType<VerticalAlignment>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxAxisConstantLineStyleLabelConfig);

const DxAxisConstantLineStyleLabel = defineComponent(DxAxisConstantLineStyleLabelConfig);

(DxAxisConstantLineStyleLabel as any).$_optionName = "label";

const DxAxisLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:customizeHint": null,
    "update:customizeText": null,
    "update:displayMode": null,
    "update:font": null,
    "update:format": null,
    "update:indentFromAxis": null,
    "update:overlappingBehavior": null,
    "update:position": null,
    "update:rotationAngle": null,
    "update:staggeringSpacing": null,
    "update:template": null,
    "update:textOverflow": null,
    "update:visible": null,
    "update:wordWrap": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    customizeHint: Function as PropType<((argument: { value: Date | number | string, valueText: string }) => string)>,
    customizeText: Function as PropType<((argument: { value: Date | number | string, valueText: string }) => string)>,
    displayMode: String as PropType<ChartLabelDisplayMode>,
    font: Object as PropType<Font | Record<string, any>>,
    format: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    indentFromAxis: Number,
    overlappingBehavior: String as PropType<ChartsAxisLabelOverlap>,
    position: String as PropType<Position | RelativePosition>,
    rotationAngle: Number,
    staggeringSpacing: Number,
    template: {},
    textOverflow: String as PropType<TextOverflow>,
    visible: Boolean,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxAxisLabelConfig);

const DxAxisLabel = defineComponent(DxAxisLabelConfig);

(DxAxisLabel as any).$_optionName = "label";

const DxAxisTitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:font": null,
    "update:margin": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:wordWrap": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    font: Object as PropType<Font | Record<string, any>>,
    margin: Number,
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxAxisTitleConfig);

const DxAxisTitle = defineComponent(DxAxisTitleConfig);

(DxAxisTitle as any).$_optionName = "title";

const DxBackgroundColorConfig = {
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

prepareConfigurationComponentConfig(DxBackgroundColorConfig);

const DxBackgroundColor = defineComponent(DxBackgroundColorConfig);

(DxBackgroundColor as any).$_optionName = "backgroundColor";

const DxBorderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:bottom": null,
    "update:color": null,
    "update:cornerRadius": null,
    "update:dashStyle": null,
    "update:left": null,
    "update:opacity": null,
    "update:right": null,
    "update:top": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    bottom: Boolean,
    color: String,
    cornerRadius: Number,
    dashStyle: String as PropType<DashStyle>,
    left: Boolean,
    opacity: Number,
    right: Boolean,
    top: Boolean,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxBorderConfig);

const DxBorder = defineComponent(DxBorderConfig);

(DxBorder as any).$_optionName = "border";

const DxBreakConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:endValue": null,
    "update:startValue": null,
  },
  props: {
    endValue: [Date, Number, String],
    startValue: [Date, Number, String]
  }
};

prepareConfigurationComponentConfig(DxBreakConfig);

const DxBreak = defineComponent(DxBreakConfig);

(DxBreak as any).$_optionName = "breaks";
(DxBreak as any).$_isCollectionItem = true;

const DxBreakStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:line": null,
    "update:width": null,
  },
  props: {
    color: String,
    line: String as PropType<ScaleBreakLineStyle>,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxBreakStyleConfig);

const DxBreakStyle = defineComponent(DxBreakStyleConfig);

(DxBreakStyle as any).$_optionName = "breakStyle";

const DxChartTitleConfig = {
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

prepareConfigurationComponentConfig(DxChartTitleConfig);

const DxChartTitle = defineComponent(DxChartTitleConfig);

(DxChartTitle as any).$_optionName = "title";
(DxChartTitle as any).$_expectedChildren = {
  chartTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  font: { isCollectionItem: false, optionName: "font" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};

const DxChartTitleSubtitleConfig = {
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

prepareConfigurationComponentConfig(DxChartTitleSubtitleConfig);

const DxChartTitleSubtitle = defineComponent(DxChartTitleSubtitleConfig);

(DxChartTitleSubtitle as any).$_optionName = "subtitle";
(DxChartTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

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
    "update:axis": null,
    "update:border": null,
    "update:color": null,
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
    "update:series": null,
    "update:shadow": null,
    "update:template": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:tooltipEnabled": null,
    "update:tooltipTemplate": null,
    "update:type": null,
    "update:value": null,
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
    axis: String,
    border: Object as PropType<Record<string, any>>,
    color: String,
    customizeTooltip: Function as PropType<((annotation: dxChartAnnotationConfig | any) => Record<string, any>)>,
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
    series: String,
    shadow: Object as PropType<Record<string, any>>,
    template: {},
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    tooltipEnabled: Boolean,
    tooltipTemplate: {},
    type: String as PropType<AnnotationType>,
    value: [Date, Number, String],
    width: Number,
    wordWrap: String as PropType<WordWrap>,
    x: Number,
    y: Number
  }
};

prepareConfigurationComponentConfig(DxCommonAnnotationSettingsConfig);

const DxCommonAnnotationSettings = defineComponent(DxCommonAnnotationSettingsConfig);

(DxCommonAnnotationSettings as any).$_optionName = "commonAnnotationSettings";

const DxCommonAxisSettingsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aggregatedPointsPosition": null,
    "update:allowDecimals": null,
    "update:breakStyle": null,
    "update:color": null,
    "update:constantLineStyle": null,
    "update:discreteAxisDivisionMode": null,
    "update:endOnTick": null,
    "update:grid": null,
    "update:inverted": null,
    "update:label": null,
    "update:maxValueMargin": null,
    "update:minorGrid": null,
    "update:minorTick": null,
    "update:minValueMargin": null,
    "update:opacity": null,
    "update:placeholderSize": null,
    "update:stripStyle": null,
    "update:tick": null,
    "update:title": null,
    "update:valueMarginsEnabled": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    aggregatedPointsPosition: String as PropType<AggregatedPointsPosition>,
    allowDecimals: Boolean,
    breakStyle: Object as PropType<Record<string, any>>,
    color: String,
    constantLineStyle: Object as PropType<Record<string, any>>,
    discreteAxisDivisionMode: String as PropType<DiscreteAxisDivisionMode>,
    endOnTick: Boolean,
    grid: Object as PropType<Record<string, any>>,
    inverted: Boolean,
    label: Object as PropType<Record<string, any>>,
    maxValueMargin: Number,
    minorGrid: Object as PropType<Record<string, any>>,
    minorTick: Object as PropType<Record<string, any>>,
    minValueMargin: Number,
    opacity: Number,
    placeholderSize: Number,
    stripStyle: Object as PropType<Record<string, any>>,
    tick: Object as PropType<Record<string, any>>,
    title: Object as PropType<Record<string, any>>,
    valueMarginsEnabled: Boolean,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxCommonAxisSettingsConfig);

const DxCommonAxisSettings = defineComponent(DxCommonAxisSettingsConfig);

(DxCommonAxisSettings as any).$_optionName = "commonAxisSettings";
(DxCommonAxisSettings as any).$_expectedChildren = {
  commonAxisSettingsConstantLineStyle: { isCollectionItem: false, optionName: "constantLineStyle" },
  commonAxisSettingsLabel: { isCollectionItem: false, optionName: "label" },
  commonAxisSettingsTitle: { isCollectionItem: false, optionName: "title" },
  constantLineStyle: { isCollectionItem: false, optionName: "constantLineStyle" },
  label: { isCollectionItem: false, optionName: "label" },
  title: { isCollectionItem: false, optionName: "title" }
};

const DxCommonAxisSettingsConstantLineStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:label": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String as PropType<DashStyle>,
    label: Object as PropType<Record<string, any>>,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxCommonAxisSettingsConstantLineStyleConfig);

const DxCommonAxisSettingsConstantLineStyle = defineComponent(DxCommonAxisSettingsConstantLineStyleConfig);

(DxCommonAxisSettingsConstantLineStyle as any).$_optionName = "constantLineStyle";
(DxCommonAxisSettingsConstantLineStyle as any).$_expectedChildren = {
  commonAxisSettingsConstantLineStyleLabel: { isCollectionItem: false, optionName: "label" },
  label: { isCollectionItem: false, optionName: "label" }
};

const DxCommonAxisSettingsConstantLineStyleLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:position": null,
    "update:visible": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    position: String as PropType<RelativePosition>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxCommonAxisSettingsConstantLineStyleLabelConfig);

const DxCommonAxisSettingsConstantLineStyleLabel = defineComponent(DxCommonAxisSettingsConstantLineStyleLabelConfig);

(DxCommonAxisSettingsConstantLineStyleLabel as any).$_optionName = "label";

const DxCommonAxisSettingsLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:displayMode": null,
    "update:font": null,
    "update:indentFromAxis": null,
    "update:overlappingBehavior": null,
    "update:position": null,
    "update:rotationAngle": null,
    "update:staggeringSpacing": null,
    "update:template": null,
    "update:textOverflow": null,
    "update:visible": null,
    "update:wordWrap": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    displayMode: String as PropType<ChartLabelDisplayMode>,
    font: Object as PropType<Font | Record<string, any>>,
    indentFromAxis: Number,
    overlappingBehavior: String as PropType<ChartsAxisLabelOverlap>,
    position: String as PropType<Position | RelativePosition>,
    rotationAngle: Number,
    staggeringSpacing: Number,
    template: {},
    textOverflow: String as PropType<TextOverflow>,
    visible: Boolean,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxCommonAxisSettingsLabelConfig);

const DxCommonAxisSettingsLabel = defineComponent(DxCommonAxisSettingsLabelConfig);

(DxCommonAxisSettingsLabel as any).$_optionName = "label";

const DxCommonAxisSettingsTitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:font": null,
    "update:margin": null,
    "update:textOverflow": null,
    "update:wordWrap": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    font: Object as PropType<Font | Record<string, any>>,
    margin: Number,
    textOverflow: String as PropType<TextOverflow>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxCommonAxisSettingsTitleConfig);

const DxCommonAxisSettingsTitle = defineComponent(DxCommonAxisSettingsTitleConfig);

(DxCommonAxisSettingsTitle as any).$_optionName = "title";

const DxCommonPaneSettingsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:border": null,
  },
  props: {
    backgroundColor: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    border: Object as PropType<Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxCommonPaneSettingsConfig);

const DxCommonPaneSettings = defineComponent(DxCommonPaneSettingsConfig);

(DxCommonPaneSettings as any).$_optionName = "commonPaneSettings";
(DxCommonPaneSettings as any).$_expectedChildren = {
  backgroundColor: { isCollectionItem: false, optionName: "backgroundColor" },
  border: { isCollectionItem: false, optionName: "border" },
  paneBorder: { isCollectionItem: false, optionName: "border" }
};

const DxCommonSeriesSettingsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aggregation": null,
    "update:area": null,
    "update:argumentField": null,
    "update:axis": null,
    "update:bar": null,
    "update:barOverlapGroup": null,
    "update:barPadding": null,
    "update:barWidth": null,
    "update:border": null,
    "update:bubble": null,
    "update:candlestick": null,
    "update:closeValueField": null,
    "update:color": null,
    "update:cornerRadius": null,
    "update:dashStyle": null,
    "update:fullstackedarea": null,
    "update:fullstackedbar": null,
    "update:fullstackedline": null,
    "update:fullstackedspline": null,
    "update:fullstackedsplinearea": null,
    "update:highValueField": null,
    "update:hoverMode": null,
    "update:hoverStyle": null,
    "update:ignoreEmptyPoints": null,
    "update:innerColor": null,
    "update:label": null,
    "update:line": null,
    "update:lowValueField": null,
    "update:maxLabelCount": null,
    "update:minBarSize": null,
    "update:opacity": null,
    "update:openValueField": null,
    "update:pane": null,
    "update:point": null,
    "update:rangearea": null,
    "update:rangebar": null,
    "update:rangeValue1Field": null,
    "update:rangeValue2Field": null,
    "update:reduction": null,
    "update:scatter": null,
    "update:selectionMode": null,
    "update:selectionStyle": null,
    "update:showInLegend": null,
    "update:sizeField": null,
    "update:spline": null,
    "update:splinearea": null,
    "update:stack": null,
    "update:stackedarea": null,
    "update:stackedbar": null,
    "update:stackedline": null,
    "update:stackedspline": null,
    "update:stackedsplinearea": null,
    "update:steparea": null,
    "update:stepline": null,
    "update:stock": null,
    "update:tagField": null,
    "update:type": null,
    "update:valueErrorBar": null,
    "update:valueField": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    aggregation: Object as PropType<Record<string, any>>,
    area: {},
    argumentField: String,
    axis: String,
    bar: {},
    barOverlapGroup: String,
    barPadding: Number,
    barWidth: Number,
    border: Object as PropType<Record<string, any>>,
    bubble: {},
    candlestick: {},
    closeValueField: String,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    cornerRadius: Number,
    dashStyle: String as PropType<DashStyle>,
    fullstackedarea: {},
    fullstackedbar: {},
    fullstackedline: {},
    fullstackedspline: {},
    fullstackedsplinearea: {},
    highValueField: String,
    hoverMode: String as PropType<SeriesHoverMode>,
    hoverStyle: Object as PropType<Record<string, any>>,
    ignoreEmptyPoints: Boolean,
    innerColor: String,
    label: Object as PropType<Record<string, any>>,
    line: {},
    lowValueField: String,
    maxLabelCount: Number,
    minBarSize: Number,
    opacity: Number,
    openValueField: String,
    pane: String,
    point: Object as PropType<Record<string, any>>,
    rangearea: {},
    rangebar: {},
    rangeValue1Field: String,
    rangeValue2Field: String,
    reduction: Object as PropType<Record<string, any>>,
    scatter: {},
    selectionMode: String as PropType<SeriesSelectionMode>,
    selectionStyle: Object as PropType<Record<string, any>>,
    showInLegend: Boolean,
    sizeField: String,
    spline: {},
    splinearea: {},
    stack: String,
    stackedarea: {},
    stackedbar: {},
    stackedline: {},
    stackedspline: {},
    stackedsplinearea: {},
    steparea: {},
    stepline: {},
    stock: {},
    tagField: String,
    type: String as PropType<SeriesType>,
    valueErrorBar: Object as PropType<Record<string, any>>,
    valueField: String,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxCommonSeriesSettingsConfig);

const DxCommonSeriesSettings = defineComponent(DxCommonSeriesSettingsConfig);

(DxCommonSeriesSettings as any).$_optionName = "commonSeriesSettings";
(DxCommonSeriesSettings as any).$_expectedChildren = {
  aggregation: { isCollectionItem: false, optionName: "aggregation" },
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  commonSeriesSettingsHoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  commonSeriesSettingsLabel: { isCollectionItem: false, optionName: "label" },
  commonSeriesSettingsSelectionStyle: { isCollectionItem: false, optionName: "selectionStyle" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  label: { isCollectionItem: false, optionName: "label" },
  point: { isCollectionItem: false, optionName: "point" },
  reduction: { isCollectionItem: false, optionName: "reduction" },
  selectionStyle: { isCollectionItem: false, optionName: "selectionStyle" },
  seriesBorder: { isCollectionItem: false, optionName: "border" },
  valueErrorBar: { isCollectionItem: false, optionName: "valueErrorBar" }
};

const DxCommonSeriesSettingsHoverStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:hatching": null,
    "update:highlight": null,
    "update:width": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    dashStyle: String as PropType<DashStyle>,
    hatching: Object as PropType<Record<string, any>>,
    highlight: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxCommonSeriesSettingsHoverStyleConfig);

const DxCommonSeriesSettingsHoverStyle = defineComponent(DxCommonSeriesSettingsHoverStyleConfig);

(DxCommonSeriesSettingsHoverStyle as any).$_optionName = "hoverStyle";
(DxCommonSeriesSettingsHoverStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};

const DxCommonSeriesSettingsLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:argumentFormat": null,
    "update:backgroundColor": null,
    "update:border": null,
    "update:connector": null,
    "update:customizeText": null,
    "update:displayFormat": null,
    "update:font": null,
    "update:format": null,
    "update:horizontalOffset": null,
    "update:position": null,
    "update:rotationAngle": null,
    "update:showForZeroValues": null,
    "update:verticalOffset": null,
    "update:visible": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    argumentFormat: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    backgroundColor: String,
    border: Object as PropType<Record<string, any>>,
    connector: Object as PropType<Record<string, any>>,
    customizeText: Function as PropType<((pointInfo: any) => string)>,
    displayFormat: String,
    font: Object as PropType<Font | Record<string, any>>,
    format: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    horizontalOffset: Number,
    position: String as PropType<RelativePosition>,
    rotationAngle: Number,
    showForZeroValues: Boolean,
    verticalOffset: Number,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxCommonSeriesSettingsLabelConfig);

const DxCommonSeriesSettingsLabel = defineComponent(DxCommonSeriesSettingsLabelConfig);

(DxCommonSeriesSettingsLabel as any).$_optionName = "label";
(DxCommonSeriesSettingsLabel as any).$_expectedChildren = {
  argumentFormat: { isCollectionItem: false, optionName: "argumentFormat" },
  border: { isCollectionItem: false, optionName: "border" },
  connector: { isCollectionItem: false, optionName: "connector" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};

const DxCommonSeriesSettingsSelectionStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:hatching": null,
    "update:highlight": null,
    "update:width": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    dashStyle: String as PropType<DashStyle>,
    hatching: Object as PropType<Record<string, any>>,
    highlight: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxCommonSeriesSettingsSelectionStyleConfig);

const DxCommonSeriesSettingsSelectionStyle = defineComponent(DxCommonSeriesSettingsSelectionStyleConfig);

(DxCommonSeriesSettingsSelectionStyle as any).$_optionName = "selectionStyle";
(DxCommonSeriesSettingsSelectionStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
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

const DxConstantLineConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:displayBehindSeries": null,
    "update:extendAxis": null,
    "update:label": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:value": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String as PropType<DashStyle>,
    displayBehindSeries: Boolean,
    extendAxis: Boolean,
    label: Object as PropType<Record<string, any>>,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    value: [Date, Number, String],
    width: Number
  }
};

prepareConfigurationComponentConfig(DxConstantLineConfig);

const DxConstantLine = defineComponent(DxConstantLineConfig);

(DxConstantLine as any).$_optionName = "constantLines";
(DxConstantLine as any).$_isCollectionItem = true;

const DxConstantLineLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:horizontalAlignment": null,
    "update:position": null,
    "update:text": null,
    "update:verticalAlignment": null,
    "update:visible": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    position: String as PropType<RelativePosition>,
    text: String,
    verticalAlignment: String as PropType<VerticalAlignment>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxConstantLineLabelConfig);

const DxConstantLineLabel = defineComponent(DxConstantLineLabelConfig);

(DxConstantLineLabel as any).$_optionName = "label";

const DxConstantLineStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:label": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String as PropType<DashStyle>,
    label: Object as PropType<Record<string, any>>,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxConstantLineStyleConfig);

const DxConstantLineStyle = defineComponent(DxConstantLineStyleConfig);

(DxConstantLineStyle as any).$_optionName = "constantLineStyle";
(DxConstantLineStyle as any).$_expectedChildren = {
  commonAxisSettingsConstantLineStyleLabel: { isCollectionItem: false, optionName: "label" }
};

const DxCrosshairConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:enabled": null,
    "update:horizontalLine": null,
    "update:label": null,
    "update:opacity": null,
    "update:verticalLine": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String as PropType<DashStyle>,
    enabled: Boolean,
    horizontalLine: [Boolean, Object] as PropType<boolean | Record<string, any>>,
    label: Object as PropType<Record<string, any>>,
    opacity: Number,
    verticalLine: [Boolean, Object] as PropType<boolean | Record<string, any>>,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxCrosshairConfig);

const DxCrosshair = defineComponent(DxCrosshairConfig);

(DxCrosshair as any).$_optionName = "crosshair";
(DxCrosshair as any).$_expectedChildren = {
  horizontalLine: { isCollectionItem: false, optionName: "horizontalLine" },
  horizontalLineLabel: { isCollectionItem: false, optionName: "label" },
  label: { isCollectionItem: false, optionName: "label" },
  verticalLine: { isCollectionItem: false, optionName: "verticalLine" }
};

const DxDataPrepareSettingsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:checkTypeForAllData": null,
    "update:convertToAxisDataType": null,
    "update:sortingMethod": null,
  },
  props: {
    checkTypeForAllData: Boolean,
    convertToAxisDataType: Boolean,
    sortingMethod: [Boolean, Function] as PropType<boolean | (((a: any, b: any) => number))>
  }
};

prepareConfigurationComponentConfig(DxDataPrepareSettingsConfig);

const DxDataPrepareSettings = defineComponent(DxDataPrepareSettingsConfig);

(DxDataPrepareSettings as any).$_optionName = "dataPrepareSettings";

const DxDragBoxStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:opacity": null,
  },
  props: {
    color: String,
    opacity: Number
  }
};

prepareConfigurationComponentConfig(DxDragBoxStyleConfig);

const DxDragBoxStyle = defineComponent(DxDragBoxStyleConfig);

(DxDragBoxStyle as any).$_optionName = "dragBoxStyle";

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

const DxGridConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:opacity": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxGridConfig);

const DxGrid = defineComponent(DxGridConfig);

(DxGrid as any).$_optionName = "grid";

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

const DxHeightConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:rangeMaxPoint": null,
    "update:rangeMinPoint": null,
  },
  props: {
    rangeMaxPoint: Number,
    rangeMinPoint: Number
  }
};

prepareConfigurationComponentConfig(DxHeightConfig);

const DxHeight = defineComponent(DxHeightConfig);

(DxHeight as any).$_optionName = "height";

const DxHorizontalLineConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:label": null,
    "update:opacity": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String as PropType<DashStyle>,
    label: Object as PropType<Record<string, any>>,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxHorizontalLineConfig);

const DxHorizontalLine = defineComponent(DxHorizontalLineConfig);

(DxHorizontalLine as any).$_optionName = "horizontalLine";
(DxHorizontalLine as any).$_expectedChildren = {
  horizontalLineLabel: { isCollectionItem: false, optionName: "label" },
  label: { isCollectionItem: false, optionName: "label" }
};

const DxHorizontalLineLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:customizeText": null,
    "update:font": null,
    "update:format": null,
    "update:visible": null,
  },
  props: {
    backgroundColor: String,
    customizeText: Function as PropType<((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string)>,
    font: Object as PropType<Font | Record<string, any>>,
    format: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxHorizontalLineLabelConfig);

const DxHorizontalLineLabel = defineComponent(DxHorizontalLineLabelConfig);

(DxHorizontalLineLabel as any).$_optionName = "label";

const DxHoverStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:hatching": null,
    "update:highlight": null,
    "update:size": null,
    "update:width": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    dashStyle: String as PropType<DashStyle>,
    hatching: Object as PropType<Record<string, any>>,
    highlight: Boolean,
    size: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxHoverStyleConfig);

const DxHoverStyle = defineComponent(DxHoverStyleConfig);

(DxHoverStyle as any).$_optionName = "hoverStyle";
(DxHoverStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  pointBorder: { isCollectionItem: false, optionName: "border" },
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
    height: [Number, Object] as PropType<number | Record<string, any>>,
    url: [String, Object] as PropType<string | Record<string, any>>,
    width: [Number, Object] as PropType<number | Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxImageConfig);

const DxImage = defineComponent(DxImageConfig);

(DxImage as any).$_optionName = "image";
(DxImage as any).$_expectedChildren = {
  height: { isCollectionItem: false, optionName: "height" },
  url: { isCollectionItem: false, optionName: "url" },
  width: { isCollectionItem: false, optionName: "width" }
};

const DxLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:argumentFormat": null,
    "update:backgroundColor": null,
    "update:border": null,
    "update:connector": null,
    "update:customizeHint": null,
    "update:customizeText": null,
    "update:displayFormat": null,
    "update:displayMode": null,
    "update:font": null,
    "update:format": null,
    "update:horizontalAlignment": null,
    "update:horizontalOffset": null,
    "update:indentFromAxis": null,
    "update:overlappingBehavior": null,
    "update:position": null,
    "update:rotationAngle": null,
    "update:showForZeroValues": null,
    "update:staggeringSpacing": null,
    "update:template": null,
    "update:text": null,
    "update:textOverflow": null,
    "update:verticalAlignment": null,
    "update:verticalOffset": null,
    "update:visible": null,
    "update:wordWrap": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    argumentFormat: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    backgroundColor: String,
    border: Object as PropType<Record<string, any>>,
    connector: Object as PropType<Record<string, any>>,
    customizeHint: Function as PropType<((argument: { value: Date | number | string, valueText: string }) => string)>,
    customizeText: Function as PropType<((argument: { value: Date | number | string, valueText: string }) => string)>,
    displayFormat: String,
    displayMode: String as PropType<ChartLabelDisplayMode>,
    font: Object as PropType<Font | Record<string, any>>,
    format: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    horizontalOffset: Number,
    indentFromAxis: Number,
    overlappingBehavior: String as PropType<ChartsAxisLabelOverlap>,
    position: String as PropType<RelativePosition | Position>,
    rotationAngle: Number,
    showForZeroValues: Boolean,
    staggeringSpacing: Number,
    template: {},
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    verticalAlignment: String as PropType<VerticalAlignment>,
    verticalOffset: Number,
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
    "update:position": null,
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
    customizeHint: Function as PropType<((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string)>,
    customizeItems: Function as PropType<((items: Array<LegendItem>) => Array<LegendItem>)>,
    customizeText: Function as PropType<((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string)>,
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    hoverMode: String as PropType<LegendHoverMode>,
    itemsAlignment: String as PropType<HorizontalAlignment>,
    itemTextPosition: String as PropType<Position>,
    margin: [Number, Object] as PropType<number | Record<string, any>>,
    markerSize: Number,
    markerTemplate: {},
    orientation: String as PropType<Orientation>,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    position: String as PropType<RelativePosition>,
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

const DxLengthConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:days": null,
    "update:hours": null,
    "update:milliseconds": null,
    "update:minutes": null,
    "update:months": null,
    "update:quarters": null,
    "update:seconds": null,
    "update:weeks": null,
    "update:years": null,
  },
  props: {
    days: Number,
    hours: Number,
    milliseconds: Number,
    minutes: Number,
    months: Number,
    quarters: Number,
    seconds: Number,
    weeks: Number,
    years: Number
  }
};

prepareConfigurationComponentConfig(DxLengthConfig);

const DxLength = defineComponent(DxLengthConfig);

(DxLength as any).$_optionName = "length";

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

const DxMinorGridConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:opacity": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxMinorGridConfig);

const DxMinorGrid = defineComponent(DxMinorGridConfig);

(DxMinorGrid as any).$_optionName = "minorGrid";

const DxMinorTickConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:length": null,
    "update:opacity": null,
    "update:shift": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    length: Number,
    opacity: Number,
    shift: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxMinorTickConfig);

const DxMinorTick = defineComponent(DxMinorTickConfig);

(DxMinorTick as any).$_optionName = "minorTick";

const DxMinorTickIntervalConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:days": null,
    "update:hours": null,
    "update:milliseconds": null,
    "update:minutes": null,
    "update:months": null,
    "update:quarters": null,
    "update:seconds": null,
    "update:weeks": null,
    "update:years": null,
  },
  props: {
    days: Number,
    hours: Number,
    milliseconds: Number,
    minutes: Number,
    months: Number,
    quarters: Number,
    seconds: Number,
    weeks: Number,
    years: Number
  }
};

prepareConfigurationComponentConfig(DxMinorTickIntervalConfig);

const DxMinorTickInterval = defineComponent(DxMinorTickIntervalConfig);

(DxMinorTickInterval as any).$_optionName = "minorTickInterval";

const DxMinVisualRangeLengthConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:days": null,
    "update:hours": null,
    "update:milliseconds": null,
    "update:minutes": null,
    "update:months": null,
    "update:quarters": null,
    "update:seconds": null,
    "update:weeks": null,
    "update:years": null,
  },
  props: {
    days: Number,
    hours: Number,
    milliseconds: Number,
    minutes: Number,
    months: Number,
    quarters: Number,
    seconds: Number,
    weeks: Number,
    years: Number
  }
};

prepareConfigurationComponentConfig(DxMinVisualRangeLengthConfig);

const DxMinVisualRangeLength = defineComponent(DxMinVisualRangeLengthConfig);

(DxMinVisualRangeLength as any).$_optionName = "minVisualRangeLength";

const DxPaneConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:border": null,
    "update:height": null,
    "update:name": null,
  },
  props: {
    backgroundColor: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    border: Object as PropType<Record<string, any>>,
    height: [Number, String],
    name: String
  }
};

prepareConfigurationComponentConfig(DxPaneConfig);

const DxPane = defineComponent(DxPaneConfig);

(DxPane as any).$_optionName = "panes";
(DxPane as any).$_isCollectionItem = true;

const DxPaneBorderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:bottom": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:left": null,
    "update:opacity": null,
    "update:right": null,
    "update:top": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    bottom: Boolean,
    color: String,
    dashStyle: String as PropType<DashStyle>,
    left: Boolean,
    opacity: Number,
    right: Boolean,
    top: Boolean,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxPaneBorderConfig);

const DxPaneBorder = defineComponent(DxPaneBorderConfig);

(DxPaneBorder as any).$_optionName = "border";

const DxPointConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:hoverMode": null,
    "update:hoverStyle": null,
    "update:image": null,
    "update:selectionMode": null,
    "update:selectionStyle": null,
    "update:size": null,
    "update:symbol": null,
    "update:visible": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    hoverMode: String as PropType<PointInteractionMode>,
    hoverStyle: Object as PropType<Record<string, any>>,
    image: [Object, String] as PropType<Record<string, any> | string>,
    selectionMode: String as PropType<PointInteractionMode>,
    selectionStyle: Object as PropType<Record<string, any>>,
    size: Number,
    symbol: String as PropType<PointSymbol>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxPointConfig);

const DxPoint = defineComponent(DxPointConfig);

(DxPoint as any).$_optionName = "point";
(DxPoint as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  image: { isCollectionItem: false, optionName: "image" },
  pointBorder: { isCollectionItem: false, optionName: "border" },
  pointHoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  pointImage: { isCollectionItem: false, optionName: "image" },
  pointSelectionStyle: { isCollectionItem: false, optionName: "selectionStyle" },
  selectionStyle: { isCollectionItem: false, optionName: "selectionStyle" }
};

const DxPointBorderConfig = {
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

prepareConfigurationComponentConfig(DxPointBorderConfig);

const DxPointBorder = defineComponent(DxPointBorderConfig);

(DxPointBorder as any).$_optionName = "border";

const DxPointHoverStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:size": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    size: Number
  }
};

prepareConfigurationComponentConfig(DxPointHoverStyleConfig);

const DxPointHoverStyle = defineComponent(DxPointHoverStyleConfig);

(DxPointHoverStyle as any).$_optionName = "hoverStyle";
(DxPointHoverStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  pointBorder: { isCollectionItem: false, optionName: "border" }
};

const DxPointImageConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:height": null,
    "update:url": null,
    "update:width": null,
  },
  props: {
    height: [Number, Object] as PropType<number | Record<string, any>>,
    url: [Object, String] as PropType<Record<string, any> | string>,
    width: [Number, Object] as PropType<number | Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxPointImageConfig);

const DxPointImage = defineComponent(DxPointImageConfig);

(DxPointImage as any).$_optionName = "image";
(DxPointImage as any).$_expectedChildren = {
  height: { isCollectionItem: false, optionName: "height" },
  url: { isCollectionItem: false, optionName: "url" },
  width: { isCollectionItem: false, optionName: "width" }
};

const DxPointSelectionStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:size": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    size: Number
  }
};

prepareConfigurationComponentConfig(DxPointSelectionStyleConfig);

const DxPointSelectionStyle = defineComponent(DxPointSelectionStyleConfig);

(DxPointSelectionStyle as any).$_optionName = "selectionStyle";
(DxPointSelectionStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  pointBorder: { isCollectionItem: false, optionName: "border" }
};

const DxReductionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:level": null,
  },
  props: {
    color: String,
    level: String as PropType<FinancialChartReductionLevel>
  }
};

prepareConfigurationComponentConfig(DxReductionConfig);

const DxReduction = defineComponent(DxReductionConfig);

(DxReduction as any).$_optionName = "reduction";

const DxScrollBarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:offset": null,
    "update:opacity": null,
    "update:position": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    offset: Number,
    opacity: Number,
    position: String as PropType<Position>,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxScrollBarConfig);

const DxScrollBar = defineComponent(DxScrollBarConfig);

(DxScrollBar as any).$_optionName = "scrollBar";

const DxSelectionStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:hatching": null,
    "update:highlight": null,
    "update:size": null,
    "update:width": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    dashStyle: String as PropType<DashStyle>,
    hatching: Object as PropType<Record<string, any>>,
    highlight: Boolean,
    size: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxSelectionStyleConfig);

const DxSelectionStyle = defineComponent(DxSelectionStyleConfig);

(DxSelectionStyle as any).$_optionName = "selectionStyle";
(DxSelectionStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  pointBorder: { isCollectionItem: false, optionName: "border" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};

const DxSeriesConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aggregation": null,
    "update:argumentField": null,
    "update:axis": null,
    "update:barOverlapGroup": null,
    "update:barPadding": null,
    "update:barWidth": null,
    "update:border": null,
    "update:closeValueField": null,
    "update:color": null,
    "update:cornerRadius": null,
    "update:dashStyle": null,
    "update:highValueField": null,
    "update:hoverMode": null,
    "update:hoverStyle": null,
    "update:ignoreEmptyPoints": null,
    "update:innerColor": null,
    "update:label": null,
    "update:lowValueField": null,
    "update:maxLabelCount": null,
    "update:minBarSize": null,
    "update:name": null,
    "update:opacity": null,
    "update:openValueField": null,
    "update:pane": null,
    "update:point": null,
    "update:rangeValue1Field": null,
    "update:rangeValue2Field": null,
    "update:reduction": null,
    "update:selectionMode": null,
    "update:selectionStyle": null,
    "update:showInLegend": null,
    "update:sizeField": null,
    "update:stack": null,
    "update:tag": null,
    "update:tagField": null,
    "update:type": null,
    "update:valueErrorBar": null,
    "update:valueField": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    aggregation: Object as PropType<Record<string, any>>,
    argumentField: String,
    axis: String,
    barOverlapGroup: String,
    barPadding: Number,
    barWidth: Number,
    border: Object as PropType<Record<string, any>>,
    closeValueField: String,
    color: [Object, String] as PropType<ChartsColor | string | Record<string, any>>,
    cornerRadius: Number,
    dashStyle: String as PropType<DashStyle>,
    highValueField: String,
    hoverMode: String as PropType<SeriesHoverMode>,
    hoverStyle: Object as PropType<Record<string, any>>,
    ignoreEmptyPoints: Boolean,
    innerColor: String,
    label: Object as PropType<Record<string, any>>,
    lowValueField: String,
    maxLabelCount: Number,
    minBarSize: Number,
    name: String,
    opacity: Number,
    openValueField: String,
    pane: String,
    point: Object as PropType<Record<string, any>>,
    rangeValue1Field: String,
    rangeValue2Field: String,
    reduction: Object as PropType<Record<string, any>>,
    selectionMode: String as PropType<SeriesSelectionMode>,
    selectionStyle: Object as PropType<Record<string, any>>,
    showInLegend: Boolean,
    sizeField: String,
    stack: String,
    tag: {},
    tagField: String,
    type: String as PropType<SeriesType>,
    valueErrorBar: Object as PropType<Record<string, any>>,
    valueField: String,
    visible: Boolean,
    width: Number
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
    customizeSeries: Function as PropType<((seriesName: any) => ChartSeries)>,
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

const DxStripConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:endValue": null,
    "update:label": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:startValue": null,
  },
  props: {
    color: String,
    endValue: [Date, Number, String],
    label: Object as PropType<Record<string, any>>,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    startValue: [Date, Number, String]
  }
};

prepareConfigurationComponentConfig(DxStripConfig);

const DxStrip = defineComponent(DxStripConfig);

(DxStrip as any).$_optionName = "strips";
(DxStrip as any).$_isCollectionItem = true;

const DxStripLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:horizontalAlignment": null,
    "update:text": null,
    "update:verticalAlignment": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    text: String,
    verticalAlignment: String as PropType<VerticalAlignment>
  }
};

prepareConfigurationComponentConfig(DxStripLabelConfig);

const DxStripLabel = defineComponent(DxStripLabelConfig);

(DxStripLabel as any).$_optionName = "label";

const DxStripStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:label": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
  },
  props: {
    label: Object as PropType<Record<string, any>>,
    paddingLeftRight: Number,
    paddingTopBottom: Number
  }
};

prepareConfigurationComponentConfig(DxStripStyleConfig);

const DxStripStyle = defineComponent(DxStripStyleConfig);

(DxStripStyle as any).$_optionName = "stripStyle";
(DxStripStyle as any).$_expectedChildren = {
  label: { isCollectionItem: false, optionName: "label" },
  stripStyleLabel: { isCollectionItem: false, optionName: "label" }
};

const DxStripStyleLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:horizontalAlignment": null,
    "update:verticalAlignment": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    verticalAlignment: String as PropType<VerticalAlignment>
  }
};

prepareConfigurationComponentConfig(DxStripStyleLabelConfig);

const DxStripStyleLabel = defineComponent(DxStripStyleLabelConfig);

(DxStripStyleLabel as any).$_optionName = "label";

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

const DxTickConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:length": null,
    "update:opacity": null,
    "update:shift": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    length: Number,
    opacity: Number,
    shift: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxTickConfig);

const DxTick = defineComponent(DxTickConfig);

(DxTick as any).$_optionName = "tick";

const DxTickIntervalConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:days": null,
    "update:hours": null,
    "update:milliseconds": null,
    "update:minutes": null,
    "update:months": null,
    "update:quarters": null,
    "update:seconds": null,
    "update:weeks": null,
    "update:years": null,
  },
  props: {
    days: Number,
    hours: Number,
    milliseconds: Number,
    minutes: Number,
    months: Number,
    quarters: Number,
    seconds: Number,
    weeks: Number,
    years: Number
  }
};

prepareConfigurationComponentConfig(DxTickIntervalConfig);

const DxTickInterval = defineComponent(DxTickIntervalConfig);

(DxTickInterval as any).$_optionName = "tickInterval";

const DxTitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
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
    alignment: String as PropType<HorizontalAlignment>,
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

prepareConfigurationComponentConfig(DxTitleConfig);

const DxTitle = defineComponent(DxTitleConfig);

(DxTitle as any).$_optionName = "title";
(DxTitle as any).$_expectedChildren = {
  chartTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  font: { isCollectionItem: false, optionName: "font" },
  legendTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  margin: { isCollectionItem: false, optionName: "margin" }
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
    "update:location": null,
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
    location: String as PropType<ChartTooltipLocation>,
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

const DxUrlConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:rangeMaxPoint": null,
    "update:rangeMinPoint": null,
  },
  props: {
    rangeMaxPoint: String,
    rangeMinPoint: String
  }
};

prepareConfigurationComponentConfig(DxUrlConfig);

const DxUrl = defineComponent(DxUrlConfig);

(DxUrl as any).$_optionName = "url";

const DxValueAxisConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aggregatedPointsPosition": null,
    "update:allowDecimals": null,
    "update:autoBreaksEnabled": null,
    "update:axisDivisionFactor": null,
    "update:breaks": null,
    "update:breakStyle": null,
    "update:categories": null,
    "update:color": null,
    "update:constantLines": null,
    "update:constantLineStyle": null,
    "update:customPosition": null,
    "update:discreteAxisDivisionMode": null,
    "update:endOnTick": null,
    "update:grid": null,
    "update:inverted": null,
    "update:label": null,
    "update:linearThreshold": null,
    "update:logarithmBase": null,
    "update:maxAutoBreakCount": null,
    "update:maxValueMargin": null,
    "update:minorGrid": null,
    "update:minorTick": null,
    "update:minorTickCount": null,
    "update:minorTickInterval": null,
    "update:minValueMargin": null,
    "update:minVisualRangeLength": null,
    "update:multipleAxesSpacing": null,
    "update:name": null,
    "update:offset": null,
    "update:opacity": null,
    "update:pane": null,
    "update:placeholderSize": null,
    "update:position": null,
    "update:showZero": null,
    "update:strips": null,
    "update:stripStyle": null,
    "update:synchronizedValue": null,
    "update:tick": null,
    "update:tickInterval": null,
    "update:title": null,
    "update:type": null,
    "update:valueMarginsEnabled": null,
    "update:valueType": null,
    "update:visible": null,
    "update:visualRange": null,
    "update:visualRangeUpdateMode": null,
    "update:wholeRange": null,
    "update:width": null,
  },
  props: {
    aggregatedPointsPosition: String as PropType<AggregatedPointsPosition>,
    allowDecimals: Boolean,
    autoBreaksEnabled: Boolean,
    axisDivisionFactor: Number,
    breaks: Array as PropType<Array<ScaleBreak>>,
    breakStyle: Object as PropType<Record<string, any>>,
    categories: Array as PropType<Array<Date | number | string>>,
    color: String,
    constantLines: Array as PropType<Array<Record<string, any>>>,
    constantLineStyle: Object as PropType<Record<string, any>>,
    customPosition: [Date, Number, String],
    discreteAxisDivisionMode: String as PropType<DiscreteAxisDivisionMode>,
    endOnTick: Boolean,
    grid: Object as PropType<Record<string, any>>,
    inverted: Boolean,
    label: Object as PropType<Record<string, any>>,
    linearThreshold: Number,
    logarithmBase: Number,
    maxAutoBreakCount: Number,
    maxValueMargin: Number,
    minorGrid: Object as PropType<Record<string, any>>,
    minorTick: Object as PropType<Record<string, any>>,
    minorTickCount: Number,
    minorTickInterval: [Number, Object, String] as PropType<number | Record<string, any> | TimeInterval>,
    minValueMargin: Number,
    minVisualRangeLength: [Number, Object, String] as PropType<number | Record<string, any> | TimeInterval>,
    multipleAxesSpacing: Number,
    name: String,
    offset: Number,
    opacity: Number,
    pane: String,
    placeholderSize: Number,
    position: String as PropType<Position>,
    showZero: Boolean,
    strips: Array as PropType<Array<Record<string, any>>>,
    stripStyle: Object as PropType<Record<string, any>>,
    synchronizedValue: Number,
    tick: Object as PropType<Record<string, any>>,
    tickInterval: [Number, Object, String] as PropType<number | Record<string, any> | TimeInterval>,
    title: [Object, String] as PropType<Record<string, any> | string>,
    type: String as PropType<AxisScaleType>,
    valueMarginsEnabled: Boolean,
    valueType: String as PropType<ChartsDataType>,
    visible: Boolean,
    visualRange: [Array, Object] as PropType<(Array<Date | number | string>) | CommonChartTypes.VisualRange | Record<string, any>>,
    visualRangeUpdateMode: String as PropType<VisualRangeUpdateMode>,
    wholeRange: [Array, Object] as PropType<(Array<Date | number | string>) | CommonChartTypes.VisualRange | Record<string, any>>,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxValueAxisConfig);

const DxValueAxis = defineComponent(DxValueAxisConfig);

(DxValueAxis as any).$_optionName = "valueAxis";
(DxValueAxis as any).$_isCollectionItem = true;
(DxValueAxis as any).$_expectedChildren = {
  axisConstantLineStyle: { isCollectionItem: false, optionName: "constantLineStyle" },
  axisLabel: { isCollectionItem: false, optionName: "label" },
  axisTitle: { isCollectionItem: false, optionName: "title" },
  break: { isCollectionItem: true, optionName: "breaks" },
  constantLine: { isCollectionItem: true, optionName: "constantLines" },
  constantLineStyle: { isCollectionItem: false, optionName: "constantLineStyle" },
  label: { isCollectionItem: false, optionName: "label" },
  minorTickInterval: { isCollectionItem: false, optionName: "minorTickInterval" },
  minVisualRangeLength: { isCollectionItem: false, optionName: "minVisualRangeLength" },
  strip: { isCollectionItem: true, optionName: "strips" },
  tickInterval: { isCollectionItem: false, optionName: "tickInterval" },
  title: { isCollectionItem: false, optionName: "title" },
  visualRange: { isCollectionItem: false, optionName: "visualRange" },
  wholeRange: { isCollectionItem: false, optionName: "wholeRange" }
};

const DxValueErrorBarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:displayMode": null,
    "update:edgeLength": null,
    "update:highValueField": null,
    "update:lineWidth": null,
    "update:lowValueField": null,
    "update:opacity": null,
    "update:type": null,
    "update:value": null,
  },
  props: {
    color: String,
    displayMode: String as PropType<ValueErrorBarDisplayMode>,
    edgeLength: Number,
    highValueField: String,
    lineWidth: Number,
    lowValueField: String,
    opacity: Number,
    type: String as PropType<ValueErrorBarType>,
    value: Number
  }
};

prepareConfigurationComponentConfig(DxValueErrorBarConfig);

const DxValueErrorBar = defineComponent(DxValueErrorBarConfig);

(DxValueErrorBar as any).$_optionName = "valueErrorBar";

const DxVerticalLineConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:label": null,
    "update:opacity": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String as PropType<DashStyle>,
    label: Object as PropType<Record<string, any>>,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxVerticalLineConfig);

const DxVerticalLine = defineComponent(DxVerticalLineConfig);

(DxVerticalLine as any).$_optionName = "verticalLine";
(DxVerticalLine as any).$_expectedChildren = {
  horizontalLineLabel: { isCollectionItem: false, optionName: "label" },
  label: { isCollectionItem: false, optionName: "label" }
};

const DxVisualRangeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:endValue": null,
    "update:length": null,
    "update:startValue": null,
  },
  props: {
    endValue: [Date, Number, String],
    length: [Number, Object, String] as PropType<number | Record<string, any> | TimeInterval>,
    startValue: [Date, Number, String]
  }
};

prepareConfigurationComponentConfig(DxVisualRangeConfig);

const DxVisualRange = defineComponent(DxVisualRangeConfig);

(DxVisualRange as any).$_optionName = "visualRange";

const DxWholeRangeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:endValue": null,
    "update:length": null,
    "update:startValue": null,
  },
  props: {
    endValue: [Date, Number, String],
    length: [Number, Object, String] as PropType<number | Record<string, any> | TimeInterval>,
    startValue: [Date, Number, String]
  }
};

prepareConfigurationComponentConfig(DxWholeRangeConfig);

const DxWholeRange = defineComponent(DxWholeRangeConfig);

(DxWholeRange as any).$_optionName = "wholeRange";

const DxWidthConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:rangeMaxPoint": null,
    "update:rangeMinPoint": null,
  },
  props: {
    rangeMaxPoint: Number,
    rangeMinPoint: Number
  }
};

prepareConfigurationComponentConfig(DxWidthConfig);

const DxWidth = defineComponent(DxWidthConfig);

(DxWidth as any).$_optionName = "width";

const DxZoomAndPanConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowMouseWheel": null,
    "update:allowTouchGestures": null,
    "update:argumentAxis": null,
    "update:dragBoxStyle": null,
    "update:dragToZoom": null,
    "update:panKey": null,
    "update:valueAxis": null,
  },
  props: {
    allowMouseWheel: Boolean,
    allowTouchGestures: Boolean,
    argumentAxis: String as PropType<ChartZoomAndPanMode>,
    dragBoxStyle: Object as PropType<Record<string, any>>,
    dragToZoom: Boolean,
    panKey: String as PropType<EventKeyModifier>,
    valueAxis: String as PropType<ChartZoomAndPanMode>
  }
};

prepareConfigurationComponentConfig(DxZoomAndPanConfig);

const DxZoomAndPan = defineComponent(DxZoomAndPanConfig);

(DxZoomAndPan as any).$_optionName = "zoomAndPan";
(DxZoomAndPan as any).$_expectedChildren = {
  dragBoxStyle: { isCollectionItem: false, optionName: "dragBoxStyle" }
};

export default DxChart;
export {
  DxChart,
  DxAdaptiveLayout,
  DxAggregation,
  DxAggregationInterval,
  DxAnimation,
  DxAnnotation,
  DxAnnotationBorder,
  DxAnnotationImage,
  DxArgumentAxis,
  DxArgumentFormat,
  DxAxisConstantLineStyle,
  DxAxisConstantLineStyleLabel,
  DxAxisLabel,
  DxAxisTitle,
  DxBackgroundColor,
  DxBorder,
  DxBreak,
  DxBreakStyle,
  DxChartTitle,
  DxChartTitleSubtitle,
  DxColor,
  DxCommonAnnotationSettings,
  DxCommonAxisSettings,
  DxCommonAxisSettingsConstantLineStyle,
  DxCommonAxisSettingsConstantLineStyleLabel,
  DxCommonAxisSettingsLabel,
  DxCommonAxisSettingsTitle,
  DxCommonPaneSettings,
  DxCommonSeriesSettings,
  DxCommonSeriesSettingsHoverStyle,
  DxCommonSeriesSettingsLabel,
  DxCommonSeriesSettingsSelectionStyle,
  DxConnector,
  DxConstantLine,
  DxConstantLineLabel,
  DxConstantLineStyle,
  DxCrosshair,
  DxDataPrepareSettings,
  DxDragBoxStyle,
  DxExport,
  DxFont,
  DxFormat,
  DxGrid,
  DxHatching,
  DxHeight,
  DxHorizontalLine,
  DxHorizontalLineLabel,
  DxHoverStyle,
  DxImage,
  DxLabel,
  DxLegend,
  DxLegendTitle,
  DxLegendTitleSubtitle,
  DxLength,
  DxLoadingIndicator,
  DxMargin,
  DxMinorGrid,
  DxMinorTick,
  DxMinorTickInterval,
  DxMinVisualRangeLength,
  DxPane,
  DxPaneBorder,
  DxPoint,
  DxPointBorder,
  DxPointHoverStyle,
  DxPointImage,
  DxPointSelectionStyle,
  DxReduction,
  DxScrollBar,
  DxSelectionStyle,
  DxSeries,
  DxSeriesBorder,
  DxSeriesTemplate,
  DxShadow,
  DxSize,
  DxStrip,
  DxStripLabel,
  DxStripStyle,
  DxStripStyleLabel,
  DxSubtitle,
  DxTick,
  DxTickInterval,
  DxTitle,
  DxTooltip,
  DxTooltipBorder,
  DxUrl,
  DxValueAxis,
  DxValueErrorBar,
  DxVerticalLine,
  DxVisualRange,
  DxWholeRange,
  DxWidth,
  DxZoomAndPan
};
import type * as DxChartTypes from "devextreme/viz/chart_types";
export { DxChartTypes };
