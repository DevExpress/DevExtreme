import { PropType } from "vue";
import RangeSelector, { Properties } from "devextreme/viz/range_selector";
import {
 DisposingEvent,
 DrawnEvent,
 ExportedEvent,
 ExportingEvent,
 FileSavingEvent,
 IncidentOccurredEvent,
 InitializedEvent,
 OptionChangedEvent,
 ValueChangedEvent,
} from "devextreme/viz/range_selector";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

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

const componentConfig = {
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
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onDrawn: Function as PropType<(e: DrawnEvent) => void>,
    onExported: Function as PropType<(e: ExportedEvent) => void>,
    onExporting: Function as PropType<(e: ExportingEvent) => void>,
    onFileSaving: Function as PropType<(e: FileSavingEvent) => void>,
    onIncidentOccurred: Function as PropType<(e: IncidentOccurredEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onValueChanged: Function as PropType<(e: ValueChangedEvent) => void>,
    pathModified: Boolean,
    redrawOnResize: Boolean,
    rtlEnabled: Boolean,
    scale: Object,
    selectedRangeColor: String,
    selectedRangeUpdateMode: String as PropType<"auto" | "keep" | "reset" | "shift">,
    shutter: Object,
    size: Object,
    sliderHandle: Object,
    sliderMarker: Object,
    theme: String as PropType<"generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light">,
    title: [Object, String],
    value: [Array, Object] as PropType<(Array<Date> | Array<number> | Array<string>) | Object>
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
};

prepareComponentConfig(componentConfig);

const DxRangeSelector = defineComponent(componentConfig);


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

const DxBackgroundConfig = {
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
};

prepareConfigurationComponentConfig(DxBackgroundConfig);

const DxBackground = defineComponent(DxBackgroundConfig);

(DxBackground as any).$_optionName = "background";
(DxBackground as any).$_expectedChildren = {
  backgroundImage: { isCollectionItem: false, optionName: "image" },
  image: { isCollectionItem: false, optionName: "image" }
};

const DxBackgroundImageConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:location": null,
    "update:url": null,
  },
  props: {
    location: String as PropType<"center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop">,
    url: String
  }
};

prepareConfigurationComponentConfig(DxBackgroundImageConfig);

const DxBackgroundImage = defineComponent(DxBackgroundImageConfig);

(DxBackgroundImage as any).$_optionName = "image";

const DxBehaviorConfig = {
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
    callValueChanged: String as PropType<"onMoving" | "onMovingComplete">,
    manualRangeSelectionEnabled: Boolean,
    moveSelectedRangeByClick: Boolean,
    snapToTicks: Boolean,
    valueChangeMode: String as PropType<"onHandleMove" | "onHandleRelease">
  }
};

prepareConfigurationComponentConfig(DxBehaviorConfig);

const DxBehavior = defineComponent(DxBehaviorConfig);

(DxBehavior as any).$_optionName = "behavior";

const DxBorderConfig = {
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

const DxChartConfig = {
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
    palette: [Array, String] as PropType<Array<string> | ("Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office")>,
    paletteExtensionMode: String as PropType<"alternate" | "blend" | "extrapolate">,
    series: [Array, Object] as PropType<Array<Object> | Object>,
    seriesTemplate: Object,
    topIndent: Number,
    valueAxis: Object
  }
};

prepareConfigurationComponentConfig(DxChartConfig);

const DxChart = defineComponent(DxChartConfig);

(DxChart as any).$_optionName = "chart";
(DxChart as any).$_expectedChildren = {
  commonSeriesSettings: { isCollectionItem: false, optionName: "commonSeriesSettings" },
  dataPrepareSettings: { isCollectionItem: false, optionName: "dataPrepareSettings" },
  series: { isCollectionItem: true, optionName: "series" },
  seriesTemplate: { isCollectionItem: false, optionName: "seriesTemplate" },
  valueAxis: { isCollectionItem: false, optionName: "valueAxis" }
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
    "update:location": null,
    "update:url": null,
    "update:width": null,
  },
  props: {
    height: [Number, Object],
    location: String as PropType<"center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop">,
    url: [String, Object],
    width: [Number, Object]
  }
};

prepareConfigurationComponentConfig(DxImageConfig);

const DxImage = defineComponent(DxImageConfig);

(DxImage as any).$_optionName = "image";

const DxIndentConfig = {
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
};

prepareConfigurationComponentConfig(DxIndentConfig);

const DxIndent = defineComponent(DxIndentConfig);

(DxIndent as any).$_optionName = "indent";

const DxLabelConfig = {
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
    overlappingBehavior: String as PropType<"hide" | "none">,
    position: String as PropType<"inside" | "outside">,
    rotationAngle: Number,
    showForZeroValues: Boolean,
    topIndent: Number,
    verticalOffset: Number,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";

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

const DxMarkerConfig = {
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
};

prepareConfigurationComponentConfig(DxMarkerConfig);

const DxMarker = defineComponent(DxMarkerConfig);

(DxMarker as any).$_optionName = "marker";
(DxMarker as any).$_expectedChildren = {
  label: { isCollectionItem: false, optionName: "label" },
  markerLabel: { isCollectionItem: false, optionName: "label" }
};

const DxMarkerLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:format": null,
  },
  props: {
    customizeText: Function as PropType<(markerValue: Object) => string>,
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>
  }
};

