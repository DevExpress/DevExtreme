import {
    dxElement, dxSVGElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

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
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextMenu?: {
      /**
      * @docid
      * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
      * @default undefined
      */
      commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>,
      /**
      * @docid
      * @default true
      */
      enabled?: boolean
    };
    /**
     * @docid
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextToolbox?: {
      /**
      * @docid
      * @type Enums.DiagramShapeCategory|String
      */
      category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string,
      /**
      * @docid
      * @type Enums.DiagramToolboxDisplayMode
      */
      displayMode?: 'icons' | 'texts',
      /**
      * @docid
      * @default true
      */
      enabled?: boolean,
      /**
      * @docid
      * @default 4
      */
      shapeIconsPerRow?: number,
      /**
      * @docid
      * @type Array<Enums.DiagramShapeType>|Array<String>
      */
      shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>,
      /**
      * @docid
      * @default 152
      */
      width?: number
    };
    /**
     * @docid
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:dxElement
     * @type_function_param1_field3 name:String
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCustomCommand?: ((e: { component?: dxDiagram, element?: dxElement, name?: string }) => any);
    /**
     * @docid
     * @type template|function
     * @type_function_param1 container:dxSVGElement
     * @type_function_param2 data:object
     * @type_function_param2_field1 item:dxDiagramShape
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customShapeTemplate?: template | ((container: dxSVGElement, data: { item?: dxDiagramShape }) => any);
    /**
     * @docid
     * @type template|function
     * @type_function_param1 container:dxSVGElement
     * @type_function_param2 data:object
     * @type_function_param2_field1 item:dxDiagramShape
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customShapeToolboxTemplate?: template | ((container: dxSVGElement, data: { item?: dxDiagramShape }) => any);
    /**
     * @docid
     * @type Array<Object>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customShapes?: Array<{
      /**
      * @docid
      * @type Boolean
      */
      allowEditImage?: boolean,
      /**
      * @docid
      * @type Boolean
      */
      allowEditText?: boolean,
      /**
      * @docid
      * @type Boolean
      */
      allowResize?: boolean,
      /**
      * @docid
      * @type Number
      */
      backgroundImageHeight?: number,
      /**
      * @docid
      * @type Number
      */
      backgroundImageLeft?: number,
      /**
      * @docid
      * @type Number
      */
      backgroundImageTop?: number,
      /**
      * @docid
      * @type String
      */
      backgroundImageUrl?: string,
      /**
      * @docid
      * @type String
      */
      backgroundImageToolboxUrl?: string,
      /**
      * @docid
      * @type Number
      */
      backgroundImageWidth?: number,
      /**
      * @docid
      * @type Enums.DiagramShapeType|String
      */
      baseType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string,
      /**
      * @docid
      * @type String
      */
      category?: string,
      /**
      * @docid
      * @type Array<Object>
      */
      connectionPoints?: Array<{
        /**
        * @docid
        * @type Number
        */
        x?: number,
        /**
        * @docid
        * @type Number
        */
        y?: number
      }>,
      /**
      * @docid
      * @type Number
      */
      defaultHeight?: number,
      /**
      * @docid
      * @type String
      */
      defaultImageUrl?: string,
      /**
      * @docid
      * @type String
      */
      defaultText?: string,
      /**
      * @docid
      * @type Number
      */
      defaultWidth?: number,
      /**
      * @docid
      * @type Number
      */
      imageHeight?: number,
      /**
      * @docid
      * @type Number
      */
      imageLeft?: number,
      /**
      * @docid
      * @type Number
      */
      imageTop?: number,
      /**
      * @docid
      * @type Number
      */
      imageWidth?: number,
      /**
      * @docid
      * @type Boolean
      */
      keepRatioOnAutoSize?: boolean
      /**
      * @docid
      * @type Number
      */
      maxHeight?: number,
      /**
      * @docid
      * @type Number
      */
      maxWidth?: number,
      /**
      * @docid
      * @type Number
      */
      minHeight?: number,
      /**
      * @docid
      * @type Number
      */
      minWidth?: number,
      /**
      * @docid
      * @type template|function
      * @type_function_param1 container:dxSVGElement
      * @type_function_param2 data:object
      * @type_function_param2_field1 item:dxDiagramShape
      */
      template?: template | ((container: dxSVGElement, data: { item?: dxDiagramShape }) => any),
      /**
      * @docid
      * @type Number
      */
      templateHeight?: number,
      /**
      * @docid
      * @type Number
      */
      templateLeft?: number,
      /**
      * @docid
      * @type Number
      */
      templateTop?: number,
      /**
      * @docid
      * @type Number
      */
      templateWidth?: number,
      /**
      * @docid
      * @type Number
      */
      textHeight?: number,
      /**
      * @docid
      * @type Number
      */
      textLeft?: number,
      /**
      * @docid
      * @type Number
      */
      textTop?: number,
      /**
      * @docid
      * @type Number
      */
      textWidth?: number,
      /**
      * @docid
      * @type String
      */
      title?: string,
      /**
      * @docid
      * @type template|function
      * @type_function_param1 container:dxSVGElement
      * @type_function_param2 data:object
      * @type_function_param2_field1 item:dxDiagramShape
      */
      toolboxTemplate?: template | ((container: dxSVGElement, data: { item?: dxDiagramShape }) => any),
      /**
      * @docid
      * @type Number
      */
      toolboxWidthToHeightRatio?: number,
      /**
      * @docid
      * @type String
      */
      type?: string
    }>;
    /**
     * @docid
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    defaultItemProperties?: {
      /**
      * @docid
      * @type Object
      */
      style?: Object,
      /**
      * @docid
      * @type Object
      */
      textStyle?: Object,
      /**
      * @docid
      * @type Enums.DiagramConnectorLineType
      * @default 'orthogonal'
      */
      connectorLineType?: 'straight' | 'orthogonal',
      /**
      * @docid
      * @type Enums.DiagramConnectorLineEnd
      * @default 'none'
      */
      connectorLineStart?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle',
      /**
      * @docid
      * @type Enums.DiagramConnectorLineEnd
      * @default 'arrow'
      */
      connectorLineEnd?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle',
      /**
      * @docid
      * @default undefined
      */
      shapeMinWidth?: number,
      /**
      * @docid
      * @default undefined
      */
      shapeMaxWidth?: number,
      /**
      * @docid
      * @default undefined
      */
      shapeMinHeight?: number,
      /**
      * @docid
      * @default undefined
      */
      shapeMaxHeight?: number
    };
    /**
     * @docid
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editing?: {
      /**
      * @docid
      * @default true
      */
      allowAddShape?: boolean,
      /**
      * @docid
      * @default true
      */
      allowDeleteShape?: boolean,
      /**
      * @docid
      * @default true
      */
      allowDeleteConnector?: boolean,
      /**
      * @docid
      * @default true
      */
      allowChangeConnection?: boolean,
      /**
      * @docid
      * @default true
      */
      allowChangeConnectorPoints?: boolean,
      /**
      * @docid
      * @default true
      */
      allowChangeConnectorText?: boolean,
      /**
      * @docid
      * @default true
      */
      allowChangeShapeText?: boolean,
      /**
      * @docid
      * @default true
      */
      allowResizeShape?: boolean,
      /**
      * @docid
      * @default true
      */
      allowMoveShape?: boolean
    };
    /**
     * @docid
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    edges?: {
      /**
       * @docid
       * @type string|function(data)
       * @type_function_param1 data:object
       * @default undefined
       */
      customDataExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type Array<Object>|DataSource|DataSourceOptions
      * @default null
      */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default "from"
      */
      fromExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      fromLineEndExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      fromPointIndexExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default "id"
      */
      keyExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      lineTypeExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      lockedExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      pointsExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      styleExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      textExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      textStyleExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default "to"
      */
      toExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      toLineEndExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      toPointIndexExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      zIndexExpr?: string | ((data: any) => any)
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    export?: {
      /**
       * @docid
       * @default "Diagram"
       */
      fileName?: string,
      /**
       * @docid
       * @default undefined
       * @deprecated
       */
      proxyUrl?: string
    };
    /**
     * @docid
     * @type Boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fullScreen?: boolean;
    /**
     * @docid
     * @type Number|Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    gridSize?: number | {
      /**
      * @docid
      * @type Array<Number>
      */
      items?: Array<number>,
      /**
      * @docid
      * @type Number
      */
      value?: number
    };
    /**
     * @docid
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
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
        orientation?: 'vertical' | 'horizontal',
        /**
         * @docid
         * @type Enums.DiagramDataLayoutType
         */
        type?: 'off' | 'tree' | 'layered'
      },
      /**
      * @docid
      * @default true
      */
      autoSizeEnabled?: boolean,
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default "children"
      */
      containerChildrenExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      containerKeyExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @type string|function(data)
       * @type_function_param1 data:object
       * @default undefined
       */
      customDataExpr?: string | ((data: any) => any),
      /**
       * @docid
       * @type Array<Object>|DataSource|DataSourceOptions
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      heightExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      imageUrlExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      itemsExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default "id"
      */
      keyExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      leftExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      lockedExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      parentKeyExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      styleExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default "text"
      */
      textExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      textStyleExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      topExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default "type"
      */
      typeExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      widthExpr?: string | ((data: any) => any),
      /**
      * @docid
      * @type string|function(data)
      * @type_function_param1 data:object
      * @default undefined
      */
      zIndexExpr?: string | ((data: any) => any)
    };
    /**
     * @docid
     * @type Boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasChanges?: boolean;
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 item:dxDiagramItem
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: { component?: dxDiagram, element?: dxElement, model?: any, item?: dxDiagramItem }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 item:dxDiagramItem
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemDblClick?: ((e: { component?: dxDiagram, element?: dxElement, model?: any, item?: dxDiagramItem }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 items:Array<dxDiagramItem>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxDiagram, element?: dxElement, model?: any, items?: Array<dxDiagramItem> }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 operation:Enums.DiagramModelOperation
     * @type_function_param1_field5 args:dxDiagramAddShapeArgs|dxDiagramAddShapeFromToolboxArgs|dxDiagramDeleteShapeArgs|dxDiagramDeleteConnectorArgs|dxDiagramChangeConnectionArgs|dxDiagramChangeConnectorPointsArgs|dxDiagramBeforeChangeShapeTextArgs|dxDiagramChangeShapeTextArgs|dxDiagramBeforeChangeConnectorTextArgs|dxDiagramChangeConnectorTextArgs|dxDiagramResizeShapeArgs|dxDiagramMoveShapeArgs
     * @type_function_param1_field6 updateUI:boolean
     * @type_function_param1_field7 allowed:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRequestEditOperation?: ((e: { component?: dxDiagram, element?: dxElement, model?: any, operation?: 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints', args?: dxDiagramAddShapeArgs|dxDiagramAddShapeFromToolboxArgs|dxDiagramDeleteShapeArgs|dxDiagramDeleteConnectorArgs|dxDiagramChangeConnectionArgs|dxDiagramChangeConnectorPointsArgs|dxDiagramBeforeChangeShapeTextArgs|dxDiagramChangeShapeTextArgs|dxDiagramBeforeChangeConnectorTextArgs|dxDiagramChangeConnectorTextArgs|dxDiagramResizeShapeArgs|dxDiagramMoveShapeArgs, updateUI?: boolean, allowed?: boolean }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 changes:Array<any>
     * @type_function_param1_field5 allowed:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRequestLayoutUpdate?: ((e: { component?: dxDiagram, element?: dxElement, model?: any, changes?: any[], allowed?: boolean }) => any);
    /**
     * @docid
     * @type String
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
     * @type Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageSize?: {
      /**
      * @docid
      */
      height?: number,
      /**
      * @docid
      * @type Array<Object>
      */
      items?: Array<{
        /**
        * @docid
        */
        height?: number,
        /**
        * @docid
        */
        text?: string,
        /**
        * @docid
        */
        width?: number
      }>,
      /**
      * @docid
      */
      width?: number
    };
    /**
     * @docid
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    propertiesPanel?: {
      /**
       * @docid
       * @type Array<Object>
       * @default undefined
       */
      tabs?: Array<{
        /**
         * @docid
         * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
         */
        commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>,
        /**
         * @docid
         * @type Array<object>
         */
        groups?: Array<{
          /**
           * @docid
           * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
           */
          commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>,
          /**
           * @docid
           */
          title?: string
        }>,
        /**
         * @docid
         */
        title?: string
      }>,
      /**
      * @docid
      * @type Enums.DiagramPanelVisibility
      * @default 'auto'
      */
      visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled'
    };
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid
     * @type Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showGrid?: boolean;
    /**
     * @docid
     * @type Boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    simpleView?: boolean;
    /**
     * @docid
     * @type Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    snapToGrid?: boolean;
    /**
     * @docid
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mainToolbar?: {
      /**
      * @docid
      * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
      * @default undefined
      */
      commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>,
      /**
      * @docid
      * @default false
      */
      visible?: boolean
    };
    /**
     * @docid
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    historyToolbar?: {
      /**
      * @docid
      * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
      * @default undefined
      */
      commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>,
      /**
      * @docid
      * @default true
      */
      visible?: boolean
    };
    /**
     * @docid
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    viewToolbar?: {
      /**
      * @docid
      * @type Array<dxDiagramCustomCommand>|Array<Enums.DiagramCommand>
      * @default undefined
      */
      commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>,
      /**
      * @docid
      * @default true
      */
      visible?: boolean
    };
    /**
     * @docid
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
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
        category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string,
        /**
         * @docid
         * @type Enums.DiagramToolboxDisplayMode
         */
        displayMode?: 'icons' | 'texts',
        /**
         * @docid
         */
        expanded?: boolean,
        /**
         * @docid
         * @type Array<Enums.DiagramShapeType>|Array<String>
         */
        shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>,
        /**
         * @docid
         */
        title?: string
      }> | Array<'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom'>,
      /**
       * @docid
       * @default 3
       */
      shapeIconsPerRow?: number,
      /**
       * @docid
       * @default true
       */
      showSearch?: boolean,
      /**
      * @docid
      * @type Enums.DiagramPanelVisibility
      * @default 'auto'
      */
      visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled',
      /**
       * @docid
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
     * @type Number|Object
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    zoomLevel?: number | {
      /**
      * @docid
      * @type Array<Number>
      * @default undefined
      */
      items?: Array<number>,
      /**
      * @docid
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
 * @public
 */
