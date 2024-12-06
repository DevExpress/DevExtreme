import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Diagram, { Properties } from "devextreme/ui/diagram";
import  DataSource from "devextreme/data/data_source";
import {
 AutoZoomMode,
 ContentReadyEvent,
 CustomCommandEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemDblClickEvent,
 OptionChangedEvent,
 RequestEditOperationEvent,
 RequestLayoutUpdateEvent,
 SelectionChangedEvent,
 Units,
 DataLayoutType,
 Command,
 CustomCommand,
 ShapeCategory,
 ToolboxDisplayMode,
 ShapeType,
 ConnectorLineEnd,
 ConnectorLineType,
 PanelVisibility,
} from "devextreme/ui/diagram";
import {
 PageOrientation,
 Orientation,
 ToolbarItemLocation,
} from "devextreme/common";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "autoZoomMode" |
  "contextMenu" |
  "contextToolbox" |
  "customShapes" |
  "customShapeTemplate" |
  "customShapeToolboxTemplate" |
  "defaultItemProperties" |
  "disabled" |
  "edges" |
  "editing" |
  "elementAttr" |
  "export" |
  "fullScreen" |
  "gridSize" |
  "hasChanges" |
  "height" |
  "historyToolbar" |
  "mainToolbar" |
  "nodes" |
  "onContentReady" |
  "onCustomCommand" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemDblClick" |
  "onOptionChanged" |
  "onRequestEditOperation" |
  "onRequestLayoutUpdate" |
  "onSelectionChanged" |
  "pageColor" |
  "pageOrientation" |
  "pageSize" |
  "propertiesPanel" |
  "readOnly" |
  "rtlEnabled" |
  "showGrid" |
  "simpleView" |
  "snapToGrid" |
  "toolbox" |
  "units" |
  "useNativeScrolling" |
  "viewToolbar" |
  "viewUnits" |
  "visible" |
  "width" |
  "zoomLevel"
>;

interface DxDiagram extends AccessibleOptions {
  readonly instance?: Diagram;
}

