import type { EventWithHandled, EventWithIgnore } from './types';

const markIgnored = <TEvent extends Event>(
  event: EventWithIgnore<TEvent>,
): void => {
  event.dxIgnore = true;
};

const markHandled = <TEvent extends Event>(
  event: EventWithHandled<TEvent>,
): void => {
  event.dxHandled = true;
};

export const eventUtils = {
  markHandled,
  markIgnored,
};
