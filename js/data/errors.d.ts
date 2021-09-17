/**
 * @docid Utils.errorHandler
 * @type function(e)
 * @module data/errors
 * @export errorHandler
 * @namespace DevExpress.data
 * @deprecated Utils.setErrorHandler
 * @public
 */
export function errorHandler(e: Error): void;

/**
 * @docid Utils.setErrorHandler
 * @type function(handler)
 * @module data/errors
 * @export setErrorHandler
 * @namespace DevExpress.data
 * @public
 */
export function setErrorHandler(handler: (e: Error) => void): void;
