import {
    dxElement
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
     * @docid dxDiagramOptions.autoZoomMode
     * @type Enums.DiagramAutoZoomMode
     * @default "disabled"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoZoomMode?: 'fitContent' | 'fitWidth' | 'disabled';
    /**
     * @docid dxDiagramOptions.contextMenu
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextMenu?: { commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>, enabled?: boolean };
    /**
     * @docid dxDiagramOptions.contextToolbox
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextToolbox?: { category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string, displayMode?: 'icons' | 'texts', enabled?: boolean, shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string> };
    /**
     * @docid dxDiagramOptions.onCustomCommand
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
     * @docid dxDiagramOptions.customShapeTemplate
     * @type template|function
     * @type_function_param1 container:dxElement
     * @type_function_param2 data:object
     * @type_function_param2_field1 item:dxDiagramShape
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customShapeTemplate?: template | ((container: dxElement, data: { item?: dxDiagramShape }) => any);
    /**
     * @docid dxDiagramOptions.customShapes
     * @type Array<Object>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customShapes?: Array<{ allowEditImage?: boolean, allowEditText?: boolean, allowResize?: boolean, backgroundImageHeight?: number, backgroundImageLeft?: number, backgroundImageTop?: number, backgroundImageUrl?: string, backgroundImageToolboxUrl?: string, backgroundImageWidth?: number, baseType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string, category?: string, connectionPoints?: Array<{ x?: number, y?: number }>, defaultHeight?: number, defaultImageUrl?: string, defaultText?: string, defaultWidth?: number, imageHeight?: number, imageLeft?: number, imageTop?: number, imageWidth?: number, maxHeight?: number, maxWidth?: number, minHeight?: number, minWidth?: number, template?: template | ((container: dxElement, data: { item?: dxDiagramShape }) => any), templateHeight?: number, templateLeft?: number, templateTop?: number, templateWidth?: number, textHeight?: number, textLeft?: number, textTop?: number, textWidth?: number, title?: string, type?: string }>;
    /**
     * @docid dxDiagramOptions.edges
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    edges?: { dataSource?: Array<any> | DataSource | DataSourceOptions, fromExpr?: string | ((data: any) => any), fromLineEndExpr?: string | ((data: any) => any), fromPointIndexExpr?: string | ((data: any) => any), keyExpr?: string | ((data: any) => any), lineTypeExpr?: string | ((data: any) => any), lockedExpr?: string | ((data: any) => any), pointsExpr?: string | ((data: any) => any), styleExpr?: string | ((data: any) => any), textExpr?: string | ((data: any) => any), textStyleExpr?: string | ((data: any) => any), toExpr?: string | ((data: any) => any), toLineEndExpr?: string | ((data: any) => any), toPointIndexExpr?: string | ((data: any) => any), zIndexExpr?: string | ((data: any) => any) };
    /**
     * @docid dxDiagramOptions.export
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    export?: { fileName?: string, proxyUrl?: string };
    /**
     * @docid dxDiagramOptions.fullScreen
     * @type Boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fullScreen?: boolean;
    /**
     * @docid dxDiagramOptions.gridSize
     * @type Number|Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    gridSize?: number | { items?: Array<number>, value?: number };
    /**
     * @docid dxDiagramOptions.nodes
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    nodes?: { autoLayout?: 'off' | 'tree' | 'layered' | { orientation?: 'auto' | 'vertical' | 'horizontal', type?: 'off' | 'tree' | 'layered' }, containerChildrenExpr?: string | ((data: any) => any), containerKeyExpr?: string | ((data: any) => any), dataSource?: Array<any> | DataSource | DataSourceOptions, heightExpr?: string | ((data: any) => any), imageUrlExpr?: string | ((data: any) => any), itemsExpr?: string | ((data: any) => any), keyExpr?: string | ((data: any) => any), leftExpr?: string | ((data: any) => any), lockedExpr?: string | ((data: any) => any), parentKeyExpr?: string | ((data: any) => any), styleExpr?: string | ((data: any) => any), textExpr?: string | ((data: any) => any), textStyleExpr?: string | ((data: any) => any), topExpr?: string | ((data: any) => any), typeExpr?: string | ((data: any) => any), widthExpr?: string | ((data: any) => any), zIndexExpr?: string | ((data: any) => any) };
    /**
     * @docid dxDiagramOptions.hasChanges
     * @type Boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasChanges?: boolean;
    /**
     * @docid dxDiagramOptions.onItemClick
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
     * @docid dxDiagramOptions.onItemDblClick
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
     * @docid dxDiagramOptions.onSelectionChanged
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
     * @docid dxDiagramOptions.pageColor
     * @type String
     * @default "white"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageColor?: string;
    /**
     * @docid dxDiagramOptions.pageOrientation
     * @type Enums.DiagramPageOrientation
     * @default "portrait"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageOrientation?: 'portrait' | 'landscape';
    /**
     * @docid dxDiagramOptions.pageSize
     * @type Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageSize?: { height?: number, items?: Array<{ height?: number, text?: string, width?: number }>, width?: number };
    /**
     * @docid dxDiagramOptions.propertiesPanel
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    propertiesPanel?: { tabs?: Array<{ commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'> }>, visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled' };
    /**
     * @docid dxDiagramOptions.readOnly
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid dxDiagramOptions.showGrid
     * @type Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showGrid?: boolean;
    /**
     * @docid dxDiagramOptions.simpleView
     * @type Boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    simpleView?: boolean;
    /**
     * @docid dxDiagramOptions.snapToGrid
     * @type Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    snapToGrid?: boolean;
    /**
     * @docid dxDiagramOptions.mainToolbar
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mainToolbar?: { commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>, visible?: boolean };
    /**
     * @docid dxDiagramOptions.historyToolbar
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    historyToolbar?: { commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>, visible?: boolean };
    /**
     * @docid dxDiagramOptions.viewToolbar
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    viewToolbar?: { commands?: Array<'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'>, visible?: boolean };
    /**
     * @docid dxDiagramOptions.toolbox
     * @type Object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbox?: { groups?: Array<{ category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string, displayMode?: 'icons' | 'texts', expanded?: boolean, shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>, title?: string }> | Array<'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom'>, visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled' };
    /**
     * @docid dxDiagramOptions.units
     * @type Enums.DiagramUnits
     * @default "in"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    units?: 'in' | 'cm' | 'px';
    /**
     * @docid dxDiagramOptions.viewUnits
     * @type Enums.DiagramUnits
     * @default "in"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    viewUnits?: 'in' | 'cm' | 'px';
    /**
     * @docid dxDiagramOptions.zoomLevel
     * @type Number|Object
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    zoomLevel?: number | { items?: Array<number>, value?: number };
}
/**
 * @docid dxDiagram
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
     * @docid dxDiagramMethods.export
     * @publicName export()
     * @return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    export(): string;
    /**
     * @docid dxDiagramMethods.exportTo
     * @publicName exportTo(format, callback)
     * @param1 format:Enums.DiagramExportFormat
     * @param2 callback:function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    exportTo(format: 'svg' | 'png' | 'jpg', callback: Function): void;
    /**
     * @docid dxDiagramMethods.import
     * @publicName import(data, updateExistingItemsOnly)
     * @param1 data:string
     * @param2 updateExistingItemsOnly?:boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    import(data: string, updateExistingItemsOnly?: boolean): void;
}

export interface dxDiagramConnector extends dxDiagramItem {
    /**
     * @docid dxDiagramConnector.fromKey
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fromKey?: any;
    /**
     * @docid dxDiagramConnector.texts
     * @type Array<String>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: Array<string>;
    /**
     * @docid dxDiagramConnector.toKey
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toKey?: any;
}

export interface dxDiagramItem {
    /**
     * @docid dxDiagramItem.dataItem
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataItem?: any;
    /**
     * @docid dxDiagramItem.id
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    id?: string;
    /**
     * @docid dxDiagramItem.itemType
     * @type Enums.DiagramItemType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'shape' | 'connector';
}

export interface dxDiagramShape extends dxDiagramItem {
    /**
     * @docid dxDiagramShape.text
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid dxDiagramShape.type
     * @type Enums.DiagramShapeType|String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
}

export interface dxDiagramCustomCommand {
    /**
     * @docid dxDiagramCustomCommand.name
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxDiagramCustomCommand.text
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid dxDiagramCustomCommand.icon
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxDiagramCustomCommand.items
     * @type Array<dxDiagramCustomCommand>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxDiagramCustomCommand>;
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
