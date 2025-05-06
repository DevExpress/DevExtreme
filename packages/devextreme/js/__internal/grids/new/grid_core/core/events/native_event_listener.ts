import type { RefObject } from 'inferno';

export class NativeEventListener {
  private readonly unsubscribeArray: (() => void)[] = [];

  public add<TEventName extends keyof HTMLElementEventMap>(
    elementRef: RefObject<HTMLElement>,
    eventName: TEventName,
    eventHandler: (event: HTMLElementEventMap[TEventName]) => void,
  ): NativeEventListener {
    elementRef.current?.addEventListener(eventName, eventHandler);
    this.unsubscribeArray.push(() => {
      elementRef.current?.removeEventListener(eventName, eventHandler);
    });

    return this;
  }

  public unsubscribe(): void {
    this.unsubscribeArray.forEach((fn) => fn());
  }
}
