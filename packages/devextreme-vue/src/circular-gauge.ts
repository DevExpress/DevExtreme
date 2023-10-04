import CircularGauge, { Properties } from "devextreme/viz/circular_gauge";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "animation" |
  "centerTemplate" |
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

interface DxCircularGauge extends AccessibleOptions {
  readonly instance?: CircularGauge;
}
const DxCircularGauge = createComponent({
  props: {
    animation: Object,
    centerTemplate: {},
    containerBackgroundColor: String,
    disabled: Boolean,
    elementAttr: Object,
    export: Object,
    geometry: Object,
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
    onTooltipHidden: Function,
    onTooltipShown: Function,
    pathModified: Boolean,
    rangeContainer: Object,
    redrawOnResize: Boolean,
    rtlEnabled: Boolean,
    scale: Object,
    size: Object,
    subvalueIndicator: Object,
    subvalues: Array,
    theme: String,
    title: [Object, String],
    tooltip: Object,
    value: Number,
    valueIndicator: Object
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:animation": null,
    "update:centerTemplate": null,
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
    instance(): CircularGauge {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = CircularGauge;
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
});

const DxAnimation = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:duration": null,
    "update:easing": null,
    "update:enabled": null,
  },
  props: {
    duration: Number,
    easing: String,
    enabled: Boolean
  }
});
(DxAnimation as any).$_optionName = "animation";
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
const DxGeometry = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:endAngle": null,
    "update:startAngle": null,
  },
  props: {
    endAngle: Number,
    startAngle: Number
  }
});
(DxGeometry as any).$_optionName = "geometry";
const DxLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:font": null,
    "update:format": null,
    "update:hideFirstOrLast": null,
    "update:indentFromTick": null,
    "update:overlappingBehavior": null,
    "update:useRangeColors": null,
    "update:visible": null,
  },
  props: {
    customizeText: Function,
    font: Object,
    format: [Object, Function, String],
    hideFirstOrLast: String,
    indentFromTick: Number,
    overlappingBehavior: String,
    useRangeColors: Boolean,
    visible: Boolean
  }
});
(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" }
};
const DxLoadingIndicator = createConfigurationComponent({
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
const DxMinorTick = createConfigurationComponent({
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
(DxMinorTick as any).$_optionName = "minorTick";
const DxRange = createConfigurationComponent({
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
});
(DxRange as any).$_optionName = "ranges";
(DxRange as any).$_isCollectionItem = true;
(DxRange as any).$_expectedChildren = {
  color: { isCollectionItem: false, optionName: "color" }
};
const DxRangeContainer = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:offset": null,
    "update:orientation": null,
    "update:palette": null,
    "update:paletteExtensionMode": null,
    "update:ranges": null,
    "update:width": null,
  },
  props: {
    backgroundColor: [Object, String],
    offset: Number,
    orientation: String,
    palette: [Array, String],
    paletteExtensionMode: String,
    ranges: Array,
    width: Number
  }
});
(DxRangeContainer as any).$_optionName = "rangeContainer";
(DxRangeContainer as any).$_expectedChildren = {
  backgroundColor: { isCollectionItem: false, optionName: "backgroundColor" },
  range: { isCollectionItem: true, optionName: "ranges" }
};
const DxScale = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDecimals": null,
    "update:customMinorTicks": null,
    "update:customTicks": null,
    "update:endValue": null,
    "update:label": null,
    "update:minorTick": null,
    "update:minorTickInterval": null,
    "update:orientation": null,
    "update:scaleDivisionFactor": null,
    "update:startValue": null,
    "update:tick": null,
    "update:tickInterval": null,
  },
  props: {
    allowDecimals: Boolean,
    customMinorTicks: Array,
    customTicks: Array,
    endValue: Number,
    label: Object,
    minorTick: Object,
    minorTickInterval: Number,
    orientation: String,
    scaleDivisionFactor: Number,
    startValue: Number,
    tick: Object,
    tickInterval: Number
  }
});
(DxScale as any).$_optionName = "scale";
(DxScale as any).$_expectedChildren = {
  label: { isCollectionItem: false, optionName: "label" },
  minorTick: { isCollectionItem: false, optionName: "minorTick" },
  tick: { isCollectionItem: false, optionName: "tick" }
};
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
const DxSubvalueIndicator = createConfigurationComponent({
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
    horizontalOrientation: String,
    indentFromCenter: Number,
    length: Number,
    offset: Number,
    palette: [Array, String],
    secondColor: String,
    secondFraction: Number,
    size: Number,
    spindleGapSize: Number,
    spindleSize: Number,
    text: Object,
    type: String,
    verticalOrientation: String,
    width: Number
  }
});
(DxSubvalueIndicator as any).$_optionName = "subvalueIndicator";
(DxSubvalueIndicator as any).$_expectedChildren = {
  color: { isCollectionItem: false, optionName: "color" },
  text: { isCollectionItem: false, optionName: "text" }
};
const DxText = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:font": null,
    "update:format": null,
    "update:indent": null,
  },
  props: {
    customizeText: Function,
    font: Object,
    format: [Object, Function, String],
    indent: Number
  }
});
(DxText as any).$_optionName = "text";
(DxText as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" }
};
const DxTick = createConfigurationComponent({
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
(DxTick as any).$_optionName = "tick";
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
const DxTooltip = createConfigurationComponent({
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
    customizeTooltip: Function,
    enabled: Boolean,
    font: Object,
    format: [Object, Function, String],
    interactive: Boolean,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    shadow: Object,
    zIndex: Number
  }
});
(DxTooltip as any).$_optionName = "tooltip";
(DxTooltip as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
  shadow: { isCollectionItem: false, optionName: "shadow" }
};
const DxValueIndicator = createConfigurationComponent({
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
    horizontalOrientation: String,
    indentFromCenter: Number,
    length: Number,
    offset: Number,
    palette: [Array, String],
    secondColor: String,
    secondFraction: Number,
    size: Number,
    spindleGapSize: Number,
    spindleSize: Number,
    text: Object,
    type: String,
    verticalOrientation: String,
    width: Number
  }
});
(DxValueIndicator as any).$_optionName = "valueIndicator";

export default DxCircularGauge;
export {
  DxCircularGauge,
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
  DxValueIndicator
};
import type * as DxCircularGaugeTypes from "devextreme/viz/circular_gauge_types";
export { DxCircularGaugeTypes };
