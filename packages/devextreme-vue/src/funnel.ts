import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Funnel, { Properties } from "devextreme/viz/funnel";
import  DataSource from "devextreme/data/data_source";
import {
 FunnelAlgorithm,
 DisposingEvent,
 DrawnEvent,
 ExportedEvent,
 ExportingEvent,
 FileSavingEvent,
 HoverChangedEvent,
 IncidentOccurredEvent,
 InitializedEvent,
 ItemClickEvent,
 LegendClickEvent,
 OptionChangedEvent,
 SelectionChangedEvent,
 dxFunnelItem,
 FunnelLegendItem,
} from "devextreme/viz/funnel";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 Palette,
 PaletteExtensionMode,
 ShiftLabelOverlap,
 Theme,
 DashStyle,
 Font,
 TextOverflow,
 WordWrap,
 HatchDirection,
 LabelPosition,
} from "devextreme/common/charts";
import {
 SingleMultipleOrNone,
 ExportFormat,
 Format,
 HorizontalAlignment,
 VerticalEdge,
 HorizontalEdge,
 Position,
 Orientation,
} from "devextreme/common";
import {
 Format as LocalizationFormat,
} from "devextreme/common/core/localization";
import { prepareConfigurationComponentConfig } from "./core/index";

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

const componentConfig = {
  props: {
    adaptiveLayout: Object as PropType<Record<string, any>>,
    algorithm: String as PropType<FunnelAlgorithm>,
    argumentField: String,
    colorField: String,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    export: Object as PropType<Record<string, any>>,
    hoverEnabled: Boolean,
    inverted: Boolean,
    item: Object as PropType<Record<string, any>>,
    label: Object as PropType<Record<string, any>>,
    legend: Object as PropType<Record<string, any>>,
    loadingIndicator: Object as PropType<Record<string, any>>,
    margin: Object as PropType<Record<string, any>>,
    neckHeight: Number,
    neckWidth: Number,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onDrawn: Function as PropType<((e: DrawnEvent) => void)>,
    onExported: Function as PropType<((e: ExportedEvent) => void)>,
    onExporting: Function as PropType<((e: ExportingEvent) => void)>,
    onFileSaving: Function as PropType<((e: FileSavingEvent) => void)>,
    onHoverChanged: Function as PropType<((e: HoverChangedEvent) => void)>,
    onIncidentOccurred: Function as PropType<((e: IncidentOccurredEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onLegendClick: Function as PropType<((e: LegendClickEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    palette: [Array, String] as PropType<Array<string> | Palette>,
    paletteExtensionMode: String as PropType<PaletteExtensionMode>,
    pathModified: Boolean,
    redrawOnResize: Boolean,
    resolveLabelOverlapping: String as PropType<ShiftLabelOverlap>,
    rtlEnabled: Boolean,
    selectionMode: String as PropType<SingleMultipleOrNone>,
    size: Object as PropType<Record<string, any>>,
    sortData: Boolean,
    theme: String as PropType<Theme>,
    title: [Object, String] as PropType<Record<string, any> | string>,
    tooltip: Object as PropType<Record<string, any>>,
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
    (this as any).$_hasAsyncTemplate = true;
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
};

prepareComponentConfig(componentConfig);

const DxFunnel = defineComponent(componentConfig);


const DxAdaptiveLayoutConfig = {
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
};

prepareConfigurationComponentConfig(DxAdaptiveLayoutConfig);

const DxAdaptiveLayout = defineComponent(DxAdaptiveLayoutConfig);

(DxAdaptiveLayout as any).$_optionName = "adaptiveLayout";

const DxBorderConfig = {
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
    dashStyle: String as PropType<DashStyle>,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxBorderConfig);

const DxBorder = defineComponent(DxBorderConfig);

(DxBorder as any).$_optionName = "border";

const DxConnectorConfig = {
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

prepareConfigurationComponentConfig(DxConnectorConfig);

const DxConnector = defineComponent(DxConnectorConfig);

(DxConnector as any).$_optionName = "connector";

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
    formats: Array as PropType<Array<ExportFormat>>,
    margin: Number,
    printingEnabled: Boolean,
    svgToCanvas: Function as PropType<((svg: any, canvas: any) => any)>
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
    formatter: Function as PropType<((value: number | Date) => string)>,
    parser: Function as PropType<((value: string) => number | Date)>,
    precision: Number,
    type: String as PropType<Format | string>,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxFormatConfig);

const DxFormat = defineComponent(DxFormatConfig);

(DxFormat as any).$_optionName = "format";

const DxFunnelTitleConfig = {
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
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    margin: [Number, Object] as PropType<number | Record<string, any>>,
    placeholderSize: Number,
    subtitle: [Object, String] as PropType<Record<string, any> | string>,
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    verticalAlignment: String as PropType<VerticalEdge>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxFunnelTitleConfig);

const DxFunnelTitle = defineComponent(DxFunnelTitleConfig);

(DxFunnelTitle as any).$_optionName = "title";
(DxFunnelTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  funnelTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};

const DxFunnelTitleSubtitleConfig = {
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
    font: Object as PropType<Font | Record<string, any>>,
    offset: Number,
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxFunnelTitleSubtitleConfig);

const DxFunnelTitleSubtitle = defineComponent(DxFunnelTitleSubtitleConfig);

(DxFunnelTitleSubtitle as any).$_optionName = "subtitle";
(DxFunnelTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

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
    direction: String as PropType<HatchDirection>,
    opacity: Number,
    step: Number,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxHatchingConfig);

const DxHatching = defineComponent(DxHatchingConfig);

(DxHatching as any).$_optionName = "hatching";

const DxHoverStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:hatching": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    hatching: Object as PropType<Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxHoverStyleConfig);

const DxHoverStyle = defineComponent(DxHoverStyleConfig);

(DxHoverStyle as any).$_optionName = "hoverStyle";
(DxHoverStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  itemBorder: { isCollectionItem: false, optionName: "border" }
};

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:hoverStyle": null,
    "update:selectionStyle": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    hoverStyle: Object as PropType<Record<string, any>>,
    selectionStyle: Object as PropType<Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "item";
(DxItem as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  hoverStyle: { isCollectionItem: false, optionName: "hoverStyle" },
  itemBorder: { isCollectionItem: false, optionName: "border" },
  selectionStyle: { isCollectionItem: false, optionName: "selectionStyle" }
};

const DxItemBorderConfig = {
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

prepareConfigurationComponentConfig(DxItemBorderConfig);

const DxItemBorder = defineComponent(DxItemBorderConfig);

(DxItemBorder as any).$_optionName = "border";

const DxLabelConfig = {
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
    border: Object as PropType<Record<string, any>>,
    connector: Object as PropType<Record<string, any>>,
    customizeText: Function as PropType<((itemInfo: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }) => string)>,
    font: Object as PropType<Font | Record<string, any>>,
    format: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    horizontalAlignment: String as PropType<HorizontalEdge>,
    horizontalOffset: Number,
    position: String as PropType<LabelPosition>,
    showForZeroValues: Boolean,
    textOverflow: String as PropType<TextOverflow>,
    visible: Boolean,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";
(DxLabel as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  connector: { isCollectionItem: false, optionName: "connector" },
  font: { isCollectionItem: false, optionName: "font" },
  format: { isCollectionItem: false, optionName: "format" },
  labelBorder: { isCollectionItem: false, optionName: "border" }
};

const DxLabelBorderConfig = {
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
    dashStyle: String as PropType<DashStyle>,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxLabelBorderConfig);

const DxLabelBorder = defineComponent(DxLabelBorderConfig);

(DxLabelBorder as any).$_optionName = "border";

const DxLegendConfig = {
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
    border: Object as PropType<Record<string, any>>,
    columnCount: Number,
    columnItemSpacing: Number,
    customizeHint: Function as PropType<((itemInfo: { item: dxFunnelItem, text: string }) => string)>,
    customizeItems: Function as PropType<((items: Array<FunnelLegendItem>) => Array<FunnelLegendItem>)>,
    customizeText: Function as PropType<((itemInfo: { item: dxFunnelItem, text: string }) => string)>,
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    itemsAlignment: String as PropType<HorizontalAlignment>,
    itemTextPosition: String as PropType<Position>,
    margin: [Number, Object] as PropType<number | Record<string, any>>,
    markerSize: Number,
    markerTemplate: {},
    orientation: String as PropType<Orientation>,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    rowCount: Number,
    rowItemSpacing: Number,
    title: [Object, String] as PropType<Record<string, any> | string>,
    verticalAlignment: String as PropType<VerticalEdge>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxLegendConfig);

const DxLegend = defineComponent(DxLegendConfig);

(DxLegend as any).$_optionName = "legend";
(DxLegend as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  font: { isCollectionItem: false, optionName: "font" },
  legendBorder: { isCollectionItem: false, optionName: "border" },
  legendTitle: { isCollectionItem: false, optionName: "title" },
  margin: { isCollectionItem: false, optionName: "margin" },
  title: { isCollectionItem: false, optionName: "title" }
};

const DxLegendBorderConfig = {
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
    dashStyle: String as PropType<DashStyle>,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxLegendBorderConfig);

const DxLegendBorder = defineComponent(DxLegendBorderConfig);

(DxLegendBorder as any).$_optionName = "border";

const DxLegendTitleConfig = {
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
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    margin: Object as PropType<Record<string, any>>,
    placeholderSize: Number,
    subtitle: [Object, String] as PropType<Record<string, any> | string>,
    text: String,
    verticalAlignment: String as PropType<VerticalEdge>
  }
};

prepareConfigurationComponentConfig(DxLegendTitleConfig);

const DxLegendTitle = defineComponent(DxLegendTitleConfig);

(DxLegendTitle as any).$_optionName = "title";
(DxLegendTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  legendTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  margin: { isCollectionItem: false, optionName: "margin" },
  subtitle: { isCollectionItem: false, optionName: "subtitle" }
};

const DxLegendTitleSubtitleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:font": null,
    "update:offset": null,
    "update:text": null,
  },
  props: {
    font: Object as PropType<Font | Record<string, any>>,
    offset: Number,
    text: String
  }
};

prepareConfigurationComponentConfig(DxLegendTitleSubtitleConfig);

const DxLegendTitleSubtitle = defineComponent(DxLegendTitleSubtitleConfig);

(DxLegendTitleSubtitle as any).$_optionName = "subtitle";
(DxLegendTitleSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

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
    font: Object as PropType<Font | Record<string, any>>,
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

const DxSelectionStyleConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:border": null,
    "update:hatching": null,
  },
  props: {
    border: Object as PropType<Record<string, any>>,
    hatching: Object as PropType<Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxSelectionStyleConfig);

const DxSelectionStyle = defineComponent(DxSelectionStyleConfig);

(DxSelectionStyle as any).$_optionName = "selectionStyle";
(DxSelectionStyle as any).$_expectedChildren = {
  border: { isCollectionItem: false, optionName: "border" },
  hatching: { isCollectionItem: false, optionName: "hatching" },
  itemBorder: { isCollectionItem: false, optionName: "border" }
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
    font: Object as PropType<Font | Record<string, any>>,
    offset: Number,
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxSubtitleConfig);

const DxSubtitle = defineComponent(DxSubtitleConfig);

(DxSubtitle as any).$_optionName = "subtitle";
(DxSubtitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" }
};

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
    font: Object as PropType<Font | Record<string, any>>,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    margin: [Object, Number] as PropType<Record<string, any> | number>,
    placeholderSize: Number,
    subtitle: [Object, String] as PropType<Record<string, any> | string>,
    text: String,
    textOverflow: String as PropType<TextOverflow>,
    verticalAlignment: String as PropType<VerticalEdge>,
    wordWrap: String as PropType<WordWrap>
  }
};

prepareConfigurationComponentConfig(DxTitleConfig);

const DxTitle = defineComponent(DxTitleConfig);

(DxTitle as any).$_optionName = "title";
(DxTitle as any).$_expectedChildren = {
  font: { isCollectionItem: false, optionName: "font" },
  funnelTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  legendTitleSubtitle: { isCollectionItem: false, optionName: "subtitle" },
  margin: { isCollectionItem: false, optionName: "margin" }
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
    "update:opacity": null,
    "update:paddingLeftRight": null,
    "update:paddingTopBottom": null,
    "update:shadow": null,
    "update:zIndex": null,
  },
  props: {
    arrowLength: Number,
    border: Object as PropType<Record<string, any>>,
    color: String,
    container: {},
    contentTemplate: {},
    cornerRadius: Number,
    customizeTooltip: Function as PropType<((info: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }) => Record<string, any>)>,
    enabled: Boolean,
    font: Object as PropType<Font | Record<string, any>>,
    format: [Object, String, Function] as PropType<LocalizationFormat | Format | (((value: number | Date) => string)) | Record<string, any> | string>,
    opacity: Number,
    paddingLeftRight: Number,
    paddingTopBottom: Number,
    shadow: Object as PropType<Record<string, any>>,
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
  shadow: { isCollectionItem: false, optionName: "shadow" },
  tooltipBorder: { isCollectionItem: false, optionName: "border" }
};

const DxTooltipBorderConfig = {
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
    dashStyle: String as PropType<DashStyle>,
    opacity: Number,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxTooltipBorderConfig);

const DxTooltipBorder = defineComponent(DxTooltipBorderConfig);

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
