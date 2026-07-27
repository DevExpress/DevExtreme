import type { SubscribeKey, SubscribeMethods } from '../m_subscribes';
import type Scheduler from '../scheduler';

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
