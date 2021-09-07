import AppointmentCollector, { CLASS } from './collector';

export default class Collectors {
  private readonly scheduler: Selector;

  constructor(scheduler: Selector) {
    this.scheduler = scheduler;
  }

  get count(): Promise<number> {
    return this.scheduler.find(`.${CLASS.appointmentCollector}`).count;
  }

  get(index: number): AppointmentCollector {
    return new AppointmentCollector(this.scheduler, index);
  }

  find(title: string, index = 0): AppointmentCollector {
    return new AppointmentCollector(this.scheduler, index, title);
  }
}
