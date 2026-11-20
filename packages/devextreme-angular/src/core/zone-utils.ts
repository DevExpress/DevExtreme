import { NgZone } from '@angular/core';

let inOutsideAngular = false;

export const isZoneless = (ngZone: NgZone) => !(ngZone instanceof NgZone);

export const canMarkForOptionChange = (ngZone: NgZone) => (
  isZoneless(ngZone)
    ? !inOutsideAngular
    : NgZone.isInAngularZone()
);

export const trackOutsideAngularHandler = (callback: (...args: any[]) => any) => function (this: unknown, e: Event) {
  const prevInOutsideAngular = inOutsideAngular;
  inOutsideAngular = true;
  try {
    return callback.call(this, e);
  } finally {
    inOutsideAngular = prevInOutsideAngular;
  }
};
