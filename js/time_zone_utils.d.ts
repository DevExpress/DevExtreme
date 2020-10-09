// export interface dxSchedulerTimeZone {
//     /**
//      * @docid dxSchedulerTimeZone.id
//      * @type string
//      * @prevFileNamespace DevExpress
//      * @public
//      */
//     id: string;
//     /**
//      * @docid dxSchedulerTimeZone.offset 
//      * @type number
//      * @prevFileNamespace DevExpress.ui
//      * @public
//      */
//     offset: number;
//      /**
//      * @docid dxSchedulerTimeZone.title 
//      * @type string
//      * @prevFileNamespace DevExpress
//      * @public
//      */
//     title: string;
// }

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