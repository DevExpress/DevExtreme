/**
 * @docid dxSchedulerTimeZone
 * @prevFileNamespace DevExpress
 */
export interface dxSchedulerTimeZone {
    /** 
     * @docid dxSchedulerTimeZone.id
     *  @type string
     */
    id: string;
    /**
     * @docid dxSchedulerTimeZone.offset
     * @type number
     */
    offset: number;
    /**
     * @docid dxSchedulerTimeZone.title
     * @type string
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