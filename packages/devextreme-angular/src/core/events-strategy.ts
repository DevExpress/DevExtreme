/* eslint-disable max-classes-per-file */
import { ChangeDetectorRef, EventEmitter, NgZone } from '@angular/core';
import { DxComponent } from './component';
import { isZoneless } from './zone-utils';

interface IEventSubscription {
  handler: any;
  unsubscribe: () => void;
}
export class NgEventsStrategy {
  private subscriptions: { [key: string]: IEventSubscription[] } = {};

  private events: { [key: string]: EventEmitter<any> } = {};

  constructor(
    private readonly instance: any,
    private readonly zone: NgZone,
    private readonly changeDetectorRef?: ChangeDetectorRef,
  ) { }

  hasEvent(name: string) {
    return this.getEmitter(name).observers.length !== 0;
  }

  fireEvent(name, args) {
    const emitter = this.getEmitter(name);
    if (!emitter.observers.length) {
      return;
    }
    const internalSubs = this.subscriptions[name] || [];
    const hasAngularSubscribers = emitter.observers.length > internalSubs.length;
    const shouldMark = name !== 'optionChanged' || hasAngularSubscribers;

    if (isZoneless(this.zone)) {
      this.fireZoneless(emitter, args?.[0], shouldMark);
      return;
    }
    this.fireInZone(
      emitter,
      args?.[0],
      hasAngularSubscribers,
      shouldMark,
    );
  }

  on(name: string | object, handler?: Function) {
    if (typeof name === 'string') {
      const eventSubscriptions = this.subscriptions[name] || [];
      const subcription = this.getEmitter(name).subscribe(handler?.bind(this.instance));
      const unsubscribe = subcription.unsubscribe.bind(subcription);

      eventSubscriptions.push({ handler, unsubscribe });
      this.subscriptions[name] = eventSubscriptions;
    } else {
      const handlersObj = name;

      Object.keys(handlersObj).forEach((event) => this.on(event, handlersObj[event]));
    }
  }

  off(name, handler) {
    const eventSubscriptions = this.subscriptions[name] || [];

    if (handler) {
      eventSubscriptions.some((subscription, i) => {
        if (subscription.handler === handler) {
          subscription.unsubscribe();
          eventSubscriptions.splice(i, 1);
          return true;
        }
        return false;
      });
    } else {
      eventSubscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      eventSubscriptions.splice(0, eventSubscriptions.length);
    }
  }

  dispose() {}

  public addEmitter(eventName: string, emitter: EventEmitter<any>) {
    this.events[eventName] = emitter;
  }

  private getEmitter(eventName: string): EventEmitter<any> {
    if (!this.events[eventName]) {
      this.events[eventName] = new EventEmitter();
    }
    return this.events[eventName];
  }

  private fireZoneless(
    emitter: EventEmitter<any>,
    value: any,
    shouldMark: boolean,
  ) {
    emitter.next(value);
    if (shouldMark) {
      this.changeDetectorRef?.markForCheck();
    }
  }

  private fireInZone(
    emitter: EventEmitter<any>,
    value: any,
    hasAngularSubscribers: boolean,
    shouldMark: boolean,
  ) {
    if (hasAngularSubscribers) {
      this.zone.run(() => {
        emitter.next(value);
        this.changeDetectorRef?.markForCheck();
      });
    } else {
      emitter.next(value);
      if (shouldMark && NgZone.isInAngularZone()) {
        this.changeDetectorRef?.markForCheck();
      }
    }
  }
}

export class EmitterHelper {
  lockedValueChangeEvent = false;

  constructor(
    private readonly zone: NgZone,
    private component: DxComponent,
    private readonly changeDetectorRef?: ChangeDetectorRef,
  ) { }

  fireNgEvent(eventName: string, eventArgs: any) {
    if (this.lockedValueChangeEvent && eventName === 'valueChange') {
      return;
    }
    const emitter = this.component[eventName];
    if (emitter?.observers.length) {
      if (isZoneless(this.zone)) {
        this.fireZoneless(emitter, eventArgs?.[0]);
      } else {
        this.fireInZone(emitter, eventArgs?.[0]);
      }
    }
  }

  createEmitters(events: any[]) {
    events.forEach((event) => {
      this.component[event.emit] = new EventEmitter();
    });
  }

  private fireZoneless(
    emitter: EventEmitter<any>,
    value: any,
  ) {
    emitter.next(value);
    this.changeDetectorRef?.markForCheck();
  }

  private fireInZone(
    emitter: EventEmitter<any>,
    value: any,
  ) {
    this.zone.run(() => {
      emitter.next(value);
      this.changeDetectorRef?.markForCheck();
    });
  }
}
