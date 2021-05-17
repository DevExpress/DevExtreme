import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';


import {
  EventInfo,
  InitializedEventInfo,
  ChangedOptionInfo
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';


/** @public */
export type ContentReadyEvent = EventInfo<dxDiagram>;

/** @public */
export type CustomCommandEvent = {
    readonly component: dxDiagram;
    readonly element: DxElement;
    readonly name: string;
}

/** @public */
export type DisposingEvent = EventInfo<dxDiagram>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDiagram>;

/** @public */
export type ItemClickEvent = EventInfo<dxDiagram> & {
    readonly item: dxDiagramItem;
}

/** @public */
export type ItemDblClickEvent = EventInfo<dxDiagram> & {
    readonly item: dxDiagramItem;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxDiagram> & ChangedOptionInfo;

/** @public */
export type RequestEditOperationEvent = EventInfo<dxDiagram> & {
    readonly operation: 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints';
    readonly args: dxDiagramAddShapeArgs|dxDiagramAddShapeFromToolboxArgs|dxDiagramDeleteShapeArgs|dxDiagramDeleteConnectorArgs|dxDiagramChangeConnectionArgs|dxDiagramChangeConnectorPointsArgs|dxDiagramBeforeChangeShapeTextArgs|dxDiagramChangeShapeTextArgs|dxDiagramBeforeChangeConnectorTextArgs|dxDiagramChangeConnectorTextArgs|dxDiagramResizeShapeArgs|dxDiagramMoveShapeArgs;
    readonly reason: 'checkUIElementAvailability' | 'modelModification';
    allowed?: boolean;
}

/** @public */
export type RequestLayoutUpdateEvent = EventInfo<dxDiagram> & {
    readonly changes: any[];
    allowed?: boolean 
}

/** @public */
export type SelectionChangedEvent = EventInfo<dxDiagram> & {
    readonly items: Array<dxDiagramItem>;
}

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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoZoomMode?: 'fitContent' | 'fitWidth' | 'disabled';
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextMenu?: {
      /**
       * @docid
       * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>,
      /**
       * @docid
       * @default true
       * @prevFileNamespace DevExpress.ui
       */
      enabled?: boolean
    };
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextToolbox?: {
      /**
       * @docid
       * @type Enums.DiagramShapeCategory|String
       * @prevFileNamespace DevExpress.ui
       */
      category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string,
      /**
       * @docid
       * @type Enums.DiagramToolboxDisplayMode
       * @prevFileNamespace DevExpress.ui
       */
      displayMode?: 'icons' | 'texts',
      /**
       * @docid
       * @default true
       * @prevFileNamespace DevExpress.ui
       */
      enabled?: boolean,
      /**
       * @docid
       * @default 4
       * @prevFileNamespace DevExpress.ui
       */
      shapeIconsPerRow?: number,
      /**
       * @docid
       * @type Array<Enums.DiagramShapeType>|Array<String>
       * @prevFileNamespace DevExpress.ui
       */
      shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>,
      /**
       * @docid
       * @default 152
       * @prevFileNamespace DevExpress.ui
       */
      width?: number
    };
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 name:String
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCustomCommand?: ((e: CustomCommandEvent) => void);
    /**
     * @docid
     * @type_function_param1 container:dxSVGElement
     * @type_function_param2 data:object
     * @type_function_param2_field1 item:dxDiagramShape
     * @prevFileNamespace DevExpress.ui
     * @return void
     * @public
     */
    customShapeTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeTemplateData) => any);
    /**
     * @docid
     * @type_function_param1 container:dxSVGElement
     * @type_function_param2 data:object
     * @type_function_param2_field1 item:dxDiagramShape
     * @prevFileNamespace DevExpress.ui
     * @return void
     * @public
     */
    customShapeToolboxTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeToolboxTemplateData) => any);
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customShapes?: Array<{
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      allowEditImage?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      allowEditText?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      allowResize?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      backgroundImageHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      backgroundImageLeft?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      backgroundImageTop?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      backgroundImageUrl?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      backgroundImageToolboxUrl?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      backgroundImageWidth?: number,
      /**
       * @docid
       * @type Enums.DiagramShapeType|String
       * @prevFileNamespace DevExpress.ui
       */
      baseType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      category?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      connectionPoints?: Array<{
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        x?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        y?: number
      }>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      defaultHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      defaultImageUrl?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      defaultText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      defaultWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      imageHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      imageLeft?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      imageTop?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      imageWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      keepRatioOnAutoSize?: boolean
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      maxHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      maxWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      minHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      minWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 container:dxSVGElement
       * @type_function_param2 data:object
       * @type_function_param2_field1 item:dxDiagramShape
       * @return void
       */
      template?: template | ((container: DxElement<SVGElement>, data: CustomShapeTemplateData) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      templateHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      templateLeft?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      templateTop?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      templateWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      textHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      textLeft?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      textTop?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      textWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      title?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 container:dxSVGElement
       * @type_function_param2 data:object
       * @type_function_param2_field1 item:dxDiagramShape
       * @return void
       */
      toolboxTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeToolboxTemplateData) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      toolboxWidthToHeightRatio?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      type?: string
    }>;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    defaultItemProperties?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      style?: Object,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      textStyle?: Object,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.DiagramConnectorLineType
       * @default 'orthogonal'
       */
      connectorLineType?: 'straight' | 'orthogonal',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.DiagramConnectorLineEnd
       * @default 'none'
       */
      connectorLineStart?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.DiagramConnectorLineEnd
       * @default 'arrow'
       */
      connectorLineEnd?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      shapeMinWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      shapeMaxWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      shapeMinHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      shapeMaxHeight?: number
    };
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editing?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowAddShape?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowDeleteShape?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowDeleteConnector?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowChangeConnection?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowChangeConnectorPoints?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowChangeConnectorText?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowChangeShapeText?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowResizeShape?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowMoveShape?: boolean
    };
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    edges?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      customDataExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default "from"
       */
      fromExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      fromLineEndExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      fromPointIndexExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default "id"
       */
      keyExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      lineTypeExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      lockedExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      pointsExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      styleExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      textExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      textStyleExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default "to"
       */
      toExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      toLineEndExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      toPointIndexExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      zIndexExpr?: string | ((data: any) => any)
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    export?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Diagram"
       */
      fileName?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       * @deprecated
       */
      proxyUrl?: string
    };
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fullScreen?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    gridSize?: number | {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      items?: Array<number>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      value?: number
    };
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    nodes?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.DiagramDataLayoutType|Object
       * @default "auto"
       */
      autoLayout?: 'off' | 'tree' | 'layered' | {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type Enums.DiagramDataLayoutOrientation
         */
        orientation?: 'vertical' | 'horizontal',
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type Enums.DiagramDataLayoutType
         */
        type?: 'off' | 'tree' | 'layered'
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      autoSizeEnabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default "children"
       */
      containerChildrenExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      containerKeyExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      customDataExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      heightExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      imageUrlExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      itemsExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default "id"
       */
      keyExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      leftExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      lockedExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      parentKeyExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      styleExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default "text"
       */
      textExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      textStyleExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      topExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default "type"
       */
      typeExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      widthExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 data:object
       * @return void
       * @default undefined
       */
      zIndexExpr?: string | ((data: any) => any)
    };
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasChanges?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDiagram
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 item:dxDiagramItem
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDiagram
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 item:dxDiagramItem
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemDblClick?: ((e: ItemDblClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDiagram
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 items:Array<dxDiagramItem>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDiagram
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 operation:Enums.DiagramModelOperation
     * @type_function_param1_field5 args:dxDiagramAddShapeArgs|dxDiagramAddShapeFromToolboxArgs|dxDiagramDeleteShapeArgs|dxDiagramDeleteConnectorArgs|dxDiagramChangeConnectionArgs|dxDiagramChangeConnectorPointsArgs|dxDiagramBeforeChangeShapeTextArgs|dxDiagramChangeShapeTextArgs|dxDiagramBeforeChangeConnectorTextArgs|dxDiagramChangeConnectorTextArgs|dxDiagramResizeShapeArgs|dxDiagramMoveShapeArgs
     * @type_function_param1_field6 reason:Enums.DiagramRequestEditOperationReason
     * @type_function_param1_field7 allowed:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRequestEditOperation?: ((e: RequestEditOperationEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDiagram
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 changes:Array<any>
     * @type_function_param1_field5 allowed:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRequestLayoutUpdate?: ((e: RequestLayoutUpdateEvent) => void);
    /**
     * @docid
     * @default "white"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageColor?: string;
    /**
     * @docid
     * @type Enums.DiagramPageOrientation
     * @default "portrait"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageOrientation?: 'portrait' | 'landscape';
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageSize?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      height?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      items?: Array<{
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        height?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        text?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        width?: number
      }>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      width?: number
    };
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    propertiesPanel?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      tabs?: Array<{
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
         */
        commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'|'simpleView'|'toolbox'>,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        groups?: Array<{
          /**
           * @docid
           * @prevFileNamespace DevExpress.ui
           * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
           */
          commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'|'simpleView'|'toolbox'>,
          /**
           * @docid
           * @prevFileNamespace DevExpress.ui
           */
          title?: string
        }>,
        /**
         * @prevFileNamespace DevExpress.ui
         * @docid
         */
        title?: string
      }>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.DiagramPanelVisibility
       * @default 'auto'
       */
      visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled'
    };
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showGrid?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    simpleView?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    snapToGrid?: boolean;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mainToolbar?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
       * @default undefined
       */
      commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      visible?: boolean
    };
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    historyToolbar?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
       * @default undefined
       */
      commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      visible?: boolean
    };
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    viewToolbar?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
       * @default undefined
       */
      commands?: Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox'>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      visible?: boolean
    };
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbox?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Array<Object>|Array<Enums.DiagramShapeCategory>
       * @default undefined
       */
      groups?: Array<{
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type Enums.DiagramShapeCategory|String
         */
        category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type Enums.DiagramToolboxDisplayMode
         */
        displayMode?: 'icons' | 'texts',
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        expanded?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type Array<Enums.DiagramShapeType>|Array<String>
         */
        shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        title?: string
      }> | Array<'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom'>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 3
       */
      shapeIconsPerRow?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      showSearch?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.DiagramPanelVisibility
       * @default 'auto'
       */
      visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      width?: number
    };
    /**
     * @docid
     * @type Enums.DiagramUnits
     * @default "in"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    units?: 'in' | 'cm' | 'px';
    /**
     * @docid
     * @type Enums.DiagramUnits
     * @default "in"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    viewUnits?: 'in' | 'cm' | 'px';
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    zoomLevel?: number | {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      items?: Array<number>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      value?: number
    };
}
/**
 * @docid
 * @inherits Widget
 * @module ui/diagram
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDiagram extends Widget {
    constructor(element: UserDefinedElement, options?: dxDiagramOptions)
    /**
     * @docid
     * @publicName getNodeDataSource()
     * @return DataSource
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getNodeDataSource(): DataSource;
    /**
     * @docid
     * @publicName getEdgeDataSource()
     * @return DataSource
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getEdgeDataSource(): DataSource;
    /**
     * @docid
     * @publicName getItemByKey(key)
     * @param1 key:Object
     * @return dxDiagramItem
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getItemByKey(key: Object): dxDiagramItem;
    /**
     * @docid
     * @publicName getItemById(id)
     * @param1 id:String
     * @return dxDiagramItem
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getItemById(id: string): dxDiagramItem;
    /**
     * @docid
     * @publicName getItems()
     * @return Array<dxDiagramItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
     getItems(): Array<dxDiagramItem>;
    /**
     * @docid
     * @publicName getSelectedItems()
     * @return Array<dxDiagramItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
     getSelectedItems(): Array<dxDiagramItem>;
    /**
     * @docid
     * @publicName setSelectedItems(items)
     * @param1 items:Array<dxDiagramItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
     setSelectedItems(items: Array<dxDiagramItem>): void;
    /**
     * @docid
     * @publicName scrollToItem(item)
     * @param1 item:dxDiagramItem
     * @prevFileNamespace DevExpress.ui
     * @public
     */
     scrollToItem(item: dxDiagramItem): void;
    /**
     * @docid
     * @publicName export()
     * @return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    export(): string;
    /**
     * @docid
     * @publicName exportTo(format, callback)
     * @param1 format:Enums.DiagramExportFormat
     * @param2 callback:function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    exportTo(format: 'svg' | 'png' | 'jpg', callback: Function): void;
    /**
     * @docid
     * @publicName import(data, updateExistingItemsOnly)
     * @param1 data:string
     * @param2 updateExistingItemsOnly?:boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    import(data: string, updateExistingItemsOnly?: boolean): void;
    /**
     * @docid
     * @publicName updateToolbox()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateToolbox(): void;
}

/**
 * @docid
 * @inherits dxDiagramItem
 * @namespace DevExpress.ui
 */
