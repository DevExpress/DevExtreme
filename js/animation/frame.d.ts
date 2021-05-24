/**
 * @docid utils.cancelAnimationFrame
 * @publicName cancelAnimationFrame(requestID)
 * @param1 requestID:number
 * @namespace DevExpress.utils
 * @module animation/frame
 * @export cancel
 * @public
 */
export function cancelAnimationFrame(requestID: number): void;

/**
 * @docid utils.requestAnimationFrame
 * @publicName requestAnimationFrame(callback)
 * @param1 callback:function
 * @return number
 * @namespace DevExpress.utils
 * @module animation/frame
 * @export request
 * @public
 */
export function requestAnimationFrame(callback: Function): number;
