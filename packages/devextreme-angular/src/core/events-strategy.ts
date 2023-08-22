import { EventEmitter, NgZone } from '@angular/core';
import { DxComponent } from './component';

interface IEventSubscription {
  handler: any;
  unsubscribe: () => void;
}
export class NgEventsStrategy {
  private subscriptions: { [key: string]: IEventSubscription[] } = {};

  private events: { [key: string]: EventEmitter<any> } = {};

  constructor(private readonly instance: any, private readonly zone: NgZone) { }

  hasEvent(name: string) {
    return this.getEmitter(name).observers.length !== 0;
  }

  fireEvent(name, args) {
    const emitter = this.getEmitter(name);
    if (emitter.observers.length) {
      const internalSubs = this.subscriptions[name] || [];
      if (internalSubs.length === emitter.observers.length) {
        emitter.next(args && args[0]);
      } else {
        this.zone.run(() => emitter.next(args && args[0]));
      }
    }
  }

  on(name: string | Object, handler?: Function) {
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
}

export class EmitterHelper {
  lockedValueChangeEvent = false;

  constructor(private readonly zone: NgZone, private component: DxComponent) { }

  fireNgEvent(eventName: string, eventArgs: any) {
    if (this.lockedValueChangeEvent && eventName === 'valueChange') {
      return;
    }
    const emitter = this.component[eventName];
    if (emitter && emitter.observers.length) {
      this.zone.run(() => {
        emitter.next(eventArgs && eventArgs[0]);
      });
    }
  }

  createEmitters(events: any[]) {
    events.forEach((event) => {
      this.component[event.emit] = new EventEmitter();
    });
  }
}
