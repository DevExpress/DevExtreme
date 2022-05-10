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
    readonly reason: 'checkUIElementAvailability' | 'modelModification';
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
 */
export interface dxDiagramOptions extends WidgetOptions<dxDiagram> {
    /**
     * @docid
     * @type Enums.DiagramAutoZoomMode
     * @default "disabled"
     * @public
     */
    autoZoomMode?: 'fitContent' | 'fitWidth' | 'disabled';
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
      commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'lineStyle' | 'lineWidth' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>;
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
       * @type Enums.DiagramShapeCategory|String
       */
      category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string;
      /**
       * @docid
       * @type Enums.DiagramToolboxDisplayMode
       */
      displayMode?: 'icons' | 'texts';
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
       * @type Array<Enums.DiagramShapeType>|Array<String>
       */
      shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>;
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
       * @type Enums.DiagramShapeType|String
       */
      baseType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
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
       * @type Enums.DiagramConnectorLineType
       * @default 'orthogonal'
       */
      connectorLineType?: 'straight' | 'orthogonal';
      /**
       * @docid
       * @type Enums.DiagramConnectorLineEnd
       * @default 'none'
       */
      connectorLineStart?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle';
      /**
       * @docid
       * @type Enums.DiagramConnectorLineEnd
       * @default 'arrow'
       */
      connectorLineEnd?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle';
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
       * @type Store|DataSource|DataSourceOptions|string|Array<any>
       */
      dataSource?: DataSourceLike<any>;
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
      /**
       * @docid
       * @default undefined
       * @deprecated
       */
      proxyUrl?: string;
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
       * @type Enums.DiagramDataLayoutType|Object
       * @default "auto"
       */
      autoLayout?: 'off' | 'tree' | 'layered' | {
        /**
         * @docid
         * @type Enums.DiagramDataLayoutOrientation
         */
        orientation?: 'vertical' | 'horizontal';
        /**
         * @docid
         * @type Enums.DiagramDataLayoutType
         */
        type?: 'off' | 'tree' | 'layered';
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
       * @type Store|DataSource|DataSourceOptions|string|Array<any>
       */
      dataSource?: DataSourceLike<any>;
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
     * @type Enums.DiagramPageOrientation
     * @default "portrait"
     * @public
     */
    pageOrientation?: 'portrait' | 'landscape';
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
        commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>;
        /**
         * @docid
         */
        groups?: Array<{
          /**
           * @docid
           * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
           */
          commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>;
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
       * @type Enums.DiagramPanelVisibility
       * @default 'auto'
       */
      visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled';
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
      commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>;
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
      commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>;
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
      commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>;
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
       * @type Array<Object>|Array<Enums.DiagramShapeCategory>
       * @default undefined
       */
      groups?: Array<{
        /**
         * @docid
         * @type Enums.DiagramShapeCategory|String
         */
        category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string;
        /**
         * @docid
         * @type Enums.DiagramToolboxDisplayMode
         */
        displayMode?: 'icons' | 'texts';
        /**
         * @docid
         */
        expanded?: boolean;
        /**
         * @docid
         * @type Array<Enums.DiagramShapeType>|Array<String>
         */
        shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>;
        /**
         * @docid
         */
        title?: string;
      }> | Array<'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom'>;
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
       * @type Enums.DiagramPanelVisibility
       * @default 'auto'
       */
      visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled';
      /**
       * @docid
       * @default undefined
       */
      width?: number;
    };
    /**
     * @docid
     * @type Enums.DiagramUnits
     * @default "in"
     * @public
     */
    units?: 'in' | 'cm' | 'px';
    /**
     * @docid
     * @type Enums.DiagramUnits
     * @default "in"
     * @public
     */
    viewUnits?: 'in' | 'cm' | 'px';
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
    exportTo(format: 'svg' | 'png' | 'jpg', callback: Function): void;
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
     * @type Enums.DiagramItemType
     * @public
     */
    itemType?: 'shape' | 'connector';
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
     * @type Enums.DiagramShapeType|String
     * @public
     */
    type?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
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
     * @type Enums.ToolbarItemLocation
     * @public
     */
    location?: 'after' | 'before' | 'center';
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
   * @type Enums.DiagramShapeType|String
   * @public
   */
  shapeType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
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
   * @type Enums.DiagramConnectorPosition
   * @public
   */
  connectorPosition?: 'start' | 'end';
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
