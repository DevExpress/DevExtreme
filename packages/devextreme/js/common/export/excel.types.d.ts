/**
 * @namespace DevExpress.exportInternal
 * @type object
 */
export interface CellAddress {
  /**
   * @docid
   * @public
   */
  row?: number;
  /**
   * @docid
   * @public
   */
  column?: number;
}

/**
* @namespace DevExpress.exportInternal
* @type object
*/
export interface CellRange {
/**
 * @docid
 * @public
 */
from?: CellAddress;
/**
 * @docid
 * @public
 */
to?: CellAddress;
}
