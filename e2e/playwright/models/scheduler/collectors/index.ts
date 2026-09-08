import type { Locator } from '@playwright/test';
import AppointmentCollector, { CLASS } from './collector';

export default class Collectors {
  private readonly scheduler: Locator;

  constructor(scheduler: Locator) {
    this.scheduler = scheduler;
  }

  public count(): Promise<number> {
    return this.scheduler.locator(`.${CLASS.appointmentCollector}`).count();
  }

  public get(index: number): AppointmentCollector {
    return new AppointmentCollector(this.scheduler, index);
  }

  public find(title: string, index = 0): AppointmentCollector {
    return new AppointmentCollector(this.scheduler, index, title);
  }
}
