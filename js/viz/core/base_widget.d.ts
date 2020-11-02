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
     * @docid
     * @type boolean
     * @default false
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    export?: BaseWidgetExport;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: BaseWidgetMargin;
    /**
     * @docid
     * @extends Action
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onDrawn?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onExported?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid
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
     * @docid
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
     * @docid
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
     * @docid
     * @type boolean
     * @default false
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pathModified?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    redrawOnResize?: boolean;
    /**
     * @docid
     * @type boolean
     * @notUsedInTheme
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: BaseWidgetSize;
    /**
     * @docid
     * @type Enums.VizTheme
     * @default 'generic.light'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    theme?: 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: BaseWidgetTitle | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseWidgetTooltip;
}
export interface BaseWidgetExport {
    /**
     * @docid
     * @type string
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @type string
     * @default 'file'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fileName?: string;
    /**
     * @docid
     * @type Array<Enums.ExportFormat>
     * @default ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF']
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    formats?: Array<'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG'>;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    printingEnabled?: boolean;
    /**
     * @docid
     * @type string
     * @default undefined
     * @deprecated
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    proxyUrl?: string;
    /**
     * @docid
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
/**
 * @docid
 * @hidden
 * @type object
 */
export interface BaseWidgetLoadingIndicator {
    /**
     * @docid
     * @type string
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @type boolean
     * @default false
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show?: boolean;
    /**
     * @docid
     * @type string
     * @default 'Loading...'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface BaseWidgetMargin {
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bottom?: number;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    left?: number;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    right?: number;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    top?: number;
}
export interface BaseWidgetSize {
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface BaseWidgetTitle {
    /**
     * @docid
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
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type number | object
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number | {
      /**
       * @docid
       * @type number
       * @default 10
       */
      bottom?: number,
      /**
       * @docid
       * @type number
       * @default 10
       */
      left?: number,
      /**
       * @docid
       * @type number
       * @default 10
       */
      right?: number,
      /**
       * @docid
       * @type number
       * @default 10
       */
      top?: number
    };
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    placeholderSize?: number;
    /**
     * @docid
     * @type object|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subtitle?: {
      /**
      * @docid
       * @type Font
       * @default '#232323' [prop](color)
       * @default 16 [prop](size)
       * @default 200 [prop](weight)
       * @extends CommonVizLightFontFamily
       */
      font?: Font,
      /**
       * @docid
       * @type number
       * @default 0
       */
      offset?: number,
      /**
       * @docid
       * @type string
       * @default null
       */
      text?: string,
      /**
       * @docid
       * @type Enums.VizTextOverflow
       * @default "ellipsis"
       */
      textOverflow?: VizTextOverflowType,
      /**
       * @docid
       * @type Enums.VizWordWrap
       * @default "normal"
       */
      wordWrap?: WordWrapType
    } | string;
    /**
     * @docid
     * @type string
     * @default null
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid
     * @type Enums.VizTextOverflow
     * @default "ellipsis"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    textOverflow?: VizTextOverflowType;
    /**
     * @docid
     * @type Enums.VerticalEdge
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'top';
    /**
     * @docid
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: WordWrapType;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface BaseWidgetTooltip {
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowLength?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid
       * @type string
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid
       * @type number
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid
       * @type boolean
       * @default true
       */
      visible?: boolean,
      /**
       * @docid
       * @default 1
       * @type number
       */
      width?: number
    };
    /**
     * @docid
     * @type string
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    container?: string | Element | JQuery;
    /**
     * @docid
     * @type number
     * @default 0
     * @default 4 [for](Material)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    cornerRadius?: number;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @type Font
     * @default '#232323' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @type number
     * @default 18
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid
     * @type number
     * @default 15
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shadow?: {
      /**
       * @docid
       * @type number
       * @default 2
       */
      blur?: number,
      /**
       * @docid
       * @type string
       * @default #000000
       */
      color?: string,
      /**
       * @docid
       * @type number
       * @default 0
       */
      offsetX?: number,
      /**
       * @docid
       * @type number
       * @default 4
       */
      offsetY?: number,
      /**
       * @docid
       * @type number
       * @default 0.4
       */
      opacity?: number
    };
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zIndex?: number;
}
/**
 * @docid
 * @type object
 * @hidden
 * @inherits DOMComponent
 * @prevFileNamespace DevExpress.viz
 */
export default class BaseWidget extends DOMComponent {
    constructor(element: Element, options?: BaseWidgetOptions)
    constructor(element: JQuery, options?: BaseWidgetOptions)
    /**
     * @docid
     * @publicName exportTo(fileName, format)
     * @param1 fileName:string
     * @param2 format:string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    exportTo(fileName: string, format: string): void;
    /**
     * @docid
     * @publicName getSize()
     * @return BaseWidgetOptions.size
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getSize(): BaseWidgetSize;
    /**
     * @docid
     * @publicName hideLoadingIndicator()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideLoadingIndicator(): void;
    /**
     * @docid
     * @publicName print()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    print(): void;
    /**
     * @docid
     * @publicName render()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    render(): void;
    /**
     * @docid
     * @publicName showLoadingIndicator()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showLoadingIndicator(): void;
    /**
     * @docid
     * @publicName svg()
     * @return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    svg(): string;
}

/**
 * @docid
 * @type object
 * @hidden
 */
export interface Font {
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type string
     * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    family?: string;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @type string|number
     * @default 12
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: string | number;
    /**
     * @docid
     * @type number
     * @default 400
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    weight?: number;
}

/**
* @docid
* @type object
*/
export interface BaseWidgetAnnotationConfig {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDragging?: boolean;
    /**
     * @docid
     * @type number
     * @default 14
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowLength?: number;
    /**
     * @docid
     * @type number
     * @default 14
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowWidth?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
      * @docid
      * @default '#dddddd'
      */
      color?: string,
      /**
      * @docid
      * @default 0
      * @default 4 [for](Material)
      */
      cornerRadius?: number,
      /**
      * @docid
      * @type Enums.DashStyle
      * @default 'solid'
      */
      dashStyle?: DashStyleType,
      /**
      * @docid
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid
      * @default true
      */
      visible?: boolean,
      /**
      * @docid
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
     * @type string
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    description?: string;
    /**
     * @docid
     * @type Font
     * @default '#333333' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid
     * @type string|object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | {
      /**
      * @docid
      * @default 30
      */
      height?: number,
      /**
      * @docid
      * @default undefined
      */
      url?: string,
      /**
      * @docid
      * @default 30
      */
      width?: number
    };
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offsetX?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offsetY?: number;
    /**
     * @docid
     * @type number
     * @default 0.9
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shadow?: {
      /**
      * @docid
      * @default 4
      */
      blur?: number,
      /**
      * @docid
      * @default '#000000'
      */
      color?: string,
      /**
      * @docid
      * @default 0
      */
      offsetX?: number,
      /**
      * @docid
      * @default 1
      */
      offsetY?: number,
      /**
      * @docid
      * @default 0.15
      */
      opacity?: number
    };
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid
     * @type Enums.VizTextOverflow
     * @default "ellipsis"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    textOverflow?: VizTextOverflowType;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipEnabled?: boolean;
    /**
     * @docid
     * @type Enums.AnnotationType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'text' | 'image' | 'custom';
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
    /**
     * @docid
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: WordWrapType;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    x?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    y?: number;
}
