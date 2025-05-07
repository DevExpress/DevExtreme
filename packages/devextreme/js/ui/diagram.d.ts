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

/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type AutoZoomMode = 'fitContent' | 'fitWidth' | 'disabled';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type Command = 'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type ConnectorLineEnd = 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type ConnectorLineType = 'straight' | 'orthogonal';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type ConnectorPosition = 'start' | 'end';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type DataLayoutType = 'auto' | 'off' | 'tree' | 'layered';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type DiagramExportFormat = 'svg' | 'png' | 'jpg';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type ItemType = 'shape' | 'connector';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type ModelOperation = 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints' | 'beforeChangeShapeText' | 'changeShapeText' | 'beforeChangeConnectorText' | 'changeConnectorText' | 'resizeShape' | 'moveShape';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type PanelVisibility = 'auto' | 'visible' | 'collapsed' | 'disabled';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type RequestEditOperationReason = 'checkUIElementAvailability' | 'modelModification';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type ShapeCategory = 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type ShapeType = 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type ToolboxDisplayMode = 'icons' | 'texts';
/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type Units = 'in' | 'cm' | 'px';

/**
 * @docid _ui_diagram_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxDiagram>;

/**
 * @docid _ui_diagram_CustomCommandEvent
 * @public
 * @type object
 */
export type CustomCommandEvent = {
    /**
     * @docid _ui_diagram_CustomCommandEvent.component
     * @type this
     */
    readonly component: dxDiagram;
    /** @docid _ui_diagram_CustomCommandEvent.element */
    readonly element: DxElement;
    /** @docid _ui_diagram_CustomCommandEvent.name */
    readonly name: string;
};

/**
 * @docid _ui_diagram_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxDiagram>;

/**
 * @docid _ui_diagram_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxDiagram>;

/**
 * @docid _ui_diagram_ItemClickEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ItemClickEvent = EventInfo<dxDiagram> & {
    /**
     * @docid _ui_diagram_ItemClickEvent.item
     * @type dxDiagramItem
     */
    readonly item: Item;
};

/**
 * @docid _ui_diagram_ItemDblClickEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ItemDblClickEvent = EventInfo<dxDiagram> & {
    /**
     * @docid _ui_diagram_ItemDblClickEvent.item
     * @type dxDiagramItem
     */
    readonly item: Item;
};

/**
 * @docid _ui_diagram_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxDiagram> & ChangedOptionInfo;

/**
 * @docid _ui_diagram_RequestEditOperationEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type RequestEditOperationEvent = EventInfo<dxDiagram> & {
    /** @docid _ui_diagram_RequestEditOperationEvent.operation */
    readonly operation: 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints';
    /** @docid _ui_diagram_RequestEditOperationEvent.args */
    readonly args: dxDiagramAddShapeArgs | dxDiagramAddShapeFromToolboxArgs | dxDiagramDeleteShapeArgs | dxDiagramDeleteConnectorArgs | dxDiagramChangeConnectionArgs | dxDiagramChangeConnectorPointsArgs | dxDiagramBeforeChangeShapeTextArgs | dxDiagramChangeShapeTextArgs | dxDiagramBeforeChangeConnectorTextArgs | dxDiagramChangeConnectorTextArgs | dxDiagramResizeShapeArgs | dxDiagramMoveShapeArgs;
    /** @docid _ui_diagram_RequestEditOperationEvent.reason */
    readonly reason: RequestEditOperationReason;
    /** @docid _ui_diagram_RequestEditOperationEvent.allowed */
    allowed?: boolean;
};

/**
 * @docid _ui_diagram_RequestLayoutUpdateEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type RequestLayoutUpdateEvent = EventInfo<dxDiagram> & {
    /**
     * @docid _ui_diagram_RequestLayoutUpdateEvent.changes
     * @type Array<any>
     */
    readonly changes: any[];
    /** @docid _ui_diagram_RequestLayoutUpdateEvent.allowed */
    allowed?: boolean;
};

