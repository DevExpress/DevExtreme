/**
 * @docid
 * @prevFileNamespace DevExpress
 */
export interface dxSchedulerTimeZone {
    /**
     * @docid
     *  @type string
     */
    id: string;
    /**
     * @docid
     * @type number
     */
    offset: number;
    /**
     * @docid
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
