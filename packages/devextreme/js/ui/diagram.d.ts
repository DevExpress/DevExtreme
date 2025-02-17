import DataSource, { DataSourceLike } from '../data/data_source';

import {
    DxElement,
} from '../core/element';

import {
    template,
    Orientation,
    PageOrientation,
    ToolbarItemLocation,
} from '../common';

import {
  EventInfo,
  InitializedEventInfo,
  ChangedOptionInfo,
} from '../common/core/events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

export type AutoZoomMode = 'fitContent' | 'fitWidth' | 'disabled';
export type Command = 'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox';
export type ConnectorLineEnd = 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle';
export type ConnectorLineType = 'straight' | 'orthogonal';
export type ConnectorPosition = 'start' | 'end';
export type DataLayoutType = 'auto' | 'off' | 'tree' | 'layered';
export type DiagramExportFormat = 'svg' | 'png' | 'jpg';
export type ItemType = 'shape' | 'connector';
export type ModelOperation = 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints' | 'beforeChangeShapeText' | 'changeShapeText' | 'beforeChangeConnectorText' | 'changeConnectorText' | 'resizeShape' | 'moveShape';
export type PanelVisibility = 'auto' | 'visible' | 'collapsed' | 'disabled';
export type RequestEditOperationReason = 'checkUIElementAvailability' | 'modelModification';
export type ShapeCategory = 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom';
export type ShapeType = 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight';
export type ToolboxDisplayMode = 'icons' | 'texts';
export type Units = 'in' | 'cm' | 'px';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxDiagram>;

/**
 * The type of the customCommand event handler&apos;s argument.
 */
