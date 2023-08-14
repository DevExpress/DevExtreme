import RangeSelector, { Properties } from "devextreme/viz/range_selector";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "background" |
  "behavior" |
  "chart" |
  "containerBackgroundColor" |
  "dataSource" |
  "dataSourceField" |
  "disabled" |
  "elementAttr" |
  "export" |
  "indent" |
  "loadingIndicator" |
  "margin" |
  "onDisposing" |
  "onDrawn" |
  "onExported" |
  "onExporting" |
  "onFileSaving" |
  "onIncidentOccurred" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "pathModified" |
  "redrawOnResize" |
  "rtlEnabled" |
  "scale" |
  "selectedRangeColor" |
  "selectedRangeUpdateMode" |
  "shutter" |
  "size" |
  "sliderHandle" |
  "sliderMarker" |
  "theme" |
  "title" |
  "value"
>;

interface DxRangeSelector extends AccessibleOptions {
  readonly instance?: RangeSelector;
}
const DxRangeSelector = createComponent({
  props: {
    background: Object,
    behavior: Object,
    chart: Object,
    containerBackgroundColor: String,
    dataSource: {},
    dataSourceField: String,
    disabled: Boolean,
    elementAttr: Object,
    export: Object,
    indent: Object,
    loadingIndicator: Object,
    margin: Object,
    onDisposing: Function,
    onDrawn: Function,
    onExported: Function,
    onExporting: Function,
    onFileSaving: Function,
    onIncidentOccurred: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    pathModified: Boolean,
    redrawOnResize: Boolean,
    rtlEnabled: Boolean,
    scale: Object,
    selectedRangeColor: String,
    selectedRangeUpdateMode: String,
    shutter: Object,
    size: Object,
    sliderHandle: Object,
    sliderMarker: Object,
    theme: String,
    title: [Object, String],
    value: [Array, Object]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:background": null,
    "update:behavior": null,
    "update:chart": null,
    "update:containerBackgroundColor": null,
    "update:dataSource": null,
    "update:dataSourceField": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:indent": null,
    "update:loadingIndicator": null,
    "update:margin": null,
    "update:onDisposing": null,
    "update:onDrawn": null,
    "update:onExported": null,
    "update:onExporting": null,
    "update:onFileSaving": null,
    "update:onIncidentOccurred": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:pathModified": null,
    "update:redrawOnResize": null,
    "update:rtlEnabled": null,
    "update:scale": null,
    "update:selectedRangeColor": null,
    "update:selectedRangeUpdateMode": null,
    "update:shutter": null,
    "update:size": null,
    "update:sliderHandle": null,
    "update:sliderMarker": null,
    "update:theme": null,
    "update:title": null,
    "update:value": null,
  },
  computed: {
    instance(): RangeSelector {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = RangeSelector;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      background: { isCollectionItem: false, optionName: "background" },
      behavior: { isCollectionItem: false, optionName: "behavior" },
      chart: { isCollectionItem: false, optionName: "chart" },
      export: { isCollectionItem: false, optionName: "export" },
      indent: { isCollectionItem: false, optionName: "indent" },
      loadingIndicator: { isCollectionItem: false, optionName: "loadingIndicator" },
      margin: { isCollectionItem: false, optionName: "margin" },
      scale: { isCollectionItem: false, optionName: "scale" },
      shutter: { isCollectionItem: false, optionName: "shutter" },
      size: { isCollectionItem: false, optionName: "size" },
      sliderHandle: { isCollectionItem: false, optionName: "sliderHandle" },
      sliderMarker: { isCollectionItem: false, optionName: "sliderMarker" },
      title: { isCollectionItem: false, optionName: "title" },
      value: { isCollectionItem: false, optionName: "value" }
    };
  }
});

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
const DxBackground = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:image": null,
    "update:visible": null,
  },
  props: {
    color: String,
    image: Object,
    visible: Boolean
  }
});
(DxBackground as any).$_optionName = "background";
(DxBackground as any).$_expectedChildren = {
  backgroundImage: { isCollectionItem: false, optionName: "image" },
  image: { isCollectionItem: false, optionName: "image" }
};
const DxBackgroundImage = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:location": null,
    "update:url": null,
  },
  props: {
    location: String,
    url: String
  }
});
(DxBackgroundImage as any).$_optionName = "image";
const DxBehavior = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSlidersSwap": null,
    "update:animationEnabled": null,
    "update:callValueChanged": null,
    "update:manualRangeSelectionEnabled": null,
    "update:moveSelectedRangeByClick": null,
    "update:snapToTicks": null,
    "update:valueChangeMode": null,
  },
  props: {
    allowSlidersSwap: Boolean,
    animationEnabled: Boolean,
    callValueChanged: String,
    manualRangeSelectionEnabled: Boolean,
    moveSelectedRangeByClick: Boolean,
    snapToTicks: Boolean,
    valueChangeMode: String
  }
});
(DxBehavior as any).$_optionName = "behavior";
const DxBorder = createConfigurationComponent({
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
const DxChart = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:barGroupPadding": null,
    "update:barGroupWidth": null,
    "update:bottomIndent": null,
    "update:commonSeriesSettings": null,
    "update:dataPrepareSettings": null,
    "update:maxBubbleSize": null,
    "update:minBubbleSize": null,
    "update:negativesAsZeroes": null,
    "update:palette": null,
    "update:paletteExtensionMode": null,
    "update:series": null,
    "update:seriesTemplate": null,
    "update:topIndent": null,
    "update:valueAxis": null,
  },
  props: {
    barGroupPadding: Number,
    barGroupWidth: Number,
    bottomIndent: Number,
    commonSeriesSettings: Object,
    dataPrepareSettings: Object,
    maxBubbleSize: Number,
    minBubbleSize: Number,
    negativesAsZeroes: Boolean,
    palette: [Array, String],
    paletteExtensionMode: String,
    series: [Array, Object],
    seriesTemplate: Object,
    topIndent: Number,
    valueAxis: Object
  }
});
(DxChart as any).$_optionName = "chart";
(DxChart as any).$_expectedChildren = {
  commonSeriesSettings: { isCollectionItem: false, optionName: "commonSeriesSettings" },
  dataPrepareSettings: { isCollectionItem: false, optionName: "dataPrepareSettings" },
  series: { isCollectionItem: true, optionName: "series" },
  seriesTemplate: { isCollectionItem: false, optionName: "seriesTemplate" },
  valueAxis: { isCollectionItem: false, optionName: "valueAxis" }
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
    "update:location": null,
    "update:url": null,
    "update:width": null,
  },
  props: {
    height: [Number, Object],
    location: String,
    url: [String, Object],
    width: [Number, Object]
  }
});
(DxImage as any).$_optionName = "image";
const DxIndent = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:left": null,
    "update:right": null,
  },
  props: {
    left: Number,
    right: Number
  }
});
(DxIndent as any).$_optionName = "indent";
const DxLabel = createConfigurationComponent({
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
    "update:overlappingBehavior": null,
    "update:position": null,
    "update:rotationAngle": null,
    "update:showForZeroValues": null,
    "update:topIndent": null,
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
    overlappingBehavior: String,
    position: String,
    rotationAngle: Number,
    showForZeroValues: Boolean,
    topIndent: Number,
    verticalOffset: Number,
    visible: Boolean
  }
});
(DxLabel as any).$_optionName = "label";
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
const DxMarker = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:label": null,
    "update:separatorHeight": null,
    "update:textLeftIndent": null,
    "update:textTopIndent": null,
    "update:topIndent": null,
    "update:visible": null,
  },
  props: {
    label: Object,
    separatorHeight: Number,
    textLeftIndent: Number,
    textTopIndent: Number,
    topIndent: Number,
    visible: Boolean
  }
});
(DxMarker as any).$_optionName = "marker";
(DxMarker as any).$_expectedChildren = {
  label: { isCollectionItem: false, optionName: "label" },
  markerLabel: { isCollectionItem: false, optionName: "label" }
};
const DxMarkerLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:format": null,
  },
  props: {
    customizeText: Function,
    format: [Object, Function, String]
  }
});
(DxMarkerLabel as any).$_optionName = "label";
(DxMarkerLabel as any).$_expectedChildren = {
  format: { isCollectionItem: false, optionName: "format" }
};
const DxMaxRange = createConfigurationComponent({
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
(DxMaxRange as any).$_optionName = "maxRange";
const DxMinorTick = createConfigurationComponent({
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
const DxMinRange = createConfigurationComponent({
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
(DxMinRange as any).$_optionName = "minRange";
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
const DxScale = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aggregateByCategory": null,
    "update:aggregationGroupWidth": null,
    "update:aggregationInterval": null,
    "update:allowDecimals": null,
    "update:breaks": null,
    "update:breakStyle": null,
    "update:categories": null,
    "update:discreteAxisDivisionMode": null,
    "update:endOnTick": null,
    "update:endValue": null,
    "update:holidays": null,
    "update:label": null,
    "update:linearThreshold": null,
    "update:logarithmBase": null,
    "update:marker": null,
    "update:maxRange": null,
    "update:minorTick": null,
    "update:minorTickCount": null,
    "update:minorTickInterval": null,
    "update:minRange": null,
    "update:placeholderHeight": null,
    "update:showCustomBoundaryTicks": null,
    "update:singleWorkdays": null,
    "update:startValue": null,
    "update:tick": null,
    "update:tickInterval": null,
    "update:type": null,
    "update:valueType": null,
    "update:workdaysOnly": null,
    "update:workWeek": null,
  },
  props: {
    aggregateByCategory: Boolean,
    aggregationGroupWidth: Number,
    aggregationInterval: [Number, Object, String],
    allowDecimals: Boolean,
    breaks: Array,
    breakStyle: Object,
    categories: Array,
    discreteAxisDivisionMode: String,
    endOnTick: Boolean,
    endValue: {},
    holidays: Array,
    label: Object,
    linearThreshold: Number,
    logarithmBase: Number,
    marker: Object,
    maxRange: [Number, Object, String],
    minorTick: Object,
    minorTickCount: Number,
    minorTickInterval: [Number, Object, String],
    minRange: [Number, Object, String],
    placeholderHeight: Number,
    showCustomBoundaryTicks: Boolean,
    singleWorkdays: Array,
    startValue: {},
    tick: Object,
    tickInterval: [Number, Object, String],
    type: String,
    valueType: String,
    workdaysOnly: Boolean,
    workWeek: Array
  }
});
(DxScale as any).$_optionName = "scale";
(DxScale as any).$_expectedChildren = {
  aggregationInterval: { isCollectionItem: false, optionName: "aggregationInterval" },
  break: { isCollectionItem: true, optionName: "breaks" },
  breakStyle: { isCollectionItem: false, optionName: "breakStyle" },
  label: { isCollectionItem: false, optionName: "label" },
  marker: { isCollectionItem: false, optionName: "marker" },
  maxRange: { isCollectionItem: false, optionName: "maxRange" },
  minorTick: { isCollectionItem: false, optionName: "minorTick" },
  minorTickInterval: { isCollectionItem: false, optionName: "minorTickInterval" },
  minRange: { isCollectionItem: false, optionName: "minRange" },
  scaleLabel: { isCollectionItem: false, optionName: "label" },
  tick: { isCollectionItem: false, optionName: "tick" },
  tickInterval: { isCollectionItem: false, optionName: "tickInterval" }
};
const DxScaleLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:font": null,
    "update:format": null,
    "update:overlappingBehavior": null,
    "update:topIndent": null,
    "update:visible": null,
  },
  props: {
    customizeText: Function,
    font: Object,
    format: [Object, Function, String],
    overlappingBehavior: String,
    topIndent: Number,
    visible: Boolean
  }
});
(DxScaleLabel as any).$_optionName = "label";
(DxScaleLabel as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" }
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
const DxShutter = createConfigurationComponent({
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
(DxShutter as any).$_optionName = "shutter";
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
const DxSliderHandle = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:opacity": null,
    "update:width": null,
  },
  props: {
    color: String,
    opacity: Number,
    width: Number
  }
});
(DxSliderHandle as any).$_optionName = "sliderHandle";
const DxSliderMarker = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:customizeText": null,
    "update:font": null,
    "update:format": null,
    "update:invalidRangeColor": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:placeholderHeight": null,
    "update:visible": null,
  },
  props: {
    color: String,
    customizeText: Function,
    font: Object,
    format: [Object, Function, String],
    invalidRangeColor: String,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    placeholderHeight: Number,
    visible: Boolean
  }
});
(DxSliderMarker as any).$_optionName = "sliderMarker";
(DxSliderMarker as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" }
};
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
(DxSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};
const DxTick = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:opacity": null,
    "update:width": null,
  },
  props: {
    color: String,
    opacity: Number,
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
(DxTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};
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
const DxValue = createConfigurationComponent({
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
(DxValue as any).$_optionName = "value";
(DxValue as any).$_expectedChildren = {
  length: { isCollectionItem: false, optionName: "length" }
};
const DxValueAxis = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:inverted": null,
    "update:logarithmBase": null,
    "update:max": null,
    "update:min": null,
    "update:type": null,
    "update:valueType": null,
  },
  props: {
    inverted: Boolean,
    logarithmBase: Number,
    max: Number,
    min: Number,
    type: String,
    valueType: String
  }
});
(DxValueAxis as any).$_optionName = "valueAxis";
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

