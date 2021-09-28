import DOMComponent from '../core/dom_component';

/**
 * @docid viz.exportFromMarkup
 * @publicName exportFromMarkup(markup, options)
 * @param2_field4 proxyUrl:string:deprecated
 * @param2_field7 onExporting:function(e)
 * @param2_field8 onExported:function
 * @param2_field9 onFileSaving:function(e)
 * @param2_field11 svgToCanvas: function(svg, canvas)
 * @static
 * @public
 */
export function exportFromMarkup(markup: string, options: { fileName?: string; format?: string; backgroundColor?: string; proxyUrl?: string; width?: number; height?: number; onExporting?: Function; onExported?: Function; onFileSaving?: Function; margin?: number; svgToCanvas?: Function }): void;

/**
 * @docid viz.exportWidgets
 * @publicName exportWidgets(widgetInstances)
 * @static
 * @public
 */
export function exportWidgets(widgetInstances: Array<Array<DOMComponent>>): void;

/**
 * @docid viz.exportWidgets
 * @publicName exportWidgets(widgetInstances, options)
 * @param2_field2 format:Enums.ExportFormat
 * @param2_field6 verticalAlignment:Enums.VerticalAlignment
 * @param2_field7 horizontalAlignment:Enums.HorizontalAlignment
 * @param2_field8 proxyUrl:string:deprecated
 * @param2_field9 onExporting:function(e)
 * @param2_field10 onExported:function
 * @param2_field11 onFileSaving:function(e)
 * @param2_field12 svgToCanvas: function(svg, canvas)
 * @static
 * @public
 */
export function exportWidgets(widgetInstances: Array<Array<DOMComponent>>, options: { fileName?: string; format?: 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG'; backgroundColor?: string; margin?: number; gridLayout?: boolean; verticalAlignment?: 'bottom' | 'center' | 'top'; horizontalAlignment?: 'center' | 'left' | 'right'; proxyUrl?: string; onExporting?: Function; onExported?: Function; onFileSaving?: Function; svgToCanvas?: Function }): void;

/**
 * @docid viz.getMarkup
 * @publicName getMarkup(widgetInstances)
 * @static
 * @public
 */
export function getMarkup(widgetInstances: Array<DOMComponent>): string;
