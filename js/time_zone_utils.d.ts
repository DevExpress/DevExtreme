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
 * @docid utils.timeZone.getTimeZones
 * @publicName getTimeZones(date)
 * @param1 date:Date|undefined
 * @return Array<dxSchedulerTimeZone>
 * @namespace DevExpress.utils
 * @module time_zone_utils
 * @export getTimeZones
 * @static
 * @prevFileNamespace DevExpress
 * @public
 */
export function getTimeZones(date?: Date): Array<dxSchedulerTimeZone>;