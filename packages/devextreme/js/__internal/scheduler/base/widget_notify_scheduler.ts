import type Scheduler from '../m_scheduler';
import type { SubscribeKey, SubscribeMethods } from '../m_subscribes';

class NotifyScheduler {
  scheduler: Scheduler;

  constructor({ scheduler }: { scheduler: Scheduler }) {
    this.scheduler = scheduler;
  }

  invoke<Subject extends SubscribeKey>(
    funcName: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.scheduler.fire(funcName, ...args);
  }
}

export default NotifyScheduler;
