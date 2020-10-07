/**
 * @docid utils.getTimeZones
 * @publicName getTimeZones(date)
 * @param1 date:Date|undefined
 * @return Array<Object>
 * @namespace DevExpress.utils
 * @module time_zone_utils
 * @export getTimeZones
 * @static
 * @prevFileNamespace DevExpress
 * @public
 */
export function getTimeZones(date?: Date): Array<{id: string, title: string, offset: number}>;