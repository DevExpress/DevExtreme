import Scheduler from '@ts/scheduler/m_scheduler';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Config = any;

export const createScheduler = async (config: Config): Promise<{
  container: HTMLDivElement;
  scheduler: Scheduler;
}> => {
  const container = document.createElement('div');
  const scheduler = new Scheduler(container, config);
  await new Promise(process.nextTick);

  return {
    container,
    scheduler,
  };
};