export default DxRangeSelector;
export {
  DxRangeSelector,
  DxAggregation,
  DxAggregationInterval,
  DxArgumentFormat,
  DxBackground,
  DxBackgroundImage,
  DxBehavior,
  DxBorder,
  DxBreak,
  DxBreakStyle,
  DxChart,
  DxColor,
  DxCommonSeriesSettings,
  DxCommonSeriesSettingsHoverStyle,
  DxCommonSeriesSettingsLabel,
  DxCommonSeriesSettingsSelectionStyle,
  DxConnector,
  DxDataPrepareSettings,
  DxExport,
  DxFont,
  DxFormat,
  DxHatching,
  DxHeight,
  DxHoverStyle,
  DxImage,
  DxIndent,
  DxLabel,
  DxLength,
  DxLoadingIndicator,
  DxMargin,
  DxMarker,
  DxMarkerLabel,
  DxMaxRange,
  DxMinorTick,
  DxMinorTickInterval,
  DxMinRange,
  DxPoint,
  DxPointBorder,
  DxPointHoverStyle,
  DxPointImage,
  DxPointSelectionStyle,
  DxReduction,
  DxScale,
  DxScaleLabel,
  DxSelectionStyle,
  DxSeries,
  DxSeriesBorder,
  DxSeriesTemplate,
  DxShutter,
  DxSize,
  DxSliderHandle,
  DxSliderMarker,
  DxSubtitle,
  DxTick,
  DxTickInterval,
  DxTitle,
  DxUrl,
  DxValue,
  DxValueAxis,
  DxValueErrorBar,
  DxWidth
};
import type * as DxRangeSelectorTypes from "devextreme/viz/range_selector_types";
export { DxRangeSelectorTypes };
