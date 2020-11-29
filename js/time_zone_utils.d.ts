/**
 * @docid dxSchedulerTimeZone
 * @prevFileNamespace DevExpress
 */
export interface dxSchedulerTimeZone {
    /** 
     * @docid dxSchedulerTimeZone.id
     */
    id: string;
    /**
     * @docid dxSchedulerTimeZone.offset
     */
    offset: number;
    /**
     * @docid dxSchedulerTimeZone.title
     */
    title: string;
}

/**
 * @docid utils.getTimeZones
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