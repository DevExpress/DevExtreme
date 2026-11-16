import { provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';

export const isZoneless = typeof (globalThis as any).Zone === 'undefined';

export const itWithZone = (isZoneless ? it.skip : it) as typeof it;

export const provideChangeDetection = () => (
  isZoneless ? provideZonelessChangeDetection() : provideZoneChangeDetection()
);
