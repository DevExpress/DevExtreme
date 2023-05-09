import DOMComponent, {
    DOMComponentOptions,
} from '../../core/dom_component';

import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    Cancelable,
    EventInfo,
} from '../../events/index';

import {
  Format,
} from '../../localization';

import {
    DefaultOptionsRule,
} from '../../core/options';

import {
    ExportFormat,
    HorizontalAlignment,
    VerticalEdge,
} from '../../common';

import {
    AnnotationType,
    DashStyle,
    TextOverflow,
    Theme,
    WordWrap,
} from '../../common/charts';

export interface ExportInfo {
  readonly fileName: string;
  readonly format: string;
}

export interface IncidentInfo {
  readonly target: any;
}

export type FileSavingEventInfo<T> = Cancelable & {
  readonly component: T;
  readonly element: DxElement;
  readonly fileName: string;
  readonly format: string;
  readonly data: Blob;
};

/**
 * @namespace DevExpress.viz
 * @docid
 */
export interface BaseWidgetOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * @docid
     * @default false
     * @notUsedInTheme
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    export?: BaseWidgetExport;
    /**
     * @docid
     * @hidden
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type object
     * @public
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * @docid
     * @type object
     * @public
     */
    margin?: BaseWidgetMargin;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:EventInfo
     * @notUsedInTheme
     * @action
     * @public
     */
    onDrawn?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:EventInfo
     * @action
     * @public
     */
    onExported?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @default null
     * @action
     * @public
     */
    onExporting?: ((e: EventInfo<TComponent> & ExportInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @default null
     * @action
     * @public
     */
    onFileSaving?: ((e: FileSavingEventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onIncidentOccurred?: ((e: EventInfo<TComponent> & IncidentInfo) => void);
    /**
     * @docid
     * @default false
     * @notUsedInTheme
     * @public
     */
    pathModified?: boolean;
    /**
     * @docid
     * @default true
     * @notUsedInTheme
     * @public
     */
    redrawOnResize?: boolean;
    /**
     * @docid
     * @notUsedInTheme
     * @default false
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid
     * @type object
     * @default undefined
     * @public
     */
    size?: BaseWidgetSize;
    /**
     * @docid
     * @default 'generic.light'
     * @public
     */
    theme?: Theme;
    /**
     * @docid
     * @type object|string
     * @public
     */
    title?: BaseWidgetTitle | string;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: BaseWidgetTooltip;
    /**
     * @docid
     * @hidden
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseWidgetExport {
    /**
     * @docid BaseWidgetOptions.export.backgroundColor
     * @default '#ffffff'
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseWidgetOptions.export.enabled
     * @default false
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseWidgetOptions.export.fileName
     * @default 'file'
     * @public
     */
    fileName?: string;
    /**
     * @docid BaseWidgetOptions.export.formats
     * @default ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF']
     * @public
     */
    formats?: Array<ExportFormat>;
    /**
     * @docid BaseWidgetOptions.export.margin
     * @default 10
     * @public
     */
    margin?: number;
    /**
     * @docid BaseWidgetOptions.export.printingEnabled
     * @default true
     * @public
     */
    printingEnabled?: boolean;
    /**
     * @docid BaseWidgetOptions.export.svgToCanvas
     * @type_function_return Promise<void>
     * @default undefined
     * @public
     */
    svgToCanvas?: ((svg: SVGElement, canvas: HTMLCanvasElement) => PromiseLike<void>);
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseWidgetLoadingIndicator {
    /**
     * @docid BaseWidgetOptions.loadingIndicator.backgroundColor
     * @default '#FFFFFF'
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.enabled
     * @default false
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.font
     * @default '#767676' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.show
     * @default false
     * @fires BaseWidgetOptions.onOptionChanged
     * @public
     */
    show?: boolean;
    /**
     * @docid BaseWidgetOptions.loadingIndicator.text
     * @default 'Loading...'
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseWidgetMargin {
    /**
     * @docid BaseWidgetOptions.margin.bottom
     * @default 0
     * @public
     */
    bottom?: number;
    /**
     * @docid BaseWidgetOptions.margin.left
     * @default 0
     * @public
     */
    left?: number;
    /**
     * @docid BaseWidgetOptions.margin.right
     * @default 0
     * @public
     */
    right?: number;
    /**
     * @docid BaseWidgetOptions.margin.top
     * @default 0
     * @public
     */
    top?: number;
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseWidgetSize {
    /**
     * @docid BaseWidgetOptions.size.height
     * @default undefined
     * @public
     */
    height?: number;
    /**
     * @docid BaseWidgetOptions.size.width
     * @default undefined
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseWidgetTitle {
    /**
     * @docid BaseWidgetOptions.title.font
     * @default '#232323' &prop(color)
     * @default 28 &prop(size)
     * @default 200 &prop(weight)
     * @default "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif" &prop(family)
     * @public
     */
    font?: Font;
    /**
     * @docid BaseWidgetOptions.title.horizontalAlignment
     * @default 'center'
     * @public
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * @docid BaseWidgetOptions.title.margin
     * @default 10
     * @public
     */
    margin?: number | {
      /**
       * @docid BaseWidgetOptions.title.margin.bottom
       * @default 10
       */
      bottom?: number;
      /**
       * @docid BaseWidgetOptions.title.margin.left
       * @default 10
       */
      left?: number;
      /**
       * @docid BaseWidgetOptions.title.margin.right
       * @default 10
       */
      right?: number;
      /**
       * @docid BaseWidgetOptions.title.margin.top
       * @default 10
       */
      top?: number;
    };
    /**
     * @docid BaseWidgetOptions.title.placeholderSize
     * @default undefined
     * @public
     */
    placeholderSize?: number;
    /**
     * @docid BaseWidgetOptions.title.subtitle
     * @public
     */
    subtitle?: {
      /**
       * @docid BaseWidgetOptions.title.subtitle.font
       * @default '#232323' &prop(color)
       * @default 16 &prop(size)
       * @default 200 &prop(weight)
       * @default "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif" &prop(family)
       */
      font?: Font;
      /**
       * @docid BaseWidgetOptions.title.subtitle.offset
       * @default 0
       */
      offset?: number;
      /**
       * @docid BaseWidgetOptions.title.subtitle.text
       * @default null
       */
      text?: string;
      /**
       * @docid BaseWidgetOptions.title.subtitle.textOverflow
       * @default "ellipsis"
       */
      textOverflow?: TextOverflow;
      /**
       * @docid BaseWidgetOptions.title.subtitle.wordWrap
       * @default "normal"
       */
      wordWrap?: WordWrap;
    } | string;
    /**
     * @docid BaseWidgetOptions.title.text
     * @default null
     * @public
     */
    text?: string;
    /**
     * @docid BaseWidgetOptions.title.textOverflow
     * @default "ellipsis"
     * @public
     */
    textOverflow?: TextOverflow;
    /**
     * @docid BaseWidgetOptions.title.verticalAlignment
     * @default 'top'
     * @public
     */
    verticalAlignment?: VerticalEdge;
    /**
     * @docid BaseWidgetOptions.title.wordWrap
     * @default "normal"
     * @public
     */
    wordWrap?: WordWrap;
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseWidgetTooltip {
    /**
     * @docid BaseWidgetOptions.tooltip.arrowLength
     * @default 10
     * @public
     */
    arrowLength?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.border
     * @public
     */
    border?: {
      /**
       * @docid BaseWidgetOptions.tooltip.border.color
       * @default '#d3d3d3'
       */
      color?: string;
      /**
       * @docid BaseWidgetOptions.tooltip.border.dashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyle;
      /**
       * @docid BaseWidgetOptions.tooltip.border.opacity
       * @default undefined
       */
      opacity?: number;
      /**
       * @docid BaseWidgetOptions.tooltip.border.visible
       * @default true
       */
      visible?: boolean;
      /**
       * @docid BaseWidgetOptions.tooltip.border.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid BaseWidgetOptions.tooltip.color
     * @default '#ffffff'
     * @public
     */
    color?: string;
    /**
     * @docid BaseWidgetOptions.tooltip.container
     * @default undefined
     * @public
     */
    container?: string | UserDefinedElement;
    /**
     * @docid BaseWidgetOptions.tooltip.cornerRadius
     * @default 0
     * @default 4 &for(Material)
     * @public
     */
    cornerRadius?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.enabled
     * @default false
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseWidgetOptions.tooltip.font
     * @default '#232323' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid BaseWidgetOptions.tooltip.format
     * @default undefined
     * @public
     */
    format?: Format;
    /**
     * @docid BaseWidgetOptions.tooltip.opacity
     * @default undefined
     * @public
     */
    opacity?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.paddingLeftRight
     * @default 18
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.paddingTopBottom
     * @default 15
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid BaseWidgetOptions.tooltip.shadow
     * @public
     */
    shadow?: {
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.blur
       * @default 2
       */
      blur?: number;
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.color
       * @default #000000
       */
      color?: string;
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.offsetX
       * @default 0
       */
      offsetX?: number;
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.offsetY
       * @default 4
       */
      offsetY?: number;
      /**
       * @docid BaseWidgetOptions.tooltip.shadow.opacity
       * @default 0.4
       */
      opacity?: number;
    };
    /**
     * @docid BaseWidgetOptions.tooltip.zIndex
     * @default undefined
     * @public
     */
    zIndex?: number;
}
/**
 * @docid
 * @hidden
 * @inherits DOMComponent
 * @namespace DevExpress.viz
 */
export default class BaseWidget<TProperties> extends DOMComponent<TProperties> {
    /**
     * @docid
     * @static
     * @publicName defaultOptions(rule)
     * @param1 rule:Object
     * @param1_field device:Device|function
     * @param1_field options:Object
     * @hidden
     */
    static defaultOptions<TProperties>(rule: DefaultOptionsRule<TProperties>): void;
    /**
     * @docid
     * @publicName exportTo(fileName, format)
     * @public
     */
    exportTo(fileName: string, format: string): void;
    /**
     * @docid
     * @publicName getSize()
     * @return BaseWidgetOptions.size
     * @public
     */
    getSize(): BaseWidgetSize;
    /**
     * @docid
     * @publicName hideLoadingIndicator()
     * @public
     */
    hideLoadingIndicator(): void;
    /**
     * @docid
     * @publicName print()
     * @public
     */
    print(): void;
    /**
     * @docid
     * @publicName render()
     * @public
     */
    render(): void;
    /**
     * @docid
     * @publicName showLoadingIndicator()
     * @public
     */
    showLoadingIndicator(): void;
    /**
     * @docid
     * @publicName svg()
     * @public
     */
    svg(): string;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.viz
 * @hidden
 */
export interface Font {
    /**
     * @docid
     * @public
     */
    color?: string;
    /**
     * @docid
     * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif"
     * @public
     */
    family?: string;
    /**
     * @docid
     * @default 1
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @default 12
     * @public
     */
    size?: string | number;
    /**
     * @docid
     * @default 400
     * @public
     */
    weight?: number;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.viz
 */
export interface BaseWidgetAnnotationConfig {
    /**
     * @docid
     * @default false
     * @public
     */
    allowDragging?: boolean;
    /**
     * @docid
     * @default 14
     * @public
     */
    arrowLength?: number;
    /**
     * @docid
     * @default 14
     * @public
     */
    arrowWidth?: number;
    /**
     * @docid
     * @public
     */
    border?: {
      /**
       * @docid
       * @default '#dddddd'
       */
      color?: string;
      /**
       * @docid
       * @default 0
       * @default 4 &for(Material)
       */
      cornerRadius?: number;
      /**
       * @docid
       * @default 'solid'
       */
      dashStyle?: DashStyle;
      /**
       * @docid
       * @default undefined
       */
      opacity?: number;
      /**
       * @docid
       * @default true
       */
      visible?: boolean;
      /**
       * @docid
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid
     * @default '#ffffff'
     * @public
     */
    color?: string;
    /**
     * @docid
     * @public
     */
    data?: any;
    /**
     * @docid
     * @default undefined
     * @public
     */
    description?: string;
    /**
     * @docid
     * @default '#333333' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @default undefined
     * @public
     */
    height?: number;
    /**
     * @docid
     * @public
     */
    image?: string | {
      /**
       * @docid
       * @default 30
       */
      height?: number;
      /**
       * @docid
       * @default undefined
       */
      url?: string;
      /**
       * @docid
       * @default 30
       */
      width?: number;
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    offsetX?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    offsetY?: number;
    /**
     * @docid
     * @default 0.9
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @default 10
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid
     * @default 10
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid
     * @public
     */
    shadow?: {
      /**
       * @docid
       * @default 4
       */
      blur?: number;
      /**
       * @docid
       * @default '#000000'
       */
      color?: string;
      /**
       * @docid
       * @default 0
       */
      offsetX?: number;
      /**
       * @docid
       * @default 1
       */
      offsetY?: number;
      /**
       * @docid
       * @default 0.15
       */
      opacity?: number;
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default "ellipsis"
     * @public
     */
    textOverflow?: TextOverflow;
    /**
     * @docid
     * @default true
     * @public
     */
    tooltipEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    type?: AnnotationType;
    /**
     * @docid
     * @default undefined
     * @public
     */
    width?: number;
    /**
     * @docid
     * @default "normal"
     * @public
     */
    wordWrap?: WordWrap;
    /**
     * @docid
     * @default undefined
     * @public
     */
    x?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    y?: number;
}