export type CustomCommandEvent = {
    /**
     * 
     */
    readonly component: dxDiagram;
    /**
     * 
     */
    readonly element: DxElement;
    /**
     * 
     */
    readonly name: string;
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxDiagram>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxDiagram>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent = EventInfo<dxDiagram> & {
    /**
     * 
     */
    readonly item: Item;
};

/**
 * The type of the itemDblClick event handler&apos;s argument.
 */
export type ItemDblClickEvent = EventInfo<dxDiagram> & {
    /**
     * 
     */
    readonly item: Item;
};

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxDiagram> & ChangedOptionInfo;

/**
 * The type of the requestEditOperation event handler&apos;s argument.
 */
export type RequestEditOperationEvent = EventInfo<dxDiagram> & {
    /**
     * 
     */
    readonly operation: 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints';
    /**
     * 
     */
    readonly args: dxDiagramAddShapeArgs | dxDiagramAddShapeFromToolboxArgs | dxDiagramDeleteShapeArgs | dxDiagramDeleteConnectorArgs | dxDiagramChangeConnectionArgs | dxDiagramChangeConnectorPointsArgs | dxDiagramBeforeChangeShapeTextArgs | dxDiagramChangeShapeTextArgs | dxDiagramBeforeChangeConnectorTextArgs | dxDiagramChangeConnectorTextArgs | dxDiagramResizeShapeArgs | dxDiagramMoveShapeArgs;
    /**
     * 
     */
    readonly reason: RequestEditOperationReason;
    /**
     * 
     */
    allowed?: boolean;
};

/**
 * The type of the requestLayoutUpdate event handler&apos;s argument.
 */
export type RequestLayoutUpdateEvent = EventInfo<dxDiagram> & {
    /**
     * 
     */
    readonly changes: any[];
    /**
     * 
     */
    allowed?: boolean;
};

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxDiagram> & {
    /**
     * 
     */
    readonly items: Array<Item>;
};

export type CustomShapeTemplateData = {
    readonly item: dxDiagramShape;
};

export type CustomShapeToolboxTemplateData = {
    readonly item: dxDiagramShape;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramOptions extends WidgetOptions<dxDiagram> {
    /**
     * Specifies how the Diagram UI component automatically zooms the work area.
     */
    autoZoomMode?: AutoZoomMode;
    /**
     * Configures the context menu&apos;s settings.
     */
    contextMenu?: {
      /**
       * Lists commands in the context menu.
       */
      commands?: Array<CustomCommand | Command>;
      /**
       * Specifies whether the context menu is enabled.
       */
      enabled?: boolean;
    };
    /**
     * Configures the context toolbox&apos;s settings.
     */
    contextToolbox?: {
      /**
       * Specifies the category of shapes that are displayed in the context toolbox.
       */
      category?: ShapeCategory | string;
      /**
       * Specifies how shapes are displayed in the context toolbox.
       */
      displayMode?: ToolboxDisplayMode;
      /**
       * Specifies the context toolbox&apos;s availability.
       */
      enabled?: boolean;
      /**
       * Specifies the number of shape icons in a row.
       */
      shapeIconsPerRow?: number;
      /**
       * Lists the shapes that are displayed in the context toolbox. The built-in shape types are shown in the Shape Types section.
       */
      shapes?: Array<ShapeType> | Array<string>;
      /**
       * Specifies the context toolbox&apos;s width in pixels.
       */
      width?: number;
    };
    /**
     * A function that is executed after a custom command item was clicked and allows you to implement the custom command&apos;s logic.
     */
    onCustomCommand?: ((e: CustomCommandEvent) => void);
    /**
     * Specifies a custom template for shapes.
     */
    customShapeTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeTemplateData) => any);
    /**
     * Specifies a custom template for shapes in the toolbox.
     */
    customShapeToolboxTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeToolboxTemplateData) => any);
    /**
     * Provide access to an array of custom shapes.
     */
    customShapes?: Array<{
      /**
       * Specifies whether a card shape&apos;s image can be edited.
       */
      allowEditImage?: boolean;
      /**
       * Specifies whether the shape&apos;s text can be edited.
       */
      allowEditText?: boolean;
      /**
       * Specifies whether the shape can be resized.
       */
      allowResize?: boolean;
      /**
       * Specifies the shape background image&apos;s fractional height.
       */
      backgroundImageHeight?: number;
      /**
       * Specifies the shape background image&apos;s left offset.
       */
      backgroundImageLeft?: number;
      /**
       * Specifies the shape background image&apos;s top offset.
       */
      backgroundImageTop?: number;
      /**
       * Specifies the shape background image&apos;s URL.
       */
      backgroundImageUrl?: string;
      /**
       * Specifies the shape image displayed in the toolbox.
       */
      backgroundImageToolboxUrl?: string;
      /**
       * Specifies the shape background image&apos;s fractional width.
       */
      backgroundImageWidth?: number;
      /**
       * Specifies the base shape type for the custom shape. The built-in shape types are shown in the Shape Types section.
       */
      baseType?: ShapeType | string;
      /**
       * Specifies a category to which the custom shape belongs.
       */
      category?: string;
      /**
       * An array of the shape&apos;s connection points.
       */
      connectionPoints?: Array<{
        /**
         * Specifies the horizontal offset.
         */
        x?: number;
        /**
         * Specifies the vertical offset.
         */
        y?: number;
      }>;
      /**
       * Specifies the initial height of the shape.
       */
      defaultHeight?: number;
      /**
       * Specifies the URL of an image displayed in a card shape.
       */
      defaultImageUrl?: string;
      /**
       * Specifies the initial text of the shape.
       */
      defaultText?: string;
      /**
       * Specifies the initial width of the shape.
       */
      defaultWidth?: number;
      /**
       * Specifies the shape image&apos;s fractional height.
       */
      imageHeight?: number;
      /**
       * Specifies the shape image&apos;s left offset.
       */
      imageLeft?: number;
      /**
       * Specifies the shape image&apos;s top offset.
       */
      imageTop?: number;
      /**
       * Specifies the shape image&apos;s fractional width.
       */
      imageWidth?: number;
      /**
       * Specifies whether the shape maintains its width-to-height ratio on auto resize.
       */
      keepRatioOnAutoSize?: boolean;
      /**
       * Specifies the maximum height of the shape.
       */
      maxHeight?: number;
      /**
       * Specifies the maximum width of the shape.
       */
      maxWidth?: number;
      /**
       * Specifies the maximum height of the shape.
       */
      minHeight?: number;
      /**
       * Specifies the minimum width of the shape.
       */
      minWidth?: number;
      /**
       * Specifies a custom template for the shape.
       */
      template?: template | ((container: DxElement<SVGElement>, data: CustomShapeTemplateData) => any);
      /**
       * Specifies the shape template&apos;s fractional height.
       */
      templateHeight?: number;
      /**
       * Specifies the shape template&apos;s left offset.
       */
      templateLeft?: number;
      /**
       * Specifies the shape template&apos;s top offset.
       */
      templateTop?: number;
      /**
       * Specifies the shape template&apos;s fractional width.
       */
      templateWidth?: number;
      /**
       * Specifies the shape text container&apos;s height.
       */
      textHeight?: number;
      /**
       * Specifies the shape text&apos;s left offset.
       */
      textLeft?: number;
      /**
       * Specifies the shape text&apos;s top offset.
       */
      textTop?: number;
      /**
       * Specifies the shape text container&apos;s width.
       */
      textWidth?: number;
      /**
       * Specifies the shape&apos;s tooltip in the toolbox panel.
       */
      title?: string;
      /**
       * Specifies a custom template for the shape in the toolbox.
       */
      toolboxTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeToolboxTemplateData) => any);
      /**
       * Specifies the aspect ratio of the shape in the toolbox.
       */
      toolboxWidthToHeightRatio?: number;
      /**
       * Specifies the custom shape&apos;s identifier.
       */
      type?: string;
    }>;
    /**
     * Configures default item properties.
     */
    defaultItemProperties?: {
      /**
       * Specifies a default item style.
       */
      style?: Object;
      /**
       * Specifies an item&apos;s default text style.
       */
      textStyle?: Object;
      /**
       * Specifies the default type of a connector.
       */
      connectorLineType?: ConnectorLineType;
      /**
       * Specifies the default tip of a connector&apos;s start point.
       */
      connectorLineStart?: ConnectorLineEnd;
      /**
       * Specifies the default tip of a connector&apos;s end point.
       */
      connectorLineEnd?: ConnectorLineEnd;
      /**
       * Specifies the default minimum width of a shape.
       */
      shapeMinWidth?: number | undefined;
      /**
       * Specifies the default maximum width of a shape.
       */
      shapeMaxWidth?: number | undefined;
      /**
       * Specifies the default minimum height of a shape.
       */
      shapeMinHeight?: number | undefined;
      /**
       * Specifies the default maximum height of a shape.
       */
      shapeMaxHeight?: number | undefined;
    };
    /**
     * Specifies which editing operations a user can perform.
     */
    editing?: {
      /**
       * Specifies whether a user can add a shape.
       */
      allowAddShape?: boolean;
      /**
       * Specifies whether a user can delete a shape.
       */
      allowDeleteShape?: boolean;
      /**
       * Specifies whether a user can delete a connector.
       */
      allowDeleteConnector?: boolean;
      /**
       * Specifies whether a user can change a connection.
       */
      allowChangeConnection?: boolean;
      /**
       * Specifies whether a user can change connector points.
       */
      allowChangeConnectorPoints?: boolean;
      /**
       * Specifies whether a user can change a connector&apos;s text.
       */
      allowChangeConnectorText?: boolean;
      /**
       * Specifies whether a user can change a shape&apos;s text.
       */
      allowChangeShapeText?: boolean;
      /**
       * Specifies whether a user can resize a shape.
       */
      allowResizeShape?: boolean;
      /**
       * Specifies whether a user can move a shape.
       */
      allowMoveShape?: boolean;
    };
    /**
     * Allows you to bind the collection of diagram edges to a data source. For more information, see the Data Binding section.
     */
    edges?: {
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s custom data.
       */
      customDataExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Binds the edges collection to the specified data. Specify this property if you use node and edge data sources.
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s start node key.
       */
      fromExpr?: string | ((data: any, value?: any) => any);
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s line start tip.
       */
      fromLineEndExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns an index of a shape connection point where an edge starts.
       */
      fromPointIndexExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s key.
       */
      keyExpr?: string | ((data: any, value?: any) => any);
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s line type.
       */
      lineTypeExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression whose Boolean value indicates whether an edge is locked.
       */
      lockedExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s key points.
       */
      pointsExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns an edge style.
       */
      styleExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns edge text.
       */
      textExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s text style.
       */
      textStyleExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s end node key.
       */
      toExpr?: string | ((data: any, value?: any) => any);
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s line end tip.
       */
      toLineEndExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns an index of a shape connection point where an edge ends.
       */
      toPointIndexExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns an edge&apos;s z-index.
       */
      zIndexExpr?: string | ((data: any, value?: any) => any) | undefined;
    };
    /**
     * Configures export settings.
     */
    export?: {
      /**
       * Specifies the name of the file to which the diagram is exported.
       */
      fileName?: string;
    };
    /**
     * Specifies whether or not to display the UI component in full-screen mode.
     */
    fullScreen?: boolean;
    /**
     * Specifies the grid pitch.
     */
    gridSize?: number | {
      /**
       * An array that specifies the _Grid Size_ combobox items on &apos;Properties&apos; panel.
       */
      items?: Array<number>;
      /**
       * Specifies the grid&apos;s pitch.
       */
      value?: number;
    };
    /**
     * Allows you to bind the collection of diagram nodes to a data source. For more information, see the Data Binding section.
     */
    nodes?: {
      /**
       * Specifies an auto-layout algorithm that the UI component uses to build a diagram.
       */
      autoLayout?: DataLayoutType | {
        /**
         * Specifies the diagram layout orientation.
         */
        orientation?: Orientation;
        /**
         * Specifies an auto-layout algorithm that is used to automatically arrange shapes.
         */
        type?: DataLayoutType;
      };
      /**
       * Specifies whether or not a shape size is automatically changed to fit the text when the UI component is bound to a data source.
       */
      autoSizeEnabled?: boolean;
      /**
       * Specifies the name of a data source field or an expression that returns a key of a node&apos;s parent container node.
       */
      containerKeyExpr?: string | ((data: any, value?: any) => any);
      /**
        * Specifies the name of a data source field or an expression that returns a container&apos;s nested items.
        */
       containerChildrenExpr?: string | ((data: any, value?: any) => any) | undefined;
       /**
       * Specifies the name of a data source field or an expression that returns a node&apos;s custom data.
       */
      customDataExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Binds the nodes collection to the specified data. For more information, see the Data Binding section.
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * Specifies the name of a data source field or an expression that returns a node&apos;s height.
       */
      heightExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns an image URL or Base64 encoded image for a node.
       */
      imageUrlExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns a node&apos;s child items.
       */
      itemsExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns node keys.
       */
      keyExpr?: string | ((data: any, value?: any) => any);
      /**
       * Specifies the name of a data source field or an expression that returns the x-coordinate of a node&apos;s left border.
       */
      leftExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression whose Boolean value indicates whether a node is locked.
       */
      lockedExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns a parent node key for a node.
       */
      parentKeyExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns a node style.
       */
      styleExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns node texts.
       */
      textExpr?: string | ((data: any, value?: any) => any);
      /**
       * Specifies the name of a data source field or an expression that returns a node&apos;s text style.
       */
      textStyleExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns the y-coordinate of a node&apos;s top border.
       */
      topExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns the shape type for a node.
       */
      typeExpr?: string | ((data: any, value?: any) => any);
      /**
       * Specifies the name of a data source field or an expression that returns a node&apos;s width.
       */
      widthExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * Specifies the name of a data source field or an expression that returns a node&apos;s z-index.
       */
      zIndexExpr?: string | ((data: any, value?: any) => any) | undefined;
    };
    /**
     * Indicates whether diagram content has unsaved changes.
     */
    hasChanges?: boolean;
    /**
     * A function that is executed after a shape or connector is clicked.
     */
    onItemClick?: ((e: ItemClickEvent) => void);
    /**
     * A function that is executed after a shape or connector is double-clicked.
     */
    onItemDblClick?: ((e: ItemDblClickEvent) => void);
    /**
     * A function that is executed after the selection is changed in the Diagram.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * A function that allows you to prohibit an edit operation at run time.
     */
    onRequestEditOperation?: ((e: RequestEditOperationEvent) => void);
    /**
     * A function that allows you to specify whether or not the UI component should reapply its auto layout after diagram data is reloaded.
     */
    onRequestLayoutUpdate?: ((e: RequestLayoutUpdateEvent) => void);
    /**
     * Specifies the color of a diagram page.
     */
    pageColor?: string;
    /**
     * Specifies the page orientation.
     */
    pageOrientation?: PageOrientation;
    /**
     * Specifies a size of pages.
     */
    pageSize?: {
      /**
       * Specifies the page height.
       */
      height?: number;
      /**
       * An array that specifies the page size items in the _Page Size_ combobox on _Properties Panel_.
       */
      items?: Array<{
        /**
         * Specifies the page height.
         */
        height?: number;
        /**
         * Specifies the display text.
         */
        text?: string;
        /**
         * Specifies the page width.
         */
        width?: number;
      }>;
      /**
       * Specifies the page width.
       */
      width?: number;
    };
    /**
     * Configures the Properties panel settings.
     */
    propertiesPanel?: {
      /**
       * Contains an array of tabs in the Properties panel.
       */
      tabs?: Array<{
        /**
         * Lists commands in a tab.
         */
        commands?: Array<CustomCommand | Command>;
        /**
         * Contains an array of command groups in the tab.
         */
        groups?: Array<{
          /**
           * Lists commands in a group.
           */
          commands?: Array<CustomCommand | Command>;
          /**
           * Specifies a title of the group.
           */
          title?: string;
        }>;
        /**
         * Specifies the tab&apos;s title.
         */
        title?: string;
      }>;
      /**
       * Specifies the panel&apos;s visibility.
       */
      visibility?: PanelVisibility;
    };
    /**
     * Specifies whether the diagram is read-only.
     */
    readOnly?: boolean;
    /**
     * Specifies whether grid lines are visible.
     */
    showGrid?: boolean;
    /**
     * Switch the Diagram UI component to simple view mode.
     */
    simpleView?: boolean;
    /**
      * Specifies whether or not the UI component uses native scrolling.
      */
     useNativeScrolling?: boolean;
    /**
     * Specifies whether diagram elements should snap to grid lines.
     */
    snapToGrid?: boolean;
    /**
     * Configures the main toolbar settings.
     */
    mainToolbar?: {
      /**
       * Lists commands in the toolbar.
       */
      commands?: Array<CustomCommand | Command>;
      /**
       * Specifies the toolbar&apos;s visibility.
       */
      visible?: boolean;
    };
    /**
     * Configures the history toolbar&apos;s settings.
     */
    historyToolbar?: {
      /**
       * Lists commands in the history toolbar.
       */
      commands?: Array<CustomCommand | Command>;
      /**
       * Specifies the history toolbar&apos;s visibility.
       */
      visible?: boolean;
    };
    /**
     * Configures the view toolbar settings.
     */
    viewToolbar?: {
      /**
       * Lists commands in the toolbar.
       */
      commands?: Array<CustomCommand | Command>;
      /**
       * Specifies the view toolbar&apos;s visibility.
       */
      visible?: boolean;
    };
    /**
     * Configures the toolbox settings.
     */
    toolbox?: {
      /**
       * Lists toolbox groups.
       */
      groups?: Array<{
        /**
         * Specifies the category of shapes that are displayed in the group.
         */
        category?: ShapeCategory | string;
        /**
         * Specifies how shapes are displayed in the toolbox.
         */
        displayMode?: ToolboxDisplayMode;
        /**
         * Specifies whether the group is expanded.
         */
        expanded?: boolean;
        /**
         * Lists the shapes in the group. The built-in shape types are shown in the Shape Types section.
         */
        shapes?: Array<ShapeType> | Array<string>;
        /**
         * Specifies the group title in the toolbox.
         */
        title?: string;
      }> | Array<ShapeCategory>;
      /**
       * Specifies the number of shape icons in a row.
       */
      shapeIconsPerRow?: number;
      /**
       * Specifies whether the search box is visible.
       */
      showSearch?: boolean;
      /**
       * Specifies the toolbar&apos;s visibility.
       */
      visibility?: PanelVisibility;
      /**
       * Specifies the toolbox&apos;s width in pixels.
       */
      width?: number | undefined;
    };
    /**
     * Specifies the measurement unit for size properties.
     */
    units?: Units;
    /**
     * Specifies the measurement unit that is displayed in user interface elements.
     */
    viewUnits?: Units;
    /**
     * Specifies the zoom level.
     */
    zoomLevel?: number | {
      /**
       * An array that specifies the zoom level items in the _Zoom Level_ combobox on &apos;Properties&apos; panel.
       */
      items?: Array<number>;
      /**
       * Specifies the zoom level.
       */
      value?: number | undefined;
    };
}
/**
 * The Diagram UI component provides a visual interface to help you design new and modify existing diagrams.
 */
