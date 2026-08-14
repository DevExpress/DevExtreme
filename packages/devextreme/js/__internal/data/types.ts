import type { ArrayStore as BaseArrayStore } from '@js/common/data';
import type { StoreChange } from '@js/data/store';

export interface ArrayStore extends BaseArrayStore {
  _array: unknown[];
}

type BeforePushHandler = (e: { changes: StoreChange[] }) => void;

declare module '@js/data/store' {
  interface Store {
    /* eslint-disable @typescript-eslint/method-signature-style */
    // AbstractStore fires `beforePush`, which the public StoreEventName union omits.
    on(eventName: 'beforePush', eventHandler: BeforePushHandler): this;
    off(eventName: 'beforePush', eventHandler: BeforePushHandler): this;
    /* eslint-enable @typescript-eslint/method-signature-style */
  }
}
