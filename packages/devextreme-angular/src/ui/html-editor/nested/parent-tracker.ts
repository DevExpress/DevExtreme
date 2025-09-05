import { InjectionToken } from '@angular/core';

export interface ParentTracker<T> {
  register(child: T): void;
  unregister(child: T): void;
}

export const ParentTrackerToken = new InjectionToken<ParentTracker<any>>('ParentTrackerToken');