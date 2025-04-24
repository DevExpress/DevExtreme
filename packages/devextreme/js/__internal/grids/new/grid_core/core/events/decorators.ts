import type { EventWithIgnore } from '@ts/grids/new/grid_core/core/events/types';

type DescriptorType<TEvent extends Event> = TypedPropertyDescriptor<(event: TEvent) => void>
  | TypedPropertyDescriptor<() => void>;

export function eventHandler<TEvent extends Event>(
  target: unknown,
  key: PropertyKey,
  descriptor: DescriptorType<TEvent>,
): void {
  const originFn = descriptor.value;

  descriptor.value = function decoratedEventHandlerFn(event: EventWithIgnore<TEvent>): void {
    if (event.dxIgnore) {
      return;
    }

    originFn?.call(this, event);
  };
}
