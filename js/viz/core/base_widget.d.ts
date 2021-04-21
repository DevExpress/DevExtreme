import DOMComponent, {
    DOMComponentOptions
} from '../../core/dom_component';

import {
  Device
} from '../../core/devices';

import {
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    TPromise
} from '../../core/utils/deferred';

import {
    EventInfo
} from '../../events/index';

import {
    format
} from '../../ui/widget/ui.widget';

import {
    DashStyleType
} from '../common';

export type WordWrapType = 'normal' | 'breakWord' | 'none';
export type VizTextOverflowType = 'ellipsis' | 'hide' | 'none';

export interface ExportInfo {
  readonly fileName: string;
  readonly format: string;
}

export interface IncidentInfo {
  readonly target: any;
}

export interface FileSavingEventInfo<T> {
  readonly component: T;
  readonly element: DxElement;
  readonly fileName: string;
  readonly format: string;
  readonly data: Blob;
}

export interface BaseWidgetOptions<T = BaseWidget> extends DOMComponentOptions<T> {
    /**
     * @docid
     * @default false
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    export?: BaseWidgetExport;
    /**
     * @docid
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: BaseWidgetMargin;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onDrawn?: ((e: EventInfo<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onExported?: ((e: EventInfo<T>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 fileName:string
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 format:string
     * @default null
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onExporting?: ((e: EventInfo<T> & ExportInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 fileName:string
     * @type_function_param1_field4 format:string
     * @type_function_param1_field5 data:BLOB
     * @type_function_param1_field6 cancel:boolean
     * @default null
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onFileSaving?: ((e: FileSavingEventInfo<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:any
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onIncidentOccurred?: ((e: EventInfo<T> & IncidentInfo) => void);
    /**
     * @docid
     * @default false
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pathModified?: boolean;
    /**
     * @docid
     * @default true
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    redrawOnResize?: boolean;
    /**
     * @docid
     * @notUsedInTheme
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid
     * @type object
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
     * @type object|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: BaseWidgetTitle | string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseWidgetTooltip;
    /**
     * @docid
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    width?: number | string | (() => number | string);
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
    svgToCanvas?: ((svg: SVGElement, canvas: HTMLCanvasElement) => TPromise<void>);
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
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number | {
      /**
       * @docid BaseWidgetOptions.title.margin.bottom
       * @prevFileNamespace DevExpress.viz
       * @default 10
       */
      bottom?: number,
      /**
       * @docid BaseWidgetOptions.title.margin.left
       * @prevFileNamespace DevExpress.viz
       * @default 10
       */
      left?: number,
      /**
       * @docid BaseWidgetOptions.title.margin.right
       * @prevFileNamespace DevExpress.viz
       * @default 10
       */
      right?: number,
      /**
       * @docid BaseWidgetOptions.title.margin.top
       * @prevFileNamespace DevExpress.viz
       * @default 10
       */
      top?: number
    };
    /**
     * @docid BaseWidgetOptions.title.placeholderSize
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    placeholderSize?: number;
    /**
     * @docid BaseWidgetOptions.title.subtitle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subtitle?: {
      /**
       * @docid BaseWidgetOptions.title.subtitle.font
       * @prevFileNamespace DevExpress.viz
       * @default '#232323' [prop](color)
       * @default 16 [prop](size)
       * @default 200 [prop](weight)
       * @extends CommonVizLightFontFamily
       */
      font?: Font,
      /**
       * @docid BaseWidgetOptions.title.subtitle.offset
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      offset?: number,
      /**
       * @docid BaseWidgetOptions.title.subtitle.text
       * @prevFileNamespace DevExpress.viz
       * @default null
       */
      text?: string,
      /**
       * @docid BaseWidgetOptions.title.subtitle.textOverflow
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VizTextOverflow
       * @default "ellipsis"
       */
      textOverflow?: VizTextOverflowType,
      /**
       * @docid BaseWidgetOptions.title.subtitle.wordWrap
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VizWordWrap
       * @default "normal"
       */
      wordWrap?: WordWrapType
    } | string;
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid BaseWidgetOptions.tooltip.border.color
       * @prevFileNamespace DevExpress.viz
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid BaseWidgetOptions.tooltip.border.dashStyle
       * @prevFileNamespace DevExpress.viz
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid BaseWidgetOptions.tooltip.border.opacity
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid BaseWidgetOptions.tooltip.border.visible
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      visible?: boolean,
      /**
       * @docid BaseWidgetOptions.tooltip.border.width
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      width?: number
    };
    /**
     * @docid BaseWidgetOptions.tooltip.color
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid BaseWidgetOptions.tooltip.container
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    container?: string | UserDefinedElement;
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shadow?: {
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.blur
       * @prevFileNamespace DevExpress.viz
       * @default 2
       */
      blur?: number,
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.color
       * @prevFileNamespace DevExpress.viz
       * @default #000000
       */
      color?: string,
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.offsetX
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      offsetX?: number,
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.offsetY
       * @prevFileNamespace DevExpress.viz
       * @default 4
       */
      offsetY?: number,
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.opacity
       * @prevFileNamespace DevExpress.viz
       * @default 0.4
       */
      opacity?: number
    };
    /**
     * @docid BaseWidgetOptions.tooltip.zIndex
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zIndex?: number;
}
/**
 * @docid
 * @hidden
 * @inherits DOMComponent
 * @prevFileNamespace DevExpress.viz
 */
export default class BaseWidget extends DOMComponent {
    constructor(element: UserDefinedElement, options?: BaseWidgetOptions)
    /**
     * @docid
     * @static
     * @publicName defaultOptions(rule)
     * @param1 rule:Object
     * @param1_field1 device:Device|Array<Device>|function
     * @param1_field2 options:Object
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    static defaultOptions(rule: { device?: Device | Array<Device> | Function, options?: any }): void;
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    family?: string;
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @default 12
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: string | number;
    /**
     * @docid
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
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDragging?: boolean;
    /**
     * @docid
     * @default 14
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowLength?: number;
    /**
     * @docid
     * @default 14
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowWidth?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#dddddd'
       */
      color?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0
       * @default 4 [for](Material)
       */
      cornerRadius?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      visible?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      width?: number
    };
    /**
     * @docid
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    description?: string;
    /**
     * @docid
     * @default '#333333' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 30
       */
      height?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      url?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 30
       */
      width?: number
    };
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offsetX?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offsetY?: number;
    /**
     * @docid
     * @default 0.9
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shadow?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 4
       */
      blur?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#000000'
       */
      color?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      offsetX?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      offsetY?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0.15
       */
      opacity?: number
    };
    /**
     * @docid
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    x?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    y?: number;
}
