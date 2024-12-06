import registerEvent from '@js/common/core/events/core/event_registrator';
import MouseStrategy from '@js/common/core/events/pointer/mouse';
import MouseAndTouchStrategy from '@js/common/core/events/pointer/mouse_and_touch';
import TouchStrategy from '@js/common/core/events/pointer/touch';
import GlobalConfig from '@js/core/config';
import { each } from '@js/core/utils/iterator';
import devices from '@ts/core/m_devices';
import support from '@ts/core/utils/m_support';

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
