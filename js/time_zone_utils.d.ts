/**
 * @docid
 */
export interface dxSchedulerTimeZone {
    /**
     * @docid
     */
    id: string;
    /**
     * @docid
     */
    offset: number;
    /**
     * @docid
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
 * @public
 */
export function getTimeZones(date?: Date): Array<dxSchedulerTimeZone>;
