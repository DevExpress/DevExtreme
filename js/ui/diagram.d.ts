import {
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
  EventInfo,
  InitializedEventInfo,
  ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
  DiagramDataLayoutType,
  DiagramDataLayoutOrientation,
  DiagramUnits,
  DiagramPageOrientation,
  DiagramShapeCategory,
  DiagramShapeType,
  DiagramConnectorLineType,
  DiagramConnectorLineEnd,
  DiagramToolboxDisplayMode,
  DiagramCommand,
  DiagramPanelVisibility,
  DiagramAutoZoomMode,
  DiagramItemType,
  DiagramExportFormat,
  DiagramModelOperation,
  DiagramRequestEditOperationReason,
  DiagramConnectorPosition,
} from '../docEnums';

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
    readonly operation: DiagramModelOperation;
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
       * @type Array<dxDiagramCustomCommand>|Array<DiagramCommand>
       * @default undefined
       */
      commands?: Array<'lineStyle' | 'lineWidth' | DiagramCommand >;
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
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 name:String
     * @action
     * @public
     */
    onCustomCommand?: ((e: CustomCommandEvent) => void);
    /**
     * @docid
     * @type_function_param1 container:dxSVGElement
     * @type_function_param2 data:object
     * @type_function_param2_field1 item:dxDiagramShape
     * @type_function_return void
     * @public
     */
    customShapeTemplate?: template | ((container: DxElement<SVGElement>, data: CustomShapeTemplateData) => any);
    /**
     * @docid
     * @type_function_param1 container:dxSVGElement
     * @type_function_param2 data:object
     * @type_function_param2_field1 item:dxDiagramShape
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
       * @type_function_param2_field1 item:dxDiagramShape
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
       * @type_function_param2_field1 item:dxDiagramShape
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
       * @type_function_param1 data:object
       * @default undefined
       */
      customDataExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @default null
       */
      dataSource?: Array<any> | Store | DataSource | DataSourceOptions;
      /**
       * @docid
       * @type_function_param1 data:object
       * @default "from"
       */
      fromExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      fromLineEndExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      fromPointIndexExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default "id"
       */
      keyExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      lineTypeExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      lockedExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      pointsExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      styleExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      textExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      textStyleExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default "to"
       */
      toExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      toLineEndExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      toPointIndexExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      zIndexExpr?: string | ((data: any) => any);
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
        orientation?: DiagramDataLayoutOrientation;
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
       * @type_function_param1 data:object
       * @default "children"
       */
      containerChildrenExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      containerKeyExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      customDataExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @default null
       */
      dataSource?: Array<any> | Store | DataSource | DataSourceOptions;
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      heightExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      imageUrlExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      itemsExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default "id"
       */
      keyExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      leftExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      lockedExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      parentKeyExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      styleExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default "text"
       */
      textExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      textStyleExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      topExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default "type"
       */
      typeExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      widthExpr?: string | ((data: any) => any);
      /**
       * @docid
       * @type_function_param1 data:object
       * @default undefined
       */
      zIndexExpr?: string | ((data: any) => any);
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
     * @type_function_param1_field1 component:dxDiagram
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 item:dxDiagramItem
     * @action
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
     * @type_function_param1_field4 operation:DiagramModelOperation
     * @type_function_param1_field5 args:dxDiagramAddShapeArgs|dxDiagramAddShapeFromToolboxArgs|dxDiagramDeleteShapeArgs|dxDiagramDeleteConnectorArgs|dxDiagramChangeConnectionArgs|dxDiagramChangeConnectorPointsArgs|dxDiagramBeforeChangeShapeTextArgs|dxDiagramChangeShapeTextArgs|dxDiagramBeforeChangeConnectorTextArgs|dxDiagramChangeConnectorTextArgs|dxDiagramResizeShapeArgs|dxDiagramMoveShapeArgs
     * @type_function_param1_field6 reason:DiagramRequestEditOperationReason
     * @type_function_param1_field7 allowed:boolean
     * @action
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
    pageOrientation?: DiagramPageOrientation;
    /**
     * @docid
     * @public
     */
    pageSize?: {
      /**
       * @docid
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
         * @type Array<dxDiagramCustomCommand>|Array<DiagramCommand>
         */
        commands?: Array<'lineStyle' | 'lineWidth' | DiagramCommand>;
        /**
         * @docid
         */
        groups?: Array<{
          /**
           * @docid
           * @type Array<dxDiagramCustomCommand>|Array<DiagramCommand>
           */
          commands?: Array<'lineStyle' | 'lineWidth' | DiagramCommand>;
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
       * @type Array<dxDiagramCustomCommand>|Array<DiagramCommand>
       * @default undefined
       */
      commands?: Array<'lineStyle' | 'lineWidth' | DiagramCommand>;
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
       * @type Array<dxDiagramCustomCommand>|Array<DiagramCommand>
       * @default undefined
       */
      commands?: Array<'lineStyle' | 'lineWidth' | DiagramCommand>;
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
       * @type Array<dxDiagramCustomCommand>|Array<DiagramCommand>
       * @default undefined
       */
      commands?: Array<'lineStyle' | 'lineWidth' | DiagramCommand>;
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
       * @type Array<Object>|Array<DiagramShapeCategory>
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
       */
      value?: number;
    };
}
/**
 * @docid
 * @inherits Widget
 * @module ui/diagram
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDiagram extends Widget<dxDiagramOptions> {
    /**
     * @docid
     * @publicName getNodeDataSource()
     * @return DataSource
     * @public
     */
    getNodeDataSource(): DataSource;
    /**
     * @docid
     * @publicName getEdgeDataSource()
     * @return DataSource
     * @public
     */
    getEdgeDataSource(): DataSource;
    /**
     * @docid
     * @publicName getItemByKey(key)
     * @param1 key:Object
     * @return dxDiagramItem
     * @public
     */
    getItemByKey(key: Object): Item;
    /**
     * @docid
     * @publicName getItemById(id)
     * @param1 id:String
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
     * @return string
     * @public
     */
    export(): string;
    /**
     * @docid
     * @publicName exportTo(format, callback)
     * @param1 format:DiagramExportFormat
     * @param2 callback:function
     * @public
     */
    exportTo(format: DiagramExportFormat, callback: Function): void;
    /**
     * @docid
     * @publicName import(data, updateExistingItemsOnly)
     * @param1 data:string
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
     * @type String
     * @public
     */
    containerId?: string;
    /**
     * @docid dxDiagramShape.containerChildItemIds
     * @type Array<String>
     * @public
     */
    containerChildItemIds?: Array<String>;
    /**
     * @docid dxDiagramShape.containerExpanded
     * @type Boolean
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
     * @type String|DiagramCommand
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

/** @deprecated use Properties instead */
export type IOptions = dxDiagramOptions;
