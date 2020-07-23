import {
  dxClick, focus, visibility, resize, hover, click, active, keyboard,
} from '../../events/short';
import events from '../../events';

type EventSubscriptionDispose = (() => void) | undefined;
type Tail<T extends any[]> =
((...t: T) => any) extends ((_: any, ...tail: infer TT) => any) ? TT : [];
type BaseSubscription = (condition: boolean, el: HTMLElement, ...args) => EventSubscriptionDispose;
export function subscribeToShortEvent<F extends BaseSubscription>(
  shortEvent,
  getOffArgs?: (...args: Tail<Parameters<F>>) => {},
): F {
  return ((condition: boolean, el: HTMLElement, ...args) => {
    if (condition) {
      const offArguments = [el, ...args] as unknown as Tail<Parameters<F>>;
      const offArgs = getOffArgs?.apply(null, offArguments) || {};
      shortEvent.on.apply(shortEvent, [el, ...args, {}]);
      return (): void => {
        shortEvent.off(el, offArgs);
      };
    }
    return undefined;
  }) as F;
}

type SimpleSubscription<E extends Event> = (
  element: HTMLElement,
  handler?: EventHandler<E>) => EventSubscriptionDispose;
type SimpleConditionSubscription<E extends Event> = (
  condition: boolean,
  element: HTMLElement,
  handler?: EventHandler<E>) => EventSubscriptionDispose;

export function subscribeToSimpleShortEvent<E extends Event>(shortEvent): SimpleSubscription<E> {
  const subscription = subscribeToShortEvent(shortEvent);
  return (
    el: HTMLElement,
    handler?: EventHandler<E>,
  ): EventSubscriptionDispose => subscription(!!handler, el, handler);
}
const getOffArguments = (el, event1, event2, options: { selector?: string }): { } => (options);

export const subscribeDxClick = subscribeToSimpleShortEvent<MouseEvent>(dxClick);
export const subscribeClick = subscribeToShortEvent<SimpleConditionSubscription<MouseEvent>>(click);
export const subscribeResize = subscribeToSimpleShortEvent<MouseEvent>(resize);
export type ActiveSubscriptionOptions = {
  selector?: string;
  showTimeout?: number;
  hideTimeout?: number;
};
export type ActiveSubscription = (
  condition: boolean,
  el: HTMLElement,
  active: EventHandler<{event: Event}>,
  inactive: EventHandler<{event: Event}>,
  options: ActiveSubscriptionOptions) => EventSubscriptionDispose;
export const subscribeActive = subscribeToShortEvent<ActiveSubscription>(
  active,
  getOffArguments,
);

export type FocusSubscription = (
  condition: boolean,
  el: HTMLElement,
  focusIn: EventHandler<events.dxEvent>,
  focusOut: EventHandler<events.dxEvent>,
  options: { isFocusable: (_, e) => boolean }) => EventSubscriptionDispose;
export const subscribeFocus = subscribeToShortEvent<FocusSubscription>(focus);

export type VisibilitySubscription = (
  condition: boolean,
  el: HTMLElement,
  shown: EventHandler<Event>,
  hiding: EventHandler<Event>) => EventSubscriptionDispose;
export const subscribeVisibility = subscribeToShortEvent<VisibilitySubscription>(visibility);

export type HoverSubscription = (
  condition: boolean,
  el: HTMLElement,
  start: EventHandler<Event>,
  end: EventHandler<Event>,
  options: { selector?: string }) => EventSubscriptionDispose;
export const subscribeHover = subscribeToShortEvent<HoverSubscription>(
  hover,
  getOffArguments,
);

export type KeyboardSubscription = (
  condition: boolean,
  el: HTMLElement,
  start: EventHandler<Event>,
  end: EventHandler<Event>,
  options: { selector?: string }) => EventSubscriptionDispose;
export const subscribeKeyboard = (
  condition: boolean,
  el: HTMLElement,
  keyDown?: EventHandler<Event>,
): EventSubscriptionDispose => {
  if (condition || keyDown) {
    const id = keyboard.on(el, el, keyDown);

    return (): void => keyboard.off(id);
  }
  return undefined;
};
