/**
 * The device object defines the device on which the application is running.
 */
export type Device = {
  /**
   * Indicates whether or not the device platform is Android.
   */
  android?: boolean;
  /**
   * Specifies the type of the device on which the application is running.
   */
  deviceType?: 'phone' | 'tablet' | 'desktop';
  /**
   * Indicates whether or not the device platform is generic, which means that the application will look and behave according to a generic &apos;light&apos; or &apos;dark&apos; theme.
   */
  generic?: boolean;
  /**
   * Specifies a performance grade of the current device.
   */
  grade?: 'A' | 'B' | 'C';
  /**
   * Indicates whether or not the device platform is iOS.
   */
  ios?: boolean;
  /**
   * Indicates whether or not the device type is &apos;phone&apos;.
   */
  phone?: boolean;
  /**
   * Specifies the platform of the device on which the application is running.
   */
  platform?: 'android' | 'ios' | 'generic';
  /**
   * Indicates whether or not the device type is &apos;tablet&apos;.
   */
  tablet?: boolean;
  /**
   * Specifies an array with the major and minor versions of the device platform.
   */
  version?: Array<number>;
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventName = 'orientationChanged';

/**
 * Hides the last displayed overlay UI component.
 */
export function hideTopOverlay(): boolean;

/**
 * Sets parameters for the viewport meta tag. Takes effect for mobile applications only.
 */
export function initMobileViewport(options: { allowZoom?: boolean; allowPan?: boolean; allowSelection?: boolean }): void;

/**
 * A time zone object.
 */
export type SchedulerTimeZone = {
  /**
   * A time zone text string from the IANA database.
   */
  id: string;
  /**
   * A GMT offset.
   */
  offset: number;
  /**
   * A time zone in the following format: `(GMT ±[hh]:[mm]) [id]`.
   */
  title: string;
};

/**
 * Gets the list of IANA time zone objects.
 */
export function getTimeZones(date?: Date): Array<SchedulerTimeZone>;
