"use client"
import dxDiagram, {
    Properties
} from "devextreme/ui/diagram";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, CustomCommandEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemDblClickEvent, RequestEditOperationEvent, RequestLayoutUpdateEvent, CustomCommand, dxDiagramShape } from "devextreme/ui/diagram";
import type { dxSVGElement } from "devextreme/core/element";
import type { template } from "devextreme/core/templates/template";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";

import type DataSource from "devextreme/data/data_source";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IDiagramOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onCustomCommand?: ((e: CustomCommandEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onItemClick?: ((e: ItemClickEvent) => void);
  onItemDblClick?: ((e: ItemDblClickEvent) => void);
  onRequestEditOperation?: ((e: RequestEditOperationEvent) => void);
  onRequestLayoutUpdate?: ((e: RequestLayoutUpdateEvent) => void);
}

type IDiagramOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IDiagramOptionsNarrowedEvents> & IHtmlOptions & {
  customShapeRender?: (...params: any) => React.ReactNode;
  customShapeComponent?: React.ComponentType<any>;
  customShapeKeyFn?: (data: any) => string;
  customShapeToolboxRender?: (...params: any) => React.ReactNode;
  customShapeToolboxComponent?: React.ComponentType<any>;
  customShapeToolboxKeyFn?: (data: any) => string;
  defaultGridSize?: number | Record<string, any>;
  defaultPageSize?: Record<string, any>;
  defaultZoomLevel?: number | Record<string, any>;
  onGridSizeChange?: (value: number | Record<string, any>) => void;
  onPageSizeChange?: (value: Record<string, any>) => void;
  onZoomLevelChange?: (value: number | Record<string, any>) => void;
}>

class Diagram extends BaseComponent<React.PropsWithChildren<IDiagramOptions>> {

  public get instance(): dxDiagram {
    return this._instance;
  }

  protected _WidgetClass = dxDiagram;

  protected subscribableOptions = ["gridSize","gridSize.value","pageSize","pageSize.height","pageSize.width","zoomLevel","zoomLevel.value"];

  protected independentEvents = ["onContentReady","onCustomCommand","onDisposing","onInitialized","onItemClick","onItemDblClick","onRequestEditOperation","onRequestLayoutUpdate"];

  protected _defaults = {
    defaultGridSize: "gridSize",
    defaultPageSize: "pageSize",
    defaultZoomLevel: "zoomLevel"
  };

  protected _expectedChildren = {
    contextMenu: { optionName: "contextMenu", isCollectionItem: false },
    contextToolbox: { optionName: "contextToolbox", isCollectionItem: false },
    customShape: { optionName: "customShapes", isCollectionItem: true },
    defaultItemProperties: { optionName: "defaultItemProperties", isCollectionItem: false },
    edges: { optionName: "edges", isCollectionItem: false },
    editing: { optionName: "editing", isCollectionItem: false },
    export: { optionName: "export", isCollectionItem: false },
    gridSize: { optionName: "gridSize", isCollectionItem: false },
    historyToolbar: { optionName: "historyToolbar", isCollectionItem: false },
    mainToolbar: { optionName: "mainToolbar", isCollectionItem: false },
    nodes: { optionName: "nodes", isCollectionItem: false },
    pageSize: { optionName: "pageSize", isCollectionItem: false },
    propertiesPanel: { optionName: "propertiesPanel", isCollectionItem: false },
    toolbox: { optionName: "toolbox", isCollectionItem: false },
    viewToolbar: { optionName: "viewToolbar", isCollectionItem: false },
    zoomLevel: { optionName: "zoomLevel", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "customShapeTemplate",
    render: "customShapeRender",
    component: "customShapeComponent",
    keyFn: "customShapeKeyFn"
  }, {
    tmplOption: "customShapeToolboxTemplate",
    render: "customShapeToolboxRender",
    component: "customShapeToolboxComponent",
    keyFn: "customShapeToolboxKeyFn"
  }];
}
(Diagram as any).propTypes = {
  autoZoomMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "fitContent",
      "fitWidth",
      "disabled"])
  ]),
  contextMenu: PropTypes.object,
  contextToolbox: PropTypes.object,
  customShapes: PropTypes.array,
  defaultItemProperties: PropTypes.object,
  disabled: PropTypes.bool,
  edges: PropTypes.object,
  editing: PropTypes.object,
  elementAttr: PropTypes.object,
  export: PropTypes.object,
  fullScreen: PropTypes.bool,
  gridSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object
  ]),
  hasChanges: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  historyToolbar: PropTypes.object,
  mainToolbar: PropTypes.object,
  nodes: PropTypes.object,
  onContentReady: PropTypes.func,
  onCustomCommand: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemDblClick: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onRequestEditOperation: PropTypes.func,
  onRequestLayoutUpdate: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  pageColor: PropTypes.string,
  pageOrientation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "portrait",
      "landscape"])
  ]),
  pageSize: PropTypes.object,
  propertiesPanel: PropTypes.object,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  showGrid: PropTypes.bool,
  simpleView: PropTypes.bool,
  snapToGrid: PropTypes.bool,
  toolbox: PropTypes.object,
  units: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "in",
      "cm",
      "px"])
  ]),
  useNativeScrolling: PropTypes.bool,
  viewToolbar: PropTypes.object,
  viewUnits: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "in",
      "cm",
      "px"])
  ]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  zoomLevel: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object
  ])
};


