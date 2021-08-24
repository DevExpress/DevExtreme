import DOMComponent from '../core/dom_component';

import {
    VerticalAlignment,
    HorizontalAlignment,
    ExportFormat,
} from '../docEnums';

/**
 * @docid viz.exportFromMarkup
 * @publicName exportFromMarkup(markup, options)
 * @param1 markup:string
 * @param2 options:object
 * @param2_field1 fileName:string
 * @param2_field2 format:string
 * @param2_field3 backgroundColor:string
 * @param2_field4 proxyUrl:string:deprecated
 * @param2_field5 width:number
 * @param2_field6 height:number
 * @param2_field7 onExporting:function(e)
 * @param2_field8 onExported:function
 * @param2_field9 onFileSaving:function(e)
 * @param2_field10 margin:number
 * @param2_field11 svgToCanvas: function(svg, canvas)
 * @static
 * @module viz/export
 * @export exportFromMarkup
 * @public
 */
export function exportFromMarkup(markup: string, options: { fileName?: string; format?: string; backgroundColor?: string; proxyUrl?: string; width?: number; height?: number; onExporting?: Function; onExported?: Function; onFileSaving?: Function; margin?: number; svgToCanvas?: Function }): void;

/**
 * @docid viz.exportWidgets
 * @publicName exportWidgets(widgetInstances)
 * @param1 widgetInstances:Array<Array<DOMComponent>>
 * @static
 * @module viz/export
 * @export exportWidgets
 * @public
 */
export function exportWidgets(widgetInstances: Array<Array<DOMComponent>>): void;

/**
 * @docid viz.exportWidgets
 * @publicName exportWidgets(widgetInstances, options)
 * @param1 widgetInstances:Array<Array<DOMComponent>>
 * @param2 options:object
 * @param2_field1 fileName:string
 * @param2_field2 format:ExportFormat
 * @param2_field3 backgroundColor:string
 * @param2_field4 margin:number
 * @param2_field5 gridLayout:boolean
 * @param2_field6 verticalAlignment:VerticalAlignment
 * @param2_field7 horizontalAlignment:HorizontalAlignment
 * @param2_field8 proxyUrl:string:deprecated
 * @param2_field9 onExporting:function(e)
 * @param2_field10 onExported:function
 * @param2_field11 onFileSaving:function(e)
 * @param2_field12 svgToCanvas: function(svg, canvas)
 * @static
 * @module viz/export
 * @export exportWidgets
 * @public
 */
export function exportWidgets(widgetInstances: Array<Array<DOMComponent>>, options: { fileName?: string; format?: ExportFormat; backgroundColor?: string; margin?: number; gridLayout?: boolean; verticalAlignment?: VerticalAlignment; horizontalAlignment?: HorizontalAlignment; proxyUrl?: string; onExporting?: Function; onExported?: Function; onFileSaving?: Function; svgToCanvas?: Function }): void;

/**
 * @docid viz.getMarkup
 * @publicName getMarkup(widgetInstances)
 * @param1 widgetInstances:Array<DOMComponent>
 * @return string
 * @static
 * @module viz/export
 * @export getMarkup
 * @public
 */
export function getMarkup(widgetInstances: Array<DOMComponent>): string;
