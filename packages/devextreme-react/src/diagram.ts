"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxDiagram, {
    Properties
} from "devextreme/ui/diagram";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, CustomCommandEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemDblClickEvent, RequestEditOperationEvent, RequestLayoutUpdateEvent, DataLayoutType, Command as DiagramCommand, CustomCommand, ShapeCategory, ToolboxDisplayMode, ShapeType, dxDiagramShape, ConnectorLineEnd, ConnectorLineType, PanelVisibility } from "devextreme/ui/diagram";
import type { Orientation, ToolbarItemLocation, template } from "devextreme/common";
import type { dxSVGElement } from "devextreme/core/element";
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
const _componentAutoLayout = (props: IAutoLayoutProps) => {
  return React.createElement(NestedOption<IAutoLayoutProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "autoLayout",
    },
  });
};

const AutoLayout = Object.assign<typeof _componentAutoLayout, NestedComponentMeta>(_componentAutoLayout, {
  componentType: "option",
});

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
const _componentCommand = (props: ICommandProps) => {
  return React.createElement(NestedOption<ICommandProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "commands",
      IsCollectionItem: true,
    },
  });
};

const Command = Object.assign<typeof _componentCommand, NestedComponentMeta>(_componentCommand, {
  componentType: "option",
});

// owners:
// Command
type ICommandItemProps = React.PropsWithChildren<{
  icon?: string;
  items?: Array<DiagramCommand | CustomCommand>;
  location?: ToolbarItemLocation;
  name?: DiagramCommand | string;
  text?: string;
}>
const _componentCommandItem = (props: ICommandItemProps) => {
  return React.createElement(NestedOption<ICommandItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
    },
  });
};

const CommandItem = Object.assign<typeof _componentCommandItem, NestedComponentMeta>(_componentCommandItem, {
  componentType: "option",
});

// owners:
// CustomShape
type IConnectionPointProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentConnectionPoint = (props: IConnectionPointProps) => {
  return React.createElement(NestedOption<IConnectionPointProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "connectionPoints",
      IsCollectionItem: true,
    },
  });
};

const ConnectionPoint = Object.assign<typeof _componentConnectionPoint, NestedComponentMeta>(_componentConnectionPoint, {
  componentType: "option",
});

// owners:
// Diagram
type IContextMenuProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  enabled?: boolean;
}>
const _componentContextMenu = (props: IContextMenuProps) => {
  return React.createElement(NestedOption<IContextMenuProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "contextMenu",
      ExpectedChildren: {
        command: { optionName: "commands", isCollectionItem: true }
      },
    },
  });
};

const ContextMenu = Object.assign<typeof _componentContextMenu, NestedComponentMeta>(_componentContextMenu, {
  componentType: "option",
});

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
const _componentContextToolbox = (props: IContextToolboxProps) => {
  return React.createElement(NestedOption<IContextToolboxProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "contextToolbox",
    },
  });
};

const ContextToolbox = Object.assign<typeof _componentContextToolbox, NestedComponentMeta>(_componentContextToolbox, {
  componentType: "option",
});

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
const _componentCustomShape = (props: ICustomShapeProps) => {
  return React.createElement(NestedOption<ICustomShapeProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const CustomShape = Object.assign<typeof _componentCustomShape, NestedComponentMeta>(_componentCustomShape, {
  componentType: "option",
});

// owners:
// Diagram
type IDefaultItemPropertiesProps = React.PropsWithChildren<{
  connectorLineEnd?: ConnectorLineEnd;
  connectorLineStart?: ConnectorLineEnd;
  connectorLineType?: ConnectorLineType;
  shapeMaxHeight?: number | undefined;
  shapeMaxWidth?: number | undefined;
  shapeMinHeight?: number | undefined;
  shapeMinWidth?: number | undefined;
  style?: Record<string, any>;
  textStyle?: Record<string, any>;
}>
const _componentDefaultItemProperties = (props: IDefaultItemPropertiesProps) => {
  return React.createElement(NestedOption<IDefaultItemPropertiesProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "defaultItemProperties",
    },
  });
};

const DefaultItemProperties = Object.assign<typeof _componentDefaultItemProperties, NestedComponentMeta>(_componentDefaultItemProperties, {
  componentType: "option",
});

// owners:
// Diagram
type IEdgesProps = React.PropsWithChildren<{
  customDataExpr?: ((data: any, value: any) => any) | string | undefined;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  fromExpr?: ((data: any, value: any) => any) | string;
  fromLineEndExpr?: ((data: any, value: any) => any) | string | undefined;
  fromPointIndexExpr?: ((data: any, value: any) => any) | string | undefined;
  keyExpr?: ((data: any, value: any) => any) | string;
  lineTypeExpr?: ((data: any, value: any) => any) | string | undefined;
  lockedExpr?: ((data: any, value: any) => any) | string | undefined;
  pointsExpr?: ((data: any, value: any) => any) | string | undefined;
  styleExpr?: ((data: any, value: any) => any) | string | undefined;
  textExpr?: ((data: any, value: any) => any) | string | undefined;
  textStyleExpr?: ((data: any, value: any) => any) | string | undefined;
  toExpr?: ((data: any, value: any) => any) | string;
  toLineEndExpr?: ((data: any, value: any) => any) | string | undefined;
  toPointIndexExpr?: ((data: any, value: any) => any) | string | undefined;
  zIndexExpr?: ((data: any, value: any) => any) | string | undefined;
}>
const _componentEdges = (props: IEdgesProps) => {
  return React.createElement(NestedOption<IEdgesProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "edges",
    },
  });
};