const componentConfig = {
  props: {
    autoZoomMode: String as PropType<AutoZoomMode>,
    contextMenu: Object as PropType<Record<string, any>>,
    contextToolbox: Object as PropType<Record<string, any>>,
    customShapes: Array as PropType<Array<Record<string, any>>>,
    customShapeTemplate: {},
    customShapeToolboxTemplate: {},
    defaultItemProperties: Object as PropType<Record<string, any>>,
    disabled: Boolean,
    edges: Object as PropType<Record<string, any>>,
    editing: Object as PropType<Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    export: Object as PropType<Record<string, any>>,
    fullScreen: Boolean,
    gridSize: [Number, Object] as PropType<number | Record<string, any>>,
    hasChanges: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    historyToolbar: Object as PropType<Record<string, any>>,
    mainToolbar: Object as PropType<Record<string, any>>,
    nodes: Object as PropType<Record<string, any>>,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onCustomCommand: Function as PropType<((e: CustomCommandEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemDblClick: Function as PropType<((e: ItemDblClickEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onRequestEditOperation: Function as PropType<((e: RequestEditOperationEvent) => void)>,
    onRequestLayoutUpdate: Function as PropType<((e: RequestLayoutUpdateEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    pageColor: String,
    pageOrientation: String as PropType<PageOrientation>,
    pageSize: Object as PropType<Record<string, any>>,
    propertiesPanel: Object as PropType<Record<string, any>>,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showGrid: Boolean,
    simpleView: Boolean,
    snapToGrid: Boolean,
    toolbox: Object as PropType<Record<string, any>>,
    units: String as PropType<Units>,
    useNativeScrolling: Boolean,
    viewToolbar: Object as PropType<Record<string, any>>,
    viewUnits: String as PropType<Units>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    zoomLevel: [Number, Object] as PropType<number | Record<string, any>>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:autoZoomMode": null,
    "update:contextMenu": null,
    "update:contextToolbox": null,
    "update:customShapes": null,
    "update:customShapeTemplate": null,
    "update:customShapeToolboxTemplate": null,
    "update:defaultItemProperties": null,
    "update:disabled": null,
    "update:edges": null,
    "update:editing": null,
    "update:elementAttr": null,
    "update:export": null,
    "update:fullScreen": null,
    "update:gridSize": null,
    "update:hasChanges": null,
    "update:height": null,
    "update:historyToolbar": null,
    "update:mainToolbar": null,
    "update:nodes": null,
    "update:onContentReady": null,
    "update:onCustomCommand": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemDblClick": null,
    "update:onOptionChanged": null,
    "update:onRequestEditOperation": null,
    "update:onRequestLayoutUpdate": null,
    "update:onSelectionChanged": null,
    "update:pageColor": null,
    "update:pageOrientation": null,
    "update:pageSize": null,
    "update:propertiesPanel": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showGrid": null,
    "update:simpleView": null,
    "update:snapToGrid": null,
    "update:toolbox": null,
    "update:units": null,
    "update:useNativeScrolling": null,
    "update:viewToolbar": null,
    "update:viewUnits": null,
    "update:visible": null,
    "update:width": null,
    "update:zoomLevel": null,
  },
  computed: {
    instance(): Diagram {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Diagram;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      contextMenu: { isCollectionItem: false, optionName: "contextMenu" },
      contextToolbox: { isCollectionItem: false, optionName: "contextToolbox" },
      customShape: { isCollectionItem: true, optionName: "customShapes" },
      defaultItemProperties: { isCollectionItem: false, optionName: "defaultItemProperties" },
      edges: { isCollectionItem: false, optionName: "edges" },
      editing: { isCollectionItem: false, optionName: "editing" },
      export: { isCollectionItem: false, optionName: "export" },
      gridSize: { isCollectionItem: false, optionName: "gridSize" },
      historyToolbar: { isCollectionItem: false, optionName: "historyToolbar" },
      mainToolbar: { isCollectionItem: false, optionName: "mainToolbar" },
      nodes: { isCollectionItem: false, optionName: "nodes" },
      pageSize: { isCollectionItem: false, optionName: "pageSize" },
      propertiesPanel: { isCollectionItem: false, optionName: "propertiesPanel" },
      toolbox: { isCollectionItem: false, optionName: "toolbox" },
      viewToolbar: { isCollectionItem: false, optionName: "viewToolbar" },
      zoomLevel: { isCollectionItem: false, optionName: "zoomLevel" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxDiagram = defineComponent(componentConfig);


const DxAutoLayoutConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:orientation": null,
    "update:type": null,
  },
  props: {
    orientation: String as PropType<Orientation>,
    type: String as PropType<DataLayoutType>
  }
};

prepareConfigurationComponentConfig(DxAutoLayoutConfig);

const DxAutoLayout = defineComponent(DxAutoLayoutConfig);

(DxAutoLayout as any).$_optionName = "autoLayout";

const DxCommandConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:icon": null,
    "update:items": null,
    "update:location": null,
    "update:name": null,
    "update:text": null,
  },
  props: {
    icon: String,
    items: Array as PropType<Array<Command | CustomCommand>>,
    location: String as PropType<ToolbarItemLocation>,
    name: String as PropType<Command | string>,
    text: String
  }
};

prepareConfigurationComponentConfig(DxCommandConfig);

const DxCommand = defineComponent(DxCommandConfig);

(DxCommand as any).$_optionName = "commands";
(DxCommand as any).$_isCollectionItem = true;

const DxCommandItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:icon": null,
    "update:items": null,
    "update:location": null,
    "update:name": null,
    "update:text": null,
  },
  props: {
    icon: String,
    items: Array as PropType<Array<Command | CustomCommand>>,
    location: String as PropType<ToolbarItemLocation>,
    name: String as PropType<Command | string>,
    text: String
  }
};

prepareConfigurationComponentConfig(DxCommandItemConfig);

const DxCommandItem = defineComponent(DxCommandItemConfig);

(DxCommandItem as any).$_optionName = "items";
(DxCommandItem as any).$_isCollectionItem = true;

const DxConnectionPointConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
};

prepareConfigurationComponentConfig(DxConnectionPointConfig);

const DxConnectionPoint = defineComponent(DxConnectionPointConfig);

(DxConnectionPoint as any).$_optionName = "connectionPoints";
(DxConnectionPoint as any).$_isCollectionItem = true;

const DxContextMenuConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:enabled": null,
  },
  props: {
    commands: Array as PropType<Array<Command | CustomCommand>>,
    enabled: Boolean
  }
};

prepareConfigurationComponentConfig(DxContextMenuConfig);

const DxContextMenu = defineComponent(DxContextMenuConfig);

(DxContextMenu as any).$_optionName = "contextMenu";
(DxContextMenu as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};

const DxContextToolboxConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:category": null,
    "update:displayMode": null,
    "update:enabled": null,
    "update:shapeIconsPerRow": null,
    "update:shapes": null,
    "update:width": null,
  },
  props: {
    category: String as PropType<ShapeCategory | string>,
    displayMode: String as PropType<ToolboxDisplayMode>,
    enabled: Boolean,
    shapeIconsPerRow: Number,
    shapes: Array as PropType<Array<ShapeType>>,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxContextToolboxConfig);

