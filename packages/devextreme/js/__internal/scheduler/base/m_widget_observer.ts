import Widget from '@js/ui/widget/ui.widget';

import type { SubscribeKey, SubscribeMethods } from '../m_subscribes';

class WidgetObserver<T> extends Widget<T> {
  notifyObserver<Subject extends SubscribeKey>(
    funcName: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): void {
    const notifyScheduler = this.option('notifyScheduler');

    if (!notifyScheduler) {
      return undefined;
    }

    (this.option('notifyScheduler') as any).invoke(funcName, ...args);
  }

  invoke<Subject extends SubscribeKey>(
    funcName: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]> | undefined {
    const notifyScheduler = this.option('notifyScheduler');

    if (!notifyScheduler) {
      return undefined;
    }

    return (this.option('notifyScheduler') as any).invoke(funcName, ...args);
  }
}

export default WidgetObserver;
