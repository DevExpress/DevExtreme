import type { WrappedEvent } from '@ts/events/core/events_engine';

const TOUCH_PROPERTIES = ['pageX', 'pageY', 'screenX', 'screenY', 'clientX', 'clientY'] as const;

export type TouchProperty = typeof TOUCH_PROPERTIES[number];

export type TouchPropertyHook = (event: WrappedEvent) => number | undefined;

const readTouchProperty = (name: TouchProperty, event: WrappedEvent): number | undefined => {
  const { touches } = event;

  if (!touches) {
    return event[name];
  }

  const currentTouches = touches.length ? touches : event.changedTouches;

  if (!currentTouches?.length) {
    return undefined;
  }

  return currentTouches[0][name];
};

export default function hookTouchProps(
  addTouchProperty: (name: TouchProperty, hook: TouchPropertyHook) => void,
): void {
  TOUCH_PROPERTIES.forEach((name) => {
    addTouchProperty(name, (event) => readTouchProperty(name, event));
  });
}