const Edges = Object.assign<typeof _componentEdges, NestedComponentMeta>(_componentEdges, {
  componentType: "option",
});

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
const _componentEditing = (props: IEditingProps) => {
  return React.createElement(NestedOption<IEditingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "editing",
    },
  });
};

const Editing = Object.assign<typeof _componentEditing, NestedComponentMeta>(_componentEditing, {
  componentType: "option",
});

// owners:
// Diagram
type IExportProps = React.PropsWithChildren<{
  fileName?: string;
}>
const _componentExport = (props: IExportProps) => {
  return React.createElement(NestedOption<IExportProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "export",
    },
  });
};

const Export = Object.assign<typeof _componentExport, NestedComponentMeta>(_componentExport, {
  componentType: "option",
});

// owners:
// Diagram
type IGridSizeProps = React.PropsWithChildren<{
  items?: Array<number>;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}>
const _componentGridSize = (props: IGridSizeProps) => {
  return React.createElement(NestedOption<IGridSizeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "gridSize",
      DefaultsProps: {
        defaultValue: "value"
      },
    },
  });
};

const GridSize = Object.assign<typeof _componentGridSize, NestedComponentMeta>(_componentGridSize, {
  componentType: "option",
});

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
const _componentGroup = (props: IGroupProps) => {
  return React.createElement(NestedOption<IGroupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "groups",
      IsCollectionItem: true,
      ExpectedChildren: {
        command: { optionName: "commands", isCollectionItem: true }
      },
    },
  });
};

const Group = Object.assign<typeof _componentGroup, NestedComponentMeta>(_componentGroup, {
  componentType: "option",
});

// owners:
// Diagram
type IHistoryToolbarProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  visible?: boolean;
}>
const _componentHistoryToolbar = (props: IHistoryToolbarProps) => {
  return React.createElement(NestedOption<IHistoryToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "historyToolbar",
      ExpectedChildren: {
        command: { optionName: "commands", isCollectionItem: true }
      },
    },
  });
};

const HistoryToolbar = Object.assign<typeof _componentHistoryToolbar, NestedComponentMeta>(_componentHistoryToolbar, {
  componentType: "option",
});

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
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// Diagram
type IMainToolbarProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  visible?: boolean;
}>
const _componentMainToolbar = (props: IMainToolbarProps) => {
  return React.createElement(NestedOption<IMainToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "mainToolbar",
      ExpectedChildren: {
        command: { optionName: "commands", isCollectionItem: true }
      },
    },
  });
};

const MainToolbar = Object.assign<typeof _componentMainToolbar, NestedComponentMeta>(_componentMainToolbar, {
  componentType: "option",
});

// owners:
// Diagram
type INodesProps = React.PropsWithChildren<{
  autoLayout?: DataLayoutType | Record<string, any> | {
    orientation?: Orientation;
    type?: DataLayoutType;
  };
  autoSizeEnabled?: boolean;
  containerChildrenExpr?: ((data: any, value: any) => any) | string | undefined;
  containerKeyExpr?: ((data: any, value: any) => any) | string;
  customDataExpr?: ((data: any, value: any) => any) | string | undefined;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  heightExpr?: ((data: any, value: any) => any) | string | undefined;
  imageUrlExpr?: ((data: any, value: any) => any) | string | undefined;
  itemsExpr?: ((data: any, value: any) => any) | string | undefined;
  keyExpr?: ((data: any, value: any) => any) | string;
  leftExpr?: ((data: any, value: any) => any) | string | undefined;
  lockedExpr?: ((data: any, value: any) => any) | string | undefined;
  parentKeyExpr?: ((data: any, value: any) => any) | string | undefined;
  styleExpr?: ((data: any, value: any) => any) | string | undefined;
  textExpr?: ((data: any, value: any) => any) | string;
  textStyleExpr?: ((data: any, value: any) => any) | string | undefined;
  topExpr?: ((data: any, value: any) => any) | string | undefined;
  typeExpr?: ((data: any, value: any) => any) | string;
  widthExpr?: ((data: any, value: any) => any) | string | undefined;
  zIndexExpr?: ((data: any, value: any) => any) | string | undefined;
}>
const _componentNodes = (props: INodesProps) => {
  return React.createElement(NestedOption<INodesProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "nodes",
      ExpectedChildren: {
        autoLayout: { optionName: "autoLayout", isCollectionItem: false }
      },
    },
  });
};

