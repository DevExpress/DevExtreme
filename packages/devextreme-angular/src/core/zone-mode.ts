import { ChangeDetectorRef, EventEmitter, NgZone } from '@angular/core';

export interface ZoneMode {
  emit: (emitter: EventEmitter<any>, value: any) => void;
  emitInternal: (emitter: EventEmitter<any>, value: any, shouldMark: boolean) => void;
  markForCheck: () => void;
  markForOptionChange: () => void;
}

let inOutsideAngular = false;

export const isZoneless = (ngZone: NgZone) => !(ngZone instanceof NgZone);

export const trackOutsideAngularHandler = (callback: (...args: any[]) => any) => function (this: unknown, e: Event) {
  const prevInOutsideAngular = inOutsideAngular;
  inOutsideAngular = true;
  try {
    return callback.call(this, e);
  } finally {
    inOutsideAngular = prevInOutsideAngular;
  }
};

class ZoneModeWithZone implements ZoneMode {
  constructor(private readonly zone: NgZone) {}

  emit(emitter: EventEmitter<any>, value: any) {
    this.zone.run(() => emitter.next(value));
  }

  emitInternal(emitter: EventEmitter<any>, value: any) {
    emitter.next(value);
  }

  markForCheck() {}

  markForOptionChange() {}
}

class ZonelessMode implements ZoneMode {
  constructor(private readonly cdr?: ChangeDetectorRef) {}

  emit(emitter: EventEmitter<any>, value: any) {
    emitter.next(value);
    this.markForCheck();
  }

  emitInternal(emitter: EventEmitter<any>, value: any, shouldMark: boolean) {
    emitter.next(value);
    if (shouldMark) {
      this.markForCheck();
    }
  }

  markForCheck() {
    this.cdr?.markForCheck();
  }

  markForOptionChange() {
    if (!inOutsideAngular) {
      this.markForCheck();
    }
  }
}

export const createZoneMode = (zone: NgZone, cdr?: ChangeDetectorRef): ZoneMode => (
  isZoneless(zone) ? new ZonelessMode(cdr) : new ZoneModeWithZone(zone)
);