// owners:
// Nodes
type IAutoLayoutProps = React.PropsWithChildren<{
  orientation?: "horizontal" | "vertical";
  type?: "auto" | "off" | "tree" | "layered";
}>
class AutoLayout extends NestedOption<IAutoLayoutProps> {
  public static OptionName = "autoLayout";
}

// owners:
// ContextMenu
// HistoryToolbar
// MainToolbar
// Tab
// TabGroup
// ViewToolbar
type ICommandProps = React.PropsWithChildren<{
  icon?: string;
  items?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  location?: "after" | "before" | "center";
  name?: "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox";
  text?: string;
}>
class Command extends NestedOption<ICommandProps> {
  public static OptionName = "commands";
  public static IsCollectionItem = true;
}

// owners:
// Command
type ICommandItemProps = React.PropsWithChildren<{
  icon?: string;
  items?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  location?: "after" | "before" | "center";
  name?: "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox";
  text?: string;
}>
class CommandItem extends NestedOption<ICommandItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
}

// owners:
// CustomShape
type IConnectionPointProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class ConnectionPoint extends NestedOption<IConnectionPointProps> {
  public static OptionName = "connectionPoints";
  public static IsCollectionItem = true;
}

// owners:
// Diagram
type IContextMenuProps = React.PropsWithChildren<{
  commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  enabled?: boolean;
}>
class ContextMenu extends NestedOption<IContextMenuProps> {
  public static OptionName = "contextMenu";
  public static ExpectedChildren = {
    command: { optionName: "commands", isCollectionItem: true }
  };
}

// owners:
// Diagram
type IContextToolboxProps = React.PropsWithChildren<{
  category?: "general" | "flowchart" | "orgChart" | "containers" | "custom";
  displayMode?: "icons" | "texts";
  enabled?: boolean;
  shapeIconsPerRow?: number;
  shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">;
  width?: number;
}>
class ContextToolbox extends NestedOption<IContextToolboxProps> {
  public static OptionName = "contextToolbox";
}

// owners:
// Diagram
type ICustomShapeProps = React.PropsWithChildren<{
  allowEditImage?: boolean;
  allowEditText?: boolean;
  allowResize?: boolean;
  backgroundImageHeight?: number;
  backgroundImageLeft?: number;
  backgroundImageToolboxUrl?: string;
  backgroundImageTop?: number;
  backgroundImageUrl?: string;
  backgroundImageWidth?: number;
  baseType?: "text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight";
  category?: string;
  connectionPoints?: Array<Record<string, any>> | {
    x?: number;
    y?: number;
  }[];
  defaultHeight?: number;
  defaultImageUrl?: string;
  defaultText?: string;
  defaultWidth?: number;
  imageHeight?: number;
  imageLeft?: number;
  imageTop?: number;
  imageWidth?: number;
  keepRatioOnAutoSize?: boolean;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  template?: ((container: dxSVGElement, data: { item: dxDiagramShape }) => void) | template;
  templateHeight?: number;
  templateLeft?: number;
  templateTop?: number;
  templateWidth?: number;
  textHeight?: number;
  textLeft?: number;
  textTop?: number;
  textWidth?: number;
  title?: string;
  toolboxTemplate?: ((container: dxSVGElement, data: { item: dxDiagramShape }) => void) | template;
  toolboxWidthToHeightRatio?: number;
  type?: string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
  toolboxRender?: (...params: any) => React.ReactNode;
  toolboxComponent?: React.ComponentType<any>;
  toolboxKeyFn?: (data: any) => string;
}>
class CustomShape extends NestedOption<ICustomShapeProps> {
  public static OptionName = "customShapes";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    connectionPoint: { optionName: "connectionPoints", isCollectionItem: true }
  };
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }, {
    tmplOption: "toolboxTemplate",
    render: "toolboxRender",
    component: "toolboxComponent",
    keyFn: "toolboxKeyFn"
  }];
}