export default class dxDiagram extends Widget<dxDiagramOptions> {
    /**
     * Gets the DataSource instance.
     */
    getNodeDataSource(): DataSource;
    /**
     * Returns the DataSource instance.
     */
    getEdgeDataSource(): DataSource;
    /**
     * Returns a shape or connector object specified by its key.
     */
    getItemByKey(key: Object): Item;
    /**
     * Returns a shape or connector object specified by its internal identifier.
     */
    getItemById(id: string): Item;
    /**
      * Returns an array of diagram items.
      */
     getItems(): Array<Item>;
    /**
      * Returns an array of selected diagram items.
      */
     getSelectedItems(): Array<Item>;
    /**
      * Selects the specified items.
      */
     setSelectedItems(items: Array<Item>): void;
    /**
      * Scrolls the view area to the specified item.
      */
     scrollToItem(item: Item): void;
    /**
     * Exports the diagram data to a JSON object.
     */
    export(): string;
    /**
     * Exports the diagram to an image format.
     */
    exportTo(format: DiagramExportFormat, callback: Function): void;
    /**
     * Imports the diagram data.
     */
    import(data: string, updateExistingItemsOnly?: boolean): void;
    /**
     * Updates the diagram toolboxes.
     */
    updateToolbox(): void;
    /**
      * Fits the diagram content into the work area. The maximum scale is 100%.
      */
     fitToContent(): void;
    /**
      * Fits the diagram content&apos;s width into the work area width. The maximum scale is 100%.
      */
     fitToWidth(): void;
}

