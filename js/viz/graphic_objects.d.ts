import {
    template,
} from '../core/templates/template';

/**
 * @docid viz.registerGradient
 * @publicName registerGradient(type, options)
 * @static
 * @public
 */
export function registerGradient(type: string, options: { rotationAngle: number, colors: Array<Colors>}): string;
/**
 * @docid viz.registerPattern
 * @publicName registerPattern(options)
 * @static
 * @public
 */
export function registerPattern(options: { width: number|string, height: number|string, template: template }): string;
/**
 * @namespace DevExpress.viz
 */
export interface Colors {
   /**
   * @docid
   * @default undefined
   * @public
   */
    offset: number|string,
   /**
   * @docid
   * @default undefined
   * @public
   */
    color: string
}