const DxContextToolbox = defineComponent(DxContextToolboxConfig);

(DxContextToolbox as any).$_optionName = "contextToolbox";

const DxCustomShapeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowEditImage": null,
    "update:allowEditText": null,
    "update:allowResize": null,
    "update:backgroundImageHeight": null,
    "update:backgroundImageLeft": null,
    "update:backgroundImageToolboxUrl": null,
    "update:backgroundImageTop": null,
    "update:backgroundImageUrl": null,
    "update:backgroundImageWidth": null,
    "update:baseType": null,
    "update:category": null,
    "update:connectionPoints": null,
    "update:defaultHeight": null,
    "update:defaultImageUrl": null,
    "update:defaultText": null,
    "update:defaultWidth": null,
    "update:imageHeight": null,
    "update:imageLeft": null,
    "update:imageTop": null,
    "update:imageWidth": null,
    "update:keepRatioOnAutoSize": null,
    "update:maxHeight": null,
    "update:maxWidth": null,
    "update:minHeight": null,
    "update:minWidth": null,
    "update:template": null,
    "update:templateHeight": null,
    "update:templateLeft": null,
    "update:templateTop": null,
    "update:templateWidth": null,
    "update:textHeight": null,
    "update:textLeft": null,
    "update:textTop": null,
    "update:textWidth": null,
    "update:title": null,
    "update:toolboxTemplate": null,
    "update:toolboxWidthToHeightRatio": null,
    "update:type": null,
  },
  props: {
    allowEditImage: Boolean,
    allowEditText: Boolean,
    allowResize: Boolean,
    backgroundImageHeight: Number,
    backgroundImageLeft: Number,
    backgroundImageToolboxUrl: String,
    backgroundImageTop: Number,
    backgroundImageUrl: String,
    backgroundImageWidth: Number,
    baseType: String as PropType<ShapeType | string>,
    category: String,
    connectionPoints: Array as PropType<Array<Record<string, any>>>,
    defaultHeight: Number,
    defaultImageUrl: String,
    defaultText: String,
    defaultWidth: Number,
    imageHeight: Number,
    imageLeft: Number,
    imageTop: Number,
    imageWidth: Number,
    keepRatioOnAutoSize: Boolean,
    maxHeight: Number,
    maxWidth: Number,
    minHeight: Number,
    minWidth: Number,
    template: {},
    templateHeight: Number,
    templateLeft: Number,
    templateTop: Number,
    templateWidth: Number,
    textHeight: Number,
    textLeft: Number,
    textTop: Number,
    textWidth: Number,
    title: String,
    toolboxTemplate: {},
    toolboxWidthToHeightRatio: Number,
    type: String
  }
};

prepareConfigurationComponentConfig(DxCustomShapeConfig);

const DxCustomShape = defineComponent(DxCustomShapeConfig);

(DxCustomShape as any).$_optionName = "customShapes";
(DxCustomShape as any).$_isCollectionItem = true;
(DxCustomShape as any).$_expectedChildren = {
  connectionPoint: { isCollectionItem: true, optionName: "connectionPoints" }
};

const DxDefaultItemPropertiesConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:connectorLineEnd": null,
    "update:connectorLineStart": null,
    "update:connectorLineType": null,
    "update:shapeMaxHeight": null,
    "update:shapeMaxWidth": null,
    "update:shapeMinHeight": null,
    "update:shapeMinWidth": null,
    "update:style": null,
    "update:textStyle": null,
  },
  props: {
    connectorLineEnd: String as PropType<ConnectorLineEnd>,
    connectorLineStart: String as PropType<ConnectorLineEnd>,
    connectorLineType: String as PropType<ConnectorLineType>,
    shapeMaxHeight: Number,
    shapeMaxWidth: Number,
    shapeMinHeight: Number,
    shapeMinWidth: Number,
    style: Object as PropType<Record<string, any>>,
    textStyle: Object as PropType<Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxDefaultItemPropertiesConfig);

const DxDefaultItemProperties = defineComponent(DxDefaultItemPropertiesConfig);

(DxDefaultItemProperties as any).$_optionName = "defaultItemProperties";

const DxEdgesConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customDataExpr": null,
    "update:dataSource": null,
    "update:fromExpr": null,
    "update:fromLineEndExpr": null,
    "update:fromPointIndexExpr": null,
    "update:keyExpr": null,
    "update:lineTypeExpr": null,
    "update:lockedExpr": null,
    "update:pointsExpr": null,
    "update:styleExpr": null,
    "update:textExpr": null,
    "update:textStyleExpr": null,
    "update:toExpr": null,
    "update:toLineEndExpr": null,
    "update:toPointIndexExpr": null,
    "update:zIndexExpr": null,
  },
  props: {
    customDataExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    fromExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    fromLineEndExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    fromPointIndexExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    keyExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    lineTypeExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    lockedExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    pointsExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    styleExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    textExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    textStyleExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    toExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    toLineEndExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    toPointIndexExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    zIndexExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>
  }
};

prepareConfigurationComponentConfig(DxEdgesConfig);

const DxEdges = defineComponent(DxEdgesConfig);

(DxEdges as any).$_optionName = "edges";

const DxEditingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowAddShape": null,
    "update:allowChangeConnection": null,
    "update:allowChangeConnectorPoints": null,
    "update:allowChangeConnectorText": null,
    "update:allowChangeShapeText": null,
    "update:allowDeleteConnector": null,
    "update:allowDeleteShape": null,
    "update:allowMoveShape": null,
    "update:allowResizeShape": null,
  },
  props: {
    allowAddShape: Boolean,
    allowChangeConnection: Boolean,
    allowChangeConnectorPoints: Boolean,
    allowChangeConnectorText: Boolean,
    allowChangeShapeText: Boolean,
    allowDeleteConnector: Boolean,
    allowDeleteShape: Boolean,
    allowMoveShape: Boolean,
    allowResizeShape: Boolean
  }
};

prepareConfigurationComponentConfig(DxEditingConfig);

const DxEditing = defineComponent(DxEditingConfig);

(DxEditing as any).$_optionName = "editing";

const DxExportConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:fileName": null,
  },
  props: {
    fileName: String
  }
};

prepareConfigurationComponentConfig(DxExportConfig);

const DxExport = defineComponent(DxExportConfig);

(DxExport as any).$_optionName = "export";

const DxGridSizeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:items": null,
    "update:value": null,
  },
  props: {
    items: Array as PropType<Array<number>>,
    value: Number
  }
};

prepareConfigurationComponentConfig(DxGridSizeConfig);

const DxGridSize = defineComponent(DxGridSizeConfig);

(DxGridSize as any).$_optionName = "gridSize";

const DxGroupConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:category": null,
    "update:commands": null,
    "update:displayMode": null,
    "update:expanded": null,
    "update:shapes": null,
    "update:title": null,
  },
  props: {
    category: String as PropType<ShapeCategory | string>,
    commands: Array as PropType<Array<Command | CustomCommand>>,
    displayMode: String as PropType<ToolboxDisplayMode>,
    expanded: Boolean,
    shapes: Array as PropType<Array<ShapeType>>,
    title: String
  }
};

