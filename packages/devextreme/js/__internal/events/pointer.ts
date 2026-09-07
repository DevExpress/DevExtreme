import registerEvent from '@js/common/core/events/core/event_registrator';
import GlobalConfig from '@js/core/config';
import devices from '@ts/core/m_devices';
import support from '@ts/core/utils/m_support';
import MouseStrategy from '@ts/events/pointer/mouse';
import MouseAndTouchStrategy from '@ts/events/pointer/mouse_and_touch';
import TouchStrategy from '@ts/events/pointer/touch';

type PointerStrategy = | typeof MouseStrategy
  | typeof MouseAndTouchStrategy
  | typeof TouchStrategy;

const STRATEGY_BY_NAME = {
  'mouse-and-touch': MouseAndTouchStrategy,
  touch: TouchStrategy,
  mouse: MouseStrategy,
};

function getStrategyFromGlobalConfig(): PointerStrategy | undefined {
  const { pointerEventStrategy } = GlobalConfig();

  return pointerEventStrategy ? STRATEGY_BY_NAME[pointerEventStrategy] : undefined;
}

const getStrategy = (
  { touch }: { touch?: boolean },
  { tablet, phone }: { tablet?: boolean; phone?: boolean },
): PointerStrategy => {
  const pointerEventStrategy = getStrategyFromGlobalConfig();

  if (pointerEventStrategy) {
    return pointerEventStrategy;
  }

  if (touch && !(tablet || phone)) {
    return MouseAndTouchStrategy;
  }

  if (touch) {
    return TouchStrategy;
  }

  return MouseStrategy;
};

const EventStrategy = getStrategy(support, devices.real());

Object.entries(EventStrategy.map).forEach(([pointerEvent, originalEvents]) => {
  registerEvent(pointerEvent, new EventStrategy(pointerEvent, originalEvents));
});

interface PointerEvents {
  down: 'dxpointerdown';
  up: 'dxpointerup';
  move: 'dxpointermove';
  cancel: 'dxpointercancel';
  enter: 'dxpointerenter';
  leave: 'dxpointerleave';
  over: 'dxpointerover';
  out: 'dxpointerout';
  getStrategy?: typeof getStrategy;
}

const pointer: PointerEvents = {
  down: 'dxpointerdown',
  up: 'dxpointerup',
  move: 'dxpointermove',
  cancel: 'dxpointercancel',
  enter: 'dxpointerenter',
  leave: 'dxpointerleave',
  over: 'dxpointerover',
  out: 'dxpointerout',
};

/// #DEBUG
pointer.getStrategy = getStrategy;

/// #ENDDEBUG

export default pointer;
