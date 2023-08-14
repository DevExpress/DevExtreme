const schedulerComponentName = 'dxScheduler';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isSchedulerComponent(component): boolean {
  return component.NAME === schedulerComponentName;
}
