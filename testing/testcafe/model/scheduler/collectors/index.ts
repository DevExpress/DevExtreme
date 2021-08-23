import AppointmentCollector, { CLASS } from './collector';

export default class Collectors {
  private readonly scheduler: Selector;

  constructor(scheduler: Selector) {
    this.scheduler = scheduler;
  }

  get count(): Promise<number> {
    return this.scheduler.find(`.${CLASS.appointmentCollector}`).count;
  }

  async items(): Promise<AppointmentCollector[]> {
    const result: AppointmentCollector[] = [];
    const count = await this.count;

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < count; index++) {
      result.push(new AppointmentCollector(this.scheduler, index));
    }

    return result;
  }

  find(title: string, index = 0): AppointmentCollector {
    return new AppointmentCollector(this.scheduler, index, title);
  }
}
