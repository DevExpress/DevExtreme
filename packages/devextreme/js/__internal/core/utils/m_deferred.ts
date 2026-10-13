import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import type { DeferredObj as DeferredInstance } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDeferred, isDefined, isPromise } from '@js/core/utils/type';

type DeferredState = 'pending' | 'resolved' | 'rejected';

type DeferredMethod = 'resolve' | 'reject' | 'notify';

type DeferredHandlerName = 'done' | 'fail' | 'progress';

interface DeferredConfig {
  method: DeferredMethod;
  handler: DeferredHandlerName;
  state?: DeferredState;
}

type Handler = (this: unknown, ...args: unknown[]) => unknown;

type HandlerMethod = <TThis>(this: TThis, handler?: Handler | null) => TThis;

interface DeferredLike {
  done: HandlerMethod;
  fail: HandlerMethod;
}

interface DeferredPromise extends DeferredLike {
  progress: HandlerMethod;
  always: <TThis extends DeferredLike>(this: TThis, handler?: Handler | null) => TThis;
  catch: (this: DeferredPromise, handler?: Handler | null) => DeferredPromise;
  then: (resolve?: Handler | null, reject?: Handler | null) => DeferredPromise;
  state: () => DeferredState;
  promise: (args?: object) => DeferredPromise;
}

type CallbackArgs = [context: unknown, args: unknown[] | undefined];

type Trigger = (...args: unknown[]) => DeferredMethods;

type TriggerWith = (context: unknown, args?: unknown[]) => DeferredMethods;

interface DeferredMethods extends DeferredPromise {
  resolve: Trigger;
  reject: Trigger;
  notify: Trigger;
  resolveWith: TriggerWith;
  rejectWith: TriggerWith;
  notifyWith: TriggerWith;
}

interface DeferredInternal extends DeferredMethods {
  _state: DeferredState;
  _promise: DeferredPromise;
  resolveCallbacks: Callback<CallbackArgs>;
  rejectCallbacks: Callback<CallbackArgs>;
  notifyCallbacks: Callback<CallbackArgs>;
  resolveArgs?: unknown[];
  rejectArgs?: unknown[];
  notifyArgs?: unknown[];
  resolveContext?: unknown;
  rejectContext?: unknown;
  notifyContext?: unknown;
}

type DeferredConstructor = new () => DeferredMethods;

interface NativeDeferredConstructor {
  prototype: DeferredInternal;
  new (): DeferredInternal;
}

type WhenFunction = (this: unknown, ...args: unknown[]) => unknown;

interface DeferredStrategy {
  Deferred: DeferredConstructor;
  when: WhenFunction;
}

const deferredConfig: DeferredConfig[] = [{
  method: 'resolve',
  handler: 'done',
  state: 'resolved',
}, {
  method: 'reject',
  handler: 'fail',
  state: 'rejected',
}, {
  method: 'notify',
  handler: 'progress',
}];

const isDeferredLike = (value: unknown): value is DeferredLike => isDeferred(value);

