/**
 * Configures the load panel.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ExportLoadPanel {
  /**
   * Specifies whether the load panel is enabled.
   */
  enabled?: boolean;
  /**
   * Specifies text displayed on the load panel.
   */
  text?: string;
  /**
   * Specifies the width of the load panel in pixels.
   */
  width?: number;
  /**
   * Specifies the height of the load panel in pixels.
   */
  height?: number;
  /**
   * Specifies whether to show the loading indicator.
   */
  showIndicator?: boolean;
  /**
   * Specifies a URL pointing to an image to be used as a loading indicator.
   */
  indicatorSrc?: string;
  /**
   * Specifies whether to show the pane of the load panel.
   */
  showPane?: boolean;
  /**
   * Specifies whether to shade the UI component when the load panel is shown.
   */
  shading?: boolean;
  /**
   * Specifies the shading color. Applies only if shading is true.
   */
  shadingColor?: string;
}
