import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';

interface PostponedResult {
  done: (callback: (...args: unknown[]) => void) => PostponedResult;
}

interface PostponedCompletion {
  promise: (target?: unknown) => unknown;
  resolve: (...args: unknown[]) => void;
}

type PostponedFn = () => unknown;

interface PostponedOperation {
  fn: PostponedFn;
  completePromise: PostponedCompletion;
  promises: DeferredObj<unknown>[];
}

export class PostponedOperations {
  _postponedOperations: Record<string, PostponedOperation>;

  constructor() {
    this._postponedOperations = {};
  }

  add(
    key: string,
    fn: PostponedFn,
    postponedPromise?: DeferredObj<unknown>,
  ): DeferredObj<unknown> {
    if (key in this._postponedOperations) {
      if (postponedPromise) {
        this._postponedOperations[key].promises.push(postponedPromise);
      }
    } else {
      const completePromise: PostponedCompletion = Deferred<unknown>();

      this._postponedOperations[key] = {
        fn,
        completePromise,
        promises: postponedPromise ? [postponedPromise] : [],
      };
    }

    return this._postponedOperations[key].completePromise.promise() as DeferredObj<unknown>;
  }

  callPostponedOperations(): void {
    Object.values(this._postponedOperations).forEach((operation) => {
      if (isDefined(operation)) {
        if (operation.promises && operation.promises.length) {
          when(...operation.promises).done(operation.fn).then(operation.completePromise.resolve);
        } else {
          (operation.fn() as PostponedResult).done(operation.completePromise.resolve);
        }
      }
    });

    this._postponedOperations = {};
  }
}
