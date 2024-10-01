"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxDiagram, {
    Properties
} from "devextreme/ui/diagram";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, CustomCommandEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemDblClickEvent, RequestEditOperationEvent, RequestLayoutUpdateEvent, DataLayoutType, Command as DiagramCommand, CustomCommand, ShapeCategory, ToolboxDisplayMode, ShapeType, dxDiagramShape, ConnectorLineEnd, ConnectorLineType, PanelVisibility } from "devextreme/ui/diagram";
import type { Orientation, ToolbarItemLocation } from "devextreme/common";
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
  customShapeToolboxRender?: (...params: any) => React.ReactNode;
  customShapeToolboxComponent?: React.ComponentType<any>;
  defaultGridSize?: number | Record<string, any>;
  defaultPageSize?: Record<string, any>;
  defaultZoomLevel?: number | Record<string, any>;
  onGridSizeChange?: (value: number | Record<string, any>) => void;
  onPageSizeChange?: (value: Record<string, any>) => void;
  onZoomLevelChange?: (value: number | Record<string, any>) => void;
}>

interface DiagramRef {
  instance: () => dxDiagram;
}

const Diagram = memo(
  forwardRef(
    (props: React.PropsWithChildren<IDiagramOptions>, ref: ForwardedRef<DiagramRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["gridSize","gridSize.value","pageSize","pageSize.height","pageSize.width","zoomLevel","zoomLevel.value"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onCustomCommand","onDisposing","onInitialized","onItemClick","onItemDblClick","onRequestEditOperation","onRequestLayoutUpdate"]), []);

      const defaults = useMemo(() => ({
        defaultGridSize: "gridSize",
        defaultPageSize: "pageSize",
        defaultZoomLevel: "zoomLevel",
      }), []);

      const expectedChildren = useMemo(() => ({
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
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "customShapeTemplate",
          render: "customShapeRender",
          component: "customShapeComponent"
        },
        {
          tmplOption: "customShapeToolboxTemplate",
          render: "customShapeToolboxRender",
          component: "customShapeToolboxComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IDiagramOptions>>, {
          WidgetClass: dxDiagram,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IDiagramOptions> & { ref?: Ref<DiagramRef> }) => ReactElement | null;


// owners:
// Nodes
type IAutoLayoutProps = React.PropsWithChildren<{
  orientation?: Orientation;
  type?: DataLayoutType;
}>
const _componentAutoLayout = memo(
  (props: IAutoLayoutProps) => {
    return React.createElement(NestedOption<IAutoLayoutProps>, { ...props });
  }
);

const AutoLayout: typeof _componentAutoLayout & IElementDescriptor = Object.assign(_componentAutoLayout, {
  OptionName: "autoLayout",
})

// owners:
// ContextMenu
// HistoryToolbar
// MainToolbar
// Tab
// TabGroup
// ViewToolbar
type ICommandProps = React.PropsWithChildren<{
  icon?: string;
  items?: Array<DiagramCommand | CustomCommand>;
  location?: ToolbarItemLocation;
  name?: DiagramCommand | string;
  text?: string;
}>
const _componentCommand = memo(
  (props: ICommandProps) => {
    return React.createElement(NestedOption<ICommandProps>, { ...props });
  }
);

const Command: typeof _componentCommand & IElementDescriptor = Object.assign(_componentCommand, {
  OptionName: "commands",
  IsCollectionItem: true,
})

// owners:
// Command
type ICommandItemProps = React.PropsWithChildren<{
  icon?: string;
  items?: Array<DiagramCommand | CustomCommand>;
  location?: ToolbarItemLocation;
  name?: DiagramCommand | string;
  text?: string;
}>
const _componentCommandItem = memo(
  (props: ICommandItemProps) => {
    return React.createElement(NestedOption<ICommandItemProps>, { ...props });
  }
);

const CommandItem: typeof _componentCommandItem & IElementDescriptor = Object.assign(_componentCommandItem, {
  OptionName: "items",
  IsCollectionItem: true,
})

// owners:
// CustomShape
type IConnectionPointProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentConnectionPoint = memo(
  (props: IConnectionPointProps) => {
    return React.createElement(NestedOption<IConnectionPointProps>, { ...props });
  }
);

const ConnectionPoint: typeof _componentConnectionPoint & IElementDescriptor = Object.assign(_componentConnectionPoint, {
  OptionName: "connectionPoints",
  IsCollectionItem: true,
})

// owners:
// Diagram
type IContextMenuProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  enabled?: boolean;
}>
const _componentContextMenu = memo(
  (props: IContextMenuProps) => {
    return React.createElement(NestedOption<IContextMenuProps>, { ...props });
  }
);

const ContextMenu: typeof _componentContextMenu & IElementDescriptor = Object.assign(_componentContextMenu, {
  OptionName: "contextMenu",
  ExpectedChildren: {
    command: { optionName: "commands", isCollectionItem: true }
  },
})

// owners:
// Diagram
type IContextToolboxProps = React.PropsWithChildren<{
  category?: ShapeCategory | string;
  displayMode?: ToolboxDisplayMode;
  enabled?: boolean;
  shapeIconsPerRow?: number;
  shapes?: Array<ShapeType>;
  width?: number;
}>
const _componentContextToolbox = memo(
  (props: IContextToolboxProps) => {
    return React.createElement(NestedOption<IContextToolboxProps>, { ...props });
  }
);

const ContextToolbox: typeof _componentContextToolbox & IElementDescriptor = Object.assign(_componentContextToolbox, {
  OptionName: "contextToolbox",
})

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
  baseType?: ShapeType | string;
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
  toolboxRender?: (...params: any) => React.ReactNode;
  toolboxComponent?: React.ComponentType<any>;
}>
const _componentCustomShape = memo(
  (props: ICustomShapeProps) => {
    return React.createElement(NestedOption<ICustomShapeProps>, { ...props });
  }
);

const CustomShape: typeof _componentCustomShape & IElementDescriptor = Object.assign(_componentCustomShape, {
  OptionName: "customShapes",
  IsCollectionItem: true,
  ExpectedChildren: {
    connectionPoint: { optionName: "connectionPoints", isCollectionItem: true }
  },
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }, {
    tmplOption: "toolboxTemplate",
    render: "toolboxRender",
    component: "toolboxComponent"
  }],
})

// owners:
// Diagram
type IDefaultItemPropertiesProps = React.PropsWithChildren<{
  connectorLineEnd?: ConnectorLineEnd;
  connectorLineStart?: ConnectorLineEnd;
  connectorLineType?: ConnectorLineType;
  shapeMaxHeight?: number;
  shapeMaxWidth?: number;
  shapeMinHeight?: number;
  shapeMinWidth?: number;
  style?: Record<string, any>;
  textStyle?: Record<string, any>;
}>
const _componentDefaultItemProperties = memo(
  (props: IDefaultItemPropertiesProps) => {
    return React.createElement(NestedOption<IDefaultItemPropertiesProps>, { ...props });
  }
);

const DefaultItemProperties: typeof _componentDefaultItemProperties & IElementDescriptor = Object.assign(_componentDefaultItemProperties, {
  OptionName: "defaultItemProperties",
})

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
const _componentEdges = memo(
  (props: IEdgesProps) => {
    return React.createElement(NestedOption<IEdgesProps>, { ...props });
  }
);

const Edges: typeof _componentEdges & IElementDescriptor = Object.assign(_componentEdges, {
  OptionName: "edges",
})

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
const _componentEditing = memo(
  (props: IEditingProps) => {
    return React.createElement(NestedOption<IEditingProps>, { ...props });
  }
);

const Editing: typeof _componentEditing & IElementDescriptor = Object.assign(_componentEditing, {
  OptionName: "editing",
})

// owners:
// Diagram
type IExportProps = React.PropsWithChildren<{
  fileName?: string;
}>
const _componentExport = memo(
  (props: IExportProps) => {
    return React.createElement(NestedOption<IExportProps>, { ...props });
  }
);

const Export: typeof _componentExport & IElementDescriptor = Object.assign(_componentExport, {
  OptionName: "export",
})

// owners:
// Diagram
type IGridSizeProps = React.PropsWithChildren<{
  items?: Array<number>;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}>
const _componentGridSize = memo(
  (props: IGridSizeProps) => {
    return React.createElement(NestedOption<IGridSizeProps>, { ...props });
  }
);

const GridSize: typeof _componentGridSize & IElementDescriptor = Object.assign(_componentGridSize, {
  OptionName: "gridSize",
  DefaultsProps: {
    defaultValue: "value"
  },
})

// owners:
// Tab
// Toolbox
type IGroupProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  title?: string;
  category?: ShapeCategory | string;
  displayMode?: ToolboxDisplayMode;
  expanded?: boolean;
  shapes?: Array<ShapeType>;
}>
const _componentGroup = memo(
  (props: IGroupProps) => {
    return React.createElement(NestedOption<IGroupProps>, { ...props });
  }
);

const Group: typeof _componentGroup & IElementDescriptor = Object.assign(_componentGroup, {
  OptionName: "groups",
  IsCollectionItem: true,
})

// owners:
// Diagram
type IHistoryToolbarProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  visible?: boolean;
}>
const _componentHistoryToolbar = memo(
  (props: IHistoryToolbarProps) => {
    return React.createElement(NestedOption<IHistoryToolbarProps>, { ...props });
  }
);

