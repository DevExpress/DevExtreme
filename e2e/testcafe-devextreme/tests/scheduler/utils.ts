import { ClientFunction } from 'testcafe';

export const scrollTo = ClientFunction((x, y) => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const scrollable = instance.getWorkSpaceScrollable();

  scrollable.scrollTo({ y, x });
});

export const scrollToDate = ClientFunction((date: Date, groups?: Record<string, unknown>) => {
  const instance = ($('#container') as any).dxScheduler('instance');

  instance.scrollTo(date, groups);
});
