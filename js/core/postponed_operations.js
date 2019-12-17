import { Deferred, when } from './utils/deferred';
import { isDefined } from './utils/type';

export class PostponedOperations {
    constructor() {
        this._postponedOperations = {};
    }

    add(key, fn, postponedPromise) {
        if(key in this._postponedOperations) {
            postponedPromise && this._postponedOperations[key].promises.push(postponedPromise);
        } else {
            var completePromise = new Deferred();
            this._postponedOperations[key] = {
                fn: fn,
                completePromise: completePromise,
                promises: postponedPromise ? [postponedPromise] : []
            };
        }

        return this._postponedOperations[key].completePromise.promise();
    }

    callPostponedOperations() {
        for(var key in this._postponedOperations) {
            var operation = this._postponedOperations[key];

            if(isDefined(operation)) {
                if(operation.promises && operation.promises.length) {
                    when(...operation.promises).done(operation.fn).then(operation.completePromise.resolve);
                } else {
                    operation.fn().done(operation.completePromise.resolve);
                }
            }
        }
        this._postponedOperations = {};
    }
}
