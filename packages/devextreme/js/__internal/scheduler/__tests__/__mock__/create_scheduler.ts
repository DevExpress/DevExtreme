import Scheduler from '@ts/scheduler/m_scheduler';

import { createSchedulerModel, type SchedulerModel } from './model/scheduler';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Config = any;

export const createScheduler = async (config: Config): Promise<{
  container: HTMLDivElement;
  scheduler: Scheduler;
  POM: SchedulerModel;
  keydown: (element: Element, key: string) => void;
}> => {
  const container = document.createElement('div');
  const scheduler = new Scheduler(container, config);
  await new Promise(process.nextTick);
  document.body.appendChild(container);

  return {
    container,
    scheduler,
    POM: createSchedulerModel(container),
    keydown: (element: Element, key: string): void => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    },
  };
};
