import Chart, { Properties } from "devextreme/viz/chart";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

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
const DxChart = createComponent({
  props: {
    adaptiveLayout: Object,
    adjustOnZoom: Boolean,
    animation: [Boolean, Object],
    annotations: Array,
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
    customizeAnnotation: Function,
    customizeLabel: Function,
    customizePoint: Function,
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
    onArgumentAxisClick: Function,
    onDisposing: Function,
    onDone: Function,
    onDrawn: Function,
    onExported: Function,
    onExporting: Function,
    onFileSaving: Function,
    onIncidentOccurred: Function,
    onInitialized: Function,
    onLegendClick: Function,
    onOptionChanged: Function,
    onPointClick: Function,
    onPointHoverChanged: Function,
    onPointSelectionChanged: Function,
    onSeriesClick: Function,
    onSeriesHoverChanged: Function,
    onSeriesSelectionChanged: Function,
    onTooltipHidden: Function,
    onTooltipShown: Function,
    onZoomEnd: Function,
    onZoomStart: Function,
    palette: [Array, String],
    paletteExtensionMode: String,
    panes: [Array, Object],
    pathModified: Boolean,
    pointSelectionMode: String,
    redrawOnResize: Boolean,
    resizePanesOnZoom: Boolean,
    resolveLabelOverlapping: String,
    rotated: Boolean,
    rtlEnabled: Boolean,
    scrollBar: Object,
    series: [Array, Object],
    seriesSelectionMode: String,
    seriesTemplate: Object,
    size: Object,
    stickyHovering: Boolean,
    synchronizeMultiAxes: Boolean,
    theme: String,
    title: [Object, String],
    tooltip: Object,
    valueAxis: [Array, Object],
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
});

const DxAdaptiveLayout = createConfigurationComponent({
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
});
(DxAdaptiveLayout as any).$_optionName = "adaptiveLayout";
const DxAggregation = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:calculate": null,
    "update:enabled": null,
    "update:method": null,
  },
  props: {
    calculate: Function,
    enabled: Boolean,
    method: String
  }
});
(DxAggregation as any).$_optionName = "aggregation";
const DxAggregationInterval = createConfigurationComponent({
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
});
(DxAggregationInterval as any).$_optionName = "aggregationInterval";
const DxAnimation = createConfigurationComponent({
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
    easing: String,
    enabled: Boolean,
    maxPointCountSupported: Number
  }
});
(DxAnimation as any).$_optionName = "animation";
const DxAnnotation = createConfigurationComponent({
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
    argument: {},
    arrowLength: Number,
    arrowWidth: Number,
    axis: String,
    border: Object,
    color: String,
    customizeTooltip: Function,
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
    textOverflow: String,
    tooltipEnabled: Boolean,
    tooltipTemplate: {},
    type: String,
    value: {},
    width: Number,
    wordWrap: String,
    x: Number,
    y: Number
  }
});
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
const DxAnnotationBorder = createConfigurationComponent({
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
    dashStyle: String,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
});
(DxAnnotationBorder as any).$_optionName = "border";
const DxAnnotationImage = createConfigurationComponent({
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
});
(DxAnnotationImage as any).$_optionName = "image";
const DxArgumentAxis = createConfigurationComponent({
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
    aggregatedPointsPosition: String,
    aggregationGroupWidth: Number,
    aggregationInterval: [Number, Object, String],
    allowDecimals: Boolean,
    argumentType: String,
    axisDivisionFactor: Number,
    breaks: Array,
    breakStyle: Object,
    categories: Array,
    color: String,
    constantLines: Array,
    constantLineStyle: Object,
    customPosition: {},
    customPositionAxis: String,
    discreteAxisDivisionMode: String,
    endOnTick: Boolean,
    grid: Object,
    holidays: Array,
    hoverMode: String,
    inverted: Boolean,
    label: Object,
    linearThreshold: Number,
    logarithmBase: Number,
    maxValueMargin: Number,
    minorGrid: Object,
    minorTick: Object,
    minorTickCount: Number,
    minorTickInterval: [Number, Object, String],
    minValueMargin: Number,
    minVisualRangeLength: [Number, Object, String],
    offset: Number,
    opacity: Number,
    placeholderSize: Number,
    position: String,
    singleWorkdays: Array,
    strips: Array,
    stripStyle: Object,
    tick: Object,
    tickInterval: [Number, Object, String],
    title: [Object, String],
    type: String,
    valueMarginsEnabled: Boolean,
    visible: Boolean,
    visualRange: [Array, Object],
    visualRangeUpdateMode: String,
    wholeRange: [Array, Object],
    width: Number,
    workdaysOnly: Boolean,
    workWeek: Array
  }
});
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
const DxArgumentFormat = createConfigurationComponent({
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
    formatter: Function,
    parser: Function,
    precision: Number,
    type: String,
    useCurrencyAccountingStyle: Boolean
  }
});
(DxArgumentFormat as any).$_optionName = "argumentFormat";
const DxAxisConstantLineStyle = createConfigurationComponent({
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
    dashStyle: String,
    label: Object,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    width: Number
  }
});
(DxAxisConstantLineStyle as any).$_optionName = "constantLineStyle";
const DxAxisConstantLineStyleLabel = createConfigurationComponent({
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
    horizontalAlignment: String,
    position: String,
    verticalAlignment: String,
    visible: Boolean
  }
});
(DxAxisConstantLineStyleLabel as any).$_optionName = "label";
const DxAxisLabel = createConfigurationComponent({
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
    alignment: String,
    customizeHint: Function,
    customizeText: Function,
    displayMode: String,
    font: Object,
    format: [Object, Function, String],
    indentFromAxis: Number,
    overlappingBehavior: String,
    position: String,
    rotationAngle: Number,
    staggeringSpacing: Number,
    template: {},
    textOverflow: String,
    visible: Boolean,
    wordWrap: String
  }
});
(DxAxisLabel as any).$_optionName = "label";
const DxAxisTitle = createConfigurationComponent({
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
    alignment: String,
    font: Object,
    margin: Number,
    text: String,
    textOverflow: String,
    wordWrap: String
  }
});
(DxAxisTitle as any).$_optionName = "title";
const DxBackgroundColor = createConfigurationComponent({
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
});
(DxBackgroundColor as any).$_optionName = "backgroundColor";
const DxBorder = createConfigurationComponent({
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
    dashStyle: String,
    left: Boolean,
    opacity: Number,
    right: Boolean,
    top: Boolean,
    visible: Boolean,
    width: Number
  }
});
(DxBorder as any).$_optionName = "border";
const DxBreak = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:endValue": null,
    "update:startValue": null,
  },
  props: {
    endValue: {},
    startValue: {}
  }
});
(DxBreak as any).$_optionName = "breaks";
(DxBreak as any).$_isCollectionItem = true;
const DxBreakStyle = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:line": null,
    "update:width": null,
  },
  props: {
    color: String,
    line: String,
    width: Number
  }
});
(DxBreakStyle as any).$_optionName = "breakStyle";
const DxChartTitle = createConfigurationComponent({
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
    horizontalAlignment: String,
    margin: [Number, Object],
    placeholderSize: Number,
    subtitle: [Object, String],
    text: String,
    textOverflow: String,
    verticalAlignment: String,
    wordWrap: String
  }
});
(DxChartTitle as any).$_optionName = "title";
(DxChartTitle as any).$_expectedChildren = {
  chartTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  font: { isCollectionItem: false, optionName: "font" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};
const DxChartTitleSubtitle = createConfigurationComponent({
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
    textOverflow: String,
    wordWrap: String
  }
});
(DxChartTitleSubtitle as any).$_optionName = "subtitle";
(DxChartTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};
const DxColor = createConfigurationComponent({
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
});
(DxColor as any).$_optionName = "color";
const DxCommonAnnotationSettings = createConfigurationComponent({
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
    argument: {},
    arrowLength: Number,
    arrowWidth: Number,
    axis: String,
    border: Object,
    color: String,
    customizeTooltip: Function,
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
    textOverflow: String,
    tooltipEnabled: Boolean,
    tooltipTemplate: {},
    type: String,
    value: {},
    width: Number,
    wordWrap: String,
    x: Number,
    y: Number
  }
});
(DxCommonAnnotationSettings as any).$_optionName = "commonAnnotationSettings";
const DxCommonAxisSettings = createConfigurationComponent({
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
    aggregatedPointsPosition: String,
    allowDecimals: Boolean,
    breakStyle: Object,
    color: String,
    constantLineStyle: Object,
    discreteAxisDivisionMode: String,
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
});
(DxCommonAxisSettings as any).$_optionName = "commonAxisSettings";
(DxCommonAxisSettings as any).$_expectedChildren = {
  commonAxisSettingsConstantLineStyle: { isCollectionItem: false, optionName: "constantLineStyle" },
  commonAxisSettingsLabel: { isCollectionItem: false, optionName: "label" },
  commonAxisSettingsTitle: { isCollectionItem: false, optionName: "title" },
  constantLineStyle: { isCollectionItem: false, optionName: "constantLineStyle" },
  label: { isCollectionItem: false, optionName: "label" },
  title: { isCollectionItem: false, optionName: "title" }
};
const DxCommonAxisSettingsConstantLineStyle = createConfigurationComponent({
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
    dashStyle: String,
    label: Object,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    width: Number
  }
});
(DxCommonAxisSettingsConstantLineStyle as any).$_optionName = "constantLineStyle";
(DxCommonAxisSettingsConstantLineStyle as any).$_expectedChildren = {
  commonAxisSettingsConstantLineStyleLabel: { isCollectionItem: false, optionName: "label" },
  label: { isCollectionItem: false, optionName: "label" }
};
const DxCommonAxisSettingsConstantLineStyleLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:position": null,
    "update:visible": null,
  },
  props: {
    font: Object,
    position: String,
    visible: Boolean
  }
});
(DxCommonAxisSettingsConstantLineStyleLabel as any).$_optionName = "label";
const DxCommonAxisSettingsLabel = createConfigurationComponent({
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
    alignment: String,
    displayMode: String,
    font: Object,
    indentFromAxis: Number,
    overlappingBehavior: String,
    position: String,
    rotationAngle: Number,
    staggeringSpacing: Number,
    template: {},
    textOverflow: String,
    visible: Boolean,
    wordWrap: String
  }
});
(DxCommonAxisSettingsLabel as any).$_optionName = "label";
const DxCommonAxisSettingsTitle = createConfigurationComponent({
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
    alignment: String,
    font: Object,
    margin: Number,
    textOverflow: String,
    wordWrap: String
  }
});
(DxCommonAxisSettingsTitle as any).$_optionName = "title";
const DxCommonPaneSettings = createConfigurationComponent({
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
});
(DxCommonPaneSettings as any).$_optionName = "commonPaneSettings";
(DxCommonPaneSettings as any).$_expectedChildren = {
  backgroundColor: { isCollectionItem: false, optionName: "backgroundColor" },
  border: { isCollectionItem: false, optionName: "border" },
  paneBorder: { isCollectionItem: false, optionName: "border" }
};
const DxCommonSeriesSettings = createConfigurationComponent({
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
    dashStyle: String,
    fullstackedarea: {},
    fullstackedbar: {},
    fullstackedline: {},
    fullstackedspline: {},
    fullstackedsplinearea: {},
    highValueField: String,
    hoverMode: String,
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
    selectionMode: String,
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
    type: String,
    valueErrorBar: Object,
    valueField: String,
    visible: Boolean,
    width: Number
  }
});
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
const DxCommonSeriesSettingsHoverStyle = createConfigurationComponent({
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
    dashStyle: String,
    hatching: Object,
    highlight: Boolean,
    width: Number
  }
});
(DxCommonSeriesSettingsHoverStyle as any).$_optionName = "hoverStyle";
(DxCommonSeriesSettingsHoverStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};
const DxCommonSeriesSettingsLabel = createConfigurationComponent({
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
    alignment: String,
    argumentFormat: [Object, Function, String],
    backgroundColor: String,
    border: Object,
    connector: Object,
    customizeText: Function,
    displayFormat: String,
    font: Object,
    format: [Object, Function, String],
    horizontalOffset: Number,
    position: String,
    rotationAngle: Number,
    showForZeroValues: Boolean,
    verticalOffset: Number,
    visible: Boolean
  }
});
(DxCommonSeriesSettingsLabel as any).$_optionName = "label";
(DxCommonSeriesSettingsLabel as any).$_expectedChildren = {
  argumentFormat: { isCollectionItem: false, optionName: "argumentFormat" },
  border: { isCollectionItem: false, optionName: "border" },
  connector: { isCollectionItem: false, optionName: "connector" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};
const DxCommonSeriesSettingsSelectionStyle = createConfigurationComponent({
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
    dashStyle: String,
    hatching: Object,
    highlight: Boolean,
    width: Number
  }
});
(DxCommonSeriesSettingsSelectionStyle as any).$_optionName = "selectionStyle";
(DxCommonSeriesSettingsSelectionStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};
const DxConnector = createConfigurationComponent({
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
});
(DxConnector as any).$_optionName = "connector";
const DxConstantLine = createConfigurationComponent({
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
    dashStyle: String,
    displayBehindSeries: Boolean,
    extendAxis: Boolean,
    label: Object,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    value: {},
    width: Number
  }
});
(DxConstantLine as any).$_optionName = "constantLines";
(DxConstantLine as any).$_isCollectionItem = true;
const DxConstantLineLabel = createConfigurationComponent({
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
    horizontalAlignment: String,
    position: String,
    text: String,
    verticalAlignment: String,
    visible: Boolean
  }
});
(DxConstantLineLabel as any).$_optionName = "label";
const DxConstantLineStyle = createConfigurationComponent({
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
    dashStyle: String,
    label: Object,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    width: Number
  }
});
(DxConstantLineStyle as any).$_optionName = "constantLineStyle";
const DxCrosshair = createConfigurationComponent({
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
    dashStyle: String,
    enabled: Boolean,
    horizontalLine: [Boolean, Object],
    label: Object,
    opacity: Number,
    verticalLine: [Boolean, Object],
    width: Number
  }
});
(DxCrosshair as any).$_optionName = "crosshair";
(DxCrosshair as any).$_expectedChildren = {
  horizontalLine: { isCollectionItem: false, optionName: "horizontalLine" },
  horizontalLineLabel: { isCollectionItem: false, optionName: "label" },
  label: { isCollectionItem: false, optionName: "label" },
  verticalLine: { isCollectionItem: false, optionName: "verticalLine" }
};
const DxDataPrepareSettings = createConfigurationComponent({
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
    sortingMethod: [Boolean, Function]
  }
});
(DxDataPrepareSettings as any).$_optionName = "dataPrepareSettings";
const DxDragBoxStyle = createConfigurationComponent({
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
});
(DxDragBoxStyle as any).$_optionName = "dragBoxStyle";
const DxExport = createConfigurationComponent({
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
    formats: Array,
    margin: Number,
    printingEnabled: Boolean,
    svgToCanvas: Function
  }
});
(DxExport as any).$_optionName = "export";
const DxFont = createConfigurationComponent({
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
});
(DxFont as any).$_optionName = "font";
const DxFormat = createConfigurationComponent({
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
    formatter: Function,
    parser: Function,
    precision: Number,
    type: String,
    useCurrencyAccountingStyle: Boolean
  }
});
(DxFormat as any).$_optionName = "format";
const DxGrid = createConfigurationComponent({
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
});
(DxGrid as any).$_optionName = "grid";
const DxHatching = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:direction": null,
    "update:opacity": null,
    "update:step": null,
    "update:width": null,
  },
  props: {
    direction: String,
    opacity: Number,
    step: Number,
    width: Number
  }
});
(DxHatching as any).$_optionName = "hatching";
const DxHeight = createConfigurationComponent({
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
});
(DxHeight as any).$_optionName = "height";
const DxHorizontalLine = createConfigurationComponent({
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
    dashStyle: String,
    label: Object,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
});
(DxHorizontalLine as any).$_optionName = "horizontalLine";
(DxHorizontalLine as any).$_expectedChildren = {
  horizontalLineLabel: { isCollectionItem: false, optionName: "label" },
  label: { isCollectionItem: false, optionName: "label" }
};
const DxHorizontalLineLabel = createConfigurationComponent({
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
    customizeText: Function,
    font: Object,
    format: [Object, Function, String],
    visible: Boolean
  }
});
(DxHorizontalLineLabel as any).$_optionName = "label";
const DxHoverStyle = createConfigurationComponent({
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
    dashStyle: String,
    hatching: Object,
    highlight: Boolean,
    size: Number,
    width: Number
  }
});
(DxHoverStyle as any).$_optionName = "hoverStyle";
const DxImage = createConfigurationComponent({
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
});
(DxImage as any).$_optionName = "image";
const DxLabel = createConfigurationComponent({
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
    alignment: String,
    argumentFormat: [Object, Function, String],
    backgroundColor: String,
    border: Object,
    connector: Object,
    customizeHint: Function,
    customizeText: Function,
    displayFormat: String,
    displayMode: String,
    font: Object,
    format: [Object, Function, String],
    horizontalAlignment: String,
    horizontalOffset: Number,
    indentFromAxis: Number,
    overlappingBehavior: String,
    position: String,
    rotationAngle: Number,
    showForZeroValues: Boolean,
    staggeringSpacing: Number,
    template: {},
    text: String,
    textOverflow: String,
    verticalAlignment: String,
    verticalOffset: Number,
    visible: Boolean,
    wordWrap: String
  }
});
(DxLabel as any).$_optionName = "label";
const DxLegend = createConfigurationComponent({
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
    customizeHint: Function,
    customizeItems: Function,
    customizeText: Function,
    font: Object,
    horizontalAlignment: String,
    hoverMode: String,
    itemsAlignment: String,
    itemTextPosition: String,
    margin: [Number, Object],
    markerSize: Number,
    markerTemplate: {},
    orientation: String,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    position: String,
    rowCount: Number,
    rowItemSpacing: Number,
    title: [Object, String],
    verticalAlignment: String,
    visible: Boolean
  }
});
(DxLegend as any).$_optionName = "legend";
(DxLegend as any).$_expectedChildren = {
  annotationBorder: { isCollectionItem: false, optionName: "border" },
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  legendTitle: { isCollectionItem: false, optionName: "title" },
  margin: { isCollectionItem: false, optionName: "margin" },
  title: { isCollectionItem: false, optionName: "title" }
};
const DxLegendTitle = createConfigurationComponent({
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
    horizontalAlignment: String,
    margin: Object,
    placeholderSize: Number,
    subtitle: [Object, String],
    text: String,
    verticalAlignment: String
  }
});
(DxLegendTitle as any).$_optionName = "title";
(DxLegendTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  legendTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};
const DxLegendTitleSubtitle = createConfigurationComponent({
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
});
(DxLegendTitleSubtitle as any).$_optionName = "subtitle";
(DxLegendTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};
const DxLength = createConfigurationComponent({
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
});
(DxLength as any).$_optionName = "length";
const DxLoadingIndicator = createConfigurationComponent({
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
});
(DxLoadingIndicator as any).$_optionName = "loadingIndicator";
(DxLoadingIndicator as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};
const DxMargin = createConfigurationComponent({
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
});
(DxMargin as any).$_optionName = "margin";
const DxMinorGrid = createConfigurationComponent({
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
});
(DxMinorGrid as any).$_optionName = "minorGrid";
const DxMinorTick = createConfigurationComponent({
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
});
(DxMinorTick as any).$_optionName = "minorTick";
const DxMinorTickInterval = createConfigurationComponent({
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
});
(DxMinorTickInterval as any).$_optionName = "minorTickInterval";
const DxMinVisualRangeLength = createConfigurationComponent({
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
});
(DxMinVisualRangeLength as any).$_optionName = "minVisualRangeLength";
const DxPane = createConfigurationComponent({
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
});
(DxPane as any).$_optionName = "panes";
(DxPane as any).$_isCollectionItem = true;
const DxPaneBorder = createConfigurationComponent({
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
    dashStyle: String,
    left: Boolean,
    opacity: Number,
    right: Boolean,
    top: Boolean,
    visible: Boolean,
    width: Number
  }
});
(DxPaneBorder as any).$_optionName = "border";
const DxPoint = createConfigurationComponent({
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
    hoverMode: String,
    hoverStyle: Object,
    image: [Object, String],
    selectionMode: String,
    selectionStyle: Object,
    size: Number,
    symbol: String,
    visible: Boolean
  }
});
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
const DxPointBorder = createConfigurationComponent({
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
});
(DxPointBorder as any).$_optionName = "border";
const DxPointHoverStyle = createConfigurationComponent({
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
});
(DxPointHoverStyle as any).$_optionName = "hoverStyle";
(DxPointHoverStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  pointBorder: { isCollectionItem: false, optionName: "border" }
};
const DxPointImage = createConfigurationComponent({
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
});
(DxPointImage as any).$_optionName = "image";
(DxPointImage as any).$_expectedChildren = {
  height: { isCollectionItem: false, optionName: "height" },
  url: { isCollectionItem: false, optionName: "url" },
  width: { isCollectionItem: false, optionName: "width" }
};
const DxPointSelectionStyle = createConfigurationComponent({
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
});
(DxPointSelectionStyle as any).$_optionName = "selectionStyle";
(DxPointSelectionStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  pointBorder: { isCollectionItem: false, optionName: "border" }
};
const DxReduction = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:level": null,
  },
  props: {
    color: String,
    level: String
  }
});
(DxReduction as any).$_optionName = "reduction";
const DxScrollBar = createConfigurationComponent({
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
    position: String,
    visible: Boolean,
    width: Number
  }
});
(DxScrollBar as any).$_optionName = "scrollBar";
const DxSelectionStyle = createConfigurationComponent({
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
    dashStyle: String,
    hatching: Object,
    highlight: Boolean,
    size: Number,
    width: Number
  }
});
(DxSelectionStyle as any).$_optionName = "selectionStyle";
const DxSeries = createConfigurationComponent({
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
    dashStyle: String,
    highValueField: String,
    hoverMode: String,
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
    selectionMode: String,
    selectionStyle: Object,
    showInLegend: Boolean,
    sizeField: String,
    stack: String,
    tag: {},
    tagField: String,
    type: String,
    valueErrorBar: Object,
    valueField: String,
    visible: Boolean,
    width: Number
  }
});
(DxSeries as any).$_optionName = "series";
(DxSeries as any).$_isCollectionItem = true;
const DxSeriesBorder = createConfigurationComponent({
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
    dashStyle: String,
    visible: Boolean,
    width: Number
  }
});
(DxSeriesBorder as any).$_optionName = "border";
const DxSeriesTemplate = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeSeries": null,
    "update:nameField": null,
  },
  props: {
    customizeSeries: Function,
    nameField: String
  }
});
(DxSeriesTemplate as any).$_optionName = "seriesTemplate";
const DxShadow = createConfigurationComponent({
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
});
(DxShadow as any).$_optionName = "shadow";
const DxSize = createConfigurationComponent({
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
});
(DxSize as any).$_optionName = "size";
const DxStrip = createConfigurationComponent({
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
    endValue: {},
    label: Object,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    startValue: {}
  }
});
(DxStrip as any).$_optionName = "strips";
(DxStrip as any).$_isCollectionItem = true;
const DxStripLabel = createConfigurationComponent({
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
    horizontalAlignment: String,
    text: String,
    verticalAlignment: String
  }
});
(DxStripLabel as any).$_optionName = "label";
const DxStripStyle = createConfigurationComponent({
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
});
(DxStripStyle as any).$_optionName = "stripStyle";
(DxStripStyle as any).$_expectedChildren = {
  label: { isCollectionItem: false, optionName: "label" },
  stripStyleLabel: { isCollectionItem: false, optionName: "label" }
};
const DxStripStyleLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:horizontalAlignment": null,
    "update:verticalAlignment": null,
  },
  props: {
    font: Object,
    horizontalAlignment: String,
    verticalAlignment: String
  }
});
(DxStripStyleLabel as any).$_optionName = "label";
const DxSubtitle = createConfigurationComponent({
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
    textOverflow: String,
    wordWrap: String
  }
});
(DxSubtitle as any).$_optionName = "subtitle";
const DxTick = createConfigurationComponent({
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
});
(DxTick as any).$_optionName = "tick";
const DxTickInterval = createConfigurationComponent({
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
});
(DxTickInterval as any).$_optionName = "tickInterval";
const DxTitle = createConfigurationComponent({
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
    alignment: String,
    font: Object,
    horizontalAlignment: String,
    margin: [Number, Object],
    placeholderSize: Number,
    subtitle: [Object, String],
    text: String,
    textOverflow: String,
    verticalAlignment: String,
    wordWrap: String
  }
});
(DxTitle as any).$_optionName = "title";
const DxTooltip = createConfigurationComponent({
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
    argumentFormat: [Object, Function, String],
    arrowLength: Number,
    border: Object,
    color: String,
    container: {},
    contentTemplate: {},
    cornerRadius: Number,
    customizeTooltip: Function,
    enabled: Boolean,
    font: Object,
    format: [Object, Function, String],
    interactive: Boolean,
    location: String,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    shadow: Object,
    shared: Boolean,
    zIndex: Number
  }
});
(DxTooltip as any).$_optionName = "tooltip";
(DxTooltip as any).$_expectedChildren = {
  argumentFormat: { isCollectionItem: false, optionName: "argumentFormat" },
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
  shadow: { isCollectionItem: false, optionName: "shadow" },
  tooltipBorder: { isCollectionItem: false, optionName: "border" }
};
const DxTooltipBorder = createConfigurationComponent({
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
    dashStyle: String,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
});
(DxTooltipBorder as any).$_optionName = "border";
const DxUrl = createConfigurationComponent({
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
});
(DxUrl as any).$_optionName = "url";
const DxValueAxis = createConfigurationComponent({
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
    aggregatedPointsPosition: String,
    allowDecimals: Boolean,
    autoBreaksEnabled: Boolean,
    axisDivisionFactor: Number,
    breaks: Array,
    breakStyle: Object,
    categories: Array,
    color: String,
    constantLines: Array,
    constantLineStyle: Object,
    customPosition: {},
    discreteAxisDivisionMode: String,
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
    minorTickInterval: [Number, Object, String],
    minValueMargin: Number,
    minVisualRangeLength: [Number, Object, String],
    multipleAxesSpacing: Number,
    name: String,
    offset: Number,
    opacity: Number,
    pane: String,
    placeholderSize: Number,
    position: String,
    showZero: Boolean,
    strips: Array,
    stripStyle: Object,
    synchronizedValue: Number,
    tick: Object,
    tickInterval: [Number, Object, String],
    title: [Object, String],
    type: String,
    valueMarginsEnabled: Boolean,
    valueType: String,
    visible: Boolean,
    visualRange: [Array, Object],
    visualRangeUpdateMode: String,
    wholeRange: [Array, Object],
    width: Number
  }
});
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
const DxValueErrorBar = createConfigurationComponent({
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
    displayMode: String,
    edgeLength: Number,
    highValueField: String,
    lineWidth: Number,
    lowValueField: String,
    opacity: Number,
    type: String,
    value: Number
  }
});
(DxValueErrorBar as any).$_optionName = "valueErrorBar";
const DxVerticalLine = createConfigurationComponent({
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
    dashStyle: String,
    label: Object,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
});
(DxVerticalLine as any).$_optionName = "verticalLine";
(DxVerticalLine as any).$_expectedChildren = {
  horizontalLineLabel: { isCollectionItem: false, optionName: "label" },
  label: { isCollectionItem: false, optionName: "label" }
};
const DxVisualRange = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:endValue": null,
    "update:length": null,
    "update:startValue": null,
  },
  props: {
    endValue: {},
    length: [Number, Object, String],
    startValue: {}
  }
});
(DxVisualRange as any).$_optionName = "visualRange";
const DxWholeRange = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:endValue": null,
    "update:length": null,
    "update:startValue": null,
  },
  props: {
    endValue: {},
    length: [Number, Object, String],
    startValue: {}
  }
});
(DxWholeRange as any).$_optionName = "wholeRange";
const DxWidth = createConfigurationComponent({
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
});
(DxWidth as any).$_optionName = "width";
const DxZoomAndPan = createConfigurationComponent({
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
    argumentAxis: String,
    dragBoxStyle: Object,
    dragToZoom: Boolean,
    panKey: String,
    valueAxis: String
  }
});
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