/**
 * An object that provides information about a connector in the Diagram UI component.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramConnector extends Item {
    /**
     * Specifies the connector&apos;s start node key.
     */
    fromKey?: any;
    /**
     * Gets the connector&apos;s start node identifier.
     */
    fromId?: string;
    /**
     * The index of a shape connection point where the connector starts.
     */
    fromPointIndex?: number;
    /**
     * Gets the connector&apos;s key points.
     */
    points?: Array<{
      /**
       * A horizontal position of the point.
       */
      x?: number;
      /**
       * A vertical position of the point.
       */
      y?: number;
    }>;

    /**
     * Specifies the connector&apos;s text.
     */
    texts?: Array<string>;
    /**
     * Specifies the connector&apos;s end node key.
     */
    toKey?: any;
    /**
     * Gets the connector&apos;s end node identifier.
     */
    toId?: string;
    /**
     * The index of the shape connection point where the connector ends.
     */
    toPointIndex?: number;
}

/**
 * An object that provides information about an item (shape or connector) in the Diagram UI component.
 */
export type Item = dxDiagramItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramItem {
    /**
     * Returns the data item that is bound to the diagram item.
     */
    dataItem?: any;
    /**
     * Specifies the item&apos;s internal identifier.
     */
    id?: string;
    /**
     * Gets the item&apos;s key from a data source.
     */
    key?: Object;
    /**
     * Returns the type of the item.
     */
    itemType?: ItemType;
}