prepareConfigurationComponentConfig(DxGroupConfig);

const DxGroup = defineComponent(DxGroupConfig);

(DxGroup as any).$_optionName = "groups";
(DxGroup as any).$_isCollectionItem = true;
(DxGroup as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};

const DxHistoryToolbarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:visible": null,
  },
  props: {
    commands: Array as PropType<Array<Command | CustomCommand>>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxHistoryToolbarConfig);

const DxHistoryToolbar = defineComponent(DxHistoryToolbarConfig);

(DxHistoryToolbar as any).$_optionName = "historyToolbar";
(DxHistoryToolbar as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:height": null,
    "update:icon": null,
    "update:items": null,
    "update:location": null,
    "update:name": null,
    "update:text": null,
    "update:width": null,
  },
  props: {
    height: Number,
    icon: String,
    items: Array as PropType<Array<Command | CustomCommand>>,
    location: String as PropType<ToolbarItemLocation>,
    name: String as PropType<Command | string>,
    text: String,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

const DxMainToolbarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:visible": null,
  },
  props: {
    commands: Array as PropType<Array<Command | CustomCommand>>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxMainToolbarConfig);

const DxMainToolbar = defineComponent(DxMainToolbarConfig);

(DxMainToolbar as any).$_optionName = "mainToolbar";
(DxMainToolbar as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};

const DxNodesConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:autoLayout": null,
    "update:autoSizeEnabled": null,
    "update:containerChildrenExpr": null,
    "update:containerKeyExpr": null,
    "update:customDataExpr": null,
    "update:dataSource": null,
    "update:heightExpr": null,
    "update:imageUrlExpr": null,
    "update:itemsExpr": null,
    "update:keyExpr": null,
    "update:leftExpr": null,
    "update:lockedExpr": null,
    "update:parentKeyExpr": null,
    "update:styleExpr": null,
    "update:textExpr": null,
    "update:textStyleExpr": null,
    "update:topExpr": null,
    "update:typeExpr": null,
    "update:widthExpr": null,
    "update:zIndexExpr": null,
  },
  props: {
    autoLayout: [String, Object] as PropType<DataLayoutType | Record<string, any>>,
    autoSizeEnabled: Boolean,
    containerChildrenExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    containerKeyExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    customDataExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    heightExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    imageUrlExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    itemsExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    keyExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    leftExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    lockedExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    parentKeyExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    styleExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    textExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    textStyleExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    topExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    typeExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    widthExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>,
    zIndexExpr: [Function, String] as PropType<(((data: any, value: any) => any)) | string>
  }
};

prepareConfigurationComponentConfig(DxNodesConfig);

const DxNodes = defineComponent(DxNodesConfig);

(DxNodes as any).$_optionName = "nodes";
(DxNodes as any).$_expectedChildren = {
  autoLayout: { isCollectionItem: false, optionName: "autoLayout" }
};

const DxPageSizeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:height": null,
    "update:items": null,
    "update:width": null,
  },
  props: {
    height: Number,
    items: Array as PropType<Array<Record<string, any>>>,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxPageSizeConfig);

const DxPageSize = defineComponent(DxPageSizeConfig);

(DxPageSize as any).$_optionName = "pageSize";
(DxPageSize as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  pageSizeItem: { isCollectionItem: true, optionName: "items" }
};

const DxPageSizeItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:height": null,
    "update:text": null,
    "update:width": null,
  },
  props: {
    height: Number,
    text: String,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxPageSizeItemConfig);

const DxPageSizeItem = defineComponent(DxPageSizeItemConfig);

(DxPageSizeItem as any).$_optionName = "items";
(DxPageSizeItem as any).$_isCollectionItem = true;

const DxPropertiesPanelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:tabs": null,
    "update:visibility": null,
  },
  props: {
    tabs: Array as PropType<Array<Record<string, any>>>,
    visibility: String as PropType<PanelVisibility>
  }
};

prepareConfigurationComponentConfig(DxPropertiesPanelConfig);

const DxPropertiesPanel = defineComponent(DxPropertiesPanelConfig);

