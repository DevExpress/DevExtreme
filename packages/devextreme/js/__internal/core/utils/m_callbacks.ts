type CallbackType<TArgs extends any[], TContext>
  = ((this: TContext, ...args: TArgs) => boolean)
  | ((this: TContext, ...args: TArgs) => void);

export interface CallbackInterface<TArgs extends any[] = any[], TContext = any> {
  add: (fn: CallbackType<TArgs, TContext>) => this;

  remove: (fn: CallbackType<TArgs, TContext>) => this;

  has: (fn: CallbackType<TArgs, TContext>) => this;

  empty: () => this;

  fireWith: (context: TContext, args: TArgs) => this;

  fire: (...args: TArgs) => this;

  fired: () => boolean;
}

const Callback = function (options) {
  this._options = options || {};
  this._list = [];
  this._queue = [];
  this._firing = false;
  this._fired = false;
  this._firingIndexes = [];
};

Callback.prototype._fireCore = function (context, args) {
  const firingIndexes = this._firingIndexes;
  const list = this._list;
  const { stopOnFalse } = this._options;
  const step = firingIndexes.length;

  for (firingIndexes[step] = 0; firingIndexes[step] < list.length; firingIndexes[step]++) {
    const result = list[firingIndexes[step]].apply(context, args);

    if (result === false && stopOnFalse) {
      break;
    }
  }

  firingIndexes.pop();
};

Callback.prototype.add = function (fn) {
  if (typeof fn === 'function' && (!this._options.unique || !this.has(fn))) {
    this._list.push(fn);
  }
  return this;
};

Callback.prototype.remove = function (fn) {
  const list = this._list;
  const firingIndexes = this._firingIndexes;
  const index = list.indexOf(fn);

  if (index > -1) {
    list.splice(index, 1);

    if (this._firing && firingIndexes.length) {
      for (let step = 0; step < firingIndexes.length; step++) {
        if (index <= firingIndexes[step]) {
          firingIndexes[step]--;
        }
      }
    }
  }

  return this;
};

Callback.prototype.has = function (fn) {
  const list = this._list;

  return fn ? list.indexOf(fn) > -1 : !!list.length;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Callback.prototype.empty = function (fn) {
  this._list = [];

  return this;
};

Callback.prototype.fireWith = function (context, args) {
  const queue = this._queue;

  args = args || [];
  args = args.slice ? args.slice() : args;

  if (this._options.syncStrategy) {
    this._firing = true;
    this._fireCore(context, args);
  } else {
    queue.push([context, args]);
    if (this._firing) {
      return;
    }

    this._firing = true;

    while (queue.length) {
      const memory = queue.shift();

      this._fireCore(memory[0], memory[1]);
    }
  }

  this._firing = false;
  this._fired = true;

  return this;
};

Callback.prototype.fire = function () {
  this.fireWith(this, arguments);
};

Callback.prototype.fired = function () {
  return this._fired;
};

const Callbacks = function (options?) {
  return new Callback(options);
};

export { Callbacks };
export default Callbacks;
