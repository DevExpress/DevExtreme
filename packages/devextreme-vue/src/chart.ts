import { PropType } from "vue";
import Chart, { Properties } from "devextreme/viz/chart";
import { 
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
 } from "devextreme/viz/chart";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
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
    adaptiveLayout: Object,
    adjustOnZoom: Boolean,
    animation: [Boolean, Object],
    annotations: Array as PropType<Array<any> | Array<Object>>,
    argumentAxis: Object,
    autoHidePointMarkers: Boolean,
    barGroupPadding: Number,
    barGroupWidth: Number,
    commonAnnotationSettings: Object,
    commonAxisSettings: Object,
    commonPaneSettings: Object,
    commonSeriesSettings: Object,
    containerBackgroundColor: String,
    crosshair: Object,
    customizeAnnotation: Function as PropType<(annotation: Object | any) => Object>,
    customizeLabel: Function as PropType<(pointInfo: Object) => Object>,
    customizePoint: Function as PropType<(pointInfo: Object) => Object>,
    dataPrepareSettings: Object,
    dataSource: {},
    defaultPane: String,
    disabled: Boolean,
    elementAttr: Object,
    export: Object,
    legend: Object,
    loadingIndicator: Object,
    margin: Object,
    maxBubbleSize: Number,
    minBubbleSize: Number,
    negativesAsZeroes: Boolean,
    onArgumentAxisClick: Function as PropType<(e: ArgumentAxisClickEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onDone: Function as PropType<(e: DoneEvent) => void>,
    onDrawn: Function as PropType<(e: DrawnEvent) => void>,
    onExported: Function as PropType<(e: ExportedEvent) => void>,
    onExporting: Function as PropType<(e: ExportingEvent) => void>,
    onFileSaving: Function as PropType<(e: FileSavingEvent) => void>,
    onIncidentOccurred: Function as PropType<(e: IncidentOccurredEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onLegendClick: Function as PropType<(e: LegendClickEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onPointClick: Function as PropType<(e: PointClickEvent) => void>,
    onPointHoverChanged: Function as PropType<(e: PointHoverChangedEvent) => void>,
    onPointSelectionChanged: Function as PropType<(e: PointSelectionChangedEvent) => void>,
    onSeriesClick: Function as PropType<(e: SeriesClickEvent) => void>,
    onSeriesHoverChanged: Function as PropType<(e: SeriesHoverChangedEvent) => void>,
    onSeriesSelectionChanged: Function as PropType<(e: SeriesSelectionChangedEvent) => void>,
    onTooltipHidden: Function as PropType<(e: TooltipHiddenEvent) => void>,
    onTooltipShown: Function as PropType<(e: TooltipShownEvent) => void>,
    onZoomEnd: Function as PropType<(e: ZoomEndEvent) => void>,
    onZoomStart: Function as PropType<(e: ZoomStartEvent) => void>,
    palette: [Array, String] as PropType<Array<string> | ("Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office")>,
    paletteExtensionMode: String as PropType<"alternate" | "blend" | "extrapolate">,
    panes: [Array, Object] as PropType<Array<Object> | Object>,
    pathModified: Boolean,
    pointSelectionMode: String as PropType<"single" | "multiple">,
    redrawOnResize: Boolean,
    resizePanesOnZoom: Boolean,
    resolveLabelOverlapping: String as PropType<"hide" | "none" | "stack">,
    rotated: Boolean,
    rtlEnabled: Boolean,
    scrollBar: Object,
    series: [Array, Object] as PropType<Array<Object> | Object>,
    seriesSelectionMode: String as PropType<"single" | "multiple">,
    seriesTemplate: Object,
    size: Object,
    stickyHovering: Boolean,
    synchronizeMultiAxes: Boolean,
    theme: String as PropType<"generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light">,
    title: [Object, String],
    tooltip: Object,
    valueAxis: [Array, Object] as PropType<Array<Object> | Object>,
    zoomAndPan: Object
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
    calculate: Function as PropType<(aggregationInfo: Object, series: Object) => (Object | Array<Object>)>,
    enabled: Boolean,
    method: String as PropType<"avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom">
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
    easing: String as PropType<"easeOutCubic" | "linear">,
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
    border: Object,
    color: String,
    customizeTooltip: Function as PropType<(annotation: Object | any) => Object>,
    data: {},
    description: String,
    font: Object,
    height: Number,
    image: [Object, String],
    name: String,
    offsetX: Number,
    offsetY: Number,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    series: String,
    shadow: Object,
    template: {},
    text: String,
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    tooltipEnabled: Boolean,
    tooltipTemplate: {},
    type: String as PropType<"text" | "image" | "custom">,
    value: [Date, Number, String],
    width: Number,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
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
    aggregatedPointsPosition: String as PropType<"betweenTicks" | "crossTicks">,
    aggregationGroupWidth: Number,
    aggregationInterval: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    allowDecimals: Boolean,
    argumentType: String as PropType<"datetime" | "numeric" | "string">,
    axisDivisionFactor: Number,
    breaks: Array as PropType<Array<Object>>,
    breakStyle: Object,
    categories: Array as PropType<Array<Date> | Array<number> | Array<string>>,
    color: String,
    constantLines: Array as PropType<Array<Object>>,
    constantLineStyle: Object,
    customPosition: [Date, Number, String],
    customPositionAxis: String,
    discreteAxisDivisionMode: String as PropType<"betweenLabels" | "crossLabels">,
    endOnTick: Boolean,
    grid: Object,
    holidays: Array as PropType<(Array<Date> | Array<string>) | Array<number>>,
    hoverMode: String as PropType<"allArgumentPoints" | "none">,
    inverted: Boolean,
    label: Object,
    linearThreshold: Number,
    logarithmBase: Number,
    maxValueMargin: Number,
    minorGrid: Object,
    minorTick: Object,
    minorTickCount: Number,
    minorTickInterval: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    minValueMargin: Number,
    minVisualRangeLength: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    offset: Number,
    opacity: Number,
    placeholderSize: Number,
    position: String as PropType<"bottom" | "left" | "right" | "top">,
    singleWorkdays: Array as PropType<(Array<Date> | Array<string>) | Array<number>>,
    strips: Array as PropType<Array<Object>>,
    stripStyle: Object,
    tick: Object,
    tickInterval: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    title: [Object, String],
    type: String as PropType<"continuous" | "discrete" | "logarithmic">,
    valueMarginsEnabled: Boolean,
    visible: Boolean,
    visualRange: [Array, Object] as PropType<(Array<Date> | Array<number> | Array<string>) | Object>,
    visualRangeUpdateMode: String as PropType<"auto" | "keep" | "reset" | "shift">,
    wholeRange: [Array, Object] as PropType<(Array<Date> | Array<number> | Array<string>) | Object>,
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
    formatter: Function as PropType<(value: number | Date) => string>,
    parser: Function as PropType<(value: string) => (number | Date)>,
    precision: Number,
    type: String as PropType<"billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime">,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    label: Object,
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
    font: Object,
    horizontalAlignment: String as PropType<"center" | "left" | "right">,
    position: String as PropType<"inside" | "outside">,
    verticalAlignment: String as PropType<"bottom" | "center" | "top">,
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
    alignment: String as PropType<"center" | "left" | "right">,
    customizeHint: Function as PropType<(argument: Object) => string>,
    customizeText: Function as PropType<(argument: Object) => string>,
    displayMode: String as PropType<"rotate" | "stagger" | "standard">,
    font: Object,
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    indentFromAxis: Number,
    overlappingBehavior: String as PropType<"rotate" | "stagger" | "none" | "hide">,
    position: String as PropType<"inside" | "outside" | "bottom" | "left" | "right" | "top">,
    rotationAngle: Number,
    staggeringSpacing: Number,
    template: {},
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    visible: Boolean,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">
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
    alignment: String as PropType<"center" | "left" | "right">,
    font: Object,
    margin: Number,
    text: String,
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
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
    line: String as PropType<"straight" | "waved">,
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
    font: Object,
    horizontalAlignment: String as PropType<"center" | "left" | "right">,
    margin: [Number, Object],
    placeholderSize: Number,
    subtitle: [Object, String],
    text: String,
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    verticalAlignment: String as PropType<"bottom" | "top">,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">
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
    font: Object,
    offset: Number,
    text: String,
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">
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
    border: Object,
    color: String,
    customizeTooltip: Function as PropType<(annotation: Object | any) => Object>,
    data: {},
    description: String,
    font: Object,
    height: Number,
    image: [Object, String],
    offsetX: Number,
    offsetY: Number,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    series: String,
    shadow: Object,
    template: {},
    text: String,
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    tooltipEnabled: Boolean,
    tooltipTemplate: {},
    type: String as PropType<"text" | "image" | "custom">,
    value: [Date, Number, String],
    width: Number,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">,
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
    aggregatedPointsPosition: String as PropType<"betweenTicks" | "crossTicks">,
    allowDecimals: Boolean,
    breakStyle: Object,
    color: String,
    constantLineStyle: Object,
    discreteAxisDivisionMode: String as PropType<"betweenLabels" | "crossLabels">,
    endOnTick: Boolean,
    grid: Object,
    inverted: Boolean,
    label: Object,
    maxValueMargin: Number,
    minorGrid: Object,
    minorTick: Object,
    minValueMargin: Number,
    opacity: Number,
    placeholderSize: Number,
    stripStyle: Object,
    tick: Object,
    title: Object,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    label: Object,
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
    font: Object,
    position: String as PropType<"inside" | "outside">,
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
    alignment: String as PropType<"center" | "left" | "right">,
    displayMode: String as PropType<"rotate" | "stagger" | "standard">,
    font: Object,
    indentFromAxis: Number,
    overlappingBehavior: String as PropType<"rotate" | "stagger" | "none" | "hide">,
    position: String as PropType<"inside" | "outside" | "bottom" | "left" | "right" | "top">,
    rotationAngle: Number,
    staggeringSpacing: Number,
    template: {},
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    visible: Boolean,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">
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
    alignment: String as PropType<"center" | "left" | "right">,
    font: Object,
    margin: Number,
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">
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
    backgroundColor: [Object, String],
    border: Object
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
    aggregation: Object,
    area: {},
    argumentField: String,
    axis: String,
    bar: {},
    barOverlapGroup: String,
    barPadding: Number,
    barWidth: Number,
    border: Object,
    bubble: {},
    candlestick: {},
    closeValueField: String,
    color: [Object, String],
    cornerRadius: Number,
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    fullstackedarea: {},
    fullstackedbar: {},
    fullstackedline: {},
    fullstackedspline: {},
    fullstackedsplinearea: {},
    highValueField: String,
    hoverMode: String as PropType<"allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "nearestPoint" | "none" | "onlyPoint">,
    hoverStyle: Object,
    ignoreEmptyPoints: Boolean,
    innerColor: String,
    label: Object,
    line: {},
    lowValueField: String,
    maxLabelCount: Number,
    minBarSize: Number,
    opacity: Number,
    openValueField: String,
    pane: String,
    point: Object,
    rangearea: {},
    rangebar: {},
    rangeValue1Field: String,
    rangeValue2Field: String,
    reduction: Object,
    scatter: {},
    selectionMode: String as PropType<"allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "none" | "onlyPoint">,
    selectionStyle: Object,
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
    type: String as PropType<"area" | "bar" | "bubble" | "candlestick" | "fullstackedarea" | "fullstackedbar" | "fullstackedline" | "fullstackedspline" | "fullstackedsplinearea" | "line" | "rangearea" | "rangebar" | "scatter" | "spline" | "splinearea" | "stackedarea" | "stackedbar" | "stackedline" | "stackedspline" | "stackedsplinearea" | "steparea" | "stepline" | "stock">,
    valueErrorBar: Object,
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
    border: Object,
    color: [Object, String],
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    hatching: Object,
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
    alignment: String as PropType<"center" | "left" | "right">,
    argumentFormat: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    backgroundColor: String,
    border: Object,
    connector: Object,
    customizeText: Function as PropType<(pointInfo: Object) => string>,
    displayFormat: String,
    font: Object,
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    horizontalOffset: Number,
    position: String as PropType<"inside" | "outside">,
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
    border: Object,
    color: [Object, String],
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    hatching: Object,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    displayBehindSeries: Boolean,
    extendAxis: Boolean,
    label: Object,
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
    font: Object,
    horizontalAlignment: String as PropType<"center" | "left" | "right">,
    position: String as PropType<"inside" | "outside">,
    text: String,
    verticalAlignment: String as PropType<"bottom" | "center" | "top">,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    label: Object,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxConstantLineStyleConfig);

const DxConstantLineStyle = defineComponent(DxConstantLineStyleConfig);

(DxConstantLineStyle as any).$_optionName = "constantLineStyle";

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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    enabled: Boolean,
    horizontalLine: [Boolean, Object],
    label: Object,
    opacity: Number,
    verticalLine: [Boolean, Object],
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
    sortingMethod: [Boolean, Function] as PropType<Boolean | ((a: Object, b: Object) => number)>
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
    formats: Array as PropType<Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">>,
    margin: Number,
    printingEnabled: Boolean,
    svgToCanvas: Function as PropType<(svg: any, canvas: any) => any>
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
    formatter: Function as PropType<(value: number | Date) => string>,
    parser: Function as PropType<(value: string) => (number | Date)>,
    precision: Number,
    type: String as PropType<"billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime">,
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
    direction: String as PropType<"left" | "none" | "right">,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    label: Object,
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
    customizeText: Function as PropType<(info: Object) => string>,
    font: Object,
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
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
    border: Object,
    color: [Object, String],
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    hatching: Object,
    highlight: Boolean,
    size: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxHoverStyleConfig);

const DxHoverStyle = defineComponent(DxHoverStyleConfig);

(DxHoverStyle as any).$_optionName = "hoverStyle";

const DxImageConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:height": null,
    "update:url": null,
    "update:width": null,
  },
  props: {
    height: [Number, Object],
    url: [String, Object],
    width: [Number, Object]
  }
};

