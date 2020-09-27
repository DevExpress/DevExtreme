/** @name dxSchedulerTimeZone */
export interface dxSchedulerTimeZone {
    /** @name dxSchedulerTimeZone.id */
    id: string;
    /** @name dxSchedulerTimeZone.offset */
    offset: number;
    /** @name dxSchedulerTimeZone.title */
    title: string;
}

/**
 * @docid Utils.getTimeZones
 * @publicName getTimeZones(date)
 * @param1 date:Date|undefined
 * @return Array<dxSchedulerTimeZone>
 * @namespace DevExpress.timeZoneUtils
 * @module time_zone
 * @export getTimeZones
 * @static
 * @prevFileNamespace DevExpress
 * @public
 */
export function getTimeZones(date?: Date): Array<dxSchedulerTimeZone>;