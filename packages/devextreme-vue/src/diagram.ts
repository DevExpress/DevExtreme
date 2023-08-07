import Diagram, { Properties } from "devextreme/ui/diagram";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

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
const DxDiagram = createComponent({
  props: {
    autoZoomMode: String,
    contextMenu: Object,
    contextToolbox: Object,
    customShapes: Array,
    customShapeTemplate: {},
    customShapeToolboxTemplate: {},
    defaultItemProperties: Object,
    disabled: Boolean,
    edges: Object,
    editing: Object,
    elementAttr: Object,
    export: Object,
    fullScreen: Boolean,
    gridSize: [Number, Object],
    hasChanges: Boolean,
    height: [Function, Number, String],
    historyToolbar: Object,
    mainToolbar: Object,
    nodes: Object,
    onContentReady: Function,
    onCustomCommand: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemDblClick: Function,
    onOptionChanged: Function,
    onRequestEditOperation: Function,
    onRequestLayoutUpdate: Function,
    onSelectionChanged: Function,
    pageColor: String,
    pageOrientation: String,
    pageSize: Object,
    propertiesPanel: Object,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showGrid: Boolean,
    simpleView: Boolean,
    snapToGrid: Boolean,
    toolbox: Object,
    units: String,
    useNativeScrolling: Boolean,
    viewToolbar: Object,
    viewUnits: String,
    visible: Boolean,
    width: [Function, Number, String],
    zoomLevel: [Number, Object]
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
});

const DxAutoLayout = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:orientation": null,
    "update:type": null,
  },
  props: {
    orientation: String,
    type: String
  }
});
(DxAutoLayout as any).$_optionName = "autoLayout";
const DxCommand = createConfigurationComponent({
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
    items: Array,
    location: String,
    name: String,
    text: String
  }
});
(DxCommand as any).$_optionName = "commands";
(DxCommand as any).$_isCollectionItem = true;
const DxCommandItem = createConfigurationComponent({
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
    items: Array,
    location: String,
    name: String,
    text: String
  }
});
(DxCommandItem as any).$_optionName = "items";
(DxCommandItem as any).$_isCollectionItem = true;
const DxConnectionPoint = createConfigurationComponent({
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
});
(DxConnectionPoint as any).$_optionName = "connectionPoints";
(DxConnectionPoint as any).$_isCollectionItem = true;
const DxContextMenu = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:enabled": null,
  },
  props: {
    commands: Array,
    enabled: Boolean
  }
});
(DxContextMenu as any).$_optionName = "contextMenu";
(DxContextMenu as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};
const DxContextToolbox = createConfigurationComponent({
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
    category: String,
    displayMode: String,
    enabled: Boolean,
    shapeIconsPerRow: Number,
    shapes: Array,
    width: Number
  }
});
(DxContextToolbox as any).$_optionName = "contextToolbox";
const DxCustomShape = createConfigurationComponent({
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
    baseType: String,
    category: String,
    connectionPoints: Array,
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
});
(DxCustomShape as any).$_optionName = "customShapes";
(DxCustomShape as any).$_isCollectionItem = true;
(DxCustomShape as any).$_expectedChildren = {
  connectionPoint: { isCollectionItem: true, optionName: "connectionPoints" }
};
const DxDefaultItemProperties = createConfigurationComponent({
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
    connectorLineEnd: String,
    connectorLineStart: String,
    connectorLineType: String,
    shapeMaxHeight: Number,
    shapeMaxWidth: Number,
    shapeMinHeight: Number,
    shapeMinWidth: Number,
    style: Object,
    textStyle: Object
  }
});
(DxDefaultItemProperties as any).$_optionName = "defaultItemProperties";
const DxEdges = createConfigurationComponent({
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
    customDataExpr: [Function, String],
    dataSource: {},
    fromExpr: [Function, String],
    fromLineEndExpr: [Function, String],
    fromPointIndexExpr: [Function, String],
    keyExpr: [Function, String],
    lineTypeExpr: [Function, String],
    lockedExpr: [Function, String],
    pointsExpr: [Function, String],
    styleExpr: [Function, String],
    textExpr: [Function, String],
    textStyleExpr: [Function, String],
    toExpr: [Function, String],
    toLineEndExpr: [Function, String],
    toPointIndexExpr: [Function, String],
    zIndexExpr: [Function, String]
  }
});
(DxEdges as any).$_optionName = "edges";
const DxEditing = createConfigurationComponent({
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
});
(DxEditing as any).$_optionName = "editing";
const DxExport = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:fileName": null,
  },
  props: {
    fileName: String
  }
});
(DxExport as any).$_optionName = "export";
const DxGridSize = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:items": null,
    "update:value": null,
  },
  props: {
    items: Array,
    value: Number
  }
});
(DxGridSize as any).$_optionName = "gridSize";
const DxGroup = createConfigurationComponent({
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
    category: String,
    commands: Array,
    displayMode: String,
    expanded: Boolean,
    shapes: Array,
    title: String
  }
});
(DxGroup as any).$_optionName = "groups";
(DxGroup as any).$_isCollectionItem = true;
const DxHistoryToolbar = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:visible": null,
  },
  props: {
    commands: Array,
    visible: Boolean
  }
});
(DxHistoryToolbar as any).$_optionName = "historyToolbar";
(DxHistoryToolbar as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};
const DxItem = createConfigurationComponent({
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
    items: Array,
    location: String,
    name: String,
    text: String,
    width: Number
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
const DxMainToolbar = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:visible": null,
  },
  props: {
    commands: Array,
    visible: Boolean
  }
});
(DxMainToolbar as any).$_optionName = "mainToolbar";
(DxMainToolbar as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};
const DxNodes = createConfigurationComponent({
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
    autoLayout: [Object, String],
    autoSizeEnabled: Boolean,
    containerChildrenExpr: [Function, String],
    containerKeyExpr: [Function, String],
    customDataExpr: [Function, String],
    dataSource: {},
    heightExpr: [Function, String],
    imageUrlExpr: [Function, String],
    itemsExpr: [Function, String],
    keyExpr: [Function, String],
    leftExpr: [Function, String],
    lockedExpr: [Function, String],
    parentKeyExpr: [Function, String],
    styleExpr: [Function, String],
    textExpr: [Function, String],
    textStyleExpr: [Function, String],
    topExpr: [Function, String],
    typeExpr: [Function, String],
    widthExpr: [Function, String],
    zIndexExpr: [Function, String]
  }
});
(DxNodes as any).$_optionName = "nodes";
(DxNodes as any).$_expectedChildren = {
  autoLayout: { isCollectionItem: false, optionName: "autoLayout" }
};
const DxPageSize = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:height": null,
    "update:items": null,
    "update:width": null,
  },
  props: {
    height: Number,
    items: Array,
    width: Number
  }
});
(DxPageSize as any).$_optionName = "pageSize";
(DxPageSize as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  pageSizeItem: { isCollectionItem: true, optionName: "items" }
};
const DxPageSizeItem = createConfigurationComponent({
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
});
(DxPageSizeItem as any).$_optionName = "items";
(DxPageSizeItem as any).$_isCollectionItem = true;
const DxPropertiesPanel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:tabs": null,
    "update:visibility": null,
  },
  props: {
    tabs: Array,
    visibility: String
  }
});
(DxPropertiesPanel as any).$_optionName = "propertiesPanel";
(DxPropertiesPanel as any).$_expectedChildren = {
  tab: { isCollectionItem: true, optionName: "tabs" }
};
const DxTab = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:groups": null,
    "update:title": null,
  },
  props: {
    commands: Array,
    groups: Array,
    title: String
  }
});
(DxTab as any).$_optionName = "tabs";
(DxTab as any).$_isCollectionItem = true;
(DxTab as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" },
  group: { isCollectionItem: true, optionName: "groups" },
  tabGroup: { isCollectionItem: true, optionName: "groups" }
};
const DxTabGroup = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:title": null,
  },
  props: {
    commands: Array,
    title: String
  }
});
(DxTabGroup as any).$_optionName = "groups";
(DxTabGroup as any).$_isCollectionItem = true;
(DxTabGroup as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};
const DxToolbox = createConfigurationComponent({
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
    groups: Array,
    shapeIconsPerRow: Number,
    showSearch: Boolean,
    visibility: String,
    width: Number
  }
});
(DxToolbox as any).$_optionName = "toolbox";
(DxToolbox as any).$_expectedChildren = {
  group: { isCollectionItem: true, optionName: "groups" },
  toolboxGroup: { isCollectionItem: true, optionName: "groups" }
};
const DxToolboxGroup = createConfigurationComponent({
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
    category: String,
    displayMode: String,
    expanded: Boolean,
    shapes: Array,
    title: String
  }
});
(DxToolboxGroup as any).$_optionName = "groups";
(DxToolboxGroup as any).$_isCollectionItem = true;
const DxViewToolbar = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:commands": null,
    "update:visible": null,
  },
  props: {
    commands: Array,
    visible: Boolean
  }
});
(DxViewToolbar as any).$_optionName = "viewToolbar";
(DxViewToolbar as any).$_expectedChildren = {
  command: { isCollectionItem: true, optionName: "commands" }
};
const DxZoomLevel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:items": null,
    "update:value": null,
  },
  props: {
    items: Array,
    value: Number
  }
});
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
