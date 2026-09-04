import { CANCELED_TOKEN } from '@js/common/data/data_source/utils';

export default class OperationManager {
  constructor() {
    // @ts-expect-error
    this._counter = -1;
    // @ts-expect-error
    this._deferreds = {};
  }

  add(deferred) {
    // @ts-expect-error
    this._counter++;
    // @ts-expect-error
    this._deferreds[this._counter] = deferred;
    // @ts-expect-error
    return this._counter;
  }

  remove(operationId) {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    return delete this._deferreds[operationId];
  }

  cancel(operationId) {
    // @ts-expect-error
    if (operationId in this._deferreds) {
      // @ts-expect-error
      this._deferreds[operationId].reject(CANCELED_TOKEN);
      return true;
    }

    return false;
  }

  cancelAll() {
    // @ts-expect-error
    while (this._counter > -1) {
      // @ts-expect-error
      this.cancel(this._counter);
      // @ts-expect-error
      this._counter--;
    }
  }
}
