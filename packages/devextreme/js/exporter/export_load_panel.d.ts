/**
 * @docid
 * @type object
 * @namespace DevExpress
 */
export interface ExportLoadPanel {
  /**
   * @docid
   * @default true
   */
  enabled?: boolean;
  /**
   * @docid
   * @default "Exporting..."
   */
  text?: string;
  /**
   * @docid
   * @default 200
   */
  width?: number;
  /**
   * @docid
   * @default 90
   */
  height?: number;
  /**
   * @docid
   * @default true
   */
  showIndicator?: boolean;
  /**
   * @docid
   * @default ""
   */
  indicatorSrc?: string;
  /**
   * @docid
   * @default true
   */
  showPane?: boolean;
  /**
   * @docid
   * @default false
   */
  shading?: boolean;
  /**
   * @docid
   * @default ''
   */
  shadingColor?: string;
}
