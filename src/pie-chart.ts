import PieChart, { Properties } from "devextreme/viz/pie_chart";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

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
const DxPieChart = createComponent({
  props: {
    adaptiveLayout: Object,
    animation: [Boolean, Object],
    annotations: Array,
    centerTemplate: {},
    commonAnnotationSettings: Object,
    commonSeriesSettings: {},
    customizeAnnotation: Function,
    customizeLabel: Function,
    customizePoint: Function,
    dataSource: {},
    diameter: Number,
    disabled: Boolean,
    elementAttr: Object,
    export: Object,
    innerRadius: Number,
    legend: Object,
    loadingIndicator: Object,
    margin: Object,
    minDiameter: Number,
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
    onTooltipHidden: Function,
    onTooltipShown: Function,
    palette: [Array, String],
    paletteExtensionMode: String,
    pathModified: Boolean,
    pointSelectionMode: String,
    redrawOnResize: Boolean,
    resolveLabelOverlapping: String,
    rtlEnabled: Boolean,
    segmentsDirection: String,
    series: [Array, Object],
    seriesTemplate: Object,
    size: Object,
    sizeGroup: String,
    startAngle: Number,
    theme: String,
    title: [Object, String],
    tooltip: Object,
    type: String
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
    argument: {},
    arrowLength: Number,
    arrowWidth: Number,
    border: Object,
    color: String,
    customizeTooltip: Function,
    data: {},
    description: String,
    font: Object,
    height: Number,
    image: [Object, String],
    location: String,
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
const DxBorder = createConfigurationComponent({
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
(DxBorder as any).$_optionName = "border";
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
    argument: {},
    arrowLength: Number,
    arrowWidth: Number,
    border: Object,
    color: String,
    customizeTooltip: Function,
    data: {},
    description: String,
    font: Object,
    height: Number,
    image: [Object, String],
    location: String,
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
    width: Number,
    wordWrap: String,
    x: Number,
    y: Number
  }
});
(DxCommonAnnotationSettings as any).$_optionName = "commonAnnotationSettings";
const DxCommonSeriesSettings = createConfigurationComponent({
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
    argumentType: String,
    border: Object,
    color: [Object, String],
    hoverMode: String,
    hoverStyle: Object,
    label: Object,
    maxLabelCount: Number,
    minSegmentSize: Number,
    selectionMode: String,
    selectionStyle: Object,
    smallValuesGrouping: Object,
    tagField: String,
    valueField: String
  }
});
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
const DxHoverStyle = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:hatching": null,
    "update:highlight": null,
  },
  props: {
    border: Object,
    color: [Object, String],
    hatching: Object,
    highlight: Boolean
  }
});
(DxHoverStyle as any).$_optionName = "hoverStyle";
(DxHoverStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};
const DxImage = createConfigurationComponent({
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
(DxImage as any).$_optionName = "image";
const DxLabel = createConfigurationComponent({
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
    argumentFormat: [Object, Function, String],
    backgroundColor: String,
    border: Object,
    connector: Object,
    customizeText: Function,
    displayFormat: String,
    font: Object,
    format: [Object, Function, String],
    position: String,
    radialOffset: Number,
    rotationAngle: Number,
    textOverflow: String,
    visible: Boolean,
    wordWrap: String
  }
});
(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  argumentFormat: { isCollectionItem: false, optionName: "argumentFormat" },
  border: { isCollectionItem: false, optionName: "border" },
  connector: { isCollectionItem: false, optionName: "connector" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};
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
const DxPieChartTitle = createConfigurationComponent({
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
(DxPieChartTitle as any).$_optionName = "title";
(DxPieChartTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  margin: { isCollectionItem: false, optionName: "margin" },
  pieChartTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};
const DxPieChartTitleSubtitle = createConfigurationComponent({
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
(DxPieChartTitleSubtitle as any).$_optionName = "subtitle";
(DxPieChartTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};
const DxSelectionStyle = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:hatching": null,
    "update:highlight": null,
  },
  props: {
    border: Object,
    color: [Object, String],
    hatching: Object,
    highlight: Boolean
  }
});
(DxSelectionStyle as any).$_optionName = "selectionStyle";
(DxSelectionStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  seriesBorder: { isCollectionItem: false, optionName: "border" }
};
const DxSeries = createConfigurationComponent({
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
    argumentType: String,
    border: Object,
    color: [Object, String],
    hoverMode: String,
    hoverStyle: Object,
    label: Object,
    maxLabelCount: Number,
    minSegmentSize: Number,
    name: String,
    selectionMode: String,
    selectionStyle: Object,
    smallValuesGrouping: Object,
    tag: {},
    tagField: String,
    valueField: String
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
const DxSmallValuesGrouping = createConfigurationComponent({
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
    mode: String,
    threshold: Number,
    topCount: Number
  }
});
(DxSmallValuesGrouping as any).$_optionName = "smallValuesGrouping";
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
const DxTitle = createConfigurationComponent({
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
    margin: Object,
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