/**
 * An object that provides information about a shape in the Diagram UI component.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramShape extends Item {
    /**
     * Specifies the shape&apos;s text.
     */
    text?: string;
    /**
     * Specifies the shape type. The built-in shape types are shown in the Shape Types section.
     */
    type?: ShapeType | string;
    /**
     * Specifies the position of the top left shape corner relative to the top left corner of the diagram work area.
     */
    position?: {
      /**
       * The horizontal shape position specified in units.
       */
      x?: number;
      /**
       * The vertical shape position specified in units.
       */
      y?: number;
    };

    /**
     * Specifies the shape size.
     */
    size?: {
      /**
       * The shape height specified in units.
       */
      height?: number;
      /**
       * The shape width specified in units.
       */
      width?: number;
    };
    /**
     * Gets an array of attached connector identifiers.
     */
    attachedConnectorIds?: Array<String>;
    /**
     * Gets the identifier of the container that stores the shape.
     */
    containerId?: string;
    /**
     * Gets identifiers of shapes stored in the container.
     */
    containerChildItemIds?: Array<String>;
    /**
     * Gets whether the container is expanded.
     */
    containerExpanded?: boolean;
}

/**
 * @deprecated Use CustomCommand instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxDiagramCustomCommand = CustomCommand;

/**
 * An object that provides information about a custom command in the Diagram UI component.
 */
