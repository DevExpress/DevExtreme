import PolarChart, { Properties } from "devextreme/viz/polar_chart";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "adaptiveLayout" |
  "animation" |
  "annotations" |
  "argumentAxis" |
  "barGroupPadding" |
  "barGroupWidth" |
  "commonAnnotationSettings" |
  "commonAxisSettings" |
  "commonSeriesSettings" |
  "containerBackgroundColor" |
  "customizeAnnotation" |
  "customizeLabel" |
  "customizePoint" |
  "dataPrepareSettings" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "export" |
  "legend" |
  "loadingIndicator" |
  "margin" |
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
  "pathModified" |
  "pointSelectionMode" |
  "redrawOnResize" |
  "resolveLabelOverlapping" |
  "rtlEnabled" |
  "series" |
  "seriesSelectionMode" |
  "seriesTemplate" |
  "size" |
  "theme" |
  "title" |
  "tooltip" |
  "useSpiderWeb" |
  "valueAxis"
>;

interface DxPolarChart extends AccessibleOptions {
  readonly instance?: PolarChart;
}
const DxPolarChart = createComponent({
  props: {
    adaptiveLayout: Object,
    animation: [Boolean, Object],
    annotations: Array,
    argumentAxis: Object,
    barGroupPadding: Number,
    barGroupWidth: Number,
    commonAnnotationSettings: Object,
    commonAxisSettings: Object,
    commonSeriesSettings: Object,
    containerBackgroundColor: String,
    customizeAnnotation: Function,
    customizeLabel: Function,
    customizePoint: Function,
    dataPrepareSettings: Object,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    export: Object,
    legend: Object,
    loadingIndicator: Object,
    margin: Object,
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
    pathModified: Boolean,
    pointSelectionMode: String,
    redrawOnResize: Boolean,
    resolveLabelOverlapping: String,
    rtlEnabled: Boolean,
    series: [Array, Object],
    seriesSelectionMode: String,
    seriesTemplate: Object,
    size: Object,
    theme: String,
    title: [Object, String],
    tooltip: Object,
    useSpiderWeb: Boolean,
    valueAxis: Object
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:adaptiveLayout": null,
    "update:animation": null,
    "update:annotations": null,
    "update:argumentAxis": null,
    "update:barGroupPadding": null,
    "update:barGroupWidth": null,
    "update:commonAnnotationSettings": null,
    "update:commonAxisSettings": null,
    "update:commonSeriesSettings": null,
    "update:containerBackgroundColor": null,
    "update:customizeAnnotation": null,
    "update:customizeLabel": null,
    "update:customizePoint": null,
    "update:dataPrepareSettings": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:legend": null,
    "update:loadingIndicator": null,
    "update:margin": null,
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
    "update:pathModified": null,
    "update:pointSelectionMode": null,
    "update:redrawOnResize": null,
    "update:resolveLabelOverlapping": null,
    "update:rtlEnabled": null,
    "update:series": null,
    "update:seriesSelectionMode": null,
    "update:seriesTemplate": null,
    "update:size": null,
    "update:theme": null,
    "update:title": null,
    "update:tooltip": null,
    "update:useSpiderWeb": null,
    "update:valueAxis": null,
  },
  computed: {
    instance(): PolarChart {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = PolarChart;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      adaptiveLayout: { isCollectionItem: false, optionName: "adaptiveLayout" },
      animation: { isCollectionItem: false, optionName: "animation" },
      annotation: { isCollectionItem: true, optionName: "annotations" },
      argumentAxis: { isCollectionItem: false, optionName: "argumentAxis" },
      commonAnnotationSettings: { isCollectionItem: false, optionName: "commonAnnotationSettings" },
      commonAxisSettings: { isCollectionItem: false, optionName: "commonAxisSettings" },
      commonSeriesSettings: { isCollectionItem: false, optionName: "commonSeriesSettings" },
      dataPrepareSettings: { isCollectionItem: false, optionName: "dataPrepareSettings" },
      export: { isCollectionItem: false, optionName: "export" },
      legend: { isCollectionItem: false, optionName: "legend" },
      loadingIndicator: { isCollectionItem: false, optionName: "loadingIndicator" },
      margin: { isCollectionItem: false, optionName: "margin" },
      polarChartTitle: { isCollectionItem: false, optionName: "title" },
      series: { isCollectionItem: true, optionName: "series" },
      seriesTemplate: { isCollectionItem: false, optionName: "seriesTemplate" },
      size: { isCollectionItem: false, optionName: "size" },
      title: { isCollectionItem: false, optionName: "title" },
      tooltip: { isCollectionItem: false, optionName: "tooltip" },
      valueAxis: { isCollectionItem: false, optionName: "valueAxis" }
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
    "update:angle": null,
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
    "update:name": null,
    "update:offsetX": null,
    "update:offsetY": null,
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:radius": null,
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
    angle: Number,
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
    name: String,
    offsetX: Number,
    offsetY: Number,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    radius: Number,
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
const DxArgumentAxis = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDecimals": null,
    "update:argumentType": null,
    "update:axisDivisionFactor": null,
    "update:categories": null,
    "update:color": null,
    "update:constantLines": null,
    "update:constantLineStyle": null,
    "update:discreteAxisDivisionMode": null,
    "update:endOnTick": null,
    "update:firstPointOnStartAngle": null,
    "update:grid": null,
    "update:hoverMode": null,
    "update:inverted": null,
    "update:label": null,
    "update:linearThreshold": null,
    "update:logarithmBase": null,
    "update:minorGrid": null,
    "update:minorTick": null,
    "update:minorTickCount": null,
    "update:minorTickInterval": null,
    "update:opacity": null,
    "update:originValue": null,
    "update:period": null,
    "update:startAngle": null,
    "update:strips": null,
    "update:stripStyle": null,
    "update:tick": null,
    "update:tickInterval": null,
    "update:type": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    allowDecimals: Boolean,
    argumentType: String,
    axisDivisionFactor: Number,
    categories: Array,
    color: String,
    constantLines: Array,
    constantLineStyle: Object,
    discreteAxisDivisionMode: String,
    endOnTick: Boolean,
    firstPointOnStartAngle: Boolean,
    grid: Object,
    hoverMode: String,
    inverted: Boolean,
    label: Object,
    linearThreshold: Number,
    logarithmBase: Number,
    minorGrid: Object,
    minorTick: Object,
    minorTickCount: Number,
    minorTickInterval: [Number, Object, String],
    opacity: Number,
    originValue: Number,
    period: Number,
    startAngle: Number,
    strips: Array,
    stripStyle: Object,
    tick: Object,
    tickInterval: [Number, Object, String],
    type: String,
    visible: Boolean,
    width: Number
  }
});
(DxArgumentAxis as any).$_optionName = "argumentAxis";
(DxArgumentAxis as any).$_expectedChildren = {
  argumentAxisMinorTick: { isCollectionItem: false, optionName: "minorTick" },
  argumentAxisTick: { isCollectionItem: false, optionName: "tick" },
  axisLabel: { isCollectionItem: false, optionName: "label" },
  constantLine: { isCollectionItem: true, optionName: "constantLines" },
  constantLineStyle: { isCollectionItem: false, optionName: "constantLineStyle" },
  grid: { isCollectionItem: false, optionName: "grid" },
  label: { isCollectionItem: false, optionName: "label" },
  minorGrid: { isCollectionItem: false, optionName: "minorGrid" },
  minorTick: { isCollectionItem: false, optionName: "minorTick" },
  minorTickInterval: { isCollectionItem: false, optionName: "minorTickInterval" },
  strip: { isCollectionItem: true, optionName: "strips" },
  stripStyle: { isCollectionItem: false, optionName: "stripStyle" },
  tick: { isCollectionItem: false, optionName: "tick" },
  tickInterval: { isCollectionItem: false, optionName: "tickInterval" }
};
const DxArgumentAxisMinorTick = createConfigurationComponent({
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
(DxArgumentAxisMinorTick as any).$_optionName = "minorTick";
const DxArgumentAxisTick = createConfigurationComponent({
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
(DxArgumentAxisTick as any).$_optionName = "tick";
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
const DxAxisLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeHint": null,
    "update:customizeText": null,
    "update:font": null,
    "update:format": null,
    "update:indentFromAxis": null,
    "update:overlappingBehavior": null,
    "update:visible": null,
  },
  props: {
    customizeHint: Function,
    customizeText: Function,
    font: Object,
    format: [Object, Function, String],
    indentFromAxis: Number,
    overlappingBehavior: String,
    visible: Boolean
  }
});
(DxAxisLabel as any).$_optionName = "label";
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
    "update:angle": null,
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
    "update:offsetX": null,
    "update:offsetY": null,
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:radius": null,
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
    angle: Number,
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
    offsetX: Number,
    offsetY: Number,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    radius: Number,
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
    "update:allowDecimals": null,
    "update:color": null,
    "update:constantLineStyle": null,
    "update:discreteAxisDivisionMode": null,
    "update:endOnTick": null,
    "update:grid": null,
    "update:inverted": null,
    "update:label": null,
    "update:minorGrid": null,
    "update:minorTick": null,
    "update:opacity": null,
    "update:stripStyle": null,
    "update:tick": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    allowDecimals: Boolean,
    color: String,
    constantLineStyle: Object,
    discreteAxisDivisionMode: String,
    endOnTick: Boolean,
    grid: Object,
    inverted: Boolean,
    label: Object,
    minorGrid: Object,
    minorTick: Object,
    opacity: Number,
    stripStyle: Object,
    tick: Object,
    visible: Boolean,
    width: Number
  }
});
(DxCommonAxisSettings as any).$_optionName = "commonAxisSettings";
(DxCommonAxisSettings as any).$_expectedChildren = {
  commonAxisSettingsLabel: { isCollectionItem: false, optionName: "label" },
  commonAxisSettingsMinorTick: { isCollectionItem: false, optionName: "minorTick" },
  commonAxisSettingsTick: { isCollectionItem: false, optionName: "tick" },
  label: { isCollectionItem: false, optionName: "label" },
  minorTick: { isCollectionItem: false, optionName: "minorTick" },
  tick: { isCollectionItem: false, optionName: "tick" }
};
const DxCommonAxisSettingsLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:indentFromAxis": null,
    "update:overlappingBehavior": null,
    "update:visible": null,
  },
  props: {
    font: Object,
    indentFromAxis: Number,
    overlappingBehavior: String,
    visible: Boolean
  }
});
(DxCommonAxisSettingsLabel as any).$_optionName = "label";
const DxCommonAxisSettingsMinorTick = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:length": null,
    "update:opacity": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    length: Number,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
});
(DxCommonAxisSettingsMinorTick as any).$_optionName = "minorTick";
const DxCommonAxisSettingsTick = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:length": null,
    "update:opacity": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    color: String,
    length: Number,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
});
(DxCommonAxisSettingsTick as any).$_optionName = "tick";
const DxCommonSeriesSettings = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:area": null,
    "update:argumentField": null,
    "update:bar": null,
    "update:barPadding": null,
    "update:barWidth": null,
    "update:border": null,
    "update:closed": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:hoverMode": null,
    "update:hoverStyle": null,
    "update:ignoreEmptyPoints": null,
    "update:label": null,
    "update:line": null,
    "update:maxLabelCount": null,
    "update:minBarSize": null,
    "update:opacity": null,
    "update:point": null,
    "update:scatter": null,
    "update:selectionMode": null,
    "update:selectionStyle": null,
    "update:showInLegend": null,
    "update:stack": null,
    "update:stackedbar": null,
    "update:tagField": null,
    "update:type": null,
    "update:valueErrorBar": null,
    "update:valueField": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    area: {},
    argumentField: String,
    bar: {},
    barPadding: Number,
    barWidth: Number,
    border: Object,
    closed: Boolean,
    color: [Object, String],
    dashStyle: String,
    hoverMode: String,
    hoverStyle: Object,
    ignoreEmptyPoints: Boolean,
    label: Object,
    line: {},
    maxLabelCount: Number,
    minBarSize: Number,
    opacity: Number,
    point: Object,
    scatter: {},
    selectionMode: String,
    selectionStyle: Object,
    showInLegend: Boolean,
    stack: String,
    stackedbar: {},
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
  border: { isCollectionItem: false, optionName: "border" },
  color: { isCollectionItem: false, optionName: "color" },
  commonSeriesSettingsHoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  commonSeriesSettingsLabel: { isCollectionItem: false, optionName: "label" },
  commonSeriesSettingsSelectionStyle: { isCollectionItem: false, optionName: "selectionStyle" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  label: { isCollectionItem: false, optionName: "label" },
  point: { isCollectionItem: false, optionName: "point" },
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
    "update:argumentFormat": null,
    "update:backgroundColor": null,
    "update:border": null,
    "update:connector": null,
    "update:customizeText": null,
    "update:displayFormat": null,
    "update:font": null,
    "update:format": null,
    "update:position": null,
    "update:rotationAngle": null,
    "update:showForZeroValues": null,
    "update:visible": null,
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
    rotationAngle: Number,
    showForZeroValues: Boolean,
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
    "update:value": null,
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String,
    displayBehindSeries: Boolean,
    extendAxis: Boolean,
    label: Object,
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
    "update:text": null,
    "update:visible": null,
  },
  props: {
    font: Object,
    text: String,
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
    "update:width": null,
  },
  props: {
    color: String,
    dashStyle: String,
    label: Object,
    width: Number
  }
});
(DxConstantLineStyle as any).$_optionName = "constantLineStyle";
(DxConstantLineStyle as any).$_expectedChildren = {
  constantLineStyleLabel: { isCollectionItem: false, optionName: "label" },
  label: { isCollectionItem: false, optionName: "label" }
};
const DxConstantLineStyleLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:visible": null,
  },
  props: {
    font: Object,
    visible: Boolean
  }
});
(DxConstantLineStyleLabel as any).$_optionName = "label";
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
    "update:customizeHint": null,
    "update:customizeText": null,
    "update:displayFormat": null,
    "update:font": null,
    "update:format": null,
    "update:indentFromAxis": null,
    "update:overlappingBehavior": null,
    "update:position": null,
    "update:rotationAngle": null,
    "update:showForZeroValues": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    argumentFormat: [Object, Function, String],
    backgroundColor: String,
    border: Object,
    connector: Object,
    customizeHint: Function,
    customizeText: Function,
    displayFormat: String,
    font: Object,
    format: [Object, Function, String],
    indentFromAxis: Number,
    overlappingBehavior: String,
    position: String,
    rotationAngle: Number,
    showForZeroValues: Boolean,
    text: String,
    visible: Boolean
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
const DxPolarChartTitle = createConfigurationComponent({
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
(DxPolarChartTitle as any).$_optionName = "title";
(DxPolarChartTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  margin: { isCollectionItem: false, optionName: "margin" },
  polarChartTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};
const DxPolarChartTitleSubtitle = createConfigurationComponent({
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
(DxPolarChartTitleSubtitle as any).$_optionName = "subtitle";
(DxPolarChartTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};
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
    "update:argumentField": null,
    "update:barPadding": null,
    "update:barWidth": null,
    "update:border": null,
    "update:closed": null,
    "update:color": null,
    "update:dashStyle": null,
    "update:hoverMode": null,
    "update:hoverStyle": null,
    "update:ignoreEmptyPoints": null,
    "update:label": null,
    "update:maxLabelCount": null,
    "update:minBarSize": null,
    "update:name": null,
    "update:opacity": null,
    "update:point": null,
    "update:selectionMode": null,
    "update:selectionStyle": null,
    "update:showInLegend": null,
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
    argumentField: String,
    barPadding: Number,
    barWidth: Number,
    border: Object,
    closed: Boolean,
    color: [Object, String],
    dashStyle: String,
    hoverMode: String,
    hoverStyle: Object,
    ignoreEmptyPoints: Boolean,
    label: Object,
    maxLabelCount: Number,
    minBarSize: Number,
    name: String,
    opacity: Number,
    point: Object,
    selectionMode: String,
    selectionStyle: Object,
    showInLegend: Boolean,
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
    "update:startValue": null,
  },
  props: {
    color: String,
    endValue: {},
    label: Object,
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
    "update:text": null,
  },
  props: {
    font: Object,
    text: String
  }
});
(DxStripLabel as any).$_optionName = "label";
const DxStripStyle = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:label": null,
  },
  props: {
    label: Object
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
  },
  props: {
    font: Object
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
    margin: [Object, Number],
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
const DxValueAxis = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDecimals": null,
    "update:axisDivisionFactor": null,
    "update:categories": null,
    "update:color": null,
    "update:constantLines": null,
    "update:constantLineStyle": null,
    "update:discreteAxisDivisionMode": null,
    "update:endOnTick": null,
    "update:grid": null,
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
    "update:opacity": null,
    "update:showZero": null,
    "update:strips": null,
    "update:stripStyle": null,
    "update:tick": null,
    "update:tickInterval": null,
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
    allowDecimals: Boolean,
    axisDivisionFactor: Number,
    categories: Array,
    color: String,
    constantLines: Array,
    constantLineStyle: Object,
    discreteAxisDivisionMode: String,
    endOnTick: Boolean,
    grid: Object,
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
    opacity: Number,
    showZero: Boolean,
    strips: Array,
    stripStyle: Object,
    tick: Object,
    tickInterval: [Number, Object, String],
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
(DxValueAxis as any).$_expectedChildren = {
  axisLabel: { isCollectionItem: false, optionName: "label" },
  commonAxisSettingsTick: { isCollectionItem: false, optionName: "tick" },
  constantLine: { isCollectionItem: true, optionName: "constantLines" },
  label: { isCollectionItem: false, optionName: "label" },
  minorTickInterval: { isCollectionItem: false, optionName: "minorTickInterval" },
  minVisualRangeLength: { isCollectionItem: false, optionName: "minVisualRangeLength" },
  strip: { isCollectionItem: true, optionName: "strips" },
  tick: { isCollectionItem: false, optionName: "tick" },
  tickInterval: { isCollectionItem: false, optionName: "tickInterval" },
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
(DxVisualRange as any).$_expectedChildren = {
  length: { isCollectionItem: false, optionName: "length" }
};
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

export default DxPolarChart;
export {
  DxPolarChart,
  DxAdaptiveLayout,
  DxAnimation,
  DxAnnotation,
  DxAnnotationBorder,
  DxArgumentAxis,
  DxArgumentAxisMinorTick,
  DxArgumentAxisTick,
  DxArgumentFormat,
  DxAxisLabel,
  DxBorder,
  DxColor,
  DxCommonAnnotationSettings,
  DxCommonAxisSettings,
  DxCommonAxisSettingsLabel,
  DxCommonAxisSettingsMinorTick,
  DxCommonAxisSettingsTick,
  DxCommonSeriesSettings,
  DxCommonSeriesSettingsHoverStyle,
  DxCommonSeriesSettingsLabel,
  DxCommonSeriesSettingsSelectionStyle,
  DxConnector,
  DxConstantLine,
  DxConstantLineLabel,
  DxConstantLineStyle,
  DxConstantLineStyleLabel,
  DxDataPrepareSettings,
  DxExport,
  DxFont,
  DxFormat,
  DxGrid,
  DxHatching,
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
  DxPoint,
  DxPointBorder,
  DxPointHoverStyle,
  DxPointSelectionStyle,
  DxPolarChartTitle,
  DxPolarChartTitleSubtitle,
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
  DxValueAxis,
  DxValueErrorBar,
  DxVisualRange,
  DxWholeRange
};
import type * as DxPolarChartTypes from "devextreme/viz/polar_chart_types";
export { DxPolarChartTypes };