const HistoryToolbar: typeof _componentHistoryToolbar & IElementDescriptor = Object.assign(_componentHistoryToolbar, {
  OptionName: "historyToolbar",
  ExpectedChildren: {
    command: { optionName: "commands", isCollectionItem: true }
  },
})

// owners:
// Command
// PageSize
type IItemProps = React.PropsWithChildren<{
  icon?: string;
  items?: Array<DiagramCommand | CustomCommand>;
  location?: ToolbarItemLocation;
  name?: DiagramCommand | string;
  text?: string;
  height?: number;
  width?: number;
}>
const _componentItem = memo(
  (props: IItemProps) => {
    return React.createElement(NestedOption<IItemProps>, { ...props });
  }
);

const Item: typeof _componentItem & IElementDescriptor = Object.assign(_componentItem, {
  OptionName: "items",
  IsCollectionItem: true,
})

// owners:
// Diagram
type IMainToolbarProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  visible?: boolean;
}>
const _componentMainToolbar = memo(
  (props: IMainToolbarProps) => {
    return React.createElement(NestedOption<IMainToolbarProps>, { ...props });
  }
);

const MainToolbar: typeof _componentMainToolbar & IElementDescriptor = Object.assign(_componentMainToolbar, {
  OptionName: "mainToolbar",
  ExpectedChildren: {
    command: { optionName: "commands", isCollectionItem: true }
  },
})

