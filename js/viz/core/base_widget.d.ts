import '../../jquery_augmentation';

import DOMComponent, {
    DOMComponentOptions
} from '../../core/dom_component';

import {
    dxElement
} from '../../core/element';

import {
    format
} from '../../ui/widget/ui.widget';

import {
    DashStyleType
} from '../common';

export type WordWrapType = 'normal' | 'breakWord' | 'none';
export type VizTextOverflowType = 'ellipsis' | 'hide' | 'none';

export interface BaseWidgetOptions<T = BaseWidget> extends DOMComponentOptions<T> {
    /**
     * @docid BaseWidgetOptions.disabled
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
     * @default false
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pathModified?: boolean;
    /**
     * @docid BaseWidgetOptions.redrawOnResize
     * @default true
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    redrawOnResize?: boolean;
    /**
     * @docid BaseWidgetOptions.rtlEnabled
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
    theme?: 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';
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
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseWidgetOptions.export.enabled
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseWidgetOptions.export.fileName
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
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number;
    /**
     * @docid BaseWidgetOptions.export.printingEnabled
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    printingEnabled?: boolean;
    /**
     * @docid BaseWidgetOptions.export.proxyUrl
     * @default undefined
     * @deprecated
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    proxyUrl?: string;
    /**
     * @docid BaseWidgetOptions.export.svgToCanvas
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
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.enabled
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
     * @default false
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show?: boolean;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.text
     * @default 'Loading...'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface BaseWidgetMargin {
    /**
     * @docid BaseWidgetOptions.margin.bottom
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bottom?: number;
    /**
     * @docid BaseWidgetOptions.margin.left
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    left?: number;
    /**
     * @docid BaseWidgetOptions.margin.right
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    right?: number;
    /**
     * @docid BaseWidgetOptions.margin.top
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    top?: number;
}
export interface BaseWidgetSize {
    /**
     * @docid BaseWidgetOptions.size.height
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid BaseWidgetOptions.size.width
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
    subtitle?: { font?: Font, offset?: number, text?: string, textOverflow?: VizTextOverflowType, wordWrap?: WordWrapType } | string;
    /**
     * @docid BaseWidgetOptions.title.text
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
    textOverflow?: VizTextOverflowType;
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
    wordWrap?: WordWrapType;
}
export interface BaseWidgetTooltip {
    /**
     * @docid BaseWidgetOptions.tooltip.arrowLength
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
    border?: { color?: string, dashStyle?: DashStyleType, opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid BaseWidgetOptions.tooltip.color
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid BaseWidgetOptions.tooltip.container
     * @type string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    container?: string | Element | JQuery;
    /**
     * @docid BaseWidgetOptions.tooltip.cornerRadius
     * @default 0
     * @default 4 [for](Material)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    cornerRadius?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.enabled
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.paddingLeftRight
     * @default 18
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.paddingTopBottom
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid Font.family
     * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    family?: string;
    /**
     * @docid Font.opacity
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
     * @default 400
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    weight?: number;
}

export interface BaseWidgetAnnotationConfig {
    /**
     * @docid BaseWidgetAnnotationConfig.allowDragging
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDragging?: boolean;
    /**
     * @docid BaseWidgetAnnotationConfig.arrowLength
     * @default 14
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowLength?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.arrowWidth
     * @default 14
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowWidth?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyleType, opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid BaseWidgetAnnotationConfig.color
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid BaseWidgetAnnotationConfig.data
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid BaseWidgetAnnotationConfig.description
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    description?: string;
    /**
     * @docid BaseWidgetAnnotationConfig.font
     * @type Font
     * @default '#333333' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid BaseWidgetAnnotationConfig.height
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.image
     * @type string|object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | { height?: number, url?: string, width?: number };
    /**
     * @docid BaseWidgetAnnotationConfig.offsetX
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offsetX?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.offsetY
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offsetY?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.opacity
     * @default 0.9
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.paddingLeftRight
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.paddingTopBottom
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.shadow
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number };
    /**
     * @docid BaseWidgetAnnotationConfig.text
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid BaseWidgetAnnotationConfig.textOverflow
     * @type Enums.VizTextOverflow
     * @default "ellipsis"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    textOverflow?: VizTextOverflowType;
    /**
     * @docid BaseWidgetAnnotationConfig.tooltipEnabled
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipEnabled?: boolean;
    /**
     * @docid BaseWidgetAnnotationConfig.type
     * @type Enums.AnnotationType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'text' | 'image' | 'custom';
    /**
     * @docid BaseWidgetAnnotationConfig.width
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.wordWrap
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: WordWrapType;
    /**
     * @docid BaseWidgetAnnotationConfig.x
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    x?: number;
    /**
     * @docid BaseWidgetAnnotationConfig.y
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    y?: number;
}