(DxPropertiesPanel as any).$_optionName = "propertiesPanel";
(DxPropertiesPanel as any).$_expectedChildren = {
  tab: { isCollectionItem: true, optionName: "tabs" }
};

const DxTabConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:groups": null,
    "update:title": null,
  },
  props: {
    commands: Array as PropType<Array<Command | CustomCommand>>,
    groups: Array as PropType<Array<Record<string, any>>>,
    title: String
  }
};

prepareConfigurationComponentConfig(DxTabConfig);

const DxTab = defineComponent(DxTabConfig);

(DxTab as any).$_optionName = "tabs";
(DxTab as any).$_isCollectionItem = true;
(DxTab as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" },
  group: { isCollectionItem: true, optionName: "groups" },
  tabGroup: { isCollectionItem: true, optionName: "groups" }
};

const DxTabGroupConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:title": null,
  },
  props: {
    commands: Array as PropType<Array<Command | CustomCommand>>,
    title: String
  }
};

prepareConfigurationComponentConfig(DxTabGroupConfig);

const DxTabGroup = defineComponent(DxTabGroupConfig);

(DxTabGroup as any).$_optionName = "groups";
(DxTabGroup as any).$_isCollectionItem = true;
(DxTabGroup as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};

const DxToolboxConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:groups": null,
    "update:shapeIconsPerRow": null,
    "update:showSearch": null,
    "update:visibility": null,
    "update:width": null,
  },
  props: {
    groups: Array as PropType<Array<Record<string, any>>>,
    shapeIconsPerRow: Number,
    showSearch: Boolean,
    visibility: String as PropType<PanelVisibility>,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxToolboxConfig);

const DxToolbox = defineComponent(DxToolboxConfig);

(DxToolbox as any).$_optionName = "toolbox";
(DxToolbox as any).$_expectedChildren = {
  group: { isCollectionItem: true, optionName: "groups" },
  toolboxGroup: { isCollectionItem: true, optionName: "groups" }
};

const DxToolboxGroupConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:category": null,
    "update:displayMode": null,
    "update:expanded": null,
    "update:shapes": null,
    "update:title": null,
  },
  props: {
    category: String as PropType<ShapeCategory | string>,
    displayMode: String as PropType<ToolboxDisplayMode>,
    expanded: Boolean,
    shapes: Array as PropType<Array<ShapeType>>,
    title: String
  }
};

prepareConfigurationComponentConfig(DxToolboxGroupConfig);

const DxToolboxGroup = defineComponent(DxToolboxGroupConfig);

(DxToolboxGroup as any).$_optionName = "groups";
(DxToolboxGroup as any).$_isCollectionItem = true;

const DxViewToolbarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:visible": null,
  },
  props: {
    commands: Array as PropType<Array<Command | CustomCommand>>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxViewToolbarConfig);

const DxViewToolbar = defineComponent(DxViewToolbarConfig);

(DxViewToolbar as any).$_optionName = "viewToolbar";
(DxViewToolbar as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};

const DxZoomLevelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:items": null,
    "update:value": null,
  },
  props: {
    items: Array as PropType<Array<number>>,
    value: Number
  }
};

prepareConfigurationComponentConfig(DxZoomLevelConfig);

const DxZoomLevel = defineComponent(DxZoomLevelConfig);

(DxZoomLevel as any).$_optionName = "zoomLevel";

export default DxDiagram;
export {
  DxDiagram,
  DxAutoLayout,
  DxCommand,
  DxCommandItem,
  DxConnectionPoint,
  DxContextMenu,
  DxContextToolbox,
  DxCustomShape,
  DxDefaultItemProperties,
  DxEdges,
  DxEditing,
  DxExport,
  DxGridSize,
  DxGroup,
  DxHistoryToolbar,
  DxItem,
  DxMainToolbar,
  DxNodes,
  DxPageSize,
  DxPageSizeItem,
  DxPropertiesPanel,
  DxTab,
  DxTabGroup,
  DxToolbox,
  DxToolboxGroup,
  DxViewToolbar,
  DxZoomLevel
};
import type * as DxDiagramTypes from "devextreme/ui/diagram_types";
export { DxDiagramTypes };