export type CustomCommand = {
    /**
     * Specifies the custom command&apos;s identifier.
     */
    name?: string | Command;
    /**
     * Specifies the custom command&apos;s text and tooltip text.
     */
    text?: string;
    /**
     * Specifies the custom command&apos;s icon.
     */
    icon?: string;
    /**
     * Lists command sub items.
     */
    items?: Array<CustomCommand | Command>;
    /**
     * Specifies a location for the command or separator on the main toolbar.
     */
    location?: ToolbarItemLocation;
};

/**
 * Contains information about the processed shape.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramAddShapeArgs {
    /**
     * The processed shape.
     */
    shape?: dxDiagramShape;
    /**
     * A position where the shape is being added.
     */
    position?: {
      /**
       * A horizontal position where the shape is being added.
       */
      x?: number;
      /**
       * A vertical position where the shape is being added.
       */
      y?: number;
    };
}

/**
 * Contains information about the processed shape.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramAddShapeFromToolboxArgs {
  /**
   * The type of the processed shape.
   */
  shapeType?: ShapeType | string;
}

/**
 * Contains information about the processed shape.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramDeleteShapeArgs {
  /**
   * The processed shape.
   */
  shape?: dxDiagramShape;
}

/**
 * Contains information about the processed connector.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramDeleteConnectorArgs {
  /**
   * The processed connector.
   */
  connector?: dxDiagramConnector;
}

