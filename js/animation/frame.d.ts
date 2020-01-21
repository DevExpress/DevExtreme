/**
 * @docid utils.cancelAnimationFrame
 * @publicName cancelAnimationFrame(requestID)
 * @type method
 * @param1 requestID:number
 * @namespace DevExpress.utils
 * @module animation/frame
 * @export cancel
 * @prevFileNamespace DevExpress.animation
 * @public
 */
export function cancelAnimationFrame(requestID: number): void;

/**
 * @docid utils.requestAnimationFrame
 * @publicName requestAnimationFrame(callback)
 * @type method
 * @param1 callback:function
 * @return number
 * @namespace DevExpress.utils
 * @module animation/frame
 * @export request
 * @prevFileNamespace DevExpress.animation
 * @public
 */
export function requestAnimationFrame(callback: Function): number;
