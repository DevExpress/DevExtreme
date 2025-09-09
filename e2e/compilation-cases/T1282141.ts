/* eslint-disable @typescript-eslint/naming-convention */

import { CutEvent } from 'devextreme/js/ui/color_box';
import { EVENT_PROPERTIES } from 'devextreme/js/__internal/events/core/m_consts';

type NATIVE_EVENT_ARGS = KeyboardEvent
  & PointerEvent
  & TouchEvent
  & FocusEvent
  & WheelEvent
  & ClipboardEvent;

type NATIVE_EVENT_ARG_NON_PROPS = Pick<KeyboardEvent,
  'getModifierState'
  | 'initKeyboardEvent'
  | 'DOM_KEY_LOCATION_STANDARD'
  | 'DOM_KEY_LOCATION_LEFT'
  | 'DOM_KEY_LOCATION_RIGHT'
  | 'DOM_KEY_LOCATION_NUMPAD'>
  & Pick<UIEvent, 'initUIEvent'>
  & Pick<Event,
    'composedPath'
    | 'initEvent'
    | 'preventDefault'
    | 'stopImmediatePropagation'
    | 'stopPropagation'
    | 'NONE'
    | 'CAPTURING_PHASE'
    | 'AT_TARGET'
    | 'BUBBLING_PHASE'>
  & Pick<PointerEvent, 'getCoalescedEvents' | 'getPredictedEvents'>
  & Pick<MouseEvent, 'initMouseEvent'>
  & Pick<WheelEvent, 'DOM_DELTA_PIXEL' | 'DOM_DELTA_LINE' | 'DOM_DELTA_PAGE'>;

interface PROPS_ASSIGNED_ELSEWHERE {
  type: string;
  isTrusted: boolean;
  timeStamp: number;
  which: number;
  currentTarget: EventTarget | null;

  // touch hooks
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
}

type IGNORED_MEMBERS = NATIVE_EVENT_ARG_NON_PROPS & PROPS_ASSIGNED_ELSEWHERE;

type ASSIGNED_EVENT_ARG_GETTERS = {
  [Property in typeof EVENT_PROPERTIES[number]]
};

function fn(): void {
  const e: CutEvent = undefined as unknown as CutEvent;

  e.event?.originalEvent.clipboardData?.clearData();

  const dxGetters = undefined as unknown as ASSIGNED_EVENT_ARG_GETTERS & IGNORED_MEMBERS;
  let nativeArgs = undefined as unknown as NATIVE_EVENT_ARGS;

  nativeArgs = dxGetters;
}
