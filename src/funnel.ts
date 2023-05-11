import Funnel, { Properties } from "devextreme/viz/funnel";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "adaptiveLayout" |
  "algorithm" |
  "argumentField" |
  "colorField" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "export" |
  "hoverEnabled" |
  "inverted" |
  "item" |
  "label" |
  "legend" |
  "loadingIndicator" |
  "margin" |
  "neckHeight" |
  "neckWidth" |
  "onDisposing" |
  "onDrawn" |
  "onExported" |
  "onExporting" |
  "onFileSaving" |
  "onHoverChanged" |
  "onIncidentOccurred" |
  "onInitialized" |
  "onItemClick" |
  "onLegendClick" |
  "onOptionChanged" |
  "onSelectionChanged" |
  "palette" |
  "paletteExtensionMode" |
  "pathModified" |
  "redrawOnResize" |
  "resolveLabelOverlapping" |
  "rtlEnabled" |
  "selectionMode" |
  "size" |
  "sortData" |
  "theme" |
  "title" |
  "tooltip" |
  "valueField"
>;

interface DxFunnel extends AccessibleOptions {
  readonly instance?: Funnel;
}
const DxFunnel = createComponent({
  props: {
    adaptiveLayout: Object,
    algorithm: String,
    argumentField: String,
    colorField: String,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    export: Object,
    hoverEnabled: Boolean,
    inverted: Boolean,
    item: Object,
    label: Object,
    legend: Object,
    loadingIndicator: Object,
    margin: Object,
    neckHeight: Number,
    neckWidth: Number,
    onDisposing: Function,
    onDrawn: Function,
    onExported: Function,
    onExporting: Function,
    onFileSaving: Function,
    onHoverChanged: Function,
    onIncidentOccurred: Function,
    onInitialized: Function,
    onItemClick: Function,
    onLegendClick: Function,
    onOptionChanged: Function,
    onSelectionChanged: Function,
    palette: [Array, String],
    paletteExtensionMode: String,
    pathModified: Boolean,
    redrawOnResize: Boolean,
    resolveLabelOverlapping: String,
    rtlEnabled: Boolean,
    selectionMode: String,
    size: Object,
    sortData: Boolean,
    theme: String,
    title: [Object, String],
    tooltip: Object,
    valueField: String
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:adaptiveLayout": null,
    "update:algorithm": null,
    "update:argumentField": null,
    "update:colorField": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:hoverEnabled": null,
    "update:inverted": null,
    "update:item": null,
    "update:label": null,
    "update:legend": null,
    "update:loadingIndicator": null,
    "update:margin": null,
    "update:neckHeight": null,
    "update:neckWidth": null,
    "update:onDisposing": null,
    "update:onDrawn": null,
    "update:onExported": null,
    "update:onExporting": null,
    "update:onFileSaving": null,
    "update:onHoverChanged": null,
    "update:onIncidentOccurred": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onLegendClick": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:palette": null,
    "update:paletteExtensionMode": null,
    "update:pathModified": null,
    "update:redrawOnResize": null,
    "update:resolveLabelOverlapping": null,
    "update:rtlEnabled": null,
    "update:selectionMode": null,
    "update:size": null,
    "update:sortData": null,
    "update:theme": null,
    "update:title": null,
    "update:tooltip": null,
    "update:valueField": null,
  },
  computed: {
    instance(): Funnel {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Funnel;
    (this as any).$_expectedChildren = {
      adaptiveLayout: { isCollectionItem: false, optionName: "adaptiveLayout" },
      export: { isCollectionItem: false, optionName: "export" },
      funnelTitle: { isCollectionItem: false, optionName: "title" },
      item: { isCollectionItem: false, optionName: "item" },
      label: { isCollectionItem: false, optionName: "label" },
      legend: { isCollectionItem: false, optionName: "legend" },
      loadingIndicator: { isCollectionItem: false, optionName: "loadingIndicator" },
      margin: { isCollectionItem: false, optionName: "margin" },
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
const DxConnector = createConfigurationComponent({
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
const DxFunnelTitle = createConfigurationComponent({
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
(DxFunnelTitle as any).$_optionName = "title";
(DxFunnelTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  funnelTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};
const DxFunnelTitleSubtitle = createConfigurationComponent({
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
(DxFunnelTitleSubtitle as any).$_optionName = "subtitle";
(DxFunnelTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};
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
    "update:hatching": null,
  },
  props: {
    border: Object,
    hatching: Object
  }
});
(DxHoverStyle as any).$_optionName = "hoverStyle";
(DxHoverStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  itemBorder: { isCollectionItem: false, optionName: "border" }
};
const DxItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:hoverStyle": null,
    "update:selectionStyle": null,
  },
  props: {
    border: Object,
    hoverStyle: Object,
    selectionStyle: Object
  }
});
(DxItem as any).$_optionName = "item";
(DxItem as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  itemBorder: { isCollectionItem: false, optionName: "border" },
  selectionStyle: { isCollectionItem: false, optionName: "selectionStyle" }
};
const DxItemBorder = createConfigurationComponent({
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
(DxItemBorder as any).$_optionName = "border";
const DxLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:backgroundColor": null,
    "update:border": null,
    "update:connector": null,
    "update:customizeText": null,
    "update:font": null,
    "update:format": null,
    "update:horizontalAlignment": null,
    "update:horizontalOffset": null,
    "update:position": null,
    "update:showForZeroValues": null,
    "update:textOverflow": null,
    "update:visible": null,
    "update:wordWrap": null,
  },
  props: {
    backgroundColor: String,
    border: Object,
    connector: Object,
    customizeText: Function,
    font: Object,
    format: [Object, Function, String],
    horizontalAlignment: String,
    horizontalOffset: Number,
    position: String,
    showForZeroValues: Boolean,
    textOverflow: String,
    visible: Boolean,
    wordWrap: String
  }
});
(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  connector: { isCollectionItem: false, optionName: "connector" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
  labelBorder: { isCollectionItem: false, optionName: "border" }
};
const DxLabelBorder = createConfigurationComponent({
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
(DxLabelBorder as any).$_optionName = "border";
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
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  legendBorder: { isCollectionItem: false, optionName: "border" },
  legendTitle: { isCollectionItem: false, optionName: "title" },
  margin: { isCollectionItem: false, optionName: "margin" },
  title: { isCollectionItem: false, optionName: "title" }
};
const DxLegendBorder = createConfigurationComponent({
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
(DxLegendBorder as any).$_optionName = "border";
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
const DxSelectionStyle = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:hatching": null,
  },
  props: {
    border: Object,
    hatching: Object
  }
});
(DxSelectionStyle as any).$_optionName = "selectionStyle";
(DxSelectionStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  itemBorder: { isCollectionItem: false, optionName: "border" }
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

export default DxFunnel;
export {
  DxFunnel,
  DxAdaptiveLayout,
  DxBorder,
  DxConnector,
  DxExport,
  DxFont,
  DxFormat,
  DxFunnelTitle,
  DxFunnelTitleSubtitle,
  DxHatching,
  DxHoverStyle,
  DxItem,
  DxItemBorder,
  DxLabel,
  DxLabelBorder,
  DxLegend,
  DxLegendBorder,
  DxLegendTitle,
  DxLegendTitleSubtitle,
  DxLoadingIndicator,
  DxMargin,
  DxSelectionStyle,
  DxShadow,
  DxSize,
  DxSubtitle,
  DxTitle,
  DxTooltip,
  DxTooltipBorder
};
import type * as DxFunnelTypes from "devextreme/viz/funnel_types";
export { DxFunnelTypes };