export default class dxDiagram extends Widget {
    constructor(element: Element, options?: dxDiagramOptions)
    constructor(element: JQuery, options?: dxDiagramOptions)
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
 */
export interface dxDiagramConnector extends dxDiagramItem {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fromKey?: any;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fromId?: string;
    /**
     * @docid
     * @type Number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fromPointIndex?: number;
    /**
     * @docid
     * @type Array<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    points?: Array<{
      /**
       * @docid
       */
      x?: number,
      /**
       * @docid
       */
      y?: number
    }>;

    /**
     * @docid
     * @type Array<String>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: Array<string>;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toKey?: any;
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toId?: string;
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toPointIndex?: number;
}

/**
 * @docid
 */
export interface dxDiagramItem {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataItem?: any;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    id?: string;
    /**
     * @docid
     * @type Object
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
 */
export interface dxDiagramShape extends dxDiagramItem {
    /**
     * @docid
     * @type String
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
     * @type Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: {
      /**
       * @docid
       */
      x?: number,
      /**
       * @docid
       */
      y?: number
    };

    /**
     * @docid
     * @type Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    size?: {
      /**
       * @docid
       */
      height?: number,
      /**
       * @docid
       */
      width?: number
    };
    /**
     * @docid
     * @type Array<String>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    attachedConnectorIds?: string[];
}

/**
 * @docid
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
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @type Array<dxDiagramCustomCommand>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxDiagramCustomCommand>;
}

/**
 * @docid
 */
export interface dxDiagramAddShapeArgs {
    /**
     * @docid
     * @type dxDiagramShape
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shape?: dxDiagramShape;
    /**
     * @docid
     * @type Object
     */
    position?: {
      /**
       * @docid
       */
      x?: number,
      /**
       * @docid
       */
      y?: number
    };
}

/**
 * @docid
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
 */
export interface dxDiagramDeleteShapeArgs {
  /**
   * @docid
   * @type dxDiagramShape
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  shape?: dxDiagramShape;
}

/**
 * @docid
 */
export interface dxDiagramDeleteConnectorArgs {
  /**
   * @docid
   * @type dxDiagramConnector
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connector?: dxDiagramConnector;
}

/**
 * @docid
 */
export interface dxDiagramChangeConnectionArgs {
  /**
   * @docid
   * @type dxDiagramShape
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  newShape?: dxDiagramShape;
  /**
   * @docid
   * @type dxDiagramShape
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  oldShape?: dxDiagramShape;
  /**
   * @docid
   * @type dxDiagramConnector
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @type number
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
 */
export interface dxDiagramChangeConnectorPointsArgs {
  /**
   * @docid
   * @type dxDiagramConnector
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @type Array<Object>
   */
  newPoints?: Array<{
    /**
     * @docid
     */
    x?: number,
    /**
     * @docid
     */
    y?: number
  }>;
  /**
   * @docid
   * @type Array<Object>
   */
  oldPoints?: Array<{
    /**
     * @docid
     */
    x?: number,
    /**
     * @docid
     */
    y?: number
  }>;
}

/**
 * @docid
 */
export interface dxDiagramBeforeChangeShapeTextArgs {
  /**
   * @docid
   * @type dxDiagramShape
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  shape?: dxDiagramShape;
}

/**
 * @docid
 */
export interface dxDiagramChangeShapeTextArgs {
  /**
   * @docid
   * @type dxDiagramShape
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  shape?: dxDiagramShape;
  /**
   * @docid
   * @type string
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  text?: string;
}

/**
 * @docid
 */
export interface dxDiagramBeforeChangeConnectorTextArgs {
  /**
   * @docid
   * @type dxDiagramConnector
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @type number
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  index?: number;
}

/**
 * @docid
 */
export interface dxDiagramChangeConnectorTextArgs {
  /**
   * @docid
   * @type dxDiagramConnector
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  connector?: dxDiagramConnector;
  /**
   * @docid
   * @type number
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  index?: number;
  /**
   * @docid
   * @type string
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  text?: string;
}

/**
 * @docid
 */
export interface dxDiagramResizeShapeArgs {
  /**
   * @docid
   * @type dxDiagramShape
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  shape?: dxDiagramShape;
  /**
    * @docid
    * @type Array<Object>
    */
   newSize?: {
      /**
       * @docid
       */
      height?: number,
      /**
       * @docid
       */
      width?: number
   };
  /**
    * @docid
    * @type Array<Object>
    */
   oldSize?: {
      /**
       * @docid
       */
      height?: number,
      /**
       * @docid
       */
      width?: number
   };
}

/**
 * @docid
 */
export interface dxDiagramMoveShapeArgs {
  /**
   * @docid
   * @type dxDiagramShape
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  shape?: dxDiagramShape;
  /**
    * @docid
    * @type Array<Object>
    */
   newPosition?: {
      /**
       * @docid
       */
      x?: number,
      /**
       * @docid
       */
      y?: number
   };
  /**
    * @docid
    * @type Array<Object>
    */
   oldPosition?: {
      /**
       * @docid
       */
      x?: number,
      /**
       * @docid
       */
      y?: number
   };
}

declare global {
interface JQuery {
    dxDiagram(): JQuery;
    dxDiagram(options: "instance"): dxDiagram;
    dxDiagram(options: string): any;
    dxDiagram(options: string, ...params: any[]): any;
    dxDiagram(options: dxDiagramOptions): JQuery;
}
}
export type Options = dxDiagramOptions;

/** @deprecated use Options instead */
export type IOptions = dxDiagramOptions;
