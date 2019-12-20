import {
    JQueryPromise
} from '../../common';

import DOMComponent, {
    DOMComponentOptions
} from '../../core/dom_component';

import {
    dxElement
} from '../../core/element';

import {
    format
} from '../../ui/widget/ui.widget';

export interface BaseWidgetOptions<T = BaseWidget> extends DOMComponentOptions<T> {
    /**
     * @docid BaseWidgetOptions.disabled
     * @type boolean
     * @default false
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    disabled?: boolean;
    /**
     * @docid BaseWidgetOptions.export
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    export?: BaseWidgetExport;
    /**
     * @docid BaseWidgetOptions.loadingIndicator
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * @docid BaseWidgetOptions.margin
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: BaseWidgetMargin;
    /**
     * @docid BaseWidgetOptions.onDrawn
     * @extends Action
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onDrawn?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid BaseWidgetOptions.onExported
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onExported?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid BaseWidgetOptions.onExporting
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 fileName:string
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 format:string
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onExporting?: ((e: { component?: T, element?: dxElement, model?: any, fileName?: string, cancel?: boolean, format?: string }) => any);
    /**
     * @docid BaseWidgetOptions.onFileSaving
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field3 fileName:string
     * @type_function_param1_field4 format:string
     * @type_function_param1_field5 data:BLOB
     * @type_function_param1_field6 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onFileSaving?: ((e: { component?: T, element?: dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
    /**
     * @docid BaseWidgetOptions.onIncidentOccurred
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:any
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onIncidentOccurred?: ((e: { component?: T, element?: dxElement, model?: any, target?: any }) => any);
    /**
     * @docid BaseWidgetOptions.pathModified
     * @type boolean
     * @default false
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pathModified?: boolean;
    /**
     * @docid BaseWidgetOptions.redrawOnResize
     * @type boolean
     * @default true
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    redrawOnResize?: boolean;
    /**
     * @docid BaseWidgetOptions.rtlEnabled
     * @type boolean
     * @notUsedInTheme
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid BaseWidgetOptions.size
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: BaseWidgetSize;
    /**
     * @docid BaseWidgetOptions.theme
     * @type Enums.VizTheme
     * @default 'generic.light'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    theme?: 'generic.dark' | 'generic.light' | 'generic.contrast' | 'ios7.default' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';
    /**
     * @docid BaseWidgetOptions.title
     * @type object|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: BaseWidgetTitle | string;
    /**
     * @docid BaseWidgetOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseWidgetTooltip;
}
export interface BaseWidgetExport {
    /**
     * @docid BaseWidgetOptions.export.backgroundColor
     * @type string
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseWidgetOptions.export.enabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseWidgetOptions.export.fileName
     * @type string
     * @default 'file'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fileName?: string;
    /**
     * @docid BaseWidgetOptions.export.formats
     * @type Array<Enums.ExportFormat>
     * @default ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF']
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    formats?: Array<'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG'>;
    /**
     * @docid BaseWidgetOptions.export.margin
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number;
    /**
     * @docid BaseWidgetOptions.export.printingEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    printingEnabled?: boolean;
    /**
     * @docid BaseWidgetOptions.export.proxyUrl
     * @type string
     * @default undefined
     * @deprecated
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    proxyUrl?: string;
    /**
     * @docid BaseWidgetOptions.export.svgToCanvas
     * @type function
     * @type_function_param1 svg:SVGElement
     * @type_function_param2 canvas:HTMLCanvasElement
     * @type_function_return Promise<void>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    svgToCanvas?: ((svg: SVGElement, canvas: HTMLCanvasElement) => Promise<void> | JQueryPromise<void>);
}
export interface BaseWidgetLoadingIndicator {
    /**
     * @docid BaseWidgetOptions.loadingIndicator.backgroundColor
     * @type string
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.enabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.font
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.show
     * @type boolean
     * @default false
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show?: boolean;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.text
     * @type string
     * @default 'Loading...'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface BaseWidgetMargin {
    /**
     * @docid BaseWidgetOptions.margin.bottom
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bottom?: number;
    /**
     * @docid BaseWidgetOptions.margin.left
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    left?: number;
    /**
     * @docid BaseWidgetOptions.margin.right
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    right?: number;
    /**
     * @docid BaseWidgetOptions.margin.top
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    top?: number;
}
export interface BaseWidgetSize {
    /**
     * @docid BaseWidgetOptions.size.height
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid BaseWidgetOptions.size.width
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface BaseWidgetTitle {
    /**
     * @docid BaseWidgetOptions.title.font
     * @type Font
     * @default '#232323' [prop](color)
     * @default 28 [prop](size)
     * @default 200 [prop](weight)
     * @extends CommonVizLightFontFamily
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid BaseWidgetOptions.title.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid BaseWidgetOptions.title.margin
     * @type number | object
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number | { bottom?: number, left?: number, right?: number, top?: number };
    /**
     * @docid BaseWidgetOptions.title.placeholderSize
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    placeholderSize?: number;
    /**
     * @docid BaseWidgetOptions.title.subtitle
     * @type object|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subtitle?: { font?: Font, offset?: number, text?: string, textOverflow?: 'ellipsis' | 'hide' | 'none', wordWrap?: 'normal' | 'breakWord' | 'none' } | string;
    /**
     * @docid BaseWidgetOptions.title.text
     * @type string
     * @default null
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid BaseWidgetOptions.title.textOverflow
     * @type Enums.VizTextOverflow
     * @default "ellipsis"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    textOverflow?: 'ellipsis' | 'hide' | 'none';
    /**
     * @docid BaseWidgetOptions.title.verticalAlignment
     * @type Enums.VerticalEdge
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'top';
    /**
     * @docid BaseWidgetOptions.title.wordWrap
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: 'normal' | 'breakWord' | 'none';
}
export interface BaseWidgetTooltip {
    /**
     * @docid BaseWidgetOptions.tooltip.arrowLength
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowLength?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid BaseWidgetOptions.tooltip.color
     * @type string
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid BaseWidgetOptions.tooltip.container
     * @type string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    container?: string | Element | JQuery;
    /**
     * @docid BaseWidgetOptions.tooltip.cornerRadius
     * @type number
     * @default 0
     * @default 4 [for](Material)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    cornerRadius?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.enabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseWidgetOptions.tooltip.font
     * @type Font
     * @default '#232323' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid BaseWidgetOptions.tooltip.format
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
    /**
     * @docid BaseWidgetOptions.tooltip.opacity
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.paddingLeftRight
     * @type number
     * @default 18
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.paddingTopBottom
     * @type number
     * @default 15
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.shadow
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number };
    /**
     * @docid BaseWidgetOptions.tooltip.zIndex
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zIndex?: number;
}
/**
 * @docid BaseWidget
 * @type object
 * @hidden
 * @inherits DOMComponent
 * @prevFileNamespace DevExpress.viz
 */
export default class BaseWidget extends DOMComponent {
    constructor(element: Element, options?: BaseWidgetOptions)
    constructor(element: JQuery, options?: BaseWidgetOptions)
    /**
     * @docid BaseWidgetMethods.exportTo
     * @publicName exportTo(fileName, format)
     * @param1 fileName:string
     * @param2 format:string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    exportTo(fileName: string, format: string): void;
    /**
     * @docid BaseWidgetMethods.getSize
     * @publicName getSize()
     * @return BaseWidgetOptions.size
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getSize(): BaseWidgetSize;
    /**
     * @docid BaseWidgetMethods.hideLoadingIndicator
     * @publicName hideLoadingIndicator()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideLoadingIndicator(): void;
    /**
     * @docid BaseWidgetMethods.print
     * @publicName print()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    print(): void;
    /**
     * @docid BaseWidgetMethods.render
     * @publicName render()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    render(): void;
    /**
     * @docid BaseWidgetMethods.showLoadingIndicator
     * @publicName showLoadingIndicator()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showLoadingIndicator(): void;
    /**
     * @docid BaseWidgetMethods.svg
     * @publicName svg()
     * @return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    svg(): string;
}

export interface Font {
    /**
     * @docid Font.color
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid Font.family
     * @type string
     * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    family?: string;
    /**
     * @docid Font.opacity
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid Font.size
     * @type string|number
     * @default 12
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: string | number;
    /**
     * @docid Font.weight
     * @type number
     * @default 400
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    weight?: number;
}