prepareConfigurationComponentConfig(DxMarkerLabelConfig);

const DxMarkerLabel = defineComponent(DxMarkerLabelConfig);

(DxMarkerLabel as any).$_optionName = "label";
(DxMarkerLabel as any).$_expectedChildren = {
  format: { isCollectionItem: false, optionName: "format" }
};

const DxMaxRangeConfig = {
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

prepareConfigurationComponentConfig(DxMaxRangeConfig);

const DxMaxRange = defineComponent(DxMaxRangeConfig);

(DxMaxRange as any).$_optionName = "maxRange";

const DxMinorTickConfig = {
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

const DxMinRangeConfig = {
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

prepareConfigurationComponentConfig(DxMinRangeConfig);

const DxMinRange = defineComponent(DxMinRangeConfig);

(DxMinRange as any).$_optionName = "minRange";

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

const DxScaleConfig = {
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
    aggregationInterval: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    allowDecimals: Boolean,
    breaks: Array as PropType<Array<Object>>,
    breakStyle: Object,
    categories: Array as PropType<Array<Date> | Array<number> | Array<string>>,
    discreteAxisDivisionMode: String as PropType<"betweenLabels" | "crossLabels">,
    endOnTick: Boolean,
    endValue: [Date, Number, String],
    holidays: Array as PropType<(Array<Date> | Array<string>) | Array<number>>,
    label: Object,
    linearThreshold: Number,
    logarithmBase: Number,
    marker: Object,
    maxRange: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    minorTick: Object,
    minorTickCount: Number,
    minorTickInterval: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    minRange: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    placeholderHeight: Number,
    showCustomBoundaryTicks: Boolean,
    singleWorkdays: Array as PropType<(Array<Date> | Array<string>) | Array<number>>,
    startValue: [Date, Number, String],
    tick: Object,
    tickInterval: [Number, Object, String] as PropType<number | Object | ("day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year")>,
    type: String as PropType<"continuous" | "discrete" | "logarithmic" | "semidiscrete">,
    valueType: String as PropType<"datetime" | "numeric" | "string">,
    workdaysOnly: Boolean,
    workWeek: Array as PropType<Array<number>>
  }
};

prepareConfigurationComponentConfig(DxScaleConfig);

const DxScale = defineComponent(DxScaleConfig);

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

const DxScaleLabelConfig = {
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
    customizeText: Function as PropType<(scaleValue: Object) => string>,
    font: Object,
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    overlappingBehavior: String as PropType<"hide" | "none">,
    topIndent: Number,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxScaleLabelConfig);

const DxScaleLabel = defineComponent(DxScaleLabelConfig);

(DxScaleLabel as any).$_optionName = "label";
(DxScaleLabel as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" }
};

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

const DxShutterConfig = {
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

prepareConfigurationComponentConfig(DxShutterConfig);

const DxShutter = defineComponent(DxShutterConfig);

(DxShutter as any).$_optionName = "shutter";

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

const DxSliderHandleConfig = {
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
};

prepareConfigurationComponentConfig(DxSliderHandleConfig);

const DxSliderHandle = defineComponent(DxSliderHandleConfig);

(DxSliderHandle as any).$_optionName = "sliderHandle";

const DxSliderMarkerConfig = {
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
    customizeText: Function as PropType<(scaleValue: Object) => string>,
    font: Object,
    format: [Object, Function, String] as PropType<Object | ((value: number | Date) => string) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    invalidRangeColor: String,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    placeholderHeight: Number,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxSliderMarkerConfig);

const DxSliderMarker = defineComponent(DxSliderMarkerConfig);

(DxSliderMarker as any).$_optionName = "sliderMarker";
(DxSliderMarker as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" }
};

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
(DxSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

const DxTickConfig = {
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

prepareConfigurationComponentConfig(DxTitleConfig);

const DxTitle = defineComponent(DxTitleConfig);

(DxTitle as any).$_optionName = "title";
(DxTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};

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

const DxValueConfig = {
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

prepareConfigurationComponentConfig(DxValueConfig);

const DxValue = defineComponent(DxValueConfig);

(DxValue as any).$_optionName = "value";
(DxValue as any).$_expectedChildren = {
  length: { isCollectionItem: false, optionName: "length" }
};

const DxValueAxisConfig = {
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
    type: String as PropType<"continuous" | "logarithmic">,
    valueType: String as PropType<"datetime" | "numeric" | "string">
  }
};

prepareConfigurationComponentConfig(DxValueAxisConfig);

const DxValueAxis = defineComponent(DxValueAxisConfig);

(DxValueAxis as any).$_optionName = "valueAxis";

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
