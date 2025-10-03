import { LoadIndicatorOptions } from '../ui/load_indicator';

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
   * @deprecated ExportLoadPanel.indicatorOptions
   */
  indicatorSrc?: string;
  /**
   * @docid
   */
  indicatorOptions?: LoadIndicatorOptions;
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
