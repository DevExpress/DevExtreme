/**
 * @docid Utils.applyChanges
 * @publicName applyChanges(data, changes, keyName, options)
 * @param1 data:Array<any>
 * @param2 changes:Array<any>
 * @param3 keyName?:string
 * @param4 options?:any
 * @return Array<any>
 * @namespace DevExpress.data
 * @module data/apply_changes
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
declare function applyChanges(data: Array<any>, changes: Array<{ type: string, data?: any, key?: any }>, keyName?: string, options?: any): Array<any>;

export default applyChanges;
