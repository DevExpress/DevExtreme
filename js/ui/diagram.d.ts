import DataSource, { DataSourceLike } from '../data/data_source';

import {
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
  EventInfo,
  InitializedEventInfo,
  ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    Orientation,
    PageOrientation,
    ToolbarItemLocation,
} from '../common';

export type DiagramAutoZoomMode = 'fitContent' | 'fitWidth' | 'disabled';
export type DiagramCommand = 'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox';
export type DiagramConnectorLineEnd = 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle';
export type DiagramConnectorLineType = 'straight' | 'orthogonal';
export type DiagramConnectorPosition = 'start' | 'end';
export type DiagramDataLayoutType = 'auto' | 'off' | 'tree' | 'layered';
export type DiagramExportFormat = 'svg' | 'png' | 'jpg';
export type DiagramItemType = 'shape' | 'connector';
export type DiagramModelOperation = 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints' | 'beforeChangeShapeText' | 'changeShapeText' | 'beforeChangeConnectorText' | 'changeConnectorText' | 'resizeShape' | 'moveShape';
export type DiagramPanelVisibility = 'auto' | 'visible' | 'collapsed' | 'disabled';
export type DiagramRequestEditOperationReason = 'checkUIElementAvailability' | 'modelModification';
export type DiagramShapeCategory = 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom';
export type DiagramShapeType = 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight';
export type DiagramToolboxDisplayMode = 'icons' | 'texts';
export type DiagramUnits = 'in' | 'cm' | 'px';

/** @public */
export type ContentReadyEvent = EventInfo<dxDiagram>;

/** @public */
export type CustomCommandEvent = {
    readonly component: dxDiagram;
    readonly element: DxElement;
    readonly name: string;
};

/** @public */
export type DisposingEvent = EventInfo<dxDiagram>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDiagram>;

/** @public */
export type ItemClickEvent = EventInfo<dxDiagram> & {
    readonly item: Item;
};

/** @public */
export type ItemDblClickEvent = EventInfo<dxDiagram> & {
    readonly item: Item;
};

/** @public */
export type OptionChangedEvent = EventInfo<dxDiagram> & ChangedOptionInfo;

/** @public */
export type RequestEditOperationEvent = EventInfo<dxDiagram> & {
    readonly operation: 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints';
    readonly args: dxDiagramAddShapeArgs | dxDiagramAddShapeFromToolboxArgs | dxDiagramDeleteShapeArgs | dxDiagramDeleteConnectorArgs | dxDiagramChangeConnectionArgs | dxDiagramChangeConnectorPointsArgs | dxDiagramBeforeChangeShapeTextArgs | dxDiagramChangeShapeTextArgs | dxDiagramBeforeChangeConnectorTextArgs | dxDiagramChangeConnectorTextArgs | dxDiagramResizeShapeArgs | dxDiagramMoveShapeArgs;
    readonly reason: DiagramRequestEditOperationReason;
    allowed?: boolean;
};

/** @public */
export type RequestLayoutUpdateEvent = EventInfo<dxDiagram> & {
    readonly changes: any[];
    allowed?: boolean;
};