/**
 * @docid _ui_diagram_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectionChangedEvent = EventInfo<dxDiagram> & {
    /**
     * @docid _ui_diagram_SelectionChangedEvent.items
     * @type Array<dxDiagramItem>
     */
    readonly items: Array<Item>;
};

/** @public */
export type CustomShapeTemplateData = {
    readonly item: dxDiagramShape;
};

/** @public */
export type CustomShapeToolboxTemplateData = {
    readonly item: dxDiagramShape;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxDiagramOptions extends WidgetOptions<dxDiagram> {
    /**
     * @docid
     * @default "disabled"
     * @public
     */
    autoZoomMode?: AutoZoomMode;
    /**
     * @docid
     * @default {}
     * @public
     */
    contextMenu?: {
      /**
       * @docid
       * @default undefined
       */
      commands?: Array<CustomCommand | Command>;
      /**
       * @docid
       * @default true
       */
      enabled?: boolean;
    };
    /**
     * @docid
     * @default {}
     * @public
     */
    contextToolbox?: {
      /**
       * @docid
       */
      category?: ShapeCategory | string;
      /**
       * @docid
       */
      displayMode?: ToolboxDisplayMode;
      /**
       * @docid
       * @default true
       */
      enabled?: boolean;
      /**
       * @docid
       * @default 4
       */
      shapeIconsPerRow?: number;
      /**
       * @docid
       */
      shapes?: Array<ShapeType> | Array<string>;
      /**
       * @docid
       * @default 152
       */
      width?: number;
    };
    /**
     * @docid
     * @type_function_param1 e:{ui/diagram:CustomCommandEvent}
     * @action
     * @public
     */
    onCustomCommand?: ((e: CustomCommandEvent) => void);
    /**
     * @docid
     * @type_function_param1 container:dxSVGElement
     * @type_function_param2 data:object
     * @type_function_return void
     * @public
     */
    customShapeTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeTemplateData) => any);
    /**
     * @docid
     * @type_function_param1 container:dxSVGElement
     * @type_function_param2 data:object
     * @type_function_return void
     * @public
     */
    customShapeToolboxTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeToolboxTemplateData) => any);
    /**
     * @docid
     * @default []
     * @public
     */
    customShapes?: Array<{
      /**
       * @docid
       */
      allowEditImage?: boolean;
      /**
       * @docid
       */
      allowEditText?: boolean;
      /**
       * @docid
       */
      allowResize?: boolean;
      /**
       * @docid
       */
      backgroundImageHeight?: number;
      /**
       * @docid
       */
      backgroundImageLeft?: number;
      /**
       * @docid
       */
      backgroundImageTop?: number;
      /**
       * @docid
       */
      backgroundImageUrl?: string;
      /**
       * @docid
       */
      backgroundImageToolboxUrl?: string;
      /**
       * @docid
       */
      backgroundImageWidth?: number;
      /**
       * @docid
       */
      baseType?: ShapeType | string;
      /**
       * @docid
       */
      category?: string;
      /**
       * @docid
       */
      connectionPoints?: Array<{
        /**
         * @docid
         */
        x?: number;
        /**
         * @docid
         */
        y?: number;
      }>;
      /**
       * @docid
       */
      defaultHeight?: number;
      /**
       * @docid
       */
      defaultImageUrl?: string;
      /**
       * @docid
       */
      defaultText?: string;
      /**
       * @docid
       */
      defaultWidth?: number;
      /**
       * @docid
       */
      imageHeight?: number;
      /**
       * @docid
       */
      imageLeft?: number;
      /**
       * @docid
       */
      imageTop?: number;
      /**
       * @docid
       */
      imageWidth?: number;
      /**
       * @docid
       */
      keepRatioOnAutoSize?: boolean;
      /**
       * @docid
       */
      maxHeight?: number;
      /**
       * @docid
       */
      maxWidth?: number;
      /**
       * @docid
       */
      minHeight?: number;
      /**
       * @docid
       */
      minWidth?: number;
      /**
       * @docid
       * @type_function_param1 container:dxSVGElement
       * @type_function_param2 data:object
       * @type_function_return void
       */
      template?: template | ((container: DxElement<SVGElement>, data: CustomShapeTemplateData) => any);
      /**
       * @docid
       */
      templateHeight?: number;
      /**
       * @docid
       */
      templateLeft?: number;
      /**
       * @docid
       */
      templateTop?: number;
      /**
       * @docid
       */
      templateWidth?: number;
      /**
       * @docid
       */
      textHeight?: number;
      /**
       * @docid
       */
      textLeft?: number;
      /**
       * @docid
       */
      textTop?: number;
      /**
       * @docid
       */
      textWidth?: number;
      /**
       * @docid
       */
      title?: string;
      /**
       * @docid
       * @type_function_param1 container:dxSVGElement
       * @type_function_param2 data:object
       * @type_function_return void
       */
      toolboxTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeToolboxTemplateData) => any);
      /**
       * @docid
       */
      toolboxWidthToHeightRatio?: number;
      /**
       * @docid
       */
      type?: string;
    }>;
    /**
     * @docid
     * @default {}
     * @public
     */
    defaultItemProperties?: {
      /**
       * @docid
       */
      style?: Object;
      /**
       * @docid
       */
      textStyle?: Object;
      /**
       * @docid
       * @default 'orthogonal'
       */
      connectorLineType?: ConnectorLineType;
      /**
       * @docid
       * @default 'none'
       */
      connectorLineStart?: ConnectorLineEnd;
      /**
       * @docid
       * @default 'arrow'
       */
      connectorLineEnd?: ConnectorLineEnd;
      /**
       * @docid
       * @default undefined
       */
      shapeMinWidth?: number | undefined;
      /**
       * @docid
       * @default undefined
       */
      shapeMaxWidth?: number | undefined;
      /**
       * @docid
       * @default undefined
       */
      shapeMinHeight?: number | undefined;
      /**
       * @docid
       * @default undefined
       */
      shapeMaxHeight?: number | undefined;
    };
    /**
     * @docid
     * @default {}
     * @public
     */
    editing?: {
      /**
       * @docid
       * @default true
       */
      allowAddShape?: boolean;
      /**
       * @docid
       * @default true
       */
      allowDeleteShape?: boolean;
      /**
       * @docid
       * @default true
       */
      allowDeleteConnector?: boolean;
      /**
       * @docid
       * @default true
       */
      allowChangeConnection?: boolean;
      /**
       * @docid
       * @default true
       */
      allowChangeConnectorPoints?: boolean;
      /**
       * @docid
       * @default true
       */
      allowChangeConnectorText?: boolean;
      /**
       * @docid
       * @default true
       */
      allowChangeShapeText?: boolean;
      /**
       * @docid
       * @default true
       */
      allowResizeShape?: boolean;
      /**
       * @docid
       * @default true
       */
      allowMoveShape?: boolean;
    };
    /**
     * @docid
     * @default null
     * @public
     */
    edges?: {
      /**
       * @docid
       * @default undefined
       */
      customDataExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default "from"
       */
      fromExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      fromLineEndExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      fromPointIndexExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      lineTypeExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      lockedExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      pointsExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      styleExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      textExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      textStyleExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default "to"
       */
      toExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      toLineEndExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      toPointIndexExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      zIndexExpr?: string | ((data: any, value?: any) => any) | undefined;
    };
    /**
     * @docid
     * @public
     */
    export?: {
      /**
       * @docid
       * @default "Diagram"
       */
      fileName?: string;
    };
    /**
     * @docid
     * @default false
     * @public
     */
    fullScreen?: boolean;
    /**
     * @docid
     * @public
     */
    gridSize?: number | {
      /**
       * @docid
       */
      items?: Array<number>;
      /**
       * @docid
       * @fires dxDiagramOptions.onOptionChanged
       */
      value?: number;
    };
    /**
     * @docid
     * @default null
     * @public
     */
    nodes?: {
      /**
       * @docid
       * @default "auto"
       */
      autoLayout?: DataLayoutType | {
        /**
         * @docid
         */
        orientation?: Orientation;
        /**
         * @docid
         */
        type?: DataLayoutType;
      };
      /**
       * @docid
       * @default true
       */
      autoSizeEnabled?: boolean;
      /**
       * @docid
       * @default "containerKey"
       */
      containerKeyExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
       containerChildrenExpr?: string | ((data: any, value?: any) => any) | undefined;
       /**
       * @docid
       * @default undefined
       */
      customDataExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default undefined
       */
      heightExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      imageUrlExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      itemsExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      leftExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      lockedExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      parentKeyExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      styleExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default "text"
       */
      textExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      textStyleExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      topExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default "type"
       */
      typeExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      widthExpr?: string | ((data: any, value?: any) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      zIndexExpr?: string | ((data: any, value?: any) => any) | undefined;
    };
    /**
     * @docid
     * @default false
     * @public
     */
    hasChanges?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/diagram:ItemClickEvent}
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/diagram:ItemDblClickEvent}
     * @action
     * @public
     */
    onItemDblClick?: ((e: ItemDblClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/diagram:SelectionChangedEvent}
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/diagram:RequestEditOperationEvent}
     * @action
     * @public
     */
    onRequestEditOperation?: ((e: RequestEditOperationEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/diagram:RequestLayoutUpdateEvent}
     * @action
     * @public
     */
    onRequestLayoutUpdate?: ((e: RequestLayoutUpdateEvent) => void);
    /**
     * @docid
     * @default "white"
     * @public
     */
    pageColor?: string;
    /**
     * @docid
     * @default "portrait"
     * @public
     */
    pageOrientation?: PageOrientation;
    /**
     * @docid
     * @public
     */
    pageSize?: {
      /**
       * @docid
       * @fires dxDiagramOptions.onOptionChanged
       */
      height?: number;
      /**
       * @docid
       */
      items?: Array<{
        /**
         * @docid
         */
        height?: number;
        /**
         * @docid
         */
        text?: string;
        /**
         * @docid
         */
        width?: number;
      }>;
      /**
       * @docid
       * @fires dxDiagramOptions.onOptionChanged
       */
      width?: number;
    };
    /**
     * @docid
     * @default {}
     * @public
     */
    propertiesPanel?: {
      /**
       * @docid
       * @default undefined
       */
      tabs?: Array<{
        /**
         * @docid
         */
        commands?: Array<CustomCommand | Command>;
        /**
         * @docid
         */
        groups?: Array<{
          /**
           * @docid
           */
          commands?: Array<CustomCommand | Command>;
          /**
           * @docid
           */
          title?: string;
        }>;
        /**
         * @docid
         */
        title?: string;
      }>;
      /**
       * @docid
       * @default 'auto'
       */
      visibility?: PanelVisibility;
    };
    /**
     * @docid
     * @default false
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showGrid?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    simpleView?: boolean;
    /**
     * @docid
     * @default true
     * @default false &for(desktop except Mac)
     * @public
     */
     useNativeScrolling?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    snapToGrid?: boolean;
    /**
     * @docid
     * @default {}
     * @public
     */
    mainToolbar?: {
      /**
       * @docid
       * @default undefined
       */
      commands?: Array<CustomCommand | Command>;
      /**
       * @docid
       * @default false
       */
      visible?: boolean;
    };
    /**
     * @docid
     * @default {}
     * @public
     */
    historyToolbar?: {
      /**
       * @docid
       * @default undefined
       */
      commands?: Array<CustomCommand | Command>;
      /**
       * @docid
       * @default true
       */
      visible?: boolean;
    };
    /**
     * @docid
     * @default {}
     * @public
     */
    viewToolbar?: {
      /**
       * @docid
       * @default undefined
       */
      commands?: Array<CustomCommand | Command>;
      /**
       * @docid
       * @default true
       */
      visible?: boolean;
    };
    /**
     * @docid
     * @default {}
     * @public
     */
    toolbox?: {
      /**
       * @docid
       * @default undefined
       */
      groups?: Array<{
        /**
         * @docid
         */
        category?: ShapeCategory | string;
        /**
         * @docid
         */
        displayMode?: ToolboxDisplayMode;
        /**
         * @docid
         */
        expanded?: boolean;
        /**
         * @docid
         */
        shapes?: Array<ShapeType> | Array<string>;
        /**
         * @docid
         */
        title?: string;
      }> | Array<ShapeCategory>;
      /**
       * @docid
       * @default 3
       */
      shapeIconsPerRow?: number;
      /**
       * @docid
       * @default true
       */
      showSearch?: boolean;
      /**
       * @docid
       * @default 'auto'
       */
      visibility?: PanelVisibility;
      /**
       * @docid
       * @default undefined
       */
      width?: number | undefined;
    };
    /**
     * @docid
     * @default "in"
     * @public
     */
    units?: Units;
    /**
     * @docid
     * @default "in"
     * @public
     */
    viewUnits?: Units;
    /**
     * @docid
     * @default 1
     * @public
     */
    zoomLevel?: number | {
      /**
       * @docid
       * @default undefined
       */
      items?: Array<number>;
      /**
       * @docid
       * @default undefined
       * @fires dxDiagramOptions.onOptionChanged
       */
      value?: number | undefined;
    };
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDiagram extends Widget<dxDiagramOptions> {
    /**
     * @docid
     * @publicName getNodeDataSource()
     * @public
     */
    getNodeDataSource(): DataSource;
    /**
     * @docid
     * @publicName getEdgeDataSource()
     * @public
     */
    getEdgeDataSource(): DataSource;
    /**
     * @docid
     * @publicName getItemByKey(key)
     * @return dxDiagramItem
     * @public
     */
    getItemByKey(key: Object): Item;
    /**
     * @docid
     * @publicName getItemById(id)
     * @return dxDiagramItem
     * @public
     */
    getItemById(id: string): Item;
    /**
     * @docid
     * @publicName getItems()
     * @return Array<dxDiagramItem>
     * @public
     */
     getItems(): Array<Item>;
    /**
     * @docid
     * @publicName getSelectedItems()
     * @return Array<dxDiagramItem>
     * @public
     */
     getSelectedItems(): Array<Item>;
    /**
     * @docid
     * @publicName setSelectedItems(items)
     * @param1 items:Array<dxDiagramItem>
     * @public
     */
     setSelectedItems(items: Array<Item>): void;
    /**
     * @docid
     * @publicName scrollToItem(item)
     * @param1 item:dxDiagramItem
     * @public
     */
     scrollToItem(item: Item): void;
    /**
     * @docid
     * @publicName export()
     * @public
     */
    export(): string;
    /**
     * @docid
     * @publicName exportTo(format, callback)
     * @param1 format:Enums.DiagramExportFormat
     * @public
     */
    exportTo(format: DiagramExportFormat, callback: Function): void;
    /**
     * @docid
     * @publicName import(data, updateExistingItemsOnly)
     * @param2 updateExistingItemsOnly?:boolean
     * @public
     */
    import(data: string, updateExistingItemsOnly?: boolean): void;
    /**
     * @docid
     * @publicName updateToolbox()
     * @public
     */
    updateToolbox(): void;
    /**
     * @docid
     * @publicName fitToContent()
     * @public
     */
     fitToContent(): void;
    /**
     * @docid
     * @publicName fitToWidth()
     * @public
     */
     fitToWidth(): void;
}

/**
 * @docid
 * @inherits dxDiagramItem
 * @namespace DevExpress.ui
 */
export interface dxDiagramConnector extends Item {
    /**
     * @docid
     * @public
     */
    fromKey?: any;
    /**
     * @docid
     * @public
     */
    fromId?: string;
    /**
     * @docid
     * @public
     */
    fromPointIndex?: number;
    /**
     * @docid
     * @public
     */
    points?: Array<{
      /**
       * @docid
       */
      x?: number;
      /**
       * @docid
       */
      y?: number;
    }>;

    /**
     * @docid
     * @public
     */
    texts?: Array<string>;
    /**
     * @docid
     * @public
     */
    toKey?: any;
    /**
     * @docid
     * @public
     */
    toId?: string;
    /**
     * @docid
     * @public
     */
    toPointIndex?: number;
}

/**
 * @public
 * @namespace DevExpress.ui.dxDiagram
 * @docid dxDiagramItem
 */
export type Item = dxDiagramItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxDiagramItem {
    /**
     * @docid
     * @public
     */
    dataItem?: any;
    /**
     * @docid
     * @public
     */
    id?: string;
    /**
     * @docid
     * @public
     */
    key?: Object;
    /**
     * @docid
     * @public
     */
    itemType?: ItemType;
}

/**
 * @docid
 * @inherits dxDiagramItem
 * @namespace DevExpress.ui
 */
export interface dxDiagramShape extends Item {
    /**
     * @docid
     * @public
     */
    text?: string;
    /**
     * @docid
     * @public
     */
    type?: ShapeType | string;
    /**
     * @docid
     * @public
     */
    position?: {
      /**
       * @docid
       */
      x?: number;
      /**
       * @docid
       */
      y?: number;
    };

    /**
     * @docid
     * @public
     */
    size?: {
      /**
       * @docid
       */
      height?: number;
      /**
       * @docid
       */
      width?: number;
    };
    /**
     * @docid
     * @public
     */
    attachedConnectorIds?: Array<String>;
    /**
     * @docid dxDiagramShape.containerId
     * @public
     */
    containerId?: string;
    /**
     * @docid dxDiagramShape.containerChildItemIds
     * @public
     */
    containerChildItemIds?: Array<String>;
    /**
     * @docid dxDiagramShape.containerExpanded
     * @public
     */
    containerExpanded?: boolean;
}

/**
 * @deprecated Use CustomCommand instead
 * @namespace DevExpress.ui
 */
export type dxDiagramCustomCommand = CustomCommand;

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxDiagram
 */
export type CustomCommand = {
    /**
     * @docid
     * @public
     */
    name?: string | Command;
    /**
     * @docid
     * @public
     */
    text?: string;
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @public
     */
    items?: Array<CustomCommand | Command>;
    /**
     * @docid
     * @default "before"
     * @public
     */
    location?: ToolbarItemLocation;
};

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramAddShapeArgs {
    /**
     * @docid
     * @public
     */
    shape?: dxDiagramShape;
    /**
     * @docid
     */
    position?: {
      /**
       * @docid
       */
      x?: number;
      /**
       * @docid
       */
      y?: number;
    };
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramAddShapeFromToolboxArgs {
  /**
   * @docid
   * @public
   */
  shapeType?: ShapeType | string;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramDeleteShapeArgs {
  /**
   * @docid
   * @public
   */
  shape?: dxDiagramShape;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramDeleteConnectorArgs {
  /**
   * @docid
   * @public
   */
  connector?: dxDiagramConnector;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramChangeConnectionArgs {
  /**
   * @docid
   * @public
   */
  newShape?: dxDiagramShape;
  /**
   * @docid
   * @public
   */
  oldShape?: dxDiagramShape;
  /**
   * @docid
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @public
   */
  connectionPointIndex?: number;
  /**
   * @docid
   * @public
   */
  connectorPosition?: ConnectorPosition;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramChangeConnectorPointsArgs {
  /**
   * @docid
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   */
  newPoints?: Array<{
    /**
     * @docid
     */
    x?: number;
    /**
     * @docid
     */
    y?: number;
  }>;
  /**
   * @docid
   */
  oldPoints?: Array<{
    /**
     * @docid
     */
    x?: number;
    /**
     * @docid
     */
    y?: number;
  }>;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramBeforeChangeShapeTextArgs {
  /**
   * @docid
   * @public
   */
  shape?: dxDiagramShape;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramChangeShapeTextArgs {
  /**
   * @docid
   * @public
   */
  shape?: dxDiagramShape;
  /**
   * @docid
   * @public
   */
  text?: string;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramBeforeChangeConnectorTextArgs {
  /**
   * @docid
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @public
   */
  index?: number;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramChangeConnectorTextArgs {
  /**
   * @docid
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @public
   */
  index?: number;
  /**
   * @docid
   * @public
   */
  text?: string;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramResizeShapeArgs {
  /**
   * @docid
   * @public
   */
  shape?: dxDiagramShape;
  /**
   * @docid
   */
  newSize?: {
    /**
     * @docid
     */
    height?: number;
    /**
     * @docid
     */
    width?: number;
  };
  /**
   * @docid
   */
  oldSize?: {
    /**
     * @docid
     */
    height?: number;
    /**
     * @docid
     */
    width?: number;
  };
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramMoveShapeArgs {
  /**
   * @docid
   * @public
   */
  shape?: dxDiagramShape;
  /**
   * @docid
   */
  newPosition?: {
      /**
       * @docid
       */
      x?: number;
      /**
       * @docid
       */
      y?: number;
  };
  /**
   * @docid
   */
  oldPosition?: {
      /**
       * @docid
       */
      x?: number;
      /**
       * @docid
       */
      y?: number;
  };
}

/** @public */
export type Properties = dxDiagramOptions;

/** @deprecated use Properties instead */
export type Options = dxDiagramOptions;

// #region deprecated in v24.1

/** @deprecated Use AutoZoomMode instead */
export type DiagramAutoZoomMode = AutoZoomMode;

/** @deprecated Use Command instead */
export type DiagramCommand = Command;

/** @deprecated Use ConnectorLineEnd instead */
export type DiagramConnectorLineEnd = ConnectorLineEnd;

/** @deprecated Use ConnectorLineType instead */
export type DiagramConnectorLineType = ConnectorLineType;

/** @deprecated Use ConnectorPosition instead */
export type DiagramConnectorPosition = ConnectorPosition;

/** @deprecated Use DataLayoutType instead */
export type DiagramDataLayoutType = DataLayoutType;

// /** @deprecated Use ExportFormat instead */
// export type DiagramExportFormat = ExportFormat;
// conflics with viz ExportFormat

/** @deprecated Use ItemType instead */
export type DiagramItemType = ItemType;

/** @deprecated Use ModelOperation instead */
export type DiagramModelOperation = ModelOperation;

/** @deprecated Use PanelVisibility instead */
export type DiagramPanelVisibility = PanelVisibility;

/** @deprecated Use RequestEditOperationReason instead */
export type DiagramRequestEditOperationReason = RequestEditOperationReason;

/** @deprecated Use ShapeCategory instead */
export type DiagramShapeCategory = ShapeCategory;

/** @deprecated Use ShapeType instead */
export type DiagramShapeType = ShapeType;

/** @deprecated Use ToolboxDisplayMode instead */
export type DiagramToolboxDisplayMode = ToolboxDisplayMode;

/** @deprecated Use Units instead */
export type DiagramUnits = Units;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onCustomCommand' | 'onItemClick' | 'onItemDblClick' | 'onRequestEditOperation' | 'onRequestLayoutUpdate' | 'onSelectionChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxDiagramOptions.onContentReady
 * @type_function_param1 e:{ui/diagram:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxDiagramOptions.onDisposing
 * @type_function_param1 e:{ui/diagram:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxDiagramOptions.onInitialized
 * @type_function_param1 e:{ui/diagram:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxDiagramOptions.onOptionChanged
 * @type_function_param1 e:{ui/diagram:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