/**
 * Contains information about the processed connection.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramChangeConnectionArgs {
  /**
   * The new connected shape.
   */
  newShape?: dxDiagramShape;
  /**
   * The previous connected shape.
   */
  oldShape?: dxDiagramShape;
  /**
   * The processed connector.
   */
  connector?: dxDiagramConnector;
  /**
   * The index of the processed point in the shape&apos;s connection point collection.
   */
  connectionPointIndex?: number;
  /**
   * The position of the connector in the processed point.
   */
  connectorPosition?: ConnectorPosition;
}

/**
 * Contains information about the processed connector.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramChangeConnectorPointsArgs {
  /**
   * The processed connector.
   */
  connector?: dxDiagramConnector;
  /**
   * The array of new connection points.
   */
  newPoints?: Array<{
    /**
     * A horizontal position of the point.
     */
    x?: number;
    /**
     * A vertical position of the point.
     */
    y?: number;
  }>;
  /**
   * The array of previous connection points.
   */
  oldPoints?: Array<{
    /**
     * A horizontal position of the point.
     */
    x?: number;
    /**
     * A vertical position of the point.
     */
    y?: number;
  }>;
}

/**
 * Contains information about the processed shape.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramBeforeChangeShapeTextArgs {
  /**
   * The processed shape.
   */
  shape?: dxDiagramShape;
}

