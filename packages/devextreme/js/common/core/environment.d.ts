/**
 * @public
 * @docid
 * @section commonObjectStructures
 * @namespace DevExpress.common.core.environment
 */
export type Device = {
  /**
   * @docid
   * @public
   */
  android?: boolean;
  /**
   * @docid
   * @public
   */
  deviceType?: 'phone' | 'tablet' | 'desktop';
  /**
   * @docid
   * @public
   */
  generic?: boolean;
  /**
   * @docid
   * @public
   */
  grade?: 'A' | 'B' | 'C';
  /**
   * @docid
   * @public
   */
  ios?: boolean;
  /**
   * @docid
   * @public
   */
  phone?: boolean;
  /**
   * @docid
   * @public
   */
  platform?: 'android' | 'ios' | 'generic';
  /**
   * @docid
   * @public
   */
  tablet?: boolean;
  /**
   * @docid
   * @public
   */
  version?: Array<number>;
};

type EventName = 'orientationChanged';

/**
 * @docid
 * @publicName hideTopOverlay()
 * @namespace DevExpress.common.core.environment
 * @public
 */
export function hideTopOverlay(): boolean;

/**
 * @docid utils.initMobileViewport
 * @publicName initMobileViewport(options)
 * @namespace DevExpress.common.core.environment
 * @public
 */
export function initMobileViewport(options: { allowZoom?: boolean; allowPan?: boolean; allowSelection?: boolean }): void;

/**
 * @docid
 * @public
 * @namespace DevExpress.common.core.environment
 */
export type SchedulerTimeZone = {
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
};

/**
* @docid utils.getTimeZones
* @publicName getTimeZones(date)
* @param1 date:Date|undefined
* @namespace DevExpress.common.core.environment
* @static
* @public
*/
export function getTimeZones(date?: Date): Array<SchedulerTimeZone>;
