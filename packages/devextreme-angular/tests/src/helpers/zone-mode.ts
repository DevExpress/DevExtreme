import { provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';

export const isZoneless = typeof (globalThis as any).Zone === 'undefined';

export const itWithZone: typeof it = isZoneless ? xit : it;

export const provideChangeDetection = () => (
  isZoneless ? provideZonelessChangeDetection() : provideZoneChangeDetection()
);