// owners:
// Diagram
type IDefaultItemPropertiesProps = React.PropsWithChildren<{
  connectorLineEnd?: "none" | "arrow" | "outlinedTriangle" | "filledTriangle";
  connectorLineStart?: "none" | "arrow" | "outlinedTriangle" | "filledTriangle";
  connectorLineType?: "straight" | "orthogonal";
  shapeMaxHeight?: number;
  shapeMaxWidth?: number;
  shapeMinHeight?: number;
  shapeMinWidth?: number;
  style?: Record<string, any>;
  textStyle?: Record<string, any>;
}>
class DefaultItemProperties extends NestedOption<IDefaultItemPropertiesProps> {
  public static OptionName = "defaultItemProperties";
}

// owners:
// Diagram
type IEdgesProps = React.PropsWithChildren<{
  customDataExpr?: ((data: any, value: any) => any) | string;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  fromExpr?: ((data: any, value: any) => any) | string;
  fromLineEndExpr?: ((data: any, value: any) => any) | string;
  fromPointIndexExpr?: ((data: any, value: any) => any) | string;
  keyExpr?: ((data: any, value: any) => any) | string;
  lineTypeExpr?: ((data: any, value: any) => any) | string;
  lockedExpr?: ((data: any, value: any) => any) | string;
  pointsExpr?: ((data: any, value: any) => any) | string;
  styleExpr?: ((data: any, value: any) => any) | string;
  textExpr?: ((data: any, value: any) => any) | string;
  textStyleExpr?: ((data: any, value: any) => any) | string;
  toExpr?: ((data: any, value: any) => any) | string;
  toLineEndExpr?: ((data: any, value: any) => any) | string;
  toPointIndexExpr?: ((data: any, value: any) => any) | string;
  zIndexExpr?: ((data: any, value: any) => any) | string;
}>
class Edges extends NestedOption<IEdgesProps> {
  public static OptionName = "edges";
}

// owners:
// Diagram
type IEditingProps = React.PropsWithChildren<{
  allowAddShape?: boolean;
  allowChangeConnection?: boolean;
  allowChangeConnectorPoints?: boolean;
  allowChangeConnectorText?: boolean;
  allowChangeShapeText?: boolean;
  allowDeleteConnector?: boolean;
  allowDeleteShape?: boolean;
  allowMoveShape?: boolean;
  allowResizeShape?: boolean;
}>
class Editing extends NestedOption<IEditingProps> {
  public static OptionName = "editing";
}

// owners:
// Diagram
type IExportProps = React.PropsWithChildren<{
  fileName?: string;
}>
class Export extends NestedOption<IExportProps> {
  public static OptionName = "export";
}

// owners:
// Diagram
type IGridSizeProps = React.PropsWithChildren<{
  items?: Array<number>;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}>
class GridSize extends NestedOption<IGridSizeProps> {
  public static OptionName = "gridSize";
  public static DefaultsProps = {
    defaultValue: "value"
  };
}

// owners:
// Tab
// Toolbox
type IGroupProps = React.PropsWithChildren<{
  commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  title?: string;
  category?: "general" | "flowchart" | "orgChart" | "containers" | "custom";
  displayMode?: "icons" | "texts";
  expanded?: boolean;
  shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">;
}>
class Group extends NestedOption<IGroupProps> {
  public static OptionName = "groups";
  public static IsCollectionItem = true;
}