/**
 * Contains information about the processed shape.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramChangeShapeTextArgs {
  /**
   * The processed shape.
   */
  shape?: dxDiagramShape;
  /**
   * The new shape text.
   */
  text?: string;
}

/**
 * Contains information about the processed connector.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramBeforeChangeConnectorTextArgs {
  /**
   * The processed connector.
   */
  connector?: dxDiagramConnector;
  /**
   * The index of the processed text in the connector&apos;s texts collection.
   */
  index?: number;
}

/**
 * Contains information about the processed connector.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramChangeConnectorTextArgs {
  /**
   * The processed connector.
   */
  connector?: dxDiagramConnector;
  /**
   * The index of the processed text in the connector&apos;s texts collection.
   */
  index?: number;
  /**
   * The new connector text.
   */
  text?: string;
}

/**
 * Contains information about the processed shape.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramResizeShapeArgs {
  /**
   * The processed shape.
   */
  shape?: dxDiagramShape;
  /**
   * The new shape size.
   */
  newSize?: {
    /**
     * The new shape height.
     */
    height?: number;
    /**
     * The new shape width.
     */
    width?: number;
  };
  /**
   * The previous shape size.
   */
  oldSize?: {
    /**
     * The previous shape height.
     */
    height?: number;
    /**
     * The previous shape width.
     */
    width?: number;
  };
}

/**
 * Contains information about the processed shape.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDiagramMoveShapeArgs {
  /**
   * The processed shape.
   */
  shape?: dxDiagramShape;
  /**
   * The new shape position.
   */
  newPosition?: {
      /**
       * The new horizontal shape position specified in units.
       */
      x?: number;
      /**
       * The new vertical shape position specified in units.
       */
      y?: number;
  };
  /**
   * The previous shape position.
   */
  oldPosition?: {
      /**
       * The previous horizontal shape position specified in units.
       */
      x?: number;
      /**
       * The previous vertical shape position specified in units.
       */
      y?: number;
  };
}

export type Properties = dxDiagramOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxDiagramOptions;

// #region deprecated in v24.1

/**
 * @deprecated Use AutoZoomMode instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramAutoZoomMode = AutoZoomMode;

/**
 * @deprecated Use Command instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramCommand = Command;

/**
 * @deprecated Use ConnectorLineEnd instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramConnectorLineEnd = ConnectorLineEnd;

/**
 * @deprecated Use ConnectorLineType instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramConnectorLineType = ConnectorLineType;

/**
 * @deprecated Use ConnectorPosition instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramConnectorPosition = ConnectorPosition;

/**
 * @deprecated Use DataLayoutType instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramDataLayoutType = DataLayoutType;

// /** @deprecated Use ExportFormat instead */
// export type DiagramExportFormat = ExportFormat;
// conflics with viz ExportFormat

/**
 * @deprecated Use ItemType instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramItemType = ItemType;

/**
 * @deprecated Use ModelOperation instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramModelOperation = ModelOperation;

/**
 * @deprecated Use PanelVisibility instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramPanelVisibility = PanelVisibility;

/**
 * @deprecated Use RequestEditOperationReason instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramRequestEditOperationReason = RequestEditOperationReason;

/**
 * @deprecated Use ShapeCategory instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramShapeCategory = ShapeCategory;

/**
 * @deprecated Use ShapeType instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramShapeType = ShapeType;

/**
 * @deprecated Use ToolboxDisplayMode instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramToolboxDisplayMode = ToolboxDisplayMode;

/**
 * @deprecated Use Units instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DiagramUnits = Units;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onCustomCommand' | 'onItemClick' | 'onItemDblClick' | 'onRequestEditOperation' | 'onRequestLayoutUpdate' | 'onSelectionChanged'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed when the UI component is rendered and each time the component is repainted.
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