prepareConfigurationComponentConfig(DxImageConfig);

const DxImage = defineComponent(DxImageConfig);

(DxImage as any).$_optionName = "image";

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
    alignment: String as PropType<"center" | "left" | "right">,
    argumentFormat: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    backgroundColor: String,
    border: Object,
    connector: Object,
    customizeHint: Function as PropType<(argument: Object) => string>,
    customizeText: Function as PropType<(argument: Object) => string>,
    displayFormat: String,
    displayMode: String as PropType<"rotate" | "stagger" | "standard">,
    font: Object,
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    horizontalAlignment: String as PropType<"center" | "left" | "right">,
    horizontalOffset: Number,
    indentFromAxis: Number,
    overlappingBehavior: String as PropType<"rotate" | "stagger" | "none" | "hide">,
    position: String as PropType<"inside" | "outside" | "bottom" | "left" | "right" | "top">,
    rotationAngle: Number,
    showForZeroValues: Boolean,
    staggeringSpacing: Number,
    template: {},
    text: String,
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    verticalAlignment: String as PropType<"bottom" | "center" | "top">,
    verticalOffset: Number,
    visible: Boolean,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";

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
    border: Object,
    columnCount: Number,
    columnItemSpacing: Number,
    customizeHint: Function as PropType<(seriesInfo: Object) => string>,
    customizeItems: Function as PropType<(items: Array<Object>) => Array<Object>>,
    customizeText: Function as PropType<(seriesInfo: Object) => string>,
    font: Object,
    horizontalAlignment: String as PropType<"center" | "left" | "right">,
    hoverMode: String as PropType<"excludePoints" | "includePoints" | "none">,
    itemsAlignment: String as PropType<"center" | "left" | "right">,
    itemTextPosition: String as PropType<"bottom" | "left" | "right" | "top">,
    margin: [Number, Object],
    markerSize: Number,
    markerTemplate: {},
    orientation: String as PropType<"horizontal" | "vertical">,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    position: String as PropType<"inside" | "outside">,
    rowCount: Number,
    rowItemSpacing: Number,
    title: [Object, String],
    verticalAlignment: String as PropType<"bottom" | "top">,
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
    font: Object,
    horizontalAlignment: String as PropType<"center" | "left" | "right">,
    margin: Object,
    placeholderSize: Number,
    subtitle: [Object, String],
    text: String,
    verticalAlignment: String as PropType<"bottom" | "top">
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
    font: Object,
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
    font: Object,
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
    backgroundColor: [Object, String],
    border: Object,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
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
    border: Object,
    color: [Object, String],
    hoverMode: String as PropType<"allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint">,
    hoverStyle: Object,
    image: [Object, String],
    selectionMode: String as PropType<"allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint">,
    selectionStyle: Object,
    size: Number,
    symbol: String as PropType<"circle" | "cross" | "polygon" | "square" | "triangle" | "triangleDown" | "triangleUp">,
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
    border: Object,
    color: [Object, String],
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
    height: [Number, Object],
    url: [Object, String],
    width: [Number, Object]
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
    border: Object,
    color: [Object, String],
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
    level: String as PropType<"close" | "high" | "low" | "open">
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
    position: String as PropType<"bottom" | "left" | "right" | "top">,
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
    border: Object,
    color: [Object, String],
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    hatching: Object,
    highlight: Boolean,
    size: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxSelectionStyleConfig);