// owners:
// Diagram
type INodesProps = React.PropsWithChildren<{
  autoLayout?: DataLayoutType | Record<string, any> | {
    orientation?: Orientation;
    type?: DataLayoutType;
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
const _componentNodes = memo(
  (props: INodesProps) => {
    return React.createElement(NestedOption<INodesProps>, { ...props });
  }
);

const Nodes: typeof _componentNodes & IElementDescriptor = Object.assign(_componentNodes, {
  OptionName: "nodes",
  ExpectedChildren: {
    autoLayout: { optionName: "autoLayout", isCollectionItem: false }
  },
})

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
const _componentPageSize = memo(
  (props: IPageSizeProps) => {
    return React.createElement(NestedOption<IPageSizeProps>, { ...props });
  }
);

const PageSize: typeof _componentPageSize & IElementDescriptor = Object.assign(_componentPageSize, {
  OptionName: "pageSize",
  DefaultsProps: {
    defaultHeight: "height",
    defaultWidth: "width"
  },
  ExpectedChildren: {
    item: { optionName: "items", isCollectionItem: true },
    pageSizeItem: { optionName: "items", isCollectionItem: true }
  },
})

// owners:
// PageSize
type IPageSizeItemProps = React.PropsWithChildren<{
  height?: number;
  text?: string;
  width?: number;
}>
const _componentPageSizeItem = memo(
  (props: IPageSizeItemProps) => {
    return React.createElement(NestedOption<IPageSizeItemProps>, { ...props });
  }
);

const PageSizeItem: typeof _componentPageSizeItem & IElementDescriptor = Object.assign(_componentPageSizeItem, {
  OptionName: "items",
  IsCollectionItem: true,
})

// owners:
// Diagram
type IPropertiesPanelProps = React.PropsWithChildren<{
  tabs?: Array<Record<string, any>> | {
    commands?: Array<DiagramCommand | CustomCommand>;
    groups?: Array<Record<string, any>> | {
      commands?: Array<DiagramCommand | CustomCommand>;
      title?: string;
    }[];
    title?: string;
  }[];
  visibility?: PanelVisibility;
}>
const _componentPropertiesPanel = memo(
  (props: IPropertiesPanelProps) => {
    return React.createElement(NestedOption<IPropertiesPanelProps>, { ...props });
  }
);

const PropertiesPanel: typeof _componentPropertiesPanel & IElementDescriptor = Object.assign(_componentPropertiesPanel, {
  OptionName: "propertiesPanel",
  ExpectedChildren: {
    tab: { optionName: "tabs", isCollectionItem: true }
  },
})

// owners:
// PropertiesPanel
type ITabProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  groups?: Array<Record<string, any>> | {
    commands?: Array<DiagramCommand | CustomCommand>;
    title?: string;
  }[];
  title?: string;
}>
const _componentTab = memo(
  (props: ITabProps) => {
    return React.createElement(NestedOption<ITabProps>, { ...props });
  }
);

const Tab: typeof _componentTab & IElementDescriptor = Object.assign(_componentTab, {
  OptionName: "tabs",
  IsCollectionItem: true,
  ExpectedChildren: {
    command: { optionName: "commands", isCollectionItem: true },
    group: { optionName: "groups", isCollectionItem: true },
    tabGroup: { optionName: "groups", isCollectionItem: true }
  },
})

// owners:
// Tab
type ITabGroupProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  title?: string;
}>
const _componentTabGroup = memo(
  (props: ITabGroupProps) => {
    return React.createElement(NestedOption<ITabGroupProps>, { ...props });
  }
);

