import TreeMap, { Properties } from "devextreme/viz/tree_map";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "childrenField" |
  "colorField" |
  "colorizer" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "export" |
  "group" |
  "hoverEnabled" |
  "idField" |
  "interactWithGroup" |
  "labelField" |
  "layoutAlgorithm" |
  "layoutDirection" |
  "loadingIndicator" |
  "maxDepth" |
  "onClick" |
  "onDisposing" |
  "onDrawn" |
  "onDrill" |
  "onExported" |
  "onExporting" |
  "onFileSaving" |
  "onHoverChanged" |
  "onIncidentOccurred" |
  "onInitialized" |
  "onNodesInitialized" |
  "onNodesRendering" |
  "onOptionChanged" |
  "onSelectionChanged" |
  "parentField" |
  "pathModified" |
  "redrawOnResize" |
  "rtlEnabled" |
  "selectionMode" |
  "size" |
  "theme" |
  "tile" |
  "title" |
  "tooltip" |
  "valueField"
>;

interface DxTreeMap extends AccessibleOptions {
  readonly instance?: TreeMap;
}
const DxTreeMap = createComponent({
  props: {
    childrenField: String,
    colorField: String,
    colorizer: Object,
    dataSource: {},
    disabled: Boolean,
    elementAttr: Object,
    export: Object,
    group: Object,
    hoverEnabled: Boolean,
    idField: String,
    interactWithGroup: Boolean,
    labelField: String,
    layoutAlgorithm: [Function, String],
    layoutDirection: String,
    loadingIndicator: Object,
    maxDepth: Number,
    onClick: Function,
    onDisposing: Function,
    onDrawn: Function,
    onDrill: Function,
    onExported: Function,
    onExporting: Function,
    onFileSaving: Function,
    onHoverChanged: Function,
    onIncidentOccurred: Function,
    onInitialized: Function,
    onNodesInitialized: Function,
    onNodesRendering: Function,
    onOptionChanged: Function,
    onSelectionChanged: Function,
    parentField: String,
    pathModified: Boolean,
    redrawOnResize: Boolean,
    rtlEnabled: Boolean,
    selectionMode: String,
    size: Object,
    theme: String,
    tile: Object,
    title: [Object, String],
    tooltip: Object,
    valueField: String
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:childrenField": null,
    "update:colorField": null,
    "update:colorizer": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:group": null,
    "update:hoverEnabled": null,
    "update:idField": null,
    "update:interactWithGroup": null,
    "update:labelField": null,
    "update:layoutAlgorithm": null,
    "update:layoutDirection": null,
    "update:loadingIndicator": null,
    "update:maxDepth": null,
    "update:onClick": null,
    "update:onDisposing": null,
    "update:onDrawn": null,
    "update:onDrill": null,
    "update:onExported": null,
    "update:onExporting": null,
    "update:onFileSaving": null,
    "update:onHoverChanged": null,
    "update:onIncidentOccurred": null,
    "update:onInitialized": null,
    "update:onNodesInitialized": null,
    "update:onNodesRendering": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:parentField": null,
    "update:pathModified": null,
    "update:redrawOnResize": null,
    "update:rtlEnabled": null,
    "update:selectionMode": null,
    "update:size": null,
    "update:theme": null,
    "update:tile": null,
    "update:title": null,
    "update:tooltip": null,
    "update:valueField": null,
  },
  computed: {
    instance(): TreeMap {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = TreeMap;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      colorizer: { isCollectionItem: false, optionName: "colorizer" },
      export: { isCollectionItem: false, optionName: "export" },
      group: { isCollectionItem: false, optionName: "group" },
      loadingIndicator: { isCollectionItem: false, optionName: "loadingIndicator" },
      size: { isCollectionItem: false, optionName: "size" },
      tile: { isCollectionItem: false, optionName: "tile" },
      title: { isCollectionItem: false, optionName: "title" },
      tooltip: { isCollectionItem: false, optionName: "tooltip" }
    };
  }
});

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
const DxColorizer = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colorCodeField": null,
    "update:colorizeGroups": null,
    "update:palette": null,
    "update:paletteExtensionMode": null,
    "update:range": null,
    "update:type": null,
  },
  props: {
    colorCodeField: String,
    colorizeGroups: Boolean,
    palette: [Array, String],
    paletteExtensionMode: String,
    range: Array,
    type: String
  }
});
(DxColorizer as any).$_optionName = "colorizer";
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
const DxGroup = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:headerHeight": null,
    "update:hoverEnabled": null,
    "update:hoverStyle": null,
    "update:label": null,
    "update:padding": null,
    "update:selectionStyle": null,
  },
  props: {
    border: Object,
    color: String,
    headerHeight: Number,
    hoverEnabled: Boolean,
    hoverStyle: Object,
    label: Object,
    padding: Number,
    selectionStyle: Object
  }
});
(DxGroup as any).$_optionName = "group";
(DxGroup as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  groupLabel: { isCollectionItem: false, optionName: "label" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  label: { isCollectionItem: false, optionName: "label" },
  selectionStyle: { isCollectionItem: false, optionName: "selectionStyle" },
  treeMapborder: { isCollectionItem: false, optionName: "border" }
};
const DxGroupLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:textOverflow": null,
    "update:visible": null,
  },
  props: {
    font: Object,
    textOverflow: String,
    visible: Boolean
  }
});
(DxGroupLabel as any).$_optionName = "label";
(DxGroupLabel as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};
const DxHoverStyle = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
  },
  props: {
    border: Object,
    color: String
  }
});
(DxHoverStyle as any).$_optionName = "hoverStyle";
const DxLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:textOverflow": null,
    "update:visible": null,
    "update:wordWrap": null,
  },
  props: {
    font: Object,
    textOverflow: String,
    visible: Boolean,
    wordWrap: String
  }
});
(DxLabel as any).$_optionName = "label";
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
    "update:color": null,
  },
  props: {
    border: Object,
    color: String
  }
});
(DxSelectionStyle as any).$_optionName = "selectionStyle";
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
const DxTile = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:color": null,
    "update:hoverStyle": null,
    "update:label": null,
    "update:selectionStyle": null,
  },
  props: {
    border: Object,
    color: String,
    hoverStyle: Object,
    label: Object,
    selectionStyle: Object
  }
});
(DxTile as any).$_optionName = "tile";
(DxTile as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  label: { isCollectionItem: false, optionName: "label" },
  selectionStyle: { isCollectionItem: false, optionName: "selectionStyle" },
  tileLabel: { isCollectionItem: false, optionName: "label" },
  treeMapborder: { isCollectionItem: false, optionName: "border" }
};
const DxTileLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:textOverflow": null,
    "update:visible": null,
    "update:wordWrap": null,
  },
  props: {
    font: Object,
    textOverflow: String,
    visible: Boolean,
    wordWrap: String
  }
});
(DxTileLabel as any).$_optionName = "label";
(DxTileLabel as any).$_expectedChildren = {
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
const DxTreeMapborder = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:width": null,
  },
  props: {
    color: String,
    width: Number
  }
});
(DxTreeMapborder as any).$_optionName = "border";

export default DxTreeMap;
export {
  DxTreeMap,
  DxBorder,
  DxColorizer,
  DxExport,
  DxFont,
  DxFormat,
  DxGroup,
  DxGroupLabel,
  DxHoverStyle,
  DxLabel,
  DxLoadingIndicator,
  DxMargin,
  DxSelectionStyle,
  DxShadow,
  DxSize,
  DxSubtitle,
  DxTile,
  DxTileLabel,
  DxTitle,
  DxTooltip,
  DxTooltipBorder,
  DxTreeMapborder
};
import type * as DxTreeMapTypes from "devextreme/viz/tree_map_types";
export { DxTreeMapTypes };