/** @public */
export type SelectionChangedEvent = EventInfo<dxDiagram> & {
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
    autoZoomMode?: DiagramAutoZoomMode;
    /**
     * @docid
     * @default {}
     * @public
     */
    contextMenu?: {
      /**
       * @docid
       * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
       * @default undefined
       */
      commands?: Array<DiagramCommand>;
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
      category?: DiagramShapeCategory | string;
      /**
       * @docid
       */
      displayMode?: DiagramToolboxDisplayMode;
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
      shapes?: Array<DiagramShapeType> | Array<string>;
      /**
       * @docid
       * @default 152
       */
      width?: number;
    };
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
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
      baseType?: DiagramShapeType | string;
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
      connectorLineType?: DiagramConnectorLineType;
      /**
       * @docid
       * @default 'none'
       */
      connectorLineStart?: DiagramConnectorLineEnd;
      /**
       * @docid
       * @default 'arrow'
       */
      connectorLineEnd?: DiagramConnectorLineEnd;
      /**
       * @docid
       * @default undefined
       */
      shapeMinWidth?: number;
      /**
       * @docid
       * @default undefined
       */
      shapeMaxWidth?: number;
      /**
       * @docid
       * @default undefined
       */
      shapeMinHeight?: number;
      /**
       * @docid
       * @default undefined
       */
      shapeMaxHeight?: number;
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
      customDataExpr?: string | ((data: any, value?: any) => any);
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
      fromLineEndExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      fromPointIndexExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      lineTypeExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      lockedExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      pointsExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      styleExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      textExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      textStyleExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default "to"
       */
      toExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      toLineEndExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      toPointIndexExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      zIndexExpr?: string | ((data: any, value?: any) => any);
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
      autoLayout?: DiagramDataLayoutType | {
        /**
         * @docid
         */
        orientation?: Orientation;
        /**
         * @docid
         */
        type?: DiagramDataLayoutType;
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
       containerChildrenExpr?: string | ((data: any, value?: any) => any);
       /**
       * @docid
       * @default undefined
       */
      customDataExpr?: string | ((data: any, value?: any) => any);
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
      heightExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      imageUrlExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      itemsExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      leftExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      lockedExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      parentKeyExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      styleExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default "text"
       */
      textExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      textStyleExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      topExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default "type"
       */
      typeExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      widthExpr?: string | ((data: any, value?: any) => any);
      /**
       * @docid
       * @default undefined
       */
      zIndexExpr?: string | ((data: any, value?: any) => any);
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
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDiagram
     * @type_function_param1_field item:dxDiagramItem
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDiagram
     * @type_function_param1_field item:dxDiagramItem
     * @action
     * @public
     */
    onItemDblClick?: ((e: ItemDblClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDiagram
     * @type_function_param1_field items:Array<dxDiagramItem>
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDiagram
     * @type_function_param1_field operation:Enums.DiagramModelOperation
     * @type_function_param1_field reason:Enums.DiagramRequestEditOperationReason
     * @action
     * @public
     */
    onRequestEditOperation?: ((e: RequestEditOperationEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDiagram
     * @type_function_param1_field changes:Array<any>
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
         * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
         */
        commands?: Array<DiagramCommand>;
        /**
         * @docid
         */
        groups?: Array<{
          /**
           * @docid
           * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
           */
          commands?: Array<DiagramCommand>;
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
      visibility?: DiagramPanelVisibility;
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
       * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
       * @default undefined
       */
      commands?: Array<DiagramCommand>;
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
       * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
       * @default undefined
       */
      commands?: Array<DiagramCommand>;
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
       * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
       * @default undefined
       */
      commands?: Array<DiagramCommand>;
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
        category?: DiagramShapeCategory | string;
        /**
         * @docid
         */
        displayMode?: DiagramToolboxDisplayMode;
        /**
         * @docid
         */
        expanded?: boolean;
        /**
         * @docid
         */
        shapes?: Array<DiagramShapeType> | Array<string>;
        /**
         * @docid
         */
        title?: string;
      }> | Array<DiagramShapeCategory>;
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
      visibility?: DiagramPanelVisibility;
      /**
       * @docid
       * @default undefined
       */
      width?: number;
    };
    /**
     * @docid
     * @default "in"
     * @public
     */
    units?: DiagramUnits;
    /**
     * @docid
     * @default "in"
     * @public
     */
    viewUnits?: DiagramUnits;
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
      value?: number;
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
    itemType?: DiagramItemType;
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
    type?: DiagramShapeType | string;
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
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramCustomCommand {
    /**
     * @docid
     * @type String|Enums.DiagramCommand
     * @public
     */
    name?: string;
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
    items?: Array<dxDiagramCustomCommand>;
    /**
     * @docid
     * @default "before"
     * @public
     */
    location?: ToolbarItemLocation;
}

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
  shapeType?: DiagramShapeType | string;
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
  connectorPosition?: DiagramConnectorPosition;
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

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxDiagramOptions.onContentReady
 * @type_function_param1 e:{ui/diagram:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxDiagramOptions.onCustomCommand
 * @type_function_param1 e:{ui/diagram:CustomCommandEvent}
 */
onCustomCommand?: ((e: CustomCommandEvent) => void);
/**
 * @skip
 * @docid dxDiagramOptions.onDisposing
 * @type_function_param1 e:{ui/diagram:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxDiagramOptions.onInitialized
 * @type_function_param1 e:{ui/diagram:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxDiagramOptions.onItemClick
 * @type_function_param1 e:{ui/diagram:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxDiagramOptions.onItemDblClick
 * @type_function_param1 e:{ui/diagram:ItemDblClickEvent}
 */
onItemDblClick?: ((e: ItemDblClickEvent) => void);
/**
 * @skip
 * @docid dxDiagramOptions.onOptionChanged
 * @type_function_param1 e:{ui/diagram:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxDiagramOptions.onRequestEditOperation
 * @type_function_param1 e:{ui/diagram:RequestEditOperationEvent}
 */
onRequestEditOperation?: ((e: RequestEditOperationEvent) => void);
/**
 * @skip
 * @docid dxDiagramOptions.onRequestLayoutUpdate
 * @type_function_param1 e:{ui/diagram:RequestLayoutUpdateEvent}
 */
onRequestLayoutUpdate?: ((e: RequestLayoutUpdateEvent) => void);
/**
 * @skip
 * @docid dxDiagramOptions.onSelectionChanged
 * @type_function_param1 e:{ui/diagram:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
