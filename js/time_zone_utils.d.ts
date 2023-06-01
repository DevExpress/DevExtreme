/**
 * @docid
 * @public
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
 * @namespace DevExpress.utils
 * @static
 * @public
 */
export function getTimeZones(date?: Date): Array<dxSchedulerTimeZone>;
