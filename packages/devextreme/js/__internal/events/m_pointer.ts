import GlobalConfig from '@js/core/config';
import devices from '@js/core/devices';
import { each } from '@js/core/utils/iterator';
import * as support from '@js/core/utils/support';
import registerEvent from '@js/events/core/event_registrator';
import MouseStrategy from '@js/events/pointer/mouse';
import MouseAndTouchStrategy from '@js/events/pointer/mouse_and_touch';
import TouchStrategy from '@js/events/pointer/touch';

const getStrategy = (support, { tablet, phone }) => {
  const pointerEventStrategy = getStrategyFromGlobalConfig();

  if (pointerEventStrategy) {
    return pointerEventStrategy;
  }

  if (support.touch && !(tablet || phone)) {
    return MouseAndTouchStrategy;
  }

  if (support.touch) {
    return TouchStrategy;
  }

  return MouseStrategy;
};
// @ts-expect-error
const EventStrategy = getStrategy(support, devices.real());

each(EventStrategy.map, (pointerEvent, originalEvents) => {
  registerEvent(pointerEvent, new EventStrategy(pointerEvent, originalEvents));
});

const pointer = {
  down: 'dxpointerdown',
  up: 'dxpointerup',
  move: 'dxpointermove',
  cancel: 'dxpointercancel',
  enter: 'dxpointerenter',
  leave: 'dxpointerleave',
  over: 'dxpointerover',
  out: 'dxpointerout',
};

function getStrategyFromGlobalConfig() {
  const eventStrategyName = GlobalConfig().pointerEventStrategy;

  return {
    'mouse-and-touch': MouseAndTouchStrategy,
    touch: TouchStrategy,
    mouse: MouseStrategy,
    // @ts-expect-error
  }[eventStrategyName];
}

/// #DEBUG
// @ts-expect-error
pointer.getStrategy = getStrategy;

/// #ENDDEBUG

export default pointer;
