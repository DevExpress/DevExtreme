import { Deferred, when } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';

export class PostponedOperations {
  _postponedOperations: any;

  constructor() {
    this._postponedOperations = {};
  }

  add(key, fn, postponedPromise) {
    if (key in this._postponedOperations) {
      postponedPromise && this._postponedOperations[key].promises.push(postponedPromise);
    } else {
      // @ts-expect-error only void function can be called with new
      const completePromise = new Deferred();
      this._postponedOperations[key] = {
        fn,
        completePromise,
        promises: postponedPromise ? [postponedPromise] : [],
      };
    }

    return this._postponedOperations[key].completePromise.promise();
  }

  callPostponedOperations() {
      for(const key in this._postponedOperations) {
          const operation = this._postponedOperations[key];

          if (isDefined(operation)) {
              if (operation.promises && operation.promises.length) {
                  when(...operation.promises).done(operation.fn).then(operation.completePromise.resolve);
              } else {
                  operation.fn().done(operation.completePromise.resolve);
              }
          }
      }
      this._postponedOperations = {};
  }
}