const DeferredObj = function DeferredObj(this: DeferredInternal): void {
  // eslint-disable-next-line @typescript-eslint/no-this-alias -- the handlers return their receiver
  const that = this;
  this._state = 'pending';
  this._promise = {} as DeferredPromise;

  deferredConfig.forEach((config) => {
    const methodName = config.method;
    this[`${methodName}Callbacks`] = Callbacks<CallbackArgs>();

    this[methodName] = (...args: unknown[]): DeferredMethods => this[`${methodName}With`](
      this._promise,
      args,
    );

    this._promise[config.handler] = function subscribe<TThis>(
      this: TThis,
      handler?: Handler | null,
    ): TThis {
      if (!handler) return this;

      const callbacks = that[`${methodName}Callbacks`];
      if (callbacks.fired()) {
        handler.apply(that[`${methodName}Context`], that[`${methodName}Args`] ?? []);
      } else {
        callbacks.add((context, args) => {
          handler.apply(context, args ?? []);
        });
      }
      return this;
    };
  });

  this._promise.always = function always<TThis extends DeferredLike>(
    this: TThis,
    handler?: Handler | null,
  ): TThis {
    return this.done(handler).fail(handler);
  };

  this._promise.catch = function catchHandler(
    this: DeferredPromise,
    handler?: Handler | null,
  ): DeferredPromise {
    return this.then(null, handler);
  };

  this._promise.then = function then(
    this: DeferredPromise,
    resolve?: Handler | null,
    reject?: Handler | null,
  ): DeferredPromise {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- swapped by setStrategy
    const result = new StrategyDeferred();

    (['done', 'fail'] as const).forEach((method) => {
      const callback = method === 'done' ? resolve : reject;

      this[method](function doneOrFail(this: unknown, ...args: unknown[]): void {
        if (!callback) {
          result[method === 'done' ? 'resolve' : 'reject'].apply(this, args);
          return;
        }

        const callbackResult = callback.apply(this, args);
        if (isDeferredLike(callbackResult)) {
          callbackResult.done(result.resolve).fail(result.reject);
        } else if (isPromise(callbackResult)) {
          callbackResult.then(result.resolve, result.reject);
        } else {
          result.resolve.apply(this, isDefined(callbackResult) ? [callbackResult] : args);
        }
      });
    });

    return result.promise();
  };

  this._promise.state = function state(): DeferredState {
    return that._state;
  };

  this._promise.promise = function promise(args?: object): DeferredPromise {
    return args ? extend(args, that._promise) : that._promise;
  };

  this._promise.promise(this);
} as unknown as NativeDeferredConstructor;

deferredConfig.forEach((config) => {
  const methodName = config.method;
  const { state } = config;

  DeferredObj.prototype[`${methodName}With`] = function triggerWith(
    this: DeferredInternal,
    context: unknown,
    args?: unknown[],
  ): DeferredInternal {
    const callbacks = this[`${methodName}Callbacks`];

    if (this.state() === 'pending') {
      this[`${methodName}Args`] = args;
      this[`${methodName}Context`] = context;
      if (state) {
        this._state = state;
      }
      callbacks.fire(context, args);
      if (state !== 'pending') {
        this.resolveCallbacks.empty();
        this.rejectCallbacks.empty();
      }
    }

    return this;
  };
});

let StrategyDeferred: DeferredConstructor = DeferredObj;

export function fromPromise<T>(
  promise: PromiseLike<T> | DeferredInstance<T> | T,
  context?: unknown,
): DeferredInstance<T>;
export function fromPromise(promise: unknown, context?: unknown): unknown {
  if (isDeferred(promise)) {
    return promise;
  } if (isPromise(promise)) {
    const d = new StrategyDeferred();
    promise.then((...args: unknown[]) => {
      d.resolveWith(context, args);
    }, (...args: unknown[]) => {
      d.rejectWith(context, args);
    });
    return d;
  }

  return new StrategyDeferred().resolveWith(context, [promise]);
}

let whenFunc: WhenFunction = function whenDeferreds(...args: unknown[]): unknown {
  if (args.length === 1) {
    return fromPromise(args[0]);
  }

  const values: unknown[] = args;
  const contexts: unknown[] = [];
  let resolvedCount = 0;
  const deferred = new StrategyDeferred();

  const updateState = function updateState(i: number): Handler {
    return function resolveValue(this: unknown, ...stateArgs: unknown[]): void {
      contexts[i] = this;
      values[i] = stateArgs.length > 1 ? stateArgs : stateArgs[0];
      resolvedCount += 1;
      if (resolvedCount === values.length) {
        deferred.resolveWith(contexts, values);
      }
    };
  };

  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    if (isDeferredLike(value)) {
      // @ts-expect-error a value with done and fail is a deferred with promise()
      value.promise()
        .done(updateState(i))
        .fail(deferred.reject);
    } else {
      resolvedCount += 1;
    }
  }

  if (resolvedCount === values.length) {
    deferred.resolveWith(contexts, values);
  }

  return deferred.promise();
};

export function setStrategy(value: DeferredStrategy): void {
  StrategyDeferred = value.Deferred;
  whenFunc = value.when;
}

export function Deferred<T>(): DeferredInstance<T>;
export function Deferred(): unknown {
  return new StrategyDeferred();
}

export function when<T>(...values: (DeferredInstance<T> | T)[]): DeferredInstance<T>;
export function when(this: unknown, ...args: unknown[]): unknown {
  return whenFunc.apply(this, args);
}
