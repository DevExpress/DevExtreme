/**
 * @docid Utils.applyChanges
 * @publicName applyChanges(data, changes, options)
 * @param3 options?:any
 * @namespace DevExpress.data
 * @public
 */
declare function applyChanges(data: Array<any>, changes: Array<any>, options?: { keyExpr?: string | Array<string>; immutable?: boolean }): Array<any>;

export default applyChanges;
