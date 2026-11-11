import type { Locator } from '@playwright/test';
import AppointmentCollector from './collector';

export default class Collectors {
  private readonly scheduler: Locator;

  constructor(scheduler: Locator) {
    this.scheduler = scheduler;
  }

  public get(index: number): AppointmentCollector {
    return new AppointmentCollector(this.scheduler, index);
  }
}
