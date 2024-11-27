import { DxEvent } from '../common/core/events';

export {
  /**
   * @deprecated Use on from /common/core/events instead
   */
  on,
  /**
   * @deprecated Use one from /common/core/events instead
   */
  one,
  /**
   * @deprecated Use off from /common/core/events instead
   */
  off,
  /**
   * @deprecated Use trigger from /common/core/events instead
   */
  trigger,
  /**
   * @deprecated Use triggerHandler from /common/core/events instead
   */
  triggerHandler,
  /**
   * @deprecated Use DxEvent from /common/core/events instead
   */
  DxEvent,
  /**
   * @deprecated Use InitializedEventInfo from /common/core/events instead
   */
  InitializedEventInfo,
  /**
   * @deprecated Use EventInfo from /common/core/events instead
   */
  EventInfo,
  /**
   * @deprecated Use NativeEventInfo from /common/core/events instead
   */
  NativeEventInfo,
  /**
   * @deprecated Use ChangedOptionInfo from /common/core/events instead
   */
  ChangedOptionInfo,
  /**
   * @deprecated Use ItemInfo from /common/core/events instead
   */
  ItemInfo,
  /**
   * @deprecated Use Cancelable from /common/core/events instead
   */
  Cancelable,
  /**
   * @deprecated Use AsyncCancelable from /common/core/events instead
   */
  AsyncCancelable,
  /**
   * @deprecated Use EventObject from /common/core/events instead
   */
  EventObject,
  /**
   * @deprecated Use EventExtension from /common/core/events instead
   */
  EventExtension,
  /**
   * @deprecated Use EventType from /common/core/events instead
   */
  EventType,
  /**
   * @deprecated Use dxEvent from /common/core/events instead
   */
  dxEvent,
  /**
   * @deprecated Use event from /common/core/events instead
   */
  event,
} from '../common/core/events';

/**
 * @docid
 * @publicName handler(event, extraParameters)
 * @param2 extraParameters:object
 * @hidden
 */
export function eventsHandler(event: DxEvent, extraParameters: any): boolean;
