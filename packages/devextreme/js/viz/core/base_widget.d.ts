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
} from '../../common/core/events';

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
    Font as CommonFont,
} from '../../common/charts';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ExportInfo {
  /**
   * 
   */
  readonly fileName: string;
  /**
   * 
   */
  readonly format: string;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface IncidentInfo {
  /**
   * 
   */
  readonly target: any;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type FileSavingEventInfo<T> = Cancelable & {
  /**
   * 
   */
  readonly component: T;
  /**
   * 
   */
  readonly element: DxElement;
  /**
   * 
   */
  readonly fileName: string;
  /**
   * 
   */
  readonly format: string;
  /**
   * 
   */
  readonly data: Blob;
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseWidgetOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * Specifies whether the UI component responds to user interaction.
     */
    disabled?: boolean;
    /**
     * Configures the exporting and printing features.
     */
    export?: BaseWidgetExport;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * Configures the loading indicator.
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * Generates space around the UI component.
     */
    margin?: BaseWidgetMargin;
    /**
     * A function that is executed when the UI component&apos;s rendering has finished.
     */
    onDrawn?: ((e: EventInfo<TComponent>) => void);
    /**
     * A function that is executed after the UI component is exported.
     */
    onExported?: ((e: EventInfo<TComponent>) => void);
    /**
     * A function that is executed before the UI component is exported.
     */
    onExporting?: ((e: EventInfo<TComponent> & ExportInfo) => void);
    /**
     * A function that is executed before a file with exported UI component is saved to the user&apos;s local storage.
     */
    onFileSaving?: ((e: FileSavingEventInfo<TComponent>) => void);
    /**
     * A function that is executed when an error or warning occurs.
     */
    onIncidentOccurred?: ((e: EventInfo<TComponent> & IncidentInfo) => void);
    /**
     * Notifies the UI component that it is embedded into an HTML page that uses a tag modifying the path.
     */
    pathModified?: boolean;
    /**
     * Specifies whether to redraw the UI component when the size of the container changes or a mobile device rotates.
     */
    redrawOnResize?: boolean;
    /**
     * Switches the UI component to a right-to-left representation.
     */
    rtlEnabled?: boolean;
    /**
     * Specifies the UI component&apos;s size in pixels.
     */
    size?: BaseWidgetSize | undefined;
    /**
     * Sets the name of the theme the UI component uses.
     */
    theme?: Theme;
    /**
     * Configures the UI component&apos;s title.
     */
    title?: BaseWidgetTitle | string;
    /**
     * Configures tooltips - small pop-up rectangles that display information about a data-visualizing UI component element being pressed or hovered over with the mouse pointer.
     */
    tooltip?: BaseWidgetTooltip;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * Configures the exporting and printing features.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseWidgetExport {
    /**
     * Specifies the color that will fill transparent regions in the resulting file or document.
     */
    backgroundColor?: string;
    /**
     * Enables the client-side exporting in the UI component.
     */
    enabled?: boolean;
    /**
     * Specifies a default name for the file to which the UI component will be exported.
     */
    fileName?: string;
    /**
     * Specifies a set of export formats.
     */
    formats?: Array<ExportFormat>;
    /**
     * Adds an empty space around the exported UI component; measured in pixels.
     */
    margin?: number;
    /**
     * Enables the printing feature in the UI component. Applies only if the export.enabled property is true.
     */
    printingEnabled?: boolean;
    /**
     * A function that renders SVG markup on the HTML canvas. Required to export custom SVG elements (for example, markerTemplate).
     */
    svgToCanvas?: ((svg: SVGElement, canvas: HTMLCanvasElement) => PromiseLike<void>) | undefined;
}
/**
 * Configures the loading indicator.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseWidgetLoadingIndicator {
    /**
     * Colors the background of the loading indicator.
     */
    backgroundColor?: string;
    /**
     * Specifies whether the loading indicator should be displayed and hidden automatically.
     */
    enabled?: boolean;
    /**
     * Specifies font properties for the loading indicator.
     */
    font?: CommonFont;
    /**
     * Allows you to change the loading indicator&apos;s visibility.
     */
    show?: boolean;
    /**
     * Specifies the text to be displayed by the loading indicator.
     */
    text?: string;
}
/**
 * Generates space around the UI component.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseWidgetMargin {
    /**
     * Specifies the bottom margin of the UI component in pixels.
     */
    bottom?: number;
    /**
     * Specifies the left margin of the UI component in pixels.
     */
    left?: number;
    /**
     * Specifies the right margin of the UI component in pixels.
     */
    right?: number;
    /**
     * Specifies the top margin of the UI component in pixels.
     */
    top?: number;
}
/**
 * Specifies the UI component&apos;s size in pixels.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseWidgetSize {
    /**
     * Specifies the height of the UI component in pixels.
     */
    height?: number | undefined;
    /**
     * Specifies the width of the UI component in pixels.
     */
    width?: number | undefined;
}
/**
 * Configures the UI component&apos;s title.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseWidgetTitle {
    /**
     * Specifies font properties for the title.
     */
    font?: CommonFont;
    /**
     * Specifies the title&apos;s alignment in a horizontal direction.
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * Generates space around the title.
     */
    margin?: number | {
      /**
       * Specifies the bottom margin of the title.
       */
      bottom?: number;
      /**
       * Specifies the left margin of the title.
       */
      left?: number;
      /**
       * Specifies the right margin of the title.
       */
      right?: number;
      /**
       * Specifies the top margin of the title.
       */
      top?: number;
    };
    /**
     * Reserves a pixel-measured space for the title.
     */
    placeholderSize?: number | undefined;
    /**
     * Configures the UI component&apos;s subtitle.
     */
    subtitle?: {
      /**
       * Specifies font properties for the subtitle.
       */
      font?: CommonFont;
      /**
       * Specifies the distance between the title and subtitle in pixels.
       */
      offset?: number;
      /**
       * Specifies text for the subtitle.
       */
      text?: string;
      /**
       * Specifies what to do with the subtitle when it overflows the allocated space after applying wordWrap: hide, truncate it and display an ellipsis, or do nothing.
       */
      textOverflow?: TextOverflow;
      /**
       * Specifies how to wrap the subtitle if it does not fit into a single line.
       */
      wordWrap?: WordWrap;
    } | string;
    /**
     * Specifies the title&apos;s text.
     */
    text?: string;
    /**
     * Specifies what to do with the title when it overflows the allocated space after applying wordWrap: hide, truncate it and display an ellipsis, or do nothing.
     */
    textOverflow?: TextOverflow;
    /**
     * Specifies the title&apos;s alignment in a vertical direction.
     */
    verticalAlignment?: VerticalEdge;
    /**
     * Specifies how to wrap the title if it does not fit into a single line.
     */
    wordWrap?: WordWrap;
}
/**
 * Configures tooltips - small pop-up rectangles that display information about a data-visualizing UI component element being pressed or hovered over with the mouse pointer.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseWidgetTooltip {
    /**
     * Specifies the length of a tooltip&apos;s arrow in pixels.
     */
    arrowLength?: number;
    /**
     * Configures a tooltip&apos;s border.
     */
    border?: {
      /**
       * Colors a tooltip&apos;s border.
       */
      color?: string;
      /**
       * Specifies the dash style of a tooltip&apos;s border.
       */
      dashStyle?: DashStyle;
      /**
       * Specifies the transparency of a tooltip&apos;s border.
       */
      opacity?: number | undefined;
      /**
       * Specifies whether a tooltip&apos;s border is visible.
       */
      visible?: boolean;
      /**
       * Specifies the width of a tooltip&apos;s border in pixels.
       */
      width?: number;
    };
    /**
     * Colors all tooltips.
     */
    color?: string;
    /**
     * Specifies the container in which to draw tooltips. The default container is the HTML DOM `` element.
     */
    container?: string | UserDefinedElement | undefined;
    /**
     * Makes all the tooltip&apos;s corners rounded.
     */
    cornerRadius?: number;
    /**
     * Enables tooltips.
     */
    enabled?: boolean;
    /**
     * Specifies tooltips&apos; font properties.
     */
    font?: CommonFont;
    /**
     * Formats a value before it is displayed it in a tooltip.
     */
    format?: Format | undefined;
    /**
     * Specifies tooltips&apos; transparency.
     */
    opacity?: number | undefined;
    /**
     * Generates an empty space, measured in pixels, between a tooltip&apos;s left/right border and its text.
     */
    paddingLeftRight?: number;
    /**
     * Generates an empty space, measured in pixels, between a tooltip&apos;s top/bottom border and its text.
     */
    paddingTopBottom?: number;
    /**
     * Configures a tooltip&apos;s shadow.
     */
    shadow?: {
      /**
       * Specifies the blur distance of a tooltip&apos;s shadow. The larger the value, the blurrier the shadow&apos;s edge.
       */
      blur?: number;
      /**
       * Colors a tooltip&apos;s shadow.
       */
      color?: string;
      /**
       * Specifies the horizontal offset of a tooltip&apos;s shadow relative to the tooltip itself. Measured in pixels.
       */
      offsetX?: number;
      /**
       * Specifies the vertical offset of a tooltip&apos;s shadow relative to the tooltip itself. Measured in pixels.
       */
      offsetY?: number;
      /**
       * Specifies the transparency of a tooltip&apos;s shadow.
       */
      opacity?: number;
    };
    /**
     * Specifies a tooltip&apos;s z-index.
     */
    zIndex?: number | undefined;
}
/**
 * This section describes properties and methods that are common to all UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class BaseWidget<TProperties> extends DOMComponent<TProperties> {
    /**
     * Specifies the device-dependent default configuration properties for this component.
     */
    static defaultOptions<TProperties>(rule: DefaultOptionsRule<TProperties>): void;
    /**
     * Exports the UI component.
     */
    exportTo(fileName: string, format: string): void;
    /**
     * Gets the current UI component size.
     */
    getSize(): BaseWidgetSize;
    /**
     * Hides the loading indicator.
     */
    hideLoadingIndicator(): void;
    /**
     * Opens the browser&apos;s print window.
     */
    print(): void;
    /**
     * Redraws the UI component.
     */
    render(): void;
    /**
     * Shows the loading indicator.
     */
    showLoadingIndicator(): void;
    /**
     * Gets the UI component&apos;s SVG markup.
     */
    svg(): string;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseWidgetAnnotationConfig {
    /**
     * Specifies whether users can drag and drop the annotation.
     */
    allowDragging?: boolean;
    /**
     * Specifies the length of the annotation&apos;s arrow in pixels.
     */
    arrowLength?: number;
    /**
     * Specifies the width of the annotation&apos;s arrow at its junction with the annotation rectangle.
     */
    arrowWidth?: number;
    /**
     * Configures the appearance of the annotation&apos;s border.
     */
    border?: {
      /**
       * Colors the annotation&apos;s border.
       */
      color?: string;
      /**
       * Makes the annotation&apos;s corners rounded.
       */
      cornerRadius?: number;
      /**
       * Specifies the dash style of the annotation&apos;s border.
       */
      dashStyle?: DashStyle;
      /**
       * Specifies the opacity of the annotation&apos;s border.
       */
      opacity?: number | undefined;
      /**
       * Specifies the visibility of the annotation&apos;s border.
       */
      visible?: boolean;
      /**
       * Specifies the width of the annotation&apos;s border in pixels.
       */
      width?: number;
    };
    /**
     * Specifies the color that fills the annotation.
     */
    color?: string;
    /**
     * A container for custom data.
     */
    data?: any;
    /**
     * Specifies the annotation&apos;s description in the tooltip.
     */
    description?: string | undefined;
    /**
     * Specifies the annotation&apos;s font properties. Applies to text annotations only.
     */
    font?: CommonFont;
    /**
     * Specifies the annotation&apos;s height in pixels.
     */
    height?: number | undefined;
    /**
     * Configures the image to be displayed in the annotation. Applies only if the type is &apos;image&apos;.
     */
    image?: string | {
      /**
       * Specifies the image&apos;s height in pixels.
       */
      height?: number;
      /**
       * Specifies the image&apos;s URL.
       */
      url?: string | undefined;
      /**
       * Specifies the image&apos;s width in pixels.
       */
      width?: number;
    };
    /**
     * Moves the annotation horizontally.
     */
    offsetX?: number | undefined;
    /**
     * Moves the annotation vertically.
     */
    offsetY?: number | undefined;
    /**
     * Specifies the annotation&apos;s opacity.
     */
    opacity?: number;
    /**
     * Used with paddingTopBottom to generate an empty space around the annotation&apos;s text or image (specified in pixels).
     */
    paddingLeftRight?: number;
    /**
     * Along with paddingLeftRight, generates an empty space around the annotation&apos;s text or image; specified in pixels.
     */
    paddingTopBottom?: number;
    /**
     * Configures the annotation&apos;s shadows.
     */
    shadow?: {
      /**
       * Specifies the blur distance of the shadows. A larger value increases the blur distance.
       */
      blur?: number;
      /**
       * Colors the annotation&apos;s shadows.
       */
      color?: string;
      /**
       * Moves the shadows horizontally.
       */
      offsetX?: number;
      /**
       * Moves the shadows vertically.
       */
      offsetY?: number;
      /**
       * Specifies the opacity of the shadows.
       */
      opacity?: number;
    };
    /**
     * Specifies the annotation&apos;s text. Applies only if the type is &apos;text&apos;.
     */
    text?: string | undefined;
    /**
     * Specifies what to do with the annotation&apos;s text when it overflows the allocated space after applying wordWrap: hide, truncate it and display an ellipsis, or do nothing.
     */
    textOverflow?: TextOverflow;
    /**
     * Specifies whether the annotation tooltip is enabled.
     */
    tooltipEnabled?: boolean;
    /**
     * Specifies whether the annotation displays text, an image, or a template. This is a required setting.
     */
    type?: AnnotationType | undefined;
    /**
     * Specifies the annotation&apos;s width in pixels.
     */
    width?: number | undefined;
    /**
     * Specifies how to wrap the annotation&apos;s text if it does not fit into a single line.
     */
    wordWrap?: WordWrap;
    /**
     * Used with y to position the annotation&apos;s center at a specific pixel coordinate. (0, 0) is the upper left corner of the UI component.
     */
    x?: number | undefined;
    /**
     * Used with x to position the annotation&apos;s center at a specific pixel coordinate. (0, 0) is the upper left corner of the UI component.
     */
    y?: number | undefined;
}

// #region deprecated in 23.1

/**
 * @deprecated Use Font from common/charts instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Font = CommonFont;

// #endregion