const DxSelectionStyle = defineComponent(DxSelectionStyleConfig);

(DxSelectionStyle as any).$_optionName = "selectionStyle";

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
    aggregation: Object,
    argumentField: String,
    axis: String,
    barOverlapGroup: String,
    barPadding: Number,
    barWidth: Number,
    border: Object,
    closeValueField: String,
    color: [Object, String],
    cornerRadius: Number,
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    highValueField: String,
    hoverMode: String as PropType<"allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "nearestPoint" | "none" | "onlyPoint">,
    hoverStyle: Object,
    ignoreEmptyPoints: Boolean,
    innerColor: String,
    label: Object,
    lowValueField: String,
    maxLabelCount: Number,
    minBarSize: Number,
    name: String,
    opacity: Number,
    openValueField: String,
    pane: String,
    point: Object,
    rangeValue1Field: String,
    rangeValue2Field: String,
    reduction: Object,
    selectionMode: String as PropType<"allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "none" | "onlyPoint">,
    selectionStyle: Object,
    showInLegend: Boolean,
    sizeField: String,
    stack: String,
    tag: {},
    tagField: String,
    type: String as PropType<"area" | "bar" | "bubble" | "candlestick" | "fullstackedarea" | "fullstackedbar" | "fullstackedline" | "fullstackedspline" | "fullstackedsplinearea" | "line" | "rangearea" | "rangebar" | "scatter" | "spline" | "splinearea" | "stackedarea" | "stackedbar" | "stackedline" | "stackedspline" | "stackedsplinearea" | "steparea" | "stepline" | "stock">,
    valueErrorBar: Object,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
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
    customizeSeries: Function as PropType<(seriesName: any) => Object>,
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
    label: Object,
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
    font: Object,
    horizontalAlignment: String as PropType<"center" | "left" | "right">,
    text: String,
    verticalAlignment: String as PropType<"bottom" | "center" | "top">
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
    label: Object,
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
    font: Object,
    horizontalAlignment: String as PropType<"center" | "left" | "right">,
    verticalAlignment: String as PropType<"bottom" | "center" | "top">
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
    font: Object,
    offset: Number,
    text: String,
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">
  }
};

