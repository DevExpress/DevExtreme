import Bullet, { Properties } from "devextreme/viz/bullet";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "color" |
  "disabled" |
  "elementAttr" |
  "endScaleValue" |
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
  "rtlEnabled" |
  "showTarget" |
  "showZeroLevel" |
  "size" |
  "startScaleValue" |
  "target" |
  "targetColor" |
  "targetWidth" |
  "theme" |
  "tooltip" |
  "value"
>;

interface DxBullet extends AccessibleOptions {
  readonly instance?: Bullet;
}
const DxBullet = createComponent({
  props: {
    color: String,
    disabled: Boolean,
    elementAttr: Object,
    endScaleValue: Number,
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
    rtlEnabled: Boolean,
    showTarget: Boolean,
    showZeroLevel: Boolean,
    size: Object,
    startScaleValue: Number,
    target: Number,
    targetColor: String,
    targetWidth: Number,
    theme: String,
    tooltip: Object,
    value: Number
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:color": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:endScaleValue": null,
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
    "update:rtlEnabled": null,
    "update:showTarget": null,
    "update:showZeroLevel": null,
    "update:size": null,
    "update:startScaleValue": null,
    "update:target": null,
    "update:targetColor": null,
    "update:targetWidth": null,
    "update:theme": null,
    "update:tooltip": null,
    "update:value": null,
  },
  computed: {
    instance(): Bullet {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Bullet;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      margin: { isCollectionItem: false, optionName: "margin" },
      size: { isCollectionItem: false, optionName: "size" },
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

export default DxBullet;
export {
  DxBullet,
  DxBorder,
  DxFont,
  DxFormat,
  DxMargin,
  DxShadow,
  DxSize,
  DxTooltip
};
import type * as DxBulletTypes from "devextreme/viz/bullet_types";
export { DxBulletTypes };
