import { PropType } from "vue";
import LinearGauge, { Properties } from "devextreme/viz/linear_gauge";
import {  DisposingEvent , DrawnEvent , ExportedEvent , ExportingEvent , FileSavingEvent , IncidentOccurredEvent , InitializedEvent , OptionChangedEvent , TooltipHiddenEvent , TooltipShownEvent ,} from "devextreme/viz/linear_gauge";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "animation" |
  "containerBackgroundColor" |
  "disabled" |
  "elementAttr" |
  "export" |
  "geometry" |
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
  "onTooltipHidden" |
  "onTooltipShown" |
  "pathModified" |
  "rangeContainer" |
  "redrawOnResize" |
  "rtlEnabled" |
  "scale" |
  "size" |
  "subvalueIndicator" |
  "subvalues" |
  "theme" |
  "title" |
  "tooltip" |
  "value" |
  "valueIndicator"
>;

interface DxLinearGauge extends AccessibleOptions {
  readonly instance?: LinearGauge;
}

const componentConfig = {
  props: {
    animation: Object,
    containerBackgroundColor: String,
    disabled: Boolean,
    elementAttr: Object,
    export: Object,
    geometry: Object,
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
    onTooltipHidden: Function as PropType<(e: TooltipHiddenEvent) => void>,
    onTooltipShown: Function as PropType<(e: TooltipShownEvent) => void>,
    pathModified: Boolean,
    rangeContainer: Object,
    redrawOnResize: Boolean,
    rtlEnabled: Boolean,
    scale: Object,
    size: Object,
    subvalueIndicator: Object,
    subvalues: Array as PropType<Number[]>,
    theme: String as PropType<"generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light">,
    title: [Object, String],
    tooltip: Object,
    value: Number,
    valueIndicator: Object
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:animation": null,
    "update:containerBackgroundColor": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:geometry": null,
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
    "update:onTooltipHidden": null,
    "update:onTooltipShown": null,
    "update:pathModified": null,
    "update:rangeContainer": null,
    "update:redrawOnResize": null,
    "update:rtlEnabled": null,
    "update:scale": null,
    "update:size": null,
    "update:subvalueIndicator": null,
    "update:subvalues": null,
    "update:theme": null,
    "update:title": null,
    "update:tooltip": null,
    "update:value": null,
    "update:valueIndicator": null,
  },
  computed: {
    instance(): LinearGauge {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = LinearGauge;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      animation: { isCollectionItem: false, optionName: "animation" },
      export: { isCollectionItem: false, optionName: "export" },
      geometry: { isCollectionItem: false, optionName: "geometry" },
      loadingIndicator: { isCollectionItem: false, optionName: "loadingIndicator" },
      margin: { isCollectionItem: false, optionName: "margin" },
      rangeContainer: { isCollectionItem: false, optionName: "rangeContainer" },
      scale: { isCollectionItem: false, optionName: "scale" },
      size: { isCollectionItem: false, optionName: "size" },
      subvalueIndicator: { isCollectionItem: false, optionName: "subvalueIndicator" },
      title: { isCollectionItem: false, optionName: "title" },
      tooltip: { isCollectionItem: false, optionName: "tooltip" },
      valueIndicator: { isCollectionItem: false, optionName: "valueIndicator" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxLinearGauge = defineComponent(componentConfig);


const DxAnimationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:duration": null,
    "update:easing": null,
    "update:enabled": null,
  },
  props: {
    duration: Number,
    easing: String as PropType<"easeOutCubic" | "linear">,
    enabled: Boolean
  }
};

prepareConfigurationComponentConfig(DxAnimationConfig);

const DxAnimation = defineComponent(DxAnimationConfig);

(DxAnimation as any).$_optionName = "animation";

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
    formats: Array as PropType<String[]>,
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
    formatter: Function as PropType<(value: Number | Date) => string>,
    parser: Function as PropType<(value: string) => (Number | Date)>,
    precision: Number,
    type: String as PropType<"billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime">,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxFormatConfig);

const DxFormat = defineComponent(DxFormatConfig);

(DxFormat as any).$_optionName = "format";

const DxGeometryConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:orientation": null,
  },
  props: {
    orientation: String as PropType<"horizontal" | "vertical">
  }
};

prepareConfigurationComponentConfig(DxGeometryConfig);

const DxGeometry = defineComponent(DxGeometryConfig);

(DxGeometry as any).$_optionName = "geometry";

const DxLabelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:font": null,
    "update:format": null,
    "update:indentFromTick": null,
    "update:overlappingBehavior": null,
    "update:useRangeColors": null,
    "update:visible": null,
  },
  props: {
    customizeText: Function as PropType<(scaleValue: Object) => string>,
    font: Object,
    format: [Object, Function, String] as PropType<(Object) | ((value: Number | Date) => string) | (Object) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    indentFromTick: Number,
    overlappingBehavior: String as PropType<"hide" | "none">,
    useRangeColors: Boolean,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" }
};

const DxLoadingIndicatorConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:font": null,
    "update:show": null,
    "update:text": null,
  },
  props: {
    backgroundColor: String,
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

const DxMinorTickConfig = {
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
};

prepareConfigurationComponentConfig(DxMinorTickConfig);

const DxMinorTick = defineComponent(DxMinorTickConfig);

(DxMinorTick as any).$_optionName = "minorTick";

const DxRangeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:endValue": null,
    "update:startValue": null,
  },
  props: {
    color: [Object, String],
    endValue: Number,
    startValue: Number
  }
};

prepareConfigurationComponentConfig(DxRangeConfig);

const DxRange = defineComponent(DxRangeConfig);

(DxRange as any).$_optionName = "ranges";
(DxRange as any).$_isCollectionItem = true;
(DxRange as any).$_expectedChildren = {
  color: { isCollectionItem: false, optionName: "color" }
};

const DxRangeContainerConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:horizontalOrientation": null,
    "update:offset": null,
    "update:palette": null,
    "update:paletteExtensionMode": null,
    "update:ranges": null,
    "update:verticalOrientation": null,
    "update:width": null,
  },
  props: {
    backgroundColor: [Object, String],
    horizontalOrientation: String as PropType<"center" | "left" | "right">,
    offset: Number,
    palette: [Array, String] as PropType<(String[]) | ("Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office")>,
    paletteExtensionMode: String as PropType<"alternate" | "blend" | "extrapolate">,
    ranges: Array as PropType<Object[]>,
    verticalOrientation: String as PropType<"bottom" | "center" | "top">,
    width: [Number, Object]
  }
};

prepareConfigurationComponentConfig(DxRangeContainerConfig);

const DxRangeContainer = defineComponent(DxRangeContainerConfig);

(DxRangeContainer as any).$_optionName = "rangeContainer";
(DxRangeContainer as any).$_expectedChildren = {
  backgroundColor: { isCollectionItem: false, optionName: "backgroundColor" },
  range: { isCollectionItem: true, optionName: "ranges" },
  width: { isCollectionItem: false, optionName: "width" }
};

const DxScaleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDecimals": null,
    "update:customMinorTicks": null,
    "update:customTicks": null,
    "update:endValue": null,
    "update:horizontalOrientation": null,
    "update:label": null,
    "update:minorTick": null,
    "update:minorTickInterval": null,
    "update:scaleDivisionFactor": null,
    "update:startValue": null,
    "update:tick": null,
    "update:tickInterval": null,
    "update:verticalOrientation": null,
  },
  props: {
    allowDecimals: Boolean,
    customMinorTicks: Array as PropType<Number[]>,
    customTicks: Array as PropType<Number[]>,
    endValue: Number,
    horizontalOrientation: String as PropType<"center" | "left" | "right">,
    label: Object,
    minorTick: Object,
    minorTickInterval: Number,
    scaleDivisionFactor: Number,
    startValue: Number,
    tick: Object,
    tickInterval: Number,
    verticalOrientation: String as PropType<"bottom" | "center" | "top">
  }
};

prepareConfigurationComponentConfig(DxScaleConfig);

const DxScale = defineComponent(DxScaleConfig);

(DxScale as any).$_optionName = "scale";
(DxScale as any).$_expectedChildren = {
  label: { isCollectionItem: false, optionName: "label" },
  minorTick: { isCollectionItem: false, optionName: "minorTick" },
  tick: { isCollectionItem: false, optionName: "tick" }
};

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

const DxSubvalueIndicatorConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:arrowLength": null,
    "update:backgroundColor": null,
    "update:baseValue": null,
    "update:beginAdaptingAtRadius": null,
    "update:color": null,
    "update:horizontalOrientation": null,
    "update:indentFromCenter": null,
    "update:length": null,
    "update:offset": null,
    "update:palette": null,
    "update:secondColor": null,
    "update:secondFraction": null,
    "update:size": null,
    "update:spindleGapSize": null,
    "update:spindleSize": null,
    "update:text": null,
    "update:type": null,
    "update:verticalOrientation": null,
    "update:width": null,
  },
  props: {
    arrowLength: Number,
    backgroundColor: String,
    baseValue: Number,
    beginAdaptingAtRadius: Number,
    color: [Object, String],
    horizontalOrientation: String as PropType<"left" | "right">,
    indentFromCenter: Number,
    length: Number,
    offset: Number,
    palette: [Array, String] as PropType<(String[]) | ("Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office")>,
    secondColor: String,
    secondFraction: Number,
    size: Number,
    spindleGapSize: Number,
    spindleSize: Number,
    text: Object,
    type: String as PropType<"circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle">,
    verticalOrientation: String as PropType<"bottom" | "top">,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxSubvalueIndicatorConfig);

const DxSubvalueIndicator = defineComponent(DxSubvalueIndicatorConfig);

(DxSubvalueIndicator as any).$_optionName = "subvalueIndicator";
(DxSubvalueIndicator as any).$_expectedChildren = {
  color: { isCollectionItem: false, optionName: "color" },
  text: { isCollectionItem: false, optionName: "text" }
};

const DxTextConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:font": null,
    "update:format": null,
    "update:indent": null,
  },
  props: {
    customizeText: Function as PropType<(indicatedValue: Object) => string>,
    font: Object,
    format: [Object, Function, String] as PropType<(Object) | ((value: Number | Date) => string) | (Object) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    indent: Number
  }
};

prepareConfigurationComponentConfig(DxTextConfig);

const DxText = defineComponent(DxTextConfig);

(DxText as any).$_optionName = "text";
(DxText as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" }
};

const DxTickConfig = {
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
};

prepareConfigurationComponentConfig(DxTickConfig);

const DxTick = defineComponent(DxTickConfig);

(DxTick as any).$_optionName = "tick";

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
    "update:format": null,
    "update:interactive": null,
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:shadow": null,
    "update:zIndex": null,
  },
  props: {
    arrowLength: Number,
    border: Object,
    color: String,
    container: {},
    contentTemplate: {},
    cornerRadius: Number,
    customizeTooltip: Function as PropType<(scaleValue: Object) => Object>,
    enabled: Boolean,
    font: Object,
    format: [Object, Function, String] as PropType<(Object) | ((value: Number | Date) => string) | (Object) | ("billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime")>,
    interactive: Boolean,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    shadow: Object,
    zIndex: Number
  }
};

prepareConfigurationComponentConfig(DxTooltipConfig);

const DxTooltip = defineComponent(DxTooltipConfig);

(DxTooltip as any).$_optionName = "tooltip";
(DxTooltip as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
  shadow: { isCollectionItem: false, optionName: "shadow" }
};

const DxValueIndicatorConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:arrowLength": null,
    "update:backgroundColor": null,
    "update:baseValue": null,
    "update:beginAdaptingAtRadius": null,
    "update:color": null,
    "update:horizontalOrientation": null,
    "update:indentFromCenter": null,
    "update:length": null,
    "update:offset": null,
    "update:palette": null,
    "update:secondColor": null,
    "update:secondFraction": null,
    "update:size": null,
    "update:spindleGapSize": null,
    "update:spindleSize": null,
    "update:text": null,
    "update:type": null,
    "update:verticalOrientation": null,
    "update:width": null,
  },
  props: {
    arrowLength: Number,
    backgroundColor: String,
    baseValue: Number,
    beginAdaptingAtRadius: Number,
    color: [Object, String],
    horizontalOrientation: String as PropType<"left" | "right">,
    indentFromCenter: Number,
    length: Number,
    offset: Number,
    palette: [Array, String] as PropType<(String[]) | ("Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office")>,
    secondColor: String,
    secondFraction: Number,
    size: Number,
    spindleGapSize: Number,
    spindleSize: Number,
    text: Object,
    type: String as PropType<"circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle">,
    verticalOrientation: String as PropType<"bottom" | "top">,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxValueIndicatorConfig);

const DxValueIndicator = defineComponent(DxValueIndicatorConfig);

(DxValueIndicator as any).$_optionName = "valueIndicator";

const DxWidthConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:end": null,
    "update:start": null,
  },
  props: {
    end: Number,
    start: Number
  }
};

prepareConfigurationComponentConfig(DxWidthConfig);

const DxWidth = defineComponent(DxWidthConfig);

(DxWidth as any).$_optionName = "width";

export default DxLinearGauge;
export {
  DxLinearGauge,
  DxAnimation,
  DxBackgroundColor,
  DxBorder,
  DxColor,
  DxExport,
  DxFont,
  DxFormat,
  DxGeometry,
  DxLabel,
  DxLoadingIndicator,
  DxMargin,
  DxMinorTick,
  DxRange,
  DxRangeContainer,
  DxScale,
  DxShadow,
  DxSize,
  DxSubtitle,
  DxSubvalueIndicator,
  DxText,
  DxTick,
  DxTitle,
  DxTooltip,
  DxValueIndicator,
  DxWidth
};
import type * as DxLinearGaugeTypes from "devextreme/viz/linear_gauge_types";
export { DxLinearGaugeTypes };