prepareConfigurationComponentConfig(DxSubtitleConfig);

const DxSubtitle = defineComponent(DxSubtitleConfig);

(DxSubtitle as any).$_optionName = "subtitle";

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
    alignment: String as PropType<"center" | "left" | "right">,
    font: Object,
    horizontalAlignment: String as PropType<"center" | "left" | "right">,
    margin: [Number, Object],
    placeholderSize: Number,
    subtitle: [Object, String],
    text: String,
    textOverflow: String as PropType<"ellipsis" | "hide" | "none">,
    verticalAlignment: String as PropType<"bottom" | "top">,
    wordWrap: String as PropType<"normal" | "breakWord" | "none">
  }
};

prepareConfigurationComponentConfig(DxTitleConfig);

const DxTitle = defineComponent(DxTitleConfig);

(DxTitle as any).$_optionName = "title";

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
    argumentFormat: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    arrowLength: Number,
    border: Object,
    color: String,
    container: {},
    contentTemplate: {},
    cornerRadius: Number,
    customizeTooltip: Function as PropType<(pointInfo: Object) => Object>,
    enabled: Boolean,
    font: Object,
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    interactive: Boolean,
    location: String as PropType<"center" | "edge">,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    shadow: Object,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
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
    aggregatedPointsPosition: String as PropType<"betweenTicks" | "crossTicks">,
    allowDecimals: Boolean,
    autoBreaksEnabled: Boolean,
    axisDivisionFactor: Number,
    breaks: Array as PropType<Array<Object>>,
    breakStyle: Object,
    categories: Array as PropType<Array<Date> | Array<number> | Array<string>>,
    color: String,
    constantLines: Array as PropType<Array<Object>>,
    constantLineStyle: Object,
    customPosition: [Date, Number, String],
    discreteAxisDivisionMode: String as PropType<"betweenLabels" | "crossLabels">,
    endOnTick: Boolean,
    grid: Object,
    inverted: Boolean,
    label: Object,
    linearThreshold: Number,
    logarithmBase: Number,
    maxAutoBreakCount: Number,
    maxValueMargin: Number,
    minorGrid: Object,
    minorTick: Object,
    minorTickCount: Number,
    minorTickInterval: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    minValueMargin: Number,
    minVisualRangeLength: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    multipleAxesSpacing: Number,
    name: String,
    offset: Number,
    opacity: Number,
    pane: String,
    placeholderSize: Number,
    position: String as PropType<"bottom" | "left" | "right" | "top">,
    showZero: Boolean,
    strips: Array as PropType<Array<Object>>,
    stripStyle: Object,
    synchronizedValue: Number,
    tick: Object,
    tickInterval: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    title: [Object, String],
    type: String as PropType<"continuous" | "discrete" | "logarithmic">,
    valueMarginsEnabled: Boolean,
    valueType: String as PropType<"datetime" | "numeric" | "string">,
    visible: Boolean,
    visualRange: [Array, Object] as PropType<(Array<Date> | Array<number> | Array<string>) | Object>,
    visualRangeUpdateMode: String as PropType<"auto" | "keep" | "reset" | "shift">,
    wholeRange: [Array, Object] as PropType<(Array<Date> | Array<number> | Array<string>) | Object>,
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
    displayMode: String as PropType<"auto" | "high" | "low" | "none">,
    edgeLength: Number,
    highValueField: String,
    lineWidth: Number,
    lowValueField: String,
    opacity: Number,
    type: String as PropType<"fixed" | "percent" | "stdDeviation" | "stdError" | "variance">,
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
    dashStyle: String as PropType<"dash" | "dot" | "longDash" | "solid">,
    label: Object,
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
    length: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
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
    length: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
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
    argumentAxis: String as PropType<"both" | "none" | "pan" | "zoom">,
    dragBoxStyle: Object,
    dragToZoom: Boolean,
    panKey: String as PropType<"alt" | "ctrl" | "meta" | "shift">,
    valueAxis: String as PropType<"both" | "none" | "pan" | "zoom">
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
