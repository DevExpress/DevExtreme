import Sankey, { Properties } from "devextreme/viz/sankey";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "adaptiveLayout" |
  "alignment" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "export" |
  "hoverEnabled" |
  "label" |
  "link" |
  "loadingIndicator" |
  "margin" |
  "node" |
  "onDisposing" |
  "onDrawn" |
  "onExported" |
  "onExporting" |
  "onFileSaving" |
  "onIncidentOccurred" |
  "onInitialized" |
  "onLinkClick" |
  "onLinkHoverChanged" |
  "onNodeClick" |
  "onNodeHoverChanged" |
  "onOptionChanged" |
  "palette" |
  "paletteExtensionMode" |
  "pathModified" |
  "redrawOnResize" |
  "rtlEnabled" |
  "size" |
  "sortData" |
  "sourceField" |
  "targetField" |
  "theme" |
  "title" |
  "tooltip" |
  "weightField"
>;

interface DxSankey extends AccessibleOptions {
  readonly instance?: Sankey;
}
const DxSankey = createComponent({
  props: {
    adaptiveLayout: Object,
    alignment: [Array, String],
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    export: Object,
    hoverEnabled: Boolean,
    label: Object,
    link: Object,
    loadingIndicator: Object,
    margin: Object,
    node: Object,
    onDisposing: Function,
    onDrawn: Function,
    onExported: Function,
    onExporting: Function,
    onFileSaving: Function,
    onIncidentOccurred: Function,
    onInitialized: Function,
    onLinkClick: Function,
    onLinkHoverChanged: Function,
    onNodeClick: Function,
    onNodeHoverChanged: Function,
    onOptionChanged: Function,
    palette: [Array, String],
    paletteExtensionMode: String,
    pathModified: Boolean,
    redrawOnResize: Boolean,
    rtlEnabled: Boolean,
    size: Object,
    sortData: {},
    sourceField: String,
    targetField: String,
    theme: String,
    title: [Object, String],
    tooltip: Object,
    weightField: String
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:adaptiveLayout": null,
    "update:alignment": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:hoverEnabled": null,
    "update:label": null,
    "update:link": null,
    "update:loadingIndicator": null,
    "update:margin": null,
    "update:node": null,
    "update:onDisposing": null,
    "update:onDrawn": null,
    "update:onExported": null,
    "update:onExporting": null,
    "update:onFileSaving": null,
    "update:onIncidentOccurred": null,
    "update:onInitialized": null,
    "update:onLinkClick": null,
    "update:onLinkHoverChanged": null,
    "update:onNodeClick": null,
    "update:onNodeHoverChanged": null,
    "update:onOptionChanged": null,
    "update:palette": null,
    "update:paletteExtensionMode": null,
    "update:pathModified": null,
    "update:redrawOnResize": null,
    "update:rtlEnabled": null,
    "update:size": null,
    "update:sortData": null,
    "update:sourceField": null,
    "update:targetField": null,
    "update:theme": null,
    "update:title": null,
    "update:tooltip": null,
    "update:weightField": null,
  },
  computed: {
    instance(): Sankey {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Sankey;
    (this as any).$_expectedChildren = {
      adaptiveLayout: { isCollectionItem: false, optionName: "adaptiveLayout" },
      export: { isCollectionItem: false, optionName: "export" },
      label: { isCollectionItem: false, optionName: "label" },
      link: { isCollectionItem: false, optionName: "link" },
      loadingIndicator: { isCollectionItem: false, optionName: "loadingIndicator" },
      margin: { isCollectionItem: false, optionName: "margin" },
      node: { isCollectionItem: false, optionName: "node" },
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
    "update:opacity": null,
  },
  props: {
    border: Object,
    color: String,
    hatching: Object,
    opacity: Number
  }
});
(DxHoverStyle as any).$_optionName = "hoverStyle";
const DxLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:customizeText": null,
    "update:font": null,
    "update:horizontalOffset": null,
    "update:overlappingBehavior": null,
    "update:shadow": null,
    "update:useNodeColors": null,
    "update:verticalOffset": null,
    "update:visible": null,
  },
  props: {
    border: Object,
    customizeText: Function,
    font: Object,
    horizontalOffset: Number,
    overlappingBehavior: String,
    shadow: Object,
    useNodeColors: Boolean,
    verticalOffset: Number,
    visible: Boolean
  }
});
(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  sankeyborder: { isCollectionItem: false, optionName: "border" },
  shadow: { isCollectionItem: false, optionName: "shadow" }
};
const DxLink = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:colorMode": null,
    "update:hoverStyle": null,
    "update:opacity": null,
  },
  props: {
    border: Object,
    color: String,
    colorMode: String,
    hoverStyle: Object,
    opacity: Number
  }
});
(DxLink as any).$_optionName = "link";
(DxLink as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  sankeyborder: { isCollectionItem: false, optionName: "border" }
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
const DxNode = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:hoverStyle": null,
    "update:opacity": null,
    "update:padding": null,
    "update:width": null,
  },
  props: {
    border: Object,
    color: String,
    hoverStyle: Object,
    opacity: Number,
    padding: Number,
    width: Number
  }
});
(DxNode as any).$_optionName = "node";
(DxNode as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  sankeyborder: { isCollectionItem: false, optionName: "border" }
};
const DxSankeyborder = createConfigurationComponent({
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
(DxSankeyborder as any).$_optionName = "border";
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
    "update:cornerRadius": null,
    "update:customizeLinkTooltip": null,
    "update:customizeNodeTooltip": null,
    "update:enabled": null,
    "update:font": null,
    "update:format": null,
    "update:linkTooltipTemplate": null,
    "update:nodeTooltipTemplate": null,
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
    cornerRadius: Number,
    customizeLinkTooltip: Function,
    customizeNodeTooltip: Function,
    enabled: Boolean,
    font: Object,
    format: [Object, Function, String],
    linkTooltipTemplate: {},
    nodeTooltipTemplate: {},
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

export default DxSankey;
export {
  DxSankey,
  DxAdaptiveLayout,
  DxBorder,
  DxExport,
  DxFont,
  DxFormat,
  DxHatching,
  DxHoverStyle,
  DxLabel,
  DxLink,
  DxLoadingIndicator,
  DxMargin,
  DxNode,
  DxSankeyborder,
  DxShadow,
  DxSize,
  DxSubtitle,
  DxTitle,
  DxTooltip,
  DxTooltipBorder
};
import type * as DxSankeyTypes from "devextreme/viz/sankey_types";
export { DxSankeyTypes };