// owners:
// Diagram
type IHistoryToolbarProps = React.PropsWithChildren<{
  commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  visible?: boolean;
}>
class HistoryToolbar extends NestedOption<IHistoryToolbarProps> {
  public static OptionName = "historyToolbar";
  public static ExpectedChildren = {
    command: { optionName: "commands", isCollectionItem: true }
  };
}

// owners:
// Command
// PageSize
type IItemProps = React.PropsWithChildren<{
  icon?: string;
  items?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  location?: "after" | "before" | "center";
  name?: "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox";
  text?: string;
  height?: number;
  width?: number;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
}

// owners:
// Diagram
type IMainToolbarProps = React.PropsWithChildren<{
  commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  visible?: boolean;
}>
class MainToolbar extends NestedOption<IMainToolbarProps> {
  public static OptionName = "mainToolbar";
  public static ExpectedChildren = {
    command: { optionName: "commands", isCollectionItem: true }
  };
}

// owners:
// Diagram
type INodesProps = React.PropsWithChildren<{
  autoLayout?: Record<string, any> | "auto" | "off" | "tree" | "layered" | {
    orientation?: "horizontal" | "vertical";
    type?: "auto" | "off" | "tree" | "layered";
  };
  autoSizeEnabled?: boolean;
  containerChildrenExpr?: ((data: any, value: any) => any) | string;
  containerKeyExpr?: ((data: any, value: any) => any) | string;
  customDataExpr?: ((data: any, value: any) => any) | string;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  heightExpr?: ((data: any, value: any) => any) | string;
  imageUrlExpr?: ((data: any, value: any) => any) | string;
  itemsExpr?: ((data: any, value: any) => any) | string;
  keyExpr?: ((data: any, value: any) => any) | string;
  leftExpr?: ((data: any, value: any) => any) | string;
  lockedExpr?: ((data: any, value: any) => any) | string;
  parentKeyExpr?: ((data: any, value: any) => any) | string;
  styleExpr?: ((data: any, value: any) => any) | string;
  textExpr?: ((data: any, value: any) => any) | string;
  textStyleExpr?: ((data: any, value: any) => any) | string;
  topExpr?: ((data: any, value: any) => any) | string;
  typeExpr?: ((data: any, value: any) => any) | string;
  widthExpr?: ((data: any, value: any) => any) | string;
  zIndexExpr?: ((data: any, value: any) => any) | string;
}>
class Nodes extends NestedOption<INodesProps> {
  public static OptionName = "nodes";
  public static ExpectedChildren = {
    autoLayout: { optionName: "autoLayout", isCollectionItem: false }
  };
}

// owners:
// Diagram
type IPageSizeProps = React.PropsWithChildren<{
  height?: number;
  items?: Array<Record<string, any>> | {
    height?: number;
    text?: string;
    width?: number;
  }[];
  width?: number;
  defaultHeight?: number;
  onHeightChange?: (value: number) => void;
  defaultWidth?: number;
  onWidthChange?: (value: number) => void;
}>
class PageSize extends NestedOption<IPageSizeProps> {
  public static OptionName = "pageSize";
  public static DefaultsProps = {
    defaultHeight: "height",
    defaultWidth: "width"
  };
  public static ExpectedChildren = {
    item: { optionName: "items", isCollectionItem: true },
    pageSizeItem: { optionName: "items", isCollectionItem: true }
  };
}

// owners:
// PageSize
type IPageSizeItemProps = React.PropsWithChildren<{
  height?: number;
  text?: string;
  width?: number;
}>
class PageSizeItem extends NestedOption<IPageSizeItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
}

// owners:
// Diagram
type IPropertiesPanelProps = React.PropsWithChildren<{
  tabs?: Array<Record<string, any>> | {
    commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
    groups?: Array<Record<string, any>> | {
      commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
      title?: string;
    }[];
    title?: string;
  }[];
  visibility?: "auto" | "visible" | "collapsed" | "disabled";
}>
class PropertiesPanel extends NestedOption<IPropertiesPanelProps> {
  public static OptionName = "propertiesPanel";
  public static ExpectedChildren = {
    tab: { optionName: "tabs", isCollectionItem: true }
  };
}

