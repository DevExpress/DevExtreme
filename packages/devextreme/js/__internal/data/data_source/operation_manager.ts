import { CANCELED_TOKEN } from '@js/common/data/data_source/utils';
import type { DeferredObj } from '@js/core/utils/deferred';

export default class OperationManager {
  _counter = -1;

  _deferreds: Record<number, DeferredObj<unknown>> = {};

  add(deferred: DeferredObj<unknown>): number {
    this._counter += 1;
    this._deferreds[this._counter] = deferred;
    return this._counter;
  }

  remove(operationId: number): boolean {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    return delete this._deferreds[operationId];
  }

  cancel(operationId: number): boolean {
    if (operationId in this._deferreds) {
      this._deferreds[operationId].reject(CANCELED_TOKEN);
      return true;
    }

    return false;
  }

  cancelAll(): void {
    while (this._counter > -1) {
      this.cancel(this._counter);
      this._counter -= 1;
    }
  }
}
