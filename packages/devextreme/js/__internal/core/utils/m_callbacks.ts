// eslint-disable-next-line @typescript-eslint/no-explicit-any -- handlers of any shape
type CallbackType<TArgs extends any[], TContext> = ((this: TContext, ...args: TArgs) => boolean)
  | ((this: TContext, ...args: TArgs) => void);

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- handlers of any shape
export interface CallbackInterface<TArgs extends any[] = any[], TContext = any> {
  add: (fn: CallbackType<TArgs, TContext>) => this;

  remove: (fn: CallbackType<TArgs, TContext>) => this;

  has: (fn: CallbackType<TArgs, TContext>) => this;

  empty: () => this;

  fireWith: (context: TContext, args: TArgs) => this;

  fire: (...args: TArgs) => this;

  fired: () => boolean;
}

interface CallbackOptions {
  stopOnFalse?: boolean;
  unique?: boolean;
  syncStrategy?: boolean;
}

type Handler = (...args: unknown[]) => unknown;

interface CallbackThis {
  _options: CallbackOptions;
  _list: Handler[];
  _queue: [unknown, unknown[]][];
  _firing: boolean;
  _fired: boolean;
  _firingIndexes: number[];
  _fireCore: (context: unknown, args: unknown[]) => void;
  has: (fn?: Handler) => boolean;
  fireWith: (context: unknown, args?: unknown[]) => CallbackThis | undefined;
}

const Callback = function Callback(this: CallbackThis, options?: CallbackOptions): void {
  this._options = options || {};
  this._list = [];
  this._queue = [];
  this._firing = false;
  this._fired = false;
  this._firingIndexes = [];
};

Callback.prototype._fireCore = function fireCore(
  this: CallbackThis,
  context: unknown,
  args: unknown[],
): void {
  const firingIndexes = this._firingIndexes;
  const list = this._list;
  const { stopOnFalse } = this._options;
  const step = firingIndexes.length;

  for (firingIndexes[step] = 0; firingIndexes[step] < list.length; firingIndexes[step] += 1) {
    const result = list[firingIndexes[step]].apply(context, args);

    if (result === false && stopOnFalse) {
      break;
    }
  }

  firingIndexes.pop();
};

Callback.prototype.add = function add(this: CallbackThis, fn: Handler): CallbackThis {
  if (typeof fn === 'function' && (!this._options.unique || !this.has(fn))) {
    this._list.push(fn);
  }
  return this;
};

Callback.prototype.remove = function remove(this: CallbackThis, fn: Handler): CallbackThis {
  const list = this._list;
  const firingIndexes = this._firingIndexes;
  const index = list.indexOf(fn);

  if (index > -1) {
    list.splice(index, 1);

    if (this._firing && firingIndexes.length) {
      for (let step = 0; step < firingIndexes.length; step += 1) {
        // eslint-disable-next-line max-depth -- the loop shifts the indexes of the running fires
        if (index <= firingIndexes[step]) {
          firingIndexes[step] -= 1;
        }
      }
    }
  }

  return this;
};

Callback.prototype.has = function has(this: CallbackThis, fn?: Handler): boolean {
  const list = this._list;

  return fn ? list.includes(fn) : !!list.length;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Callback.prototype.empty = function empty(this: CallbackThis, fn?: Handler): CallbackThis {
  this._list = [];

  return this;
};

Callback.prototype.fireWith = function fireWith(
  this: CallbackThis,
  context: unknown,
  args?: unknown[],
): CallbackThis | undefined {
  const queue = this._queue;

  const initialArgs = args || [];
  const queuedArgs = initialArgs.slice ? initialArgs.slice() : initialArgs;

  if (this._options.syncStrategy) {
    this._firing = true;
    this._fireCore(context, queuedArgs);
  } else {
    queue.push([context, queuedArgs]);
    if (this._firing) {
      return undefined;
    }

    this._firing = true;

    while (queue.length) {
      const memory = queue.shift() as [unknown, unknown[]];

      this._fireCore(memory[0], memory[1]);
    }
  }

  this._firing = false;
  this._fired = true;

  return this;
};

Callback.prototype.fire = function fire(this: CallbackThis, ...args: unknown[]): void {
  this.fireWith(this, args);
};

Callback.prototype.fired = function fired(this: CallbackThis): boolean {
  return this._fired;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- consumers declare their own types
const Callbacks = function Callbacks(options?: CallbackOptions): any {
  return new Callback(options);
};

export { Callbacks };
export default Callbacks;