// owners:
// PropertiesPanel
type ITabProps = React.PropsWithChildren<{
  commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  groups?: Array<Record<string, any>> | {
    commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
    title?: string;
  }[];
  title?: string;
}>
class Tab extends NestedOption<ITabProps> {
  public static OptionName = "tabs";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    command: { optionName: "commands", isCollectionItem: true },
    group: { optionName: "groups", isCollectionItem: true },
    tabGroup: { optionName: "groups", isCollectionItem: true }
  };
}

// owners:
// Tab
type ITabGroupProps = React.PropsWithChildren<{
  commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  title?: string;
}>
class TabGroup extends NestedOption<ITabGroupProps> {
  public static OptionName = "groups";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    command: { optionName: "commands", isCollectionItem: true }
  };
}

// owners:
// Diagram
type IToolboxProps = React.PropsWithChildren<{
  groups?: Array<Record<string, any>> | {
    category?: "general" | "flowchart" | "orgChart" | "containers" | "custom";
    displayMode?: "icons" | "texts";
    expanded?: boolean;
    shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">;
    title?: string;
  }[];
  shapeIconsPerRow?: number;
  showSearch?: boolean;
  visibility?: "auto" | "visible" | "collapsed" | "disabled";
  width?: number;
}>
class Toolbox extends NestedOption<IToolboxProps> {
  public static OptionName = "toolbox";
  public static ExpectedChildren = {
    group: { optionName: "groups", isCollectionItem: true },
    toolboxGroup: { optionName: "groups", isCollectionItem: true }
  };
}

// owners:
// Toolbox
type IToolboxGroupProps = React.PropsWithChildren<{
  category?: "general" | "flowchart" | "orgChart" | "containers" | "custom";
  displayMode?: "icons" | "texts";
  expanded?: boolean;
  shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">;
  title?: string;
}>
class ToolboxGroup extends NestedOption<IToolboxGroupProps> {
  public static OptionName = "groups";
  public static IsCollectionItem = true;
}

// owners:
// Diagram
type IViewToolbarProps = React.PropsWithChildren<{
  commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">;
  visible?: boolean;
}>
class ViewToolbar extends NestedOption<IViewToolbarProps> {
  public static OptionName = "viewToolbar";
  public static ExpectedChildren = {
    command: { optionName: "commands", isCollectionItem: true }
  };
}

// owners:
// Diagram
type IZoomLevelProps = React.PropsWithChildren<{
  items?: Array<number>;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}>
class ZoomLevel extends NestedOption<IZoomLevelProps> {
  public static OptionName = "zoomLevel";
  public static DefaultsProps = {
    defaultValue: "value"
  };
}

export default Diagram;
export {
  Diagram,
  IDiagramOptions,
  AutoLayout,
  IAutoLayoutProps,
  Command,
  ICommandProps,
  CommandItem,
  ICommandItemProps,
  ConnectionPoint,
  IConnectionPointProps,
  ContextMenu,
  IContextMenuProps,
  ContextToolbox,
  IContextToolboxProps,
  CustomShape,
  ICustomShapeProps,
  DefaultItemProperties,
  IDefaultItemPropertiesProps,
  Edges,
  IEdgesProps,
  Editing,
  IEditingProps,
  Export,
  IExportProps,
  GridSize,
  IGridSizeProps,
  Group,
  IGroupProps,
  HistoryToolbar,
  IHistoryToolbarProps,
  Item,
  IItemProps,
  MainToolbar,
  IMainToolbarProps,
  Nodes,
  INodesProps,
  PageSize,
  IPageSizeProps,
  PageSizeItem,
  IPageSizeItemProps,
  PropertiesPanel,
  IPropertiesPanelProps,
  Tab,
  ITabProps,
  TabGroup,
  ITabGroupProps,
  Toolbox,
  IToolboxProps,
  ToolboxGroup,
  IToolboxGroupProps,
  ViewToolbar,
  IViewToolbarProps,
  ZoomLevel,
  IZoomLevelProps
};
import type * as DiagramTypes from 'devextreme/ui/diagram_types';
export { DiagramTypes };