export interface dxDiagramConnector extends dxDiagramItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fromKey?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fromId?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fromPointIndex?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    points?: Array<{
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      x?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      y?: number
    }>;

    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: Array<string>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toKey?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toId?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toPointIndex?: number;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataItem?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    id?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    key?: Object;
    /**
     * @docid
     * @type Enums.DiagramItemType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'shape' | 'connector';
}

/**
 * @docid
 * @inherits dxDiagramItem
 * @namespace DevExpress.ui
 */
export interface dxDiagramShape extends dxDiagramItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @type Enums.DiagramShapeType|String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      x?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      y?: number
    };

    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    size?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      height?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      width?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    attachedConnectorIds?: Array<String>;
    /**
     * @docid dxDiagramShape.containerId
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    containerId?: string;
    /**
     * @docid dxDiagramShape.containerChildItemIds
     * @type Array<String>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    containerChildItemIds?: Array<String>;
    /**
     * @docid dxDiagramShape.containerExpanded
     * @type Boolean
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxDiagramCustomCommand>;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramAddShapeArgs {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shape?: dxDiagramShape;
    /**
     * @docid
     */
    position?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      x?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      y?: number
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
   * @prevFileNamespace DevExpress.ui
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
   * @prevFileNamespace DevExpress.ui
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
   * @prevFileNamespace DevExpress.ui
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
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  newShape?: dxDiagramShape;
  /**
   * @docid
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  oldShape?: dxDiagramShape;
  /**
   * @docid
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connectionPointIndex?: number;
  /**
   * @docid
   * @type Enums.DiagramConnectorPosition
   * @prevFileNamespace DevExpress.ui
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
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   */
  newPoints?: Array<{
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     */
    x?: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     */
    y?: number
  }>;
  /**
   * @docid
   */
  oldPoints?: Array<{
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     */
    x?: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     */
    y?: number
  }>;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramBeforeChangeShapeTextArgs {
  /**
   * @docid
   * @prevFileNamespace DevExpress.ui
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
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  shape?: dxDiagramShape;
  /**
   * @docid
   * @prevFileNamespace DevExpress.ui
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
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @prevFileNamespace DevExpress.ui
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
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  index?: number;
  /**
   * @docid
   * @prevFileNamespace DevExpress.ui
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
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  shape?: dxDiagramShape;
  /**
   * @docid
   */
  newSize?: {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     */
    height?: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     */
    width?: number
  };
  /**
   * @docid
   */
  oldSize?: {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     */
    height?: number,
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     */
    width?: number
  };
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxDiagramMoveShapeArgs {
  /**
   * @docid
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  shape?: dxDiagramShape;
  /**
   * @docid
   */
  newPosition?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      x?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      y?: number
  };
  /**
   * @docid
   */
  oldPosition?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      x?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      y?: number
  };
}

/** @public */
export type Properties = dxDiagramOptions;

/** @deprecated use Properties instead */
export type Options = dxDiagramOptions;

/** @deprecated use Properties instead */
export type IOptions = dxDiagramOptions;