const Nodes = Object.assign<typeof _componentNodes, NestedComponentMeta>(_componentNodes, {
  componentType: "option",
});

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
const _componentPageSize = (props: IPageSizeProps) => {
  return React.createElement(NestedOption<IPageSizeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "pageSize",
      DefaultsProps: {
        defaultHeight: "height",
        defaultWidth: "width"
      },
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true },
        pageSizeItem: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const PageSize = Object.assign<typeof _componentPageSize, NestedComponentMeta>(_componentPageSize, {
  componentType: "option",
});

// owners:
// PageSize
type IPageSizeItemProps = React.PropsWithChildren<{
  height?: number;
  text?: string;
  width?: number;
}>
const _componentPageSizeItem = (props: IPageSizeItemProps) => {
  return React.createElement(NestedOption<IPageSizeItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
    },
  });
};

const PageSizeItem = Object.assign<typeof _componentPageSizeItem, NestedComponentMeta>(_componentPageSizeItem, {
  componentType: "option",
});

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
const _componentPropertiesPanel = (props: IPropertiesPanelProps) => {
  return React.createElement(NestedOption<IPropertiesPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "propertiesPanel",
      ExpectedChildren: {
        tab: { optionName: "tabs", isCollectionItem: true }
      },
    },
  });
};

const PropertiesPanel = Object.assign<typeof _componentPropertiesPanel, NestedComponentMeta>(_componentPropertiesPanel, {
  componentType: "option",
});

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
const _componentTab = (props: ITabProps) => {
  return React.createElement(NestedOption<ITabProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tabs",
      IsCollectionItem: true,
      ExpectedChildren: {
        command: { optionName: "commands", isCollectionItem: true },
        group: { optionName: "groups", isCollectionItem: true },
        tabGroup: { optionName: "groups", isCollectionItem: true }
      },
    },
  });
};

const Tab = Object.assign<typeof _componentTab, NestedComponentMeta>(_componentTab, {
  componentType: "option",
});

// owners:
// Tab
type ITabGroupProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  title?: string;
}>
const _componentTabGroup = (props: ITabGroupProps) => {
  return React.createElement(NestedOption<ITabGroupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "groups",
      IsCollectionItem: true,
      ExpectedChildren: {
        command: { optionName: "commands", isCollectionItem: true }
      },
    },
  });
};

const TabGroup = Object.assign<typeof _componentTabGroup, NestedComponentMeta>(_componentTabGroup, {
  componentType: "option",
});

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
  width?: number | undefined;
}>
const _componentToolbox = (props: IToolboxProps) => {
  return React.createElement(NestedOption<IToolboxProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbox",
      ExpectedChildren: {
        group: { optionName: "groups", isCollectionItem: true },
        toolboxGroup: { optionName: "groups", isCollectionItem: true }
      },
    },
  });
};

const Toolbox = Object.assign<typeof _componentToolbox, NestedComponentMeta>(_componentToolbox, {
  componentType: "option",
});

// owners:
// Toolbox
type IToolboxGroupProps = React.PropsWithChildren<{
  category?: ShapeCategory | string;
  displayMode?: ToolboxDisplayMode;
  expanded?: boolean;
  shapes?: Array<ShapeType>;
  title?: string;
}>
const _componentToolboxGroup = (props: IToolboxGroupProps) => {
  return React.createElement(NestedOption<IToolboxGroupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "groups",
      IsCollectionItem: true,
    },
  });
};

const ToolboxGroup = Object.assign<typeof _componentToolboxGroup, NestedComponentMeta>(_componentToolboxGroup, {
  componentType: "option",
});

// owners:
// Diagram
type IViewToolbarProps = React.PropsWithChildren<{
  commands?: Array<DiagramCommand | CustomCommand>;
  visible?: boolean;
}>
const _componentViewToolbar = (props: IViewToolbarProps) => {
  return React.createElement(NestedOption<IViewToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "viewToolbar",
      ExpectedChildren: {
        command: { optionName: "commands", isCollectionItem: true }
      },
    },
  });
};

const ViewToolbar = Object.assign<typeof _componentViewToolbar, NestedComponentMeta>(_componentViewToolbar, {
  componentType: "option",
});

// owners:
// Diagram
type IZoomLevelProps = React.PropsWithChildren<{
  items?: Array<number>;
  value?: number | undefined;
  defaultValue?: number | undefined;
  onValueChange?: (value: number | undefined) => void;
}>
const _componentZoomLevel = (props: IZoomLevelProps) => {
  return React.createElement(NestedOption<IZoomLevelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "zoomLevel",
      DefaultsProps: {
        defaultValue: "value"
      },
    },
  });
};

const ZoomLevel = Object.assign<typeof _componentZoomLevel, NestedComponentMeta>(_componentZoomLevel, {
  componentType: "option",
});

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