const TabGroup: typeof _componentTabGroup & IElementDescriptor = Object.assign(_componentTabGroup, {
  OptionName: "groups",
  IsCollectionItem: true,
  ExpectedChildren: {
    command: { optionName: "commands", isCollectionItem: true }
  },
})

// owners:
// Diagram
type IToolboxProps = React.PropsWithChildren<{
  groups?: Array<Record<string, any>> | {
    category?: ShapeCategory | string;
    displayMode?: ToolboxDisplayMode;
    expanded?: boolean;
    shapes?: Array<ShapeType>;
    title?: string;
  }[];
  shapeIconsPerRow?: number;
  showSearch?: boolean;
  visibility?: PanelVisibility;
  width?: number;
}>
const _componentToolbox = memo(
  (props: IToolboxProps) => {
    return React.createElement(NestedOption<IToolboxProps>, { ...props });
  }
);

const Toolbox: typeof _componentToolbox & IElementDescriptor = Object.assign(_componentToolbox, {
  OptionName: "toolbox",
  ExpectedChildren: {
    group: { optionName: "groups", isCollectionItem: true },
    toolboxGroup: { optionName: "groups", isCollectionItem: true }
  },
})

// owners:
// Toolbox
type IToolboxGroupProps = React.PropsWithChildren<{
  category?: ShapeCategory | string;
  displayMode?: ToolboxDisplayMode;
  expanded?: boolean;
  shapes?: Array<ShapeType>;
  title?: string;
}>
const _componentToolboxGroup = memo(
  (props: IToolboxGroupProps) => {
    return React.createElement(NestedOption<IToolboxGroupProps>, { ...props });
  }
);

const ToolboxGroup: typeof _componentToolboxGroup & IElementDescriptor = Object.assign(_componentToolboxGroup, {
  OptionName: "groups",
  IsCollectionItem: true,
})

// owners:
// Diagram
type IViewToolbarProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  visible?: boolean;
}>
const _componentViewToolbar = memo(
  (props: IViewToolbarProps) => {
    return React.createElement(NestedOption<IViewToolbarProps>, { ...props });
  }
);

const ViewToolbar: typeof _componentViewToolbar & IElementDescriptor = Object.assign(_componentViewToolbar, {
  OptionName: "viewToolbar",
  ExpectedChildren: {
    command: { optionName: "commands", isCollectionItem: true }
  },
})

// owners:
// Diagram
type IZoomLevelProps = React.PropsWithChildren<{
  items?: Array<number>;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}>
const _componentZoomLevel = memo(
  (props: IZoomLevelProps) => {
    return React.createElement(NestedOption<IZoomLevelProps>, { ...props });
  }
);

const ZoomLevel: typeof _componentZoomLevel & IElementDescriptor = Object.assign(_componentZoomLevel, {
  OptionName: "zoomLevel",
  DefaultsProps: {
    defaultValue: "value"
  },
})

export default Diagram;
export {
  Diagram,
  IDiagramOptions,
  DiagramRef,
